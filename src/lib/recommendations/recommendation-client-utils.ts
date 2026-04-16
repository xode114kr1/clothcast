import type { RecommendationResponseData } from "@/lib/recommendations/recommendation-types";

export const recommendationErrorMessages: Record<string, string> = {
  AI_RECOMMENDATION_FAILED:
    "추천 생성이 지연되고 있습니다. 잠시 후 다시 시도해주세요.",
  EMPTY_WARDROBE: "등록된 옷이 없어 추천을 만들 수 없습니다.",
  INVALID_REQUEST: "오늘의 일정과 날씨 정보를 다시 확인해주세요.",
  UNAUTHORIZED: "로그인 후 추천을 받을 수 있습니다.",
  USER_NOT_FOUND: "사용자 정보를 찾을 수 없습니다. 다시 로그인해주세요.",
};

export function isRecommendationData(
  value: unknown,
): value is RecommendationResponseData {
  if (typeof value !== "object" || value === null || Array.isArray(value)) {
    return false;
  }

  const payload = value as Record<string, unknown>;

  return (
    typeof payload.prompt === "string" &&
    Array.isArray(payload.recommendedItems) &&
    typeof payload.reason === "string" &&
    typeof payload.styleTone === "string"
  );
}
