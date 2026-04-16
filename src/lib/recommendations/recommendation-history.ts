import "server-only";

import type { Prisma } from "@/generated/prisma/client";
import { prisma } from "@/lib/prisma";
import type {
  RecommendationHistoryItem,
  RecommendationResponseData,
  RecommendedOutfitItem,
} from "@/lib/recommendations/recommendation-types";

export type RecommendationHistoryRecord = {
  recommendationId: number;
  prompt: string;
  reason: string;
  styleTone: string;
  recommendedItems: RecommendedOutfitItem[];
  createdAt: Date;
};

function isRecommendedOutfitItems(value: unknown): value is RecommendedOutfitItem[] {
  return (
    Array.isArray(value) &&
    value.every((item) => {
      if (typeof item !== "object" || item === null || Array.isArray(item)) {
        return false;
      }

      const payload = item as Record<string, unknown>;

      return (
        typeof payload.id === "number" &&
        typeof payload.name === "string" &&
        typeof payload.category === "string" &&
        typeof payload.imageUrl === "string"
      );
    })
  );
}

// 히스토리 저장은 선택 기능이므로 저장 실패가 추천 응답 실패로 번지지 않게 한다.
export async function saveRecommendationHistory({
  userId,
  prompt,
  weatherSummary,
  recommendedItems,
  reason,
  styleTone,
}: {
  userId: number;
  prompt: string;
  weatherSummary: RecommendationResponseData["weatherSummary"];
  recommendedItems: RecommendedOutfitItem[];
  reason: string;
  styleTone: string;
}) {
  try {
    const savedRecommendation = await prisma.recommendation.create({
      data: {
        userId,
        prompt,
        weatherSummary: weatherSummary satisfies Prisma.InputJsonValue,
        recommendedItems: recommendedItems satisfies Prisma.InputJsonValue,
        reason,
        styleTone,
      },
      select: {
        id: true,
      },
    });

    return savedRecommendation.id;
  } catch {
    return null;
  }
}

export async function countRecommendationHistory(userId: number) {
  return prisma.recommendation.count({
    where: { userId },
  });
}

export async function listRecommendationHistoryRecords(
  userId: number,
  take: number,
): Promise<RecommendationHistoryRecord[]> {
  const recommendations = await prisma.recommendation.findMany({
    where: { userId },
    orderBy: { createdAt: "desc" },
    take,
    select: {
      id: true,
      prompt: true,
      reason: true,
      styleTone: true,
      recommendedItems: true,
      createdAt: true,
    },
  });

  return recommendations.map((recommendation) => ({
    recommendationId: recommendation.id,
    prompt: recommendation.prompt,
    reason: recommendation.reason,
    styleTone: recommendation.styleTone,
    recommendedItems: isRecommendedOutfitItems(recommendation.recommendedItems)
      ? recommendation.recommendedItems
      : [],
    createdAt: recommendation.createdAt,
  }));
}

export async function listRecommendationHistory(
  userId: number,
): Promise<RecommendationHistoryItem[]> {
  const recommendations = await listRecommendationHistoryRecords(userId, 10);

  return recommendations.map((recommendation) => ({
    ...recommendation,
    createdAt: recommendation.createdAt.toISOString(),
  }));
}
