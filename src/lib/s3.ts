import "dotenv/config";

import {
  DeleteObjectCommand,
  GetObjectCommand,
  PutObjectCommand,
  S3Client,
} from "@aws-sdk/client-s3";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";

function getS3Client() {
  const endpoint = process.env.S3_ENDPOINT!;
  const region = process.env.S3_REGION!;
  const accessKeyId = process.env.S3_ACCESS_KEY!;
  const secretAccessKey = process.env.S3_SECRET_KEY!;
  const forcePathStyle = process.env.S3_FORCE_PATH_STYLE === "true";

  return new S3Client({
    region,
    endpoint,
    credentials: { accessKeyId, secretAccessKey },
    forcePathStyle,
  });
}

let s3Client: S3Client;

function s3(): S3Client {
  if (!s3Client) {
    s3Client = getS3Client();
  }
  return s3Client;
}

function bucket(): string {
  return process.env.S3_BUCKET!;
}

export function generateKey(parentType: string, parentId: string, fileName: string): string {
  const ext = fileName.split(".").pop() ?? "bin";
  const uuid = crypto.randomUUID();
  return `${parentType}/${parentId}/${uuid}.${ext}`;
}

export async function uploadFile(key: string, body: Uint8Array | Blob, contentType: string) {
  await s3().send(
    new PutObjectCommand({
      Bucket: bucket(),
      Key: key,
      Body: body,
      ContentType: contentType,
    }),
  );
}

export async function deleteFile(key: string) {
  await s3().send(
    new DeleteObjectCommand({
      Bucket: bucket(),
      Key: key,
    }),
  );
}

export async function getPresignedUploadUrl(
  key: string,
  contentType: string,
  expiresIn = 3600,
): Promise<string> {
  return getSignedUrl(
    s3(),
    new PutObjectCommand({
      Bucket: bucket(),
      Key: key,
      ContentType: contentType,
    }),
    { expiresIn },
  );
}

export async function getPresignedDownloadUrl(key: string, expiresIn = 3600): Promise<string> {
  return getSignedUrl(
    s3(),
    new GetObjectCommand({
      Bucket: bucket(),
      Key: key,
    }),
    { expiresIn },
  );
}
