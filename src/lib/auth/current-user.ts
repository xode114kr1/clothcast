import "server-only";

import { cookies } from "next/headers";

import { SESSION_COOKIE_NAME, verifySessionToken } from "@/lib/auth/session";

export async function getCurrentSessionUser() {
  const cookieStore = await cookies();
  const sessionToken = cookieStore.get(SESSION_COOKIE_NAME)?.value;

  if (!sessionToken) {
    return null;
  }

  return verifySessionToken(sessionToken);
}

export async function getCurrentSessionUserId() {
  const session = await getCurrentSessionUser();

  return session?.userId ?? null;
}
