export type LoginInput = {
  email: unknown;
  password: unknown;
};

export type ValidLoginInput = {
  email: string;
  password: string;
};

export type LoginValidationResult =
  | {
      success: true;
      data: ValidLoginInput;
    }
  | {
      success: false;
      message: string;
      code: "INVALID_REQUEST";
    };

const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

function toTrimmedString(value: unknown) {
  return typeof value === "string" ? value.trim() : "";
}

export function validateLoginInput(input: LoginInput): LoginValidationResult {
  const email = toTrimmedString(input.email).toLowerCase();
  const password = typeof input.password === "string" ? input.password : "";

  if (!email || !password) {
    return {
      success: false,
      message: "이메일과 비밀번호를 모두 입력해주세요.",
      code: "INVALID_REQUEST",
    };
  }

  if (!EMAIL_PATTERN.test(email)) {
    return {
      success: false,
      message: "올바른 이메일 형식으로 입력해주세요.",
      code: "INVALID_REQUEST",
    };
  }

  return {
    success: true,
    data: {
      email,
      password,
    },
  };
}
