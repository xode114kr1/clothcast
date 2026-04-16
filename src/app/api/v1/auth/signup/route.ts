import { Prisma } from "@/generated/prisma/client";
import { apiError, apiSuccess } from "@/lib/api/response";
import { hashPassword } from "@/lib/auth/password";
import { validateSignupInput } from "@/lib/auth/signup-validation";
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
  const validation = validateSignupInput({
    email: payload.email,
    nickname: payload.nickname,
    password: payload.password,
  });

  if (!validation.success) {
    return apiError(validation.message, validation.code, { status: 400 });
  }

  const { email, nickname, password } = validation.data;

  try {
    const existingUser = await prisma.user.findUnique({
      where: { email },
      select: { id: true },
    });

    if (existingUser) {
      return apiError("이미 가입된 이메일입니다.", "EMAIL_ALREADY_EXISTS", {
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

    return apiSuccess(
      "회원가입이 완료되었습니다.",
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
      return apiError("이미 가입된 이메일입니다.", "EMAIL_ALREADY_EXISTS", {
        status: 409,
      });
    }

    return apiError("회원가입 처리 중 오류가 발생했습니다.", "SERVER_ERROR", {
      status: 500,
    });
  }
}
