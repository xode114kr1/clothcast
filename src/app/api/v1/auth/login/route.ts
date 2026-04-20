import { validateLoginInput } from "@/lib/auth/login-validation";
import { verifyPassword } from "@/lib/auth/password";
import {
  createSessionToken,
  SESSION_COOKIE_NAME,
  SESSION_DURATION_SECONDS,
} from "@/lib/auth/session";
import { apiError, apiSuccess } from "@/lib/api/response";
import { prisma } from "@/lib/prisma";

export const runtime = "nodejs";

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null && !Array.isArray(value);
}

export async function POST(request: Request) {
  let body: unknown;

  try {
    body = await request.json();
  } catch {
    return apiError("요청 본문이 올바른 JSON 형식이 아닙니다.", "INVALID_REQUEST", {
      status: 400,
    });
  }

  const payload = isRecord(body) ? body : {};
  const validation = validateLoginInput({
    email: payload.email,
    password: payload.password,
  });

  if (!validation.success) {
    return apiError(validation.message, validation.code, { status: 400 });
  }

  const { email, password } = validation.data;

  try {
    const user = await prisma.user.findUnique({
      where: { email },
      select: {
        id: true,
        email: true,
        nickname: true,
        passwordHash: true,
      },
    });

    if (!user) {
      return apiError(
        "이메일 또는 비밀번호가 올바르지 않습니다.",
        "INVALID_CREDENTIALS",
        { status: 401 },
      );
    }

    const isValidPassword = await verifyPassword(password, user.passwordHash);

    if (!isValidPassword) {
      return apiError(
        "이메일 또는 비밀번호가 올바르지 않습니다.",
        "INVALID_CREDENTIALS",
        { status: 401 },
      );
    }

    const sessionToken = await createSessionToken({ userId: user.id });
    const response = apiSuccess(
      "로그인에 성공했습니다.",
      {
        userId: user.id,
        email: user.email,
        nickname: user.nickname,
      },
      { status: 200 },
    );

    response.cookies.set(SESSION_COOKIE_NAME, sessionToken, {
      httpOnly: true,
      maxAge: SESSION_DURATION_SECONDS,
      path: "/",
      sameSite: "lax",
      secure: process.env.NODE_ENV === "production",
    });

    return response;
  } catch {
    return apiError("로그인 처리 중 오류가 발생했습니다.", "SERVER_ERROR", {
      status: 500,
    });
  }
}
