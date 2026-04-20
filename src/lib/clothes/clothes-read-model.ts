import "server-only";

import { prisma } from "@/lib/prisma";
import type { ClothesItem } from "@/lib/clothes/clothes-form-types";

export async function listWardrobeItems(userId: number): Promise<ClothesItem[]> {
  return prisma.clothes.findMany({
    where: { userId },
    orderBy: {
      createdAt: "desc",
    },
    select: {
      id: true,
      name: true,
      category: true,
      color: true,
      fit: true,
      formality: true,
      material: true,
      pattern: true,
      imageUrl: true,
    },
  });
}
