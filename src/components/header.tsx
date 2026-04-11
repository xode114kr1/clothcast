import { cookies } from "next/headers";

import { HeaderClient } from "@/components/header-client";
import { SESSION_COOKIE_NAME, verifySessionToken } from "@/lib/auth/session";
import { prisma } from "@/lib/prisma";

async function getHeaderUser() {
  const cookieStore = await cookies();
  const sessionToken = cookieStore.get(SESSION_COOKIE_NAME)?.value;

  if (!sessionToken) {
    return null;
  }

  const session = await verifySessionToken(sessionToken);

  if (!session) {
    return null;
  }

  try {
    const user = await prisma.user.findUnique({
      where: { id: session.userId },
      select: {
        email: true,
        nickname: true,
      },
    });

    return user;
  } catch {
    return null;
  }
}

export async function Header() {
  const user = await getHeaderUser();

  return <HeaderClient user={user} />;
}
