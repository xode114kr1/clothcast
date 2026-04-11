import { PutObjectCommand, S3Client } from "@aws-sdk/client-s3";

let s3Client: S3Client | null = null;

// S3 연동에 필요한 서버 환경 변수를 읽고 누락 시 즉시 실패시킨다.
function getRequiredEnv(name: string) {
  const value = process.env[name];

  if (!value) {
    throw new Error(`${name} is not set.`);
  }

  return value;
}

// 요청마다 새 client를 만들지 않도록 S3 client 인스턴스를 재사용한다.
function getS3Client() {
  if (!s3Client) {
    s3Client = new S3Client({
      region: getRequiredEnv("AWS_REGION"),
      credentials: {
        accessKeyId: getRequiredEnv("AWS_ACCESS_KEY_ID"),
        secretAccessKey: getRequiredEnv("AWS_SECRET_ACCESS_KEY"),
      },
    });
  }

  return s3Client;
}

// 저장된 S3 object key를 브라우저에서 접근할 수 있는 이미지 URL로 변환한다.
function getPublicImageUrl(key: string) {
  const publicBaseUrl = process.env.AWS_S3_PUBLIC_BASE_URL?.replace(/\/$/, "");

  if (publicBaseUrl) {
    return `${publicBaseUrl}/${key}`;
  }

  const bucket = getRequiredEnv("AWS_S3_BUCKET_NAME");
  const region = getRequiredEnv("AWS_REGION");

  return `https://${bucket}.s3.${region}.amazonaws.com/${key}`;
}

// 이미지 바이너리를 S3에 저장하고, DB에 보관할 공개 이미지 URL을 반환한다.
export async function uploadObjectToS3({
  key,
  body,
  contentType,
}: {
  key: string;
  body: Buffer;
  contentType: string;
}) {
  const bucket = getRequiredEnv("AWS_S3_BUCKET_NAME");

  await getS3Client().send(
    new PutObjectCommand({
      Bucket: bucket,
      Key: key,
      Body: body,
      ContentType: contentType,
    }),
  );

  return {
    imageUrl: getPublicImageUrl(key),
  };
}
