import { HeaderClient } from "@/components/header-client";
import { getCurrentSessionUser } from "@/lib/auth/current-user";
import { prisma } from "@/lib/prisma";

async function getHeaderUser() {
  const session = await getCurrentSessionUser();

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
