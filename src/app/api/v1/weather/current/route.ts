import { NextResponse } from "next/server";

import { fetchCurrentWeather } from "@/lib/weather/openweather";
import type { CurrentWeatherData } from "@/lib/weather/weather-types";
import { validateCurrentWeatherQuery } from "@/lib/weather/weather-validation";

export const runtime = "nodejs";

type ErrorCode = "INVALID_REQUEST" | "WEATHER_FETCH_FAILED";

// 현재 날씨 조회 성공 응답을 API 공통 형식으로 만든다.
function successResponse(data: CurrentWeatherData, init?: ResponseInit) {
  return NextResponse.json(
    {
      status: "success",
      message: "현재 날씨를 조회했습니다.",
      data,
    },
    init,
  );
}

// 현재 날씨 조회 실패 응답을 API 공통 형식으로 만든다.
function errorResponse(
  message: string,
  code: ErrorCode,
  init?: ResponseInit,
) {
  return NextResponse.json(
    {
      status: "error",
      message,
      data: { code },
    },
    init,
  );
}

// 위도/경도 기준 현재 날씨를 조회한다.
export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const validation = validateCurrentWeatherQuery(searchParams);

  if (!validation.success) {
    return errorResponse(validation.message, validation.code, { status: 400 });
  }

  try {
    const weather = await fetchCurrentWeather(validation.data);

    return successResponse(weather, { status: 200 });
  } catch {
    return errorResponse("날씨 조회에 실패했습니다.", "WEATHER_FETCH_FAILED", {
      status: 500,
    });
  }
}
