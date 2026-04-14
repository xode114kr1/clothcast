import { Prisma } from "@/generated/prisma/client";
import { hashPassword } from "@/lib/auth/password";
import { validateSignupInput } from "@/lib/auth/signup-validation";
import { prisma } from "@/lib/prisma";

export const runtime = "nodejs";

type ErrorCode = "INVALID_REQUEST" | "EMAIL_ALREADY_EXISTS" | "SERVER_ERROR";

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
      message: "회원가입이 완료되었습니다.",
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
  const validation = validateSignupInput({
    email: payload.email,
    nickname: payload.nickname,
    password: payload.password,
  });

  if (!validation.success) {
    return errorResponse(validation.message, validation.code, { status: 400 });
  }

  const { email, nickname, password } = validation.data;

  try {
    const existingUser = await prisma.user.findUnique({
      where: { email },
      select: { id: true },
    });

    if (existingUser) {
      return errorResponse("이미 가입된 이메일입니다.", "EMAIL_ALREADY_EXISTS", {
        status: 409,
      });
    }

    const passwordHash = await hashPassword(password);
    const user = await prisma.user.create({
      data: {
        email,
        nickname,
        passwordHash,
      },
      select: {
        id: true,
        email: true,
        nickname: true,
      },
    });

    return successResponse(
      {
        userId: user.id,
        email: user.email,
        nickname: user.nickname,
      },
      { status: 201 },
    );
  } catch (error) {
    if (
      error instanceof Prisma.PrismaClientKnownRequestError &&
      error.code === "P2002"
    ) {
      return errorResponse("이미 가입된 이메일입니다.", "EMAIL_ALREADY_EXISTS", {
        status: 409,
      });
    }

    return errorResponse("회원가입 처리 중 오류가 발생했습니다.", "SERVER_ERROR", {
      status: 500,
    });
  }
}
