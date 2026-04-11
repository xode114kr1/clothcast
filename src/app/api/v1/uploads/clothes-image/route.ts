import { randomUUID } from "crypto";

import { cookies } from "next/headers";
import { NextResponse } from "next/server";

import { SESSION_COOKIE_NAME, verifySessionToken } from "@/lib/auth/session";
import { uploadObjectToS3 } from "@/lib/storage/s3";
import { validateClothesImageFile } from "@/lib/uploads/clothes-image-validation";

export const runtime = "nodejs";

type ErrorCode = "INVALID_REQUEST" | "UNAUTHORIZED" | "IMAGE_UPLOAD_FAILED";

// 이미지 업로드 성공 응답을 API 공통 형식으로 만든다.
function successResponse(data: { imageUrl: string }, init?: ResponseInit) {
  return NextResponse.json(
    {
      status: "success",
      message: "이미지 업로드에 성공했습니다.",
      data,
    },
    init,
  );
}

// 이미지 업로드 실패 응답을 API 공통 형식으로 만든다.
function errorResponse(
  message: string,
  code: ErrorCode,
  init?: ResponseInit,
) {
  return NextResponse.json(
    {
      status: "error",
      message,
      data: { code },
    },
    init,
  );
}

// 인증된 사용자의 의류 이미지를 multipart/form-data로 받아 S3에 업로드한다.
export async function POST(request: Request) {
  const cookieStore = await cookies();
  const sessionToken = cookieStore.get(SESSION_COOKIE_NAME)?.value;

  if (!sessionToken) {
    return errorResponse("로그인이 필요합니다.", "UNAUTHORIZED", {
      status: 401,
    });
  }

  const session = await verifySessionToken(sessionToken);

  if (!session) {
    return errorResponse("로그인이 필요합니다.", "UNAUTHORIZED", {
      status: 401,
    });
  }

  let formData: FormData;

  try {
    formData = await request.formData();
  } catch {
    return errorResponse("요청 본문이 올바른 form-data 형식이 아닙니다.", "INVALID_REQUEST", {
      status: 400,
    });
  }

  const file = formData.get("file");

  if (!(file instanceof File)) {
    return errorResponse("업로드할 이미지 파일이 필요합니다.", "INVALID_REQUEST", {
      status: 400,
    });
  }

  const validation = validateClothesImageFile(file);

  if (!validation.success) {
    return errorResponse(validation.message, validation.code, { status: 400 });
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

    return successResponse({ imageUrl }, { status: 201 });
  } catch {
    return errorResponse("이미지 업로드에 실패했습니다.", "IMAGE_UPLOAD_FAILED", {
      status: 500,
    });
  }
}
