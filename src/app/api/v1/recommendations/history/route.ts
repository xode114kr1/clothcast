import { apiError, apiSuccess } from "@/lib/api/response";
import { getCurrentSessionUserId } from "@/lib/auth/current-user";
import { listRecommendationHistory } from "@/lib/recommendations/recommendation-history";

export const runtime = "nodejs";

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
