import { cookies } from "next/headers";
import { NextResponse } from "next/server";

import { SESSION_COOKIE_NAME, verifySessionToken } from "@/lib/auth/session";
import { prisma } from "@/lib/prisma";

export const runtime = "nodejs";

type ErrorCode = "UNAUTHORIZED" | "USER_NOT_FOUND" | "SERVER_ERROR";

function successResponse(
  data: {
    userId: number;
    email: string;
    nickname: string;
  },
  init?: ResponseInit,
) {
  return NextResponse.json(
    {
      status: "success",
      message: "사용자 정보를 조회했습니다.",
      data,
    },
    init,
  );
}

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

export async function GET() {
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
      return errorResponse("사용자를 찾을 수 없습니다.", "USER_NOT_FOUND", {
        status: 404,
      });
    }

    return successResponse(
      {
        userId: user.id,
        email: user.email,
        nickname: user.nickname,
      },
      { status: 200 },
    );
  } catch {
    return errorResponse("사용자 정보 조회 중 오류가 발생했습니다.", "SERVER_ERROR", {
      status: 500,
    });
  }
}
