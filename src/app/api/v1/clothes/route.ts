import { cookies } from "next/headers";

import type { Prisma } from "@/generated/prisma/client";
import { apiError, apiSuccess } from "@/lib/api/response";
import { SESSION_COOKIE_NAME, verifySessionToken } from "@/lib/auth/session";
import {
  validateCreateClothesInput,
  validateListClothesQuery,
} from "@/lib/clothes/clothes-validation";
import type { ListClothesFilters } from "@/lib/clothes/clothes-validation";
import { prisma } from "@/lib/prisma";

export const runtime = "nodejs";

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

// 목록 조회 query filter를 Prisma where 조건으로 변환한다.
function buildClothesWhereInput(
  userId: number,
  filters: ListClothesFilters,
): Prisma.ClothesWhereInput {
  return {
    userId,
    ...(filters.category ? { category: filters.category } : {}),
    ...(filters.fit ? { fit: filters.fit } : {}),
    ...(filters.formality ? { formality: filters.formality } : {}),
  };
}

// 인증된 사용자의 옷 등록 요청을 검증한 뒤 Clothes 레코드를 생성한다.
export async function POST(request: Request) {
  const userId = await getSessionUserId();

  if (!userId) {
    return apiError("로그인이 필요합니다.", "UNAUTHORIZED", {
      status: 401,
    });
  }

  let body: unknown;

  try {
    body = await request.json();
  } catch {
    return apiError("요청 본문이 올바른 JSON 형식이 아닙니다.", "INVALID_REQUEST", {
      status: 400,
    });
  }

  const validation = validateCreateClothesInput(body);

  if (!validation.success) {
    return apiError(validation.message, validation.code, { status: 400 });
  }

  try {
    const user = await prisma.user.findUnique({
      where: { id: userId },
      select: { id: true },
    });

    if (!user) {
      return apiError("사용자를 찾을 수 없습니다.", "USER_NOT_FOUND", {
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

    return apiSuccess("의류가 등록되었습니다.", clothes, { status: 201 });
  } catch {
    return apiError("의류 등록 중 오류가 발생했습니다.", "SERVER_ERROR", {
      status: 500,
    });
  }
}

// 인증된 사용자의 옷 목록을 최신 등록순으로 조회한다.
export async function GET(request: Request) {
  const userId = await getSessionUserId();

  if (!userId) {
    return apiError("로그인이 필요합니다.", "UNAUTHORIZED", {
      status: 401,
    });
  }

  const { searchParams } = new URL(request.url);
  const validation = validateListClothesQuery(searchParams);

  if (!validation.success) {
    return apiError(validation.message, validation.code, { status: 400 });
  }

  try {
    const clothes = await prisma.clothes.findMany({
      where: buildClothesWhereInput(userId, validation.data),
      orderBy: {
        createdAt: "desc",
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

    return apiSuccess("의류 목록을 조회했습니다.", clothes, { status: 200 });
  } catch {
    return apiError("의류 목록 조회 중 오류가 발생했습니다.", "SERVER_ERROR", {
      status: 500,
    });
  }
}
