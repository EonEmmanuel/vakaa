import { describe, test, expect, mock, beforeEach } from 'bun:test';
import { R2InvoiceStorageStrategy } from './r2-invoice-storage.strategy';
import { VakaaInvoiceController } from './vakaa-invoice.controller';
import { ForbiddenException, BadRequestException, NotFoundException } from '@nestjs/common';
import { promises as fsPromises } from 'fs';
import path from 'path';
import os from 'os';
import { Readable, PassThrough } from 'stream';

describe('R2InvoiceStorageStrategy', () => {
    let strategy: R2InvoiceStorageStrategy;
    let mockS3Send: ReturnType<typeof mock>;

    beforeEach(() => {
        mockS3Send = mock(() => Promise.resolve({ Body: Readable.from(['pdf content']), ContentLength: 11 }));
        strategy = new R2InvoiceStorageStrategy({
            bucket: 'test-bucket',
            endpoint: 'https://test.r2.cloudflarestorage.com',
            accessKeyId: 'test-key',
            secretAccessKey: 'test-secret',
        });
        (strategy as any).s3Client.send = mockS3Send;
    });

    test('save: writes file to S3, returns POSIX key, and deletes tmpFile immediately', async () => {
        const tmpDir = os.tmpdir();
        const tmpFile = path.join(tmpDir, `test-invoice-${Date.now()}.pdf`);
        await fsPromises.writeFile(tmpFile, 'PDF-DATA');

        const key = await strategy.save(tmpFile, 1001, 'default-channel', false);
        const year = new Date().getFullYear();
        expect(key).toBe(`invoices/default-channel/${year}/1001.pdf`);

        // Check tmpFile was safely removed
        let fileStillExists = false;
        try {
            await fsPromises.access(tmpFile);
            fileStillExists = true;
        } catch {
            fileStillExists = false;
        }
        expect(fileStillExists).toBe(false);
    });

    test('save: generates -credit.pdf suffix for credit invoices', async () => {
        const tmpDir = os.tmpdir();
        const tmpFile = path.join(tmpDir, `test-credit-${Date.now()}.pdf`);
        await fsPromises.writeFile(tmpFile, 'CREDIT-PDF-DATA');

        const key = await strategy.save(tmpFile, 1002, 'default-channel', true);
        const year = new Date().getFullYear();
        expect(key).toBe(`invoices/default-channel/${year}/1002-credit.pdf`);
    });

    test('streamFile: retrieves from R2 and sets PDF headers on res', async () => {
        const headers: Record<string, string> = {};
        const mockRes: any = {
            headersSent: false,
            set: mock((obj: Record<string, string>) => {
                Object.assign(headers, obj);
            }),
        };

        const invoice: any = {
            invoiceNumber: 1001,
            storageReference: 'invoices/default-channel/2026/1001.pdf',
        };

        const stream = await strategy.streamFile(invoice, mockRes);
        expect(stream).toBeDefined();
        expect(headers['Content-Type']).toBe('application/pdf');
        expect(headers['Content-Disposition']).toBe('inline; filename="Facture-VAKAA-1001.pdf"');
        expect(headers['Cache-Control']).toBe('private, no-cache');
    });

    test('streamFile: falls back to local file if R2 throws and local file exists', async () => {
        const tmpDir = os.tmpdir();
        const localFile = path.join(tmpDir, `legacy-invoice-${Date.now()}.pdf`);
        await fsPromises.writeFile(localFile, 'LEGACY-PDF');

        (strategy as any).s3Client.send = mock(() => Promise.reject(new Error('NoSuchKey')));

        const headers: Record<string, string> = {};
        const mockRes: any = {
            headersSent: false,
            set: mock((obj: Record<string, string>) => {
                Object.assign(headers, obj);
            }),
        };

        const invoice: any = {
            invoiceNumber: 999,
            storageReference: localFile,
        };

        const stream = await strategy.streamFile(invoice, mockRes);
        expect(stream).toBeDefined();
        expect(headers['Content-Type']).toBe('application/pdf');

        await fsPromises.unlink(localFile);
    });
});

describe('VakaaInvoiceController', () => {
    let controller: VakaaInvoiceController;
    let mockInvoiceService: any;
    let mockChannelService: any;
    let mockOrderService: any;
    let mockModuleRef: any;

    beforeEach(() => {
        mockInvoiceService = {
            getInvoicesForOrder: mock(() => Promise.resolve([])),
            createInvoicesForOrder: mock(() => Promise.resolve({ invoiceNumber: 1001 })),
            downloadInvoice: mock((_ctx: any, input: any) => {
                if (input.customerEmail !== 'client@example.com') {
                    throw new Error("This order doesn't belong to customer " + input.customerEmail);
                }
                const stream = Readable.from(['pdf stream content']);
                return Promise.resolve(stream);
            }),
        };

        mockChannelService = {
            getDefaultChannel: mock(() => Promise.resolve({ token: 'default-token', id: '1' })),
        };

        mockOrderService = {
            findOneByCode: mock((_ctx: any, code: string) => {
                if (code === 'VALID_ORDER') {
                    return Promise.resolve({
                        id: '123',
                        code: 'VALID_ORDER',
                        state: 'PaymentSettled',
                        orderPlacedAt: new Date(),
                        customer: {
                            emailAddress: 'client@example.com',
                        },
                    });
                }
                if (code === 'UNPLACED_ORDER') {
                    return Promise.resolve({
                        id: '456',
                        code: 'UNPLACED_ORDER',
                        state: 'AddingItems',
                        orderPlacedAt: null,
                        customer: {
                            emailAddress: 'client@example.com',
                        },
                    });
                }
                return Promise.resolve(null);
            }),
        };

        mockModuleRef = {
            get: mock(() => mockInvoiceService),
        };

        controller = new VakaaInvoiceController(
            mockModuleRef as any,
            mockChannelService as any,
            mockOrderService as any
        );
    });

    function createMockRes() {
        const res: any = new PassThrough();
        res.headersSent = false;
        res.setHeader = mock(() => {});
        res.status = mock(() => res);
        res.send = mock(() => res);
        return res;
    }

    test('download: throws ForbiddenException when email is omitted', async () => {
        const mockRes = createMockRes();
        await expect(
            controller.download('VALID_ORDER', '', {} as any, mockRes)
        ).rejects.toThrow(ForbiddenException);
    });

    test('download: throws ForbiddenException when email does not match order', async () => {
        const mockRes = createMockRes();
        await expect(
            controller.download('VALID_ORDER', 'wrong@example.com', {} as any, mockRes)
        ).rejects.toThrow(ForbiddenException);
    });

    test('download: throws BadRequestException when order is not yet placed', async () => {
        const mockRes = createMockRes();
        await expect(
            controller.download('UNPLACED_ORDER', 'client@example.com', {} as any, mockRes)
        ).rejects.toThrow(BadRequestException);
    });

    test('download: authorizes case-insensitively and passes exact DB customer email to downloadInvoice', async () => {
        const mockRes = createMockRes();

        // Customer passes uppercase email in query param
        await controller.download('VALID_ORDER', 'CLIENT@EXAMPLE.COM', {} as any, mockRes);

        expect(mockInvoiceService.createInvoicesForOrder).toHaveBeenCalled();
        expect(mockInvoiceService.downloadInvoice).toHaveBeenCalled();
    });

    test('download: does not regenerate if invoice already exists with storageReference', async () => {
        mockInvoiceService.getInvoicesForOrder = mock(() => Promise.resolve([
            { id: '1', invoiceNumber: 1001, storageReference: 'invoices/default-token/2026/1001.pdf' }
        ]));

        const mockRes = createMockRes();

        await controller.download('VALID_ORDER', 'client@example.com', {} as any, mockRes);

        // createInvoicesForOrder must NOT have been called
        expect(mockInvoiceService.createInvoicesForOrder).not.toHaveBeenCalled();
        expect(mockInvoiceService.downloadInvoice).toHaveBeenCalled();
    });

    test('download: deduplicates concurrent in-flight generation requests', async () => {
        let resolveGen: any;
        const delayedGenPromise = new Promise((resolve) => {
            resolveGen = resolve;
        });

        mockInvoiceService.createInvoicesForOrder = mock(() => delayedGenPromise);

        const mockRes1 = createMockRes();
        const mockRes2 = createMockRes();

        const p1 = controller.download('VALID_ORDER', 'client@example.com', {} as any, mockRes1);
        const p2 = controller.download('VALID_ORDER', 'client@example.com', {} as any, mockRes2);

        // Resolve generation
        resolveGen({ invoiceNumber: 1001 });

        await Promise.all([p1, p2]);

        // createInvoicesForOrder should have been called only ONCE despite two concurrent requests!
        expect(mockInvoiceService.createInvoicesForOrder).toHaveBeenCalledTimes(1);
    });

    test('download: waits for pending worker upload when invoice exists without storageReference', async () => {
        let callCount = 0;
        mockInvoiceService.getInvoicesForOrder = mock(() => {
            callCount++;
            if (callCount === 1) {
                // First call: row exists, but storageReference is null (worker still uploading)
                return Promise.resolve([{ id: '1', invoiceNumber: 1001, storageReference: null }]);
            }
            // Subsequent call: worker has populated storageReference
            return Promise.resolve([{ id: '1', invoiceNumber: 1001, storageReference: 'invoices/default-token/2026/1001.pdf' }]);
        });

        const mockRes = createMockRes();
        await controller.download('VALID_ORDER', 'client@example.com', {} as any, mockRes);

        // Should NOT trigger on-the-fly generation because worker finished saving
        expect(mockInvoiceService.createInvoicesForOrder).not.toHaveBeenCalled();
        expect(mockInvoiceService.downloadInvoice).toHaveBeenCalled();
        expect(callCount).toBeGreaterThanOrEqual(2);
    });
});
