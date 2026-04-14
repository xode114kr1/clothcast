import type { CurrentWeatherData } from "@/lib/weather/weather-types";

const MAX_RECOMMENDATION_PROMPT_LENGTH = 300;

type RecommendationValidationCode = "INVALID_REQUEST";

export type CreateRecommendationInput = {
  prompt: string;
  weather: CurrentWeatherData;
};

export type CreateRecommendationValidationResult =
  | {
      success: true;
      data: CreateRecommendationInput;
    }
  | {
      success: false;
      message: string;
      code: RecommendationValidationCode;
    };

// 알 수 없는 JSON 값이 객체 형태인지 확인한다.
function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null && !Array.isArray(value);
}

// 필수 문자열 입력값을 앞뒤 공백이 제거된 문자열로 정규화한다.
function normalizeRequiredString(value: unknown) {
  if (typeof value !== "string") {
    return null;
  }

  const trimmed = value.trim();

  return trimmed.length > 0 ? trimmed : null;
}

// 요청 값이 유한한 숫자인지 확인한다.
function isFiniteNumber(value: unknown): value is number {
  return typeof value === "number" && Number.isFinite(value);
}

// 추천 요청에 포함된 날씨 정보가 CurrentWeatherData 형태인지 검사한다.
function validateWeather(value: unknown) {
  if (!isRecord(value)) {
    return null;
  }

  const weather = normalizeRequiredString(value.weather);
  const location = normalizeRequiredString(value.location);

  if (
    !isFiniteNumber(value.temperature) ||
    !isFiniteNumber(value.feelsLike) ||
    !weather ||
    !isFiniteNumber(value.humidity) ||
    !isFiniteNumber(value.windSpeed) ||
    !location
  ) {
    return null;
  }

  return {
    temperature: value.temperature,
    feelsLike: value.feelsLike,
    weather,
    humidity: value.humidity,
    windSpeed: value.windSpeed,
    location,
  };
}

// 추천 생성 요청 본문이 프롬프트와 현재 날씨 정보를 포함하는지 검사한다.
export function validateCreateRecommendationInput(
  body: unknown,
): CreateRecommendationValidationResult {
  const payload = isRecord(body) ? body : {};
  const prompt = normalizeRequiredString(payload.prompt);

  if (!prompt) {
    return {
      success: false,
      message: "오늘의 일정이나 상황을 입력해주세요.",
      code: "INVALID_REQUEST",
    };
  }

  if (prompt.length > MAX_RECOMMENDATION_PROMPT_LENGTH) {
    return {
      success: false,
      message: `프롬프트는 ${MAX_RECOMMENDATION_PROMPT_LENGTH}자 이하로 입력해주세요.`,
      code: "INVALID_REQUEST",
    };
  }

  const weather = validateWeather(payload.weather);

  if (!weather) {
    return {
      success: false,
      message: "현재 날씨 정보가 필요합니다.",
      code: "INVALID_REQUEST",
    };
  }

  return {
    success: true,
    data: {
      prompt,
      weather,
    },
  };
}
