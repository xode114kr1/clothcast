import { cookies } from "next/headers";
import { NextResponse } from "next/server";

import { SESSION_COOKIE_NAME, verifySessionToken } from "@/lib/auth/session";
import { validateCreateClothesInput } from "@/lib/clothes/clothes-validation";
import { prisma } from "@/lib/prisma";

export const runtime = "nodejs";

type ErrorCode = "INVALID_REQUEST" | "UNAUTHORIZED" | "USER_NOT_FOUND" | "SERVER_ERROR";

type ClothesResponseData = {
  id: number;
  userId: number;
  name: string;
  category: string;
  color: string;
  fit: string;
  formality: number;
  material: string | null;
  pattern: string | null;
  imageUrl: string;
  createdAt: Date;
};

// 옷 등록 성공 응답을 API 공통 형식으로 만든다.
function successResponse(data: ClothesResponseData, init?: ResponseInit) {
  return NextResponse.json(
    {
      status: "success",
      message: "의류가 등록되었습니다.",
      data,
    },
    init,
  );
}

// 옷 등록 실패 응답을 API 공통 형식으로 만든다.
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

// HttpOnly 세션 쿠키를 검증해 현재 요청의 사용자 ID를 가져온다.
async function getSessionUserId() {
  const cookieStore = await cookies();
  const sessionToken = cookieStore.get(SESSION_COOKIE_NAME)?.value;

  if (!sessionToken) {
    return null;
  }

  const session = await verifySessionToken(sessionToken);

  return session?.userId ?? null;
}

// 인증된 사용자의 옷 등록 요청을 검증한 뒤 Clothes 레코드를 생성한다.
export async function POST(request: Request) {
  const userId = await getSessionUserId();

  if (!userId) {
    return errorResponse("로그인이 필요합니다.", "UNAUTHORIZED", {
      status: 401,
    });
  }

  let body: unknown;

  try {
    body = await request.json();
  } catch {
    return errorResponse("요청 본문이 올바른 JSON 형식이 아닙니다.", "INVALID_REQUEST", {
      status: 400,
    });
  }

  const validation = validateCreateClothesInput(body);

  if (!validation.success) {
    return errorResponse(validation.message, validation.code, { status: 400 });
  }

  try {
    const user = await prisma.user.findUnique({
      where: { id: userId },
      select: { id: true },
    });

    if (!user) {
      return errorResponse("사용자를 찾을 수 없습니다.", "USER_NOT_FOUND", {
        status: 404,
      });
    }

    const clothes = await prisma.clothes.create({
      data: {
        userId,
        ...validation.data,
      },
      select: {
        id: true,
        userId: true,
        name: true,
        category: true,
        color: true,
        fit: true,
        formality: true,
        material: true,
        pattern: true,
        imageUrl: true,
        createdAt: true,
      },
    });

    return successResponse(clothes, { status: 201 });
  } catch {
    return errorResponse("의류 등록 중 오류가 발생했습니다.", "SERVER_ERROR", {
      status: 500,
    });
  }
}
