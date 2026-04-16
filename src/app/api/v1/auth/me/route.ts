import { apiError, apiSuccess } from "@/lib/api/response";
import { getCurrentSessionUser } from "@/lib/auth/current-user";
import { prisma } from "@/lib/prisma";

export const runtime = "nodejs";

export async function GET() {
  const session = await getCurrentSessionUser();

  if (!session) {
    return apiError("로그인이 필요합니다.", "UNAUTHORIZED", {
      status: 401,
    });
  }

  try {
    const user = await prisma.user.findUnique({
      where: { id: session.userId },
      select: {
        id: true,
        email: true,
        nickname: true,
      },
    });

    if (!user) {
      return apiError("사용자를 찾을 수 없습니다.", "USER_NOT_FOUND", {
        status: 404,
      });
    }

    return apiSuccess(
      "사용자 정보를 조회했습니다.",
      {
        userId: user.id,
        email: user.email,
        nickname: user.nickname,
      },
      { status: 200 },
    );
  } catch {
    return apiError("사용자 정보 조회 중 오류가 발생했습니다.", "SERVER_ERROR", {
      status: 500,
    });
  }
}
