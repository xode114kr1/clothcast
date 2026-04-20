import { apiError, apiSuccess } from "@/lib/api/response";
import { fetchCurrentWeather } from "@/lib/weather/openweather";
import { validateCurrentWeatherQuery } from "@/lib/weather/weather-validation";

export const runtime = "nodejs";

// 위도/경도 기준 현재 날씨를 조회한다.
export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const validation = validateCurrentWeatherQuery(searchParams);

  if (!validation.success) {
    return apiError(validation.message, validation.code, { status: 400 });
  }

  try {
    const weather = await fetchCurrentWeather(validation.data);

    return apiSuccess("현재 날씨를 조회했습니다.", weather, { status: 200 });
  } catch {
    return apiError("날씨 조회에 실패했습니다.", "WEATHER_FETCH_FAILED", {
      status: 500,
    });
  }
}
