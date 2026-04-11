import { validateLoginInput } from "@/lib/auth/login-validation";
import { verifyPassword } from "@/lib/auth/password";
import { prisma } from "@/lib/prisma";

export const runtime = "nodejs";

type ErrorCode = "INVALID_REQUEST" | "INVALID_CREDENTIALS" | "SERVER_ERROR";

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null && !Array.isArray(value);
}

function successResponse(
  data: {
    userId: number;
    email: string;
    nickname: string;
  },
  init?: ResponseInit,
) {
  return Response.json(
    {
      status: "success",
      message: "로그인에 성공했습니다.",
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
  return Response.json(
    {
      status: "error",
      message,
      data: { code },
    },
    init,
  );
}

export async function POST(request: Request) {
  let body: unknown;

  try {
    body = await request.json();
  } catch {
    return errorResponse("요청 본문이 올바른 JSON 형식이 아닙니다.", "INVALID_REQUEST", {
      status: 400,
    });
  }

  const payload = isRecord(body) ? body : {};
  const validation = validateLoginInput({
    email: payload.email,
    password: payload.password,
  });

  if (!validation.success) {
    return errorResponse(validation.message, validation.code, { status: 400 });
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
      return errorResponse(
        "이메일 또는 비밀번호가 올바르지 않습니다.",
        "INVALID_CREDENTIALS",
        { status: 401 },
      );
    }

    const isValidPassword = await verifyPassword(password, user.passwordHash);

    if (!isValidPassword) {
      return errorResponse(
        "이메일 또는 비밀번호가 올바르지 않습니다.",
        "INVALID_CREDENTIALS",
        { status: 401 },
      );
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
    return errorResponse("로그인 처리 중 오류가 발생했습니다.", "SERVER_ERROR", {
      status: 500,
    });
  }
}
