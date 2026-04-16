import "server-only";

import { prisma } from "@/lib/prisma";
import {
  generateOutfitRecommendation,
  mapRecommendedItems,
} from "@/lib/recommendations/recommendation-ai";
import { RecommendationServiceError } from "@/lib/recommendations/recommendation-errors";
import { saveRecommendationHistory } from "@/lib/recommendations/recommendation-history";
import type { RecommendationResponseData } from "@/lib/recommendations/recommendation-types";
import type { CreateRecommendationInput } from "@/lib/recommendations/recommendation-validation";

export async function createRecommendation({
  userId,
  input,
}: {
  userId: number;
  input: CreateRecommendationInput;
}): Promise<RecommendationResponseData> {
  const user = await prisma.user.findUnique({
    where: { id: userId },
    select: { id: true },
  });

  if (!user) {
    throw new RecommendationServiceError(
      "사용자를 찾을 수 없습니다.",
      "USER_NOT_FOUND",
      404,
    );
  }

  const wardrobe = await prisma.clothes.findMany({
    where: { userId },
    orderBy: { createdAt: "desc" },
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

  if (wardrobe.length === 0) {
    throw new RecommendationServiceError(
      "등록된 옷이 없어 추천을 생성할 수 없습니다.",
      "EMPTY_WARDROBE",
      400,
    );
  }

  const recommendation = await generateOutfitRecommendation({
    prompt: input.prompt,
    weather: input.weather,
    wardrobe,
  });
  const recommendedItems = mapRecommendedItems(
    recommendation.recommendedItemIds,
    wardrobe,
  );

  if (recommendedItems.length === 0) {
    throw new RecommendationServiceError(
      "추천 가능한 옷 조합을 만들지 못했습니다.",
      "AI_RECOMMENDATION_FAILED",
      500,
    );
  }

  const weatherSummary = {
    temperature: input.weather.temperature,
    feelsLike: input.weather.feelsLike,
    weather: input.weather.weather,
    location: input.weather.location,
  };
  const recommendationId = await saveRecommendationHistory({
    userId,
    prompt: input.prompt,
    weatherSummary,
    recommendedItems,
    reason: recommendation.reason,
    styleTone: recommendation.styleTone,
  });

  return {
    recommendationId,
    prompt: input.prompt,
    weatherSummary,
    recommendedItems,
    reason: recommendation.reason,
    styleTone: recommendation.styleTone,
  };
}
