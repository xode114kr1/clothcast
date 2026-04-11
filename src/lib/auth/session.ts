import { jwtVerify, SignJWT } from "jose";

export const SESSION_COOKIE_NAME = "clothcast_session";
export const SESSION_DURATION_SECONDS = 60 * 60 * 24 * 7;

export type SessionUser = {
  userId: number;
};

const textEncoder = new TextEncoder();

// 세션 토큰 서명과 검증에 사용할 비밀값을 읽는다.
function getSessionSecret() {
  const secret = process.env.AUTH_SECRET;

  if (!secret) {
    throw new Error("AUTH_SECRET is not set.");
  }

  return textEncoder.encode(secret);
}

// 디코딩된 JWT payload가 앱에서 기대하는 사용자 정보인지 확인한다.
function isSessionUser(value: unknown): value is SessionUser {
  if (typeof value !== "object" || value === null) {
    return false;
  }

  const payload = value as Record<string, unknown>;

  return typeof payload.userId === "number";
}

// HttpOnly 세션 쿠키에 저장할 서명된 JWT를 만든다.
export function createSessionToken(user: SessionUser) {
  return new SignJWT(user)
    .setProtectedHeader({ alg: "HS256" })
    .setSubject(String(user.userId))
    .setIssuedAt()
    .setExpirationTime(`${SESSION_DURATION_SECONDS}s`)
    .sign(getSessionSecret());
}

// 세션 JWT를 검증하고 유효하면 사용자 정보를 반환한다.
export async function verifySessionToken(token: string) {
  try {
    const { payload } = await jwtVerify(token, getSessionSecret());

    if (!isSessionUser(payload)) {
      return null;
    }

    return payload;
  } catch {
    return null;
  }
}
