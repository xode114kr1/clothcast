import { cookies } from "next/headers";

import { apiError, apiSuccess } from "@/lib/api/response";
import { SESSION_COOKIE_NAME, verifySessionToken } from "@/lib/auth/session";
import { prisma } from "@/lib/prisma";

export const runtime = "nodejs";

export async function GET() {
  const cookieStore = await cookies();
  const sessionToken = cookieStore.get(SESSION_COOKIE_NAME)?.value;

  if (!sessionToken) {
    return apiError("로그인이 필요합니다.", "UNAUTHORIZED", {
      status: 401,
    });
  }

  const session = await verifySessionToken(sessionToken);

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
        createdAt: true,
      },
    });

    if (!user) {
      return apiError("사용자를 찾을 수 없습니다.", "USER_NOT_FOUND", {
        status: 404,
      });
    }

    return apiSuccess(
      "프로필을 조회했습니다.",
      {
        userId: user.id,
        email: user.email,
        nickname: user.nickname,
        createdAt: user.createdAt,
      },
      { status: 200 },
    );
  } catch {
    return apiError("프로필 조회 중 오류가 발생했습니다.", "SERVER_ERROR", {
      status: 500,
    });
  }
}
