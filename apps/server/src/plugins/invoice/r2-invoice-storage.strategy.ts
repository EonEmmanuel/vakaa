import { Logger } from '@vendure/core';
import { S3Client, HeadBucketCommand, GetObjectCommand } from '@aws-sdk/client-s3';
import { Upload } from '@aws-sdk/lib-storage';
import {
    LocalStorageStrategy,
    InvoiceEntity,
    createTempFile,
    zipFiles,
    safeRemove,
    ZippableFile,
    exists,
} from '@pinelab/pinelab-invoice-plugin';
import { Response } from 'express';
import { ReadStream, createReadStream, createWriteStream, promises as fsPromises } from 'fs';
import { pipeline } from 'stream/promises';
import { Readable } from 'stream';

const loggerCtx = 'R2InvoiceStorageStrategy';

export interface R2InvoiceConfig {
    bucket: string;
    endpoint: string;
    accessKeyId: string;
    secretAccessKey: string;
    region?: string;
}

function toPosixKey(key: string): string {
    return key.replace(/\\/g, '/').replace(/^\/+/, '');
}

/**
 * Cloudflare R2 Storage Strategy for Vendure Invoices:
 * - Streams invoice PDFs directly to/from Cloudflare R2 with zero buffer bloat.
 * - Stores files under `invoices/{channelToken}/{year}/{invoiceNumber}.pdf`.
 * - Cleans up local temp files immediately upon upload or failure.
 * - Gracefully falls back to local storage if an invoice was previously generated on disk.
 */
export class R2InvoiceStorageStrategy implements LocalStorageStrategy {
    private readonly s3Client: S3Client;
    private readonly bucket: string;

    constructor(config: R2InvoiceConfig) {
        this.bucket = config.bucket;
        this.s3Client = new S3Client({
            endpoint: config.endpoint,
            region: config.region || 'auto',
            credentials: {
                accessKeyId: config.accessKeyId,
                secretAccessKey: config.secretAccessKey,
            },
            forcePathStyle: true,
        });
    }

    async init(): Promise<void> {
        try {
            await this.s3Client.send(new HeadBucketCommand({ Bucket: this.bucket }));
            Logger.info(`Connected to Cloudflare R2 bucket "${this.bucket}" for invoice storage`, loggerCtx);
        } catch (err: any) {
            Logger.warn(
                `R2 invoice bucket check on "${this.bucket}" notice: ${err?.message || err}. Continuing with existing bucket.`,
                loggerCtx
            );
        }
    }

    /**
     * Uploads the temporary PDF to Cloudflare R2 and deletes the local temp file immediately.
     * Returns the R2 storage key reference (e.g. `invoices/default-channel/2026/1001.pdf`).
     */
    async save(tmpFile: string, invoiceNumber: number, channelToken: string, isCreditInvoice: boolean): Promise<string> {
        const year = new Date().getFullYear();
        const filename = isCreditInvoice ? `${invoiceNumber}-credit.pdf` : `${invoiceNumber}.pdf`;
        const key = `invoices/${channelToken}/${year}/${filename}`;

        const fileStream = createReadStream(tmpFile);
        try {
            const stat = await fsPromises.stat(tmpFile);
            const upload = new Upload({
                client: this.s3Client,
                params: {
                    Bucket: this.bucket,
                    Key: key,
                    Body: fileStream,
                    ContentType: 'application/pdf',
                    ContentDisposition: `inline; filename="Facture-VAKAA-${filename}"`,
                    CacheControl: 'private, max-age=31536000, immutable',
                },
            });

            await upload.done();
            Logger.info(`Successfully stored invoice in R2 at ${key} (${stat.size} bytes)`, loggerCtx);
            return key;
        } catch (error: any) {
            Logger.error(`Failed to upload invoice ${invoiceNumber} to R2 (${key}): ${error?.message}`, loggerCtx, error?.stack);
            throw error;
        } finally {
            if (!fileStream.destroyed) {
                fileStream.destroy();
            }
            // Guarantee local temp file deletion to prevent container disk leakage
            try {
                await fsPromises.unlink(tmpFile);
            } catch {
                safeRemove(tmpFile);
            }
        }
    }

    /**
     * Streams an invoice PDF from Cloudflare R2 directly to the Express response pipe.
     * Avoids buffering the entire PDF in Node.js memory.
     */
    async streamFile(invoice: InvoiceEntity, res: Response): Promise<ReadStream> {
        const key = toPosixKey(invoice.storageReference);
        try {
            const result = await this.s3Client.send(
                new GetObjectCommand({
                    Bucket: this.bucket,
                    Key: key,
                })
            );

            if (!result.Body) {
                throw new Error(`Invoice file empty or not found in R2 at key: ${key}`);
            }

            if (res && !res.headersSent) {
                res.set({
                    'Content-Type': 'application/pdf',
                    'Content-Disposition': `inline; filename="Facture-VAKAA-${invoice.invoiceNumber}.pdf"`,
                    'Cache-Control': 'private, max-age=86400, no-transform',
                    ...(result.ContentLength ? { 'Content-Length': String(result.ContentLength) } : {}),
                });
            }

            const bodyStream = typeof (result.Body as any).pipe === 'function'
                ? (result.Body as unknown as ReadStream)
                : (Readable.fromWeb(result.Body as any) as unknown as ReadStream);

            return bodyStream;
        } catch (r2Error: any) {
            // Graceful fallback for legacy records saved to disk prior to R2 integration
            if (await exists(invoice.storageReference)) {
                Logger.warn(
                    `Invoice not found in R2 (${key}), falling back to existing local file: ${invoice.storageReference}`,
                    loggerCtx
                );
                if (res && !res.headersSent) {
                    res.set({
                        'Content-Type': 'application/pdf',
                        'Content-Disposition': `inline; filename="Facture-VAKAA-${invoice.invoiceNumber}.pdf"`,
                    });
                }
                return createReadStream(invoice.storageReference);
            }

            Logger.error(`Failed to stream invoice from R2 (key: ${key}): ${r2Error?.message}`, loggerCtx, r2Error?.stack);
            throw r2Error;
        }
    }

    /**
     * Bundles multiple invoices into a single zip file for admin bulk export.
     * Cleans up all intermediate temp files and the zip file upon stream close.
     */
    async streamMultiple(invoices: InvoiceEntity[], res: Response): Promise<ReadStream> {
        if (res && !res.headersSent) {
            res.set({
                'Content-Type': 'application/zip',
                'Content-Disposition': `inline; filename="invoices-${invoices.length}.zip"`,
            });
        }

        const tempFiles: string[] = [];
        let zipPath: string | null = null;
        try {
            const zippableFiles: ZippableFile[] = await Promise.all(
                invoices.map(async (invoice) => {
                    const tmpFile = await createTempFile('.pdf');
                    tempFiles.push(tmpFile);
                    const key = toPosixKey(invoice.storageReference);

                    try {
                        const result = await this.s3Client.send(
                            new GetObjectCommand({
                                Bucket: this.bucket,
                                Key: key,
                            })
                        );

                        if (!result.Body) {
                            throw new Error(`Invoice file not found in R2 at key: ${key}`);
                        }

                        const bodyStream = typeof (result.Body as any).pipe === 'function'
                            ? (result.Body as Readable)
                            : (Readable.fromWeb(result.Body as any) as Readable);

                        await pipeline(bodyStream, createWriteStream(tmpFile));
                    } catch (fetchErr: any) {
                        // Check local fallback
                        if (await exists(invoice.storageReference)) {
                            await fsPromises.copyFile(invoice.storageReference, tmpFile);
                        } else {
                            throw fetchErr;
                        }
                    }

                    return {
                        path: tmpFile,
                        name: `${invoice.invoiceNumber}.pdf`,
                    };
                })
            );

            zipPath = await zipFiles(zippableFiles);
            const zipStream = createReadStream(zipPath);

            const cleanupZip = () => {
                if (zipPath) {
                    safeRemove(zipPath);
                    zipPath = null;
                }
            };

            zipStream.on('close', cleanupZip);
            zipStream.on('error', cleanupZip);
            if (res) {
                res.on('close', () => {
                    if (!res.writableEnded) {
                        zipStream.destroy();
                        cleanupZip();
                    }
                });
            }

            return zipStream;
        } finally {
            for (const tmp of tempFiles) {
                safeRemove(tmp);
            }
        }
    }
}
