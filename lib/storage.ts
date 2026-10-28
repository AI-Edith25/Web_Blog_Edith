import { AwsClient } from "aws4fetch";

const { S3_ENDPOINT, S3_BUCKET, S3_PUBLIC_URL, S3_ACCESS_KEY_ID, S3_SECRET_ACCESS_KEY, S3_REGION } = process.env;

export function isObjectStorageConfigured(): boolean {
  return Boolean(S3_ENDPOINT && S3_BUCKET && S3_PUBLIC_URL && S3_ACCESS_KEY_ID && S3_SECRET_ACCESS_KEY);
}

export async function uploadToObjectStorage(
  filename: string,
  buffer: Buffer,
  contentType: string
): Promise<string> {
  const client = new AwsClient({
    accessKeyId: S3_ACCESS_KEY_ID!,
    secretAccessKey: S3_SECRET_ACCESS_KEY!,
    region: S3_REGION || "auto",
    service: "s3",
  });

  const objectUrl = `${S3_ENDPOINT!.replace(/\/$/, "")}/${S3_BUCKET}/${filename}`;
  const res = await client.fetch(objectUrl, {
    method: "PUT",
    body: new Uint8Array(buffer),
    headers: { "Content-Type": contentType },
  });

  if (!res.ok) {
    throw new Error(`Object storage upload failed: ${res.status} ${await res.text()}`);
  }

  return `${S3_PUBLIC_URL!.replace(/\/$/, "")}/${filename}`;
}
