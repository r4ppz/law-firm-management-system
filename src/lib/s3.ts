import {
  DeleteObjectCommand,
  GetObjectCommand,
  HeadObjectCommand,
  NotFound,
  PutObjectCommand,
  S3Client,
} from "@aws-sdk/client-s3";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";

/**
 * S3-compatible object storage client.
 *
 * Lazily constructs a singleton `S3Client` from environment variables and
 * exposes helpers to generate presigned upload/download URLs and manage keys.
 * All file bytes are transferred client-side directly to the bucket via the
 * presigned URLs; this module never streams payloads through the runtime.
 */

/** Reads a required S3 env var, throwing a clear error when it is missing. */
function getRequiredEnvVar(name: string): string {
  const value = process.env[name];
  if (!value) {
    throw new Error(`Missing required S3 environment variable: ${name}. Check your .env file.`);
  }
  return value;
}

/** Constructs a configured {@link S3Client} from the S3 environment variables. */
function getS3Client() {
  const endpoint = getRequiredEnvVar("S3_ENDPOINT");
  const region = getRequiredEnvVar("S3_REGION");
  const accessKeyId = getRequiredEnvVar("S3_ACCESS_KEY");
  const secretAccessKey = getRequiredEnvVar("S3_SECRET_KEY");
  const forcePathStyle = process.env.S3_FORCE_PATH_STYLE === "true";

  return new S3Client({
    region,
    endpoint,
    credentials: { accessKeyId, secretAccessKey },
    forcePathStyle,
  });
}

let s3Client: S3Client;

/** Returns the lazily-initialized singleton S3 client. */
function s3(): S3Client {
  if (!s3Client) {
    s3Client = getS3Client();
  }
  return s3Client;
}

/** Returns the configured S3 bucket name. */
function bucket(): string {
  return getRequiredEnvVar("S3_BUCKET");
}

/** Builds a storage key of the form `${parentType}/${parentId}/${uuid}.${ext}`. */
export function generateKey(parentType: string, parentId: string, fileName: string): string {
  const dotIndex = fileName.lastIndexOf(".");
  const ext =
    dotIndex !== -1 && dotIndex < fileName.length - 1 ? fileName.slice(dotIndex + 1) : "bin";
  const uuid = crypto.randomUUID();
  return `${parentType}/${parentId}/${uuid}.${ext}`;
}

/** Deletes the object stored at the given key. */
export async function deleteFile(key: string) {
  await s3().send(
    new DeleteObjectCommand({
      Bucket: bucket(),
      Key: key,
    }),
  );
}

/** Returns whether an object exists at the given key (false on a 404). */
export async function objectExists(key: string): Promise<boolean> {
  try {
    await s3().send(new HeadObjectCommand({ Bucket: bucket(), Key: key }));
    return true;
  } catch (e) {
    if (e instanceof NotFound) return false;
    throw e;
  }
}

const UPLOAD_URL_EXPIRY_S = 300;
const DOWNLOAD_URL_EXPIRY_S = 3600;

/** Generates a presigned PUT URL the client uses to upload a file directly. */
export async function getPresignedUploadUrl(
  key: string,
  contentType: string,
  expiresIn = UPLOAD_URL_EXPIRY_S,
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

/** Strips control characters and quotes that are unsafe for a download filename. */
function sanitizeFilename(name: string): string {
  return name.replace(/["\\]/g, "").replace(/[\x00-\x1f]/g, "");
}

/** Generates a presigned GET URL the client uses to download a file directly. */
export async function getPresignedDownloadUrl(
  key: string,
  fileName?: string,
  expiresIn = DOWNLOAD_URL_EXPIRY_S,
): Promise<string> {
  return getSignedUrl(
    s3(),
    new GetObjectCommand({
      Bucket: bucket(),
      Key: key,
      ...(fileName
        ? { ResponseContentDisposition: `attachment; filename="${sanitizeFilename(fileName)}"` }
        : {}),
    }),
    { expiresIn },
  );
}
