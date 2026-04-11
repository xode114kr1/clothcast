import { cookies } from "next/headers";
import { NextResponse } from "next/server";

import { SESSION_COOKIE_NAME, verifySessionToken } from "@/lib/auth/session";
import { validateClothesIdParam } from "@/lib/clothes/clothes-validation";
import { prisma } from "@/lib/prisma";

export const runtime = "nodejs";

type RouteContext = {
  params: Promise<{
    id: string;
  }>;
};

type ErrorCode = "INVALID_REQUEST" | "UNAUTHORIZED" | "CLOTH_NOT_FOUND" | "SERVER_ERROR";

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

// 옷 상세 조회 성공 응답을 API 공통 형식으로 만든다.
function detailSuccessResponse(data: ClothesResponseData, init?: ResponseInit) {
  return NextResponse.json(
    {
      status: "success",
      message: "의류 상세 정보를 조회했습니다.",
      data,
    },
    init,
  );
}

// 옷 삭제 성공 응답을 API 공통 형식으로 만든다.
function deleteSuccessResponse(data: { id: number }, init?: ResponseInit) {
  return NextResponse.json(
    {
      status: "success",
      message: "의류가 삭제되었습니다.",
      data,
    },
    init,
  );
}

// 옷 상세/삭제 실패 응답을 API 공통 형식으로 만든다.
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

// 동적 route param을 검증해 숫자 의류 ID로 변환한다.
async function getClothesId(context: RouteContext) {
  const { id } = await context.params;
  const validation = validateClothesIdParam(id);

  if (!validation.success) {
    return validation;
  }

  return validation;
}

// 인증된 사용자가 소유한 특정 의류의 상세 정보를 조회한다.
export async function GET(_request: Request, context: RouteContext) {
  const userId = await getSessionUserId();

  if (!userId) {
    return errorResponse("로그인이 필요합니다.", "UNAUTHORIZED", {
      status: 401,
    });
  }

  const idValidation = await getClothesId(context);

  if (!idValidation.success) {
    return errorResponse(idValidation.message, idValidation.code, { status: 400 });
  }

  try {
    const clothes = await prisma.clothes.findFirst({
      where: {
        id: idValidation.data.id,
        userId,
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

    if (!clothes) {
      return errorResponse("의류 데이터를 찾을 수 없습니다.", "CLOTH_NOT_FOUND", {
        status: 404,
      });
    }

    return detailSuccessResponse(clothes, { status: 200 });
  } catch {
    return errorResponse("의류 상세 조회 중 오류가 발생했습니다.", "SERVER_ERROR", {
      status: 500,
    });
  }
}

// 인증된 사용자가 소유한 특정 의류 데이터를 삭제한다.
export async function DELETE(_request: Request, context: RouteContext) {
  const userId = await getSessionUserId();

  if (!userId) {
    return errorResponse("로그인이 필요합니다.", "UNAUTHORIZED", {
      status: 401,
    });
  }

  const idValidation = await getClothesId(context);

  if (!idValidation.success) {
    return errorResponse(idValidation.message, idValidation.code, { status: 400 });
  }

  try {
    const result = await prisma.clothes.deleteMany({
      where: {
        id: idValidation.data.id,
        userId,
      },
    });

    if (result.count === 0) {
      return errorResponse("의류 데이터를 찾을 수 없습니다.", "CLOTH_NOT_FOUND", {
        status: 404,
      });
    }

    return deleteSuccessResponse({ id: idValidation.data.id }, { status: 200 });
  } catch {
    return errorResponse("의류 삭제 중 오류가 발생했습니다.", "SERVER_ERROR", {
      status: 500,
    });
  }
}
