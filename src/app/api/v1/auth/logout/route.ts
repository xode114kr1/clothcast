import { NextResponse } from "next/server";

import { SESSION_COOKIE_NAME } from "@/lib/auth/session";

export const runtime = "nodejs";

function successResponse(init?: ResponseInit) {
  return NextResponse.json(
    {
      status: "success",
      message: "로그아웃되었습니다.",
      data: null,
    },
    init,
  );
}

export async function POST() {
  const response = successResponse({ status: 200 });

  response.cookies.set(SESSION_COOKIE_NAME, "", {
    httpOnly: true,
    maxAge: 0,
    path: "/",
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
  });

  return response;
}
