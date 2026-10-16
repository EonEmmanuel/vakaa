import { Logger } from '@vendure/core';
import {
    S3Client,
    GetObjectCommand,
    DeleteObjectCommand,
    HeadObjectCommand,
    HeadBucketCommand,
} from '@aws-sdk/client-s3';
import { Upload } from '@aws-sdk/lib-storage';
import { Request } from 'express';
import { Readable } from 'node:stream';
import mime from 'mime-types';

const loggerCtx = 'R2AssetStorageStrategy';

export interface R2Config {
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
 * Native S3/R2 Asset Storage Strategy for Cloudflare R2:
 * - Guarantees cross-platform POSIX keys (prevents Windows backslash issues in object keys).
 * - Applies long-lived cache headers (immutable edge caching).
 * - Implements pure AWS SDK v3 stream handling.
 */
export class R2AssetStorageStrategy {
    readonly toAbsoluteUrl: (request: Request, identifier: string) => string;
    private s3Client: S3Client;
    private bucket: string;

    constructor(
        config: R2Config,
        toAbsoluteUrl: (request: Request, identifier: string) => string
    ) {
        this.bucket = config.bucket;
        this.toAbsoluteUrl = toAbsoluteUrl;
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
            Logger.info(`Connected to Cloudflare R2 bucket "${this.bucket}"`, loggerCtx);
        } catch (err: any) {
            Logger.warn(
                `Bucket check on "${this.bucket}" completed with notice: ${err.message || err}. Continuing with existing bucket.`,
                loggerCtx
            );
        }
    }

    async writeFileFromBuffer(fileName: string, data: Buffer): Promise<string> {
        return this.uploadToR2(fileName, data);
    }

    async writeFileFromStream(fileName: string, data: Readable): Promise<string> {
        return this.uploadToR2(fileName, data);
    }

    async readFileToBuffer(identifier: string): Promise<Buffer> {
        const key = toPosixKey(identifier);
        const result = await this.s3Client.send(
            new GetObjectCommand({
                Bucket: this.bucket,
                Key: key,
            })
        );
        if (!result.Body) {
            Logger.error(`Got undefined Body for ${key}`, loggerCtx);
            return Buffer.from('');
        }
        const byteArray = await (result.Body as any).transformToByteArray();
        return Buffer.from(byteArray);
    }

    async readFileToStream(identifier: string): Promise<Readable> {
        const key = toPosixKey(identifier);
        const result = await this.s3Client.send(
            new GetObjectCommand({
                Bucket: this.bucket,
                Key: key,
            })
        );
        if (!result.Body) {
            return new Readable({
                read() {
                    this.push(null);
                },
            });
        }
        return result.Body as Readable;
    }

    async deleteFile(identifier: string): Promise<void> {
        const key = toPosixKey(identifier);
        await this.s3Client.send(
            new DeleteObjectCommand({
                Bucket: this.bucket,
                Key: key,
            })
        );
    }

    async fileExists(fileName: string): Promise<boolean> {
        const key = toPosixKey(fileName);
        try {
            await this.s3Client.send(
                new HeadObjectCommand({
                    Bucket: this.bucket,
                    Key: key,
                })
            );
            return true;
        } catch {
            return false;
        }
    }

    private async uploadToR2(fileName: string, data: Buffer | Readable): Promise<string> {
        const key = toPosixKey(fileName);
        const contentType = (mime.lookup(key) || 'application/octet-stream') as string;

        const upload = new Upload({
            client: this.s3Client,
            params: {
                Bucket: this.bucket,
                Key: key,
                Body: data,
                ContentType: contentType,
                CacheControl: 'public, max-age=31536000, immutable',
            },
        });

        const result = await upload.done();
        if (!result.Key) {
            throw new Error(`Failed to upload ${key} to Cloudflare R2`);
        }
        return toPosixKey(result.Key);
    }
}

export function configureR2AssetStorage(config: R2Config) {
    return (options: any) => {
        const toAbsoluteUrlFn = (request: Request, identifier: string) => {
            if (!identifier) return '';
            const normalized = toPosixKey(identifier);
            const rawPrefix = typeof options.assetUrlPrefix === 'function'
                ? options.assetUrlPrefix(request, normalized)
                : options.assetUrlPrefix || '';
            const prefix = rawPrefix && !rawPrefix.endsWith('/') ? `${rawPrefix}/` : rawPrefix;
            return normalized.startsWith(prefix) ? normalized : `${prefix}${normalized}`;
        };
        return new R2AssetStorageStrategy(config, toAbsoluteUrlFn);
    };
}
