import { apiError, apiSuccess } from "@/lib/api/response";
import { getCurrentSessionUserId } from "@/lib/auth/current-user";
import { RecommendationServiceError } from "@/lib/recommendations/recommendation-errors";
import { createRecommendation } from "@/lib/recommendations/recommendation-service";
import { validateCreateRecommendationInput } from "@/lib/recommendations/recommendation-validation";

export const runtime = "nodejs";

// 인증된 사용자의 옷장과 날씨, 프롬프트를 조합해 코디 추천을 생성한다.
export async function POST(request: Request) {
  const userId = await getCurrentSessionUserId();

  if (!userId) {
    return apiError("로그인이 필요합니다.", "UNAUTHORIZED", {
      status: 401,
    });
  }

  let body: unknown;

  try {
    body = await request.json();
  } catch {
    return apiError("요청 본문이 올바른 JSON 형식이 아닙니다.", "INVALID_REQUEST", {
      status: 400,
    });
  }

  const validation = validateCreateRecommendationInput(body);

  if (!validation.success) {
    return apiError(validation.message, validation.code, { status: 400 });
  }

  try {
    const recommendation = await createRecommendation({
      userId,
      input: validation.data,
    });

    return apiSuccess("코디 추천이 생성되었습니다.", recommendation, {
      status: 201,
    });
  } catch (error) {
    if (error instanceof RecommendationServiceError) {
      return apiError(error.message, error.code, { status: error.status });
    }

    return apiError("AI 코디 추천 생성에 실패했습니다.", "AI_RECOMMENDATION_FAILED", {
      status: 500,
    });
  }
}
