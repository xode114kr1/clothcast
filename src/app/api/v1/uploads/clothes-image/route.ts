import { randomUUID } from "crypto";

import { apiError, apiSuccess } from "@/lib/api/response";
import { getCurrentSessionUser } from "@/lib/auth/current-user";
import { uploadObjectToS3 } from "@/lib/storage/s3";
import { validateClothesImageFile } from "@/lib/uploads/clothes-image-validation";

export const runtime = "nodejs";

// 인증된 사용자의 의류 이미지를 multipart/form-data로 받아 S3에 업로드한다.
export async function POST(request: Request) {
  const session = await getCurrentSessionUser();

  if (!session) {
    return apiError("로그인이 필요합니다.", "UNAUTHORIZED", {
      status: 401,
    });
  }

  let formData: FormData;

  try {
    formData = await request.formData();
  } catch {
    return apiError("요청 본문이 올바른 form-data 형식이 아닙니다.", "INVALID_REQUEST", {
      status: 400,
    });
  }

  const file = formData.get("file");

  if (!(file instanceof File)) {
    return apiError("업로드할 이미지 파일이 필요합니다.", "INVALID_REQUEST", {
      status: 400,
    });
  }

  const validation = validateClothesImageFile(file);

  if (!validation.success) {
    return apiError(validation.message, validation.code, { status: 400 });
  }

  const key = [
    "clothes",
    String(session.userId),
    `${randomUUID()}.${validation.data.extension}`,
  ].join("/");

  try {
    const arrayBuffer = await file.arrayBuffer();
    const { imageUrl } = await uploadObjectToS3({
      key,
      body: Buffer.from(arrayBuffer),
      contentType: file.type,
    });

    return apiSuccess("이미지 업로드에 성공했습니다.", { imageUrl }, { status: 201 });
  } catch {
    return apiError("이미지 업로드에 실패했습니다.", "IMAGE_UPLOAD_FAILED", {
      status: 500,
    });
  }
}
