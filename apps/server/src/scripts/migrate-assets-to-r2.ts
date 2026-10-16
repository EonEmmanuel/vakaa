import fs from 'fs';
import path from 'path';
import mime from 'mime-types';
import { S3Client, PutObjectCommand, HeadObjectCommand } from '@aws-sdk/client-s3';
import dotenv from 'dotenv';

dotenv.config({ path: path.join(__dirname, '../../.env') });

const bucket = process.env.R2_BUCKET_NAME;
const endpoint = process.env.R2_ENDPOINT;
const accessKeyId = process.env.R2_ACCESS_KEY_ID;
const secretAccessKey = process.env.R2_SECRET_ACCESS_KEY;

if (!bucket || !endpoint || !accessKeyId || !secretAccessKey) {
    console.error('❌ Cloudflare R2 credentials missing in .env!');
    console.error('Required: R2_BUCKET_NAME, R2_ENDPOINT, R2_ACCESS_KEY_ID, R2_SECRET_ACCESS_KEY');
    process.exit(1);
}

const s3Client = new S3Client({
    endpoint,
    region: 'auto',
    credentials: {
        accessKeyId,
        secretAccessKey,
    },
    forcePathStyle: true,
});

const localAssetsDir = path.join(__dirname, '../../static/assets');

function getAllFiles(dir: string, fileList: string[] = []): string[] {
    if (!fs.existsSync(dir)) return fileList;
    const files = fs.readdirSync(dir);
    for (const file of files) {
        const fullPath = path.join(dir, file);
        if (fs.statSync(fullPath).isDirectory()) {
            getAllFiles(fullPath, fileList);
        } else {
            fileList.push(fullPath);
        }
    }
    return fileList;
}

async function uploadFile(filePath: string, relativeKey: string): Promise<boolean> {
    const posixKey = relativeKey.replace(/\\/g, '/').replace(/^\/+/, '');
    const contentType = mime.lookup(filePath) || 'application/octet-stream';
    const body = fs.readFileSync(filePath);

    // Check if object already exists in R2
    try {
        await s3Client.send(new HeadObjectCommand({ Bucket: bucket, Key: posixKey }));
        console.log(`  ✓ Already exists in R2: ${posixKey}`);
        return false;
    } catch {
        // Object does not exist, proceed to upload
    }

    await s3Client.send(
        new PutObjectCommand({
            Bucket: bucket,
            Key: posixKey,
            Body: body,
            ContentType: contentType,
            CacheControl: 'public, max-age=31536000, immutable',
        })
    );

    console.log(`  ⬆ Uploaded to R2: ${posixKey} (${(body.length / 1024).toFixed(1)} KB)`);
    return true;
}

async function migrate() {
    console.log(`\n🚀 Starting Vakaa Assets Migration to Cloudflare R2...`);
    console.log(`📦 Bucket: ${bucket}`);
    console.log(`🌐 Endpoint: ${endpoint}\n`);

    const allFiles = getAllFiles(localAssetsDir);
    console.log(`Found ${allFiles.length} local files in ${localAssetsDir}`);

    let uploaded = 0;
    let skipped = 0;

    for (const file of allFiles) {
        const relativeKey = path.relative(localAssetsDir, file);
        try {
            const didUpload = await uploadFile(file, relativeKey);
            if (didUpload) uploaded++;
            else skipped++;
        } catch (err: any) {
            console.error(`  ❌ Failed to upload ${relativeKey}:`, err.message);
        }
    }

    console.log(`\n🎉 Migration complete!`);
    console.log(`   - Uploaded: ${uploaded}`);
    console.log(`   - Already in R2 / skipped: ${skipped}`);
    console.log(`   - Total assets in catalog: ${allFiles.length}\n`);
}

migrate().catch(err => {
    console.error('Fatal migration error:', err);
    process.exit(1);
});
