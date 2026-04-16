import { apiError, apiSuccess } from "@/lib/api/response";
import { getCurrentSessionUserId } from "@/lib/auth/current-user";
import {
  validateClothesIdParam,
  validateUpdateClothesInput,
} from "@/lib/clothes/clothes-validation";
import { prisma } from "@/lib/prisma";

export const runtime = "nodejs";

type RouteContext = {
  params: Promise<{
    id: string;
  }>;
};

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
  const userId = await getCurrentSessionUserId();

  if (!userId) {
    return apiError("로그인이 필요합니다.", "UNAUTHORIZED", {
      status: 401,
    });
  }

  const idValidation = await getClothesId(context);

  if (!idValidation.success) {
    return apiError(idValidation.message, idValidation.code, { status: 400 });
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
      return apiError("의류 데이터를 찾을 수 없습니다.", "CLOTH_NOT_FOUND", {
        status: 404,
      });
    }

    return apiSuccess("의류 상세 정보를 조회했습니다.", clothes, { status: 200 });
  } catch {
    return apiError("의류 상세 조회 중 오류가 발생했습니다.", "SERVER_ERROR", {
      status: 500,
    });
  }
}

// 인증된 사용자가 소유한 특정 의류 데이터를 삭제한다.
export async function DELETE(_request: Request, context: RouteContext) {
  const userId = await getCurrentSessionUserId();

  if (!userId) {
    return apiError("로그인이 필요합니다.", "UNAUTHORIZED", {
      status: 401,
    });
  }

  const idValidation = await getClothesId(context);

  if (!idValidation.success) {
    return apiError(idValidation.message, idValidation.code, { status: 400 });
  }

  try {
    const result = await prisma.clothes.deleteMany({
      where: {
        id: idValidation.data.id,
        userId,
      },
    });

    if (result.count === 0) {
      return apiError("의류 데이터를 찾을 수 없습니다.", "CLOTH_NOT_FOUND", {
        status: 404,
      });
    }

    return apiSuccess("의류가 삭제되었습니다.", { id: idValidation.data.id }, { status: 200 });
  } catch {
    return apiError("의류 삭제 중 오류가 발생했습니다.", "SERVER_ERROR", {
      status: 500,
    });
  }
}

// 인증된 사용자가 소유한 특정 의류 데이터를 수정한다.
export async function PATCH(request: Request, context: RouteContext) {
  const userId = await getCurrentSessionUserId();

  if (!userId) {
    return apiError("로그인이 필요합니다.", "UNAUTHORIZED", {
      status: 401,
    });
  }

  const idValidation = await getClothesId(context);

  if (!idValidation.success) {
    return apiError(idValidation.message, idValidation.code, { status: 400 });
  }

  let body: unknown;

  try {
    body = await request.json();
  } catch {
    return apiError("요청 본문이 올바른 JSON 형식이 아닙니다.", "INVALID_REQUEST", {
      status: 400,
    });
  }

  const validation = validateUpdateClothesInput(body);

  if (!validation.success) {
    return apiError(validation.message, validation.code, { status: 400 });
  }

  try {
    const result = await prisma.clothes.updateMany({
      where: {
        id: idValidation.data.id,
        userId,
      },
      data: validation.data,
    });

    if (result.count === 0) {
      return apiError("의류 데이터를 찾을 수 없습니다.", "CLOTH_NOT_FOUND", {
        status: 404,
      });
    }

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
      return apiError("의류 데이터를 찾을 수 없습니다.", "CLOTH_NOT_FOUND", {
        status: 404,
      });
    }

    return apiSuccess("의류 정보가 수정되었습니다.", clothes, { status: 200 });
  } catch {
    return apiError("의류 수정 중 오류가 발생했습니다.", "SERVER_ERROR", {
      status: 500,
    });
  }
}
