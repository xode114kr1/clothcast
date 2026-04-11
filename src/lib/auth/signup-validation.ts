export type SignupInput = {
  email: unknown;
  nickname: unknown;
  password: unknown;
};

export type ValidSignupInput = {
  email: string;
  nickname: string;
  password: string;
};

export type SignupValidationResult =
  | {
      success: true;
      data: ValidSignupInput;
    }
  | {
      success: false;
      message: string;
      code: "INVALID_REQUEST";
    };

const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const MIN_PASSWORD_LENGTH = 8;

function toTrimmedString(value: unknown) {
  return typeof value === "string" ? value.trim() : "";
}

export function validateSignupInput(
  input: SignupInput,
): SignupValidationResult {
  const email = toTrimmedString(input.email).toLowerCase();
  const nickname = toTrimmedString(input.nickname);
  const password = typeof input.password === "string" ? input.password : "";

  if (!email || !nickname || !password) {
    return {
      success: false,
      message: "이메일, 닉네임, 비밀번호를 모두 입력해주세요.",
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

  if (password.length < MIN_PASSWORD_LENGTH) {
    return {
      success: false,
      message: "비밀번호는 8자 이상 입력해주세요.",
      code: "INVALID_REQUEST",
    };
  }

  return {
    success: true,
    data: {
      email,
      nickname,
      password,
    },
  };
}
