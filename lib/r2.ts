import {
  S3Client,
  PutObjectCommand,
  DeleteObjectCommand,
} from '@aws-sdk/client-s3';

const accountId = process.env.R2_ACCOUNT_ID;
const accessKeyId = process.env.R2_ACCESS_KEY_ID;
const secretAccessKey = process.env.R2_SECRET_ACCESS_KEY;
const bucketName = process.env.R2_BUCKET_NAME;
const publicUrl = process.env.R2_PUBLIC_URL?.replace(/\/$/, ''); // base URL for public access

function getClient() {
  if (!accountId || !accessKeyId || !secretAccessKey || !bucketName) {
    return null;
  }
  return new S3Client({
    region: 'auto',
    endpoint: `https://${accountId}.r2.cloudflarestorage.com`,
    credentials: { accessKeyId, secretAccessKey },
  });
}

export function isR2Configured(): boolean {
  return !!getClient() && !!publicUrl;
}

export async function uploadToR2(
  key: string,
  body: Buffer | Uint8Array,
  contentType: string
): Promise<string | null> {
  const client = getClient();
  if (!client || !bucketName || !publicUrl) return null;

  await client.send(
    new PutObjectCommand({
      Bucket: bucketName,
      Key: key,
      Body: body,
      ContentType: contentType,
    })
  );

  return `${publicUrl}/${key}`;
}

export async function deleteFromR2(key: string): Promise<boolean> {
  const client = getClient();
  if (!client || !bucketName) return false;

  await client.send(
    new DeleteObjectCommand({
      Bucket: bucketName,
      Key: key,
    })
  );
  return true;
}

export function getPublicUrl(key: string): string {
  return `${publicUrl}/${key.replace(/^\//, '')}`;
}
