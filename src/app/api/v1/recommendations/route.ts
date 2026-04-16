import { apiError, apiSuccess } from "@/lib/api/response";
import { getCurrentSessionUserId } from "@/lib/auth/current-user";
import { RecommendationServiceError } from "@/lib/recommendations/recommendation-errors";
import { listRecommendationHistory } from "@/lib/recommendations/recommendation-history";
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

// 인증된 사용자의 추천 히스토리를 최신순으로 조회한다.
export async function GET() {
  const userId = await getCurrentSessionUserId();

  if (!userId) {
    return apiError("로그인이 필요합니다.", "UNAUTHORIZED", {
      status: 401,
    });
  }

  try {
    const recommendations = await listRecommendationHistory(userId);

    return apiSuccess("추천 기록을 조회했습니다.", recommendations, {
      status: 200,
    });
  } catch {
    return apiError("추천 기록 조회 중 오류가 발생했습니다.", "SERVER_ERROR", {
      status: 500,
    });
  }
}
