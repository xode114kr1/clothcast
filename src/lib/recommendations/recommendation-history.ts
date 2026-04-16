import "server-only";

import { prisma } from "@/lib/prisma";
import type {
  RecommendationHistoryItem,
  RecommendationResponseData,
  RecommendedOutfitItem,
} from "@/lib/recommendations/recommendation-types";

type SavedRecommendationRow = {
  id: number;
};

type RecommendationHistoryRow = {
  id: number;
  prompt: string;
  reason: string;
  styleTone: string;
  recommendedItems: unknown;
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
    const [savedRecommendation] = await prisma.$queryRaw<SavedRecommendationRow[]>`
      INSERT INTO "Recommendation" (
        "userId",
        "prompt",
        "weatherSummary",
        "recommendedItems",
        "reason",
        "styleTone"
      )
      VALUES (
        ${userId},
        ${prompt},
        ${JSON.stringify(weatherSummary)}::jsonb,
        ${JSON.stringify(recommendedItems)}::jsonb,
        ${reason},
        ${styleTone}
      )
      RETURNING "id"
    `;

    return savedRecommendation?.id ?? null;
  } catch {
    return null;
  }
}

export async function listRecommendationHistory(
  userId: number,
): Promise<RecommendationHistoryItem[]> {
  const recommendations = await prisma.$queryRaw<RecommendationHistoryRow[]>`
    SELECT
      "id",
      "prompt",
      "reason",
      "styleTone",
      "recommendedItems",
      "createdAt"
    FROM "Recommendation"
    WHERE "userId" = ${userId}
    ORDER BY "createdAt" DESC
    LIMIT 10
  `;

  return recommendations.map((recommendation) => ({
    recommendationId: recommendation.id,
    prompt: recommendation.prompt,
    reason: recommendation.reason,
    styleTone: recommendation.styleTone,
    recommendedItems: isRecommendedOutfitItems(recommendation.recommendedItems)
      ? recommendation.recommendedItems
      : [],
    createdAt: recommendation.createdAt.toISOString(),
  }));
}
