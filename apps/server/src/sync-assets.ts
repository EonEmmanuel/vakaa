import fs from 'fs';
import path from 'path';
import crypto from 'crypto';

const sourceDir = path.join(__dirname, '../static/vakaa-import-assets');
const targetAssetsDir = path.join(__dirname, '../static/assets');

/**
 * Ensures all VAKAA luxury product images are synced to Vendure's
 * AssetServerPlugin directory structure (hashed folders under source/ and preview/).
 */
export function syncVakaaAssets(): void {
    if (!fs.existsSync(sourceDir)) {
        console.warn(`[AssetSync] Source directory not found: ${sourceDir}`);
        return;
    }

    const files = fs.readdirSync(sourceDir).filter(f => f.endsWith('.jpg') || f.endsWith('.png'));
    let syncedCount = 0;

    for (const file of files) {
        const ext = path.extname(file);
        const base = path.basename(file, ext);
        const previewFileName = `${base}__preview${ext}`;

        const srcHash = crypto.createHash('md5').update(file).digest('hex').slice(0, 2);
        const prevHash = crypto.createHash('md5').update(previewFileName).digest('hex').slice(0, 2);

        const sourceSubdir = path.join(targetAssetsDir, 'source', srcHash);
        const previewSubdir = path.join(targetAssetsDir, 'preview', prevHash);

        fs.mkdirSync(sourceSubdir, { recursive: true });
        fs.mkdirSync(previewSubdir, { recursive: true });

        const originalFilePath = path.join(sourceDir, file);
        const targetSourcePath = path.join(sourceSubdir, file);
        const targetPreviewPath = path.join(previewSubdir, previewFileName);

        if (!fs.existsSync(targetSourcePath)) {
            fs.copyFileSync(originalFilePath, targetSourcePath);
        }
        if (!fs.existsSync(targetPreviewPath)) {
            fs.copyFileSync(originalFilePath, targetPreviewPath);
        }

        // Also ensure fallback preview under source hash and vice versa
        const fallbackPreviewSubdir = path.join(targetAssetsDir, 'preview', srcHash);
        fs.mkdirSync(fallbackPreviewSubdir, { recursive: true });
        const fallbackPreviewPath = path.join(fallbackPreviewSubdir, previewFileName);
        if (!fs.existsSync(fallbackPreviewPath)) {
            fs.copyFileSync(originalFilePath, fallbackPreviewPath);
        }

        syncedCount++;
    }

    console.log(`[AssetSync] Successfully synced ${syncedCount} VAKAA product assets into ${targetAssetsDir}`);
}

if (require.main === module) {
    syncVakaaAssets();
}
