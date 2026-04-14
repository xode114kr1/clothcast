import { cookies } from "next/headers";
import { NextResponse } from "next/server";

import { SESSION_COOKIE_NAME, verifySessionToken } from "@/lib/auth/session";
import { generateGeminiText } from "@/lib/ai/gemini";
import { prisma } from "@/lib/prisma";
import type { RecommendationResponseData } from "@/lib/recommendations/recommendation-types";
import { validateCreateRecommendationInput } from "@/lib/recommendations/recommendation-validation";
import type { CurrentWeatherData } from "@/lib/weather/weather-types";

export const runtime = "nodejs";

type ErrorCode =
  | "INVALID_REQUEST"
  | "UNAUTHORIZED"
  | "USER_NOT_FOUND"
  | "EMPTY_WARDROBE"
  | "AI_RECOMMENDATION_FAILED"
  | "SERVER_ERROR";

type WardrobeItem = {
  id: number;
  name: string;
  category: string;
  color: string;
  fit: string;
  formality: number;
  material: string | null;
  pattern: string | null;
  imageUrl: string;
};

type GeminiRecommendation = {
  recommendedItemIds: number[];
  reason: string;
  styleTone: string;
};

const RECOMMENDATION_SYSTEM_INSTRUCTION = [
  "당신은 ClothCast의 한국어 코디 추천 스타일리스트입니다.",
  "반드시 사용자의 옷장 데이터에 있는 id만 recommendedItemIds에 사용하세요.",
  "옷장에 없는 옷, 색상, 카테고리, 상품명을 새로 만들지 마세요.",
  "오늘 날씨와 사용자의 일정/상황 프롬프트를 함께 고려하세요.",
  "상의, 하의, 신발, 아우터가 모두 있으면 완성된 코디가 되도록 조합하세요.",
  "사용자 옷장에 특정 카테고리 옷이 없으면 보유한 옷만으로 추천하세요.",
  "추천 이유에는 날씨 조건과 사용자 상황을 모두 언급하세요.",
  "응답은 markdown 없이 JSON 객체 하나만 반환하세요.",
].join("\n");

// 추천 생성 성공 응답을 API 공통 형식으로 만든다.
function successResponse(data: RecommendationResponseData, init?: ResponseInit) {
  return NextResponse.json(
    {
      status: "success",
      message: "코디 추천이 생성되었습니다.",
      data,
    },
    init,
  );
}

// 추천 API 실패 응답을 API 공통 형식으로 만든다.
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

// HttpOnly 세션 쿠키를 검증해 현재 요청의 사용자 ID를 가져온다.
async function getSessionUserId() {
  const cookieStore = await cookies();
  const sessionToken = cookieStore.get(SESSION_COOKIE_NAME)?.value;

  if (!sessionToken) {
    return null;
  }

  const session = await verifySessionToken(sessionToken);

  return session?.userId ?? null;
}

// Gemini에 전달할 추천 요청 프롬프트를 JSON 기반으로 구성한다.
function buildRecommendationPrompt({
  prompt,
  weather,
  wardrobe,
}: {
  prompt: string;
  weather: CurrentWeatherData;
  wardrobe: WardrobeItem[];
}) {
  const availableCategories = [...new Set(wardrobe.map((item) => item.category))];

  return JSON.stringify(
    {
      task: "사용자 프롬프트, 현재 날씨, 사용자의 옷장을 바탕으로 오늘 입을 코디를 추천하세요.",
      outputSchema: {
        recommendedItemIds: ["number"],
        reason: "한국어 문자열",
        styleTone: "한국어 짧은 문자열",
      },
      outputExample: {
        recommendedItemIds: [101, 102, 103],
        reason: "17도 흐린 날씨와 면접 일정을 고려해 단정하고 보온감이 있는 조합을 골랐습니다.",
        styleTone: "단정한 비즈니스",
      },
      constraints: [
        "recommendedItemIds에는 wardrobe에 존재하는 id만 넣으세요.",
        "recommendedItemIds는 중복 없이 1개 이상 4개 이하로 작성하세요.",
        "가능하면 TOP, BOTTOM, SHOES를 포함하고, 날씨가 쌀쌀하면 OUTER도 포함하세요.",
        "특정 카테고리가 availableCategories에 없으면 없는 카테고리는 추천하지 마세요.",
        "reason은 한국어 한두 문장으로 작성하고, 기온/날씨와 사용자 프롬프트를 모두 반영하세요.",
        "styleTone은 코디 분위기를 한국어 10자 내외의 짧은 문구로 작성하세요.",
        "JSON 외의 설명, markdown 코드블록, 주석은 반환하지 마세요.",
      ],
      userPrompt: prompt,
      weather,
      availableCategories,
      wardrobe,
    },
    null,
    2,
  );
}

// 코드블록이 섞인 Gemini 응답에서도 JSON 본문만 추출한다.
function extractJsonText(text: string) {
  const trimmed = text.trim();
  const fencedMatch = trimmed.match(/```(?:json)?\s*([\s\S]*?)\s*```/i);

  return fencedMatch?.[1]?.trim() ?? trimmed;
}

// 알 수 없는 JSON 값이 Gemini 추천 응답 형태인지 확인한다.
function isGeminiRecommendation(value: unknown): value is GeminiRecommendation {
  if (typeof value !== "object" || value === null || Array.isArray(value)) {
    return false;
  }

  const payload = value as Record<string, unknown>;

  return (
    Array.isArray(payload.recommendedItemIds) &&
    payload.recommendedItemIds.every((id) => Number.isInteger(id)) &&
    typeof payload.reason === "string" &&
    payload.reason.trim().length > 0 &&
    typeof payload.styleTone === "string" &&
    payload.styleTone.trim().length > 0
  );
}

// Gemini의 문자열 응답을 추천 결과 객체로 파싱한다.
function parseGeminiRecommendation(text: string) {
  const parsed = JSON.parse(extractJsonText(text)) as unknown;

  if (!isGeminiRecommendation(parsed)) {
    throw new Error("Gemini recommendation response is invalid.");
  }

  return {
    recommendedItemIds: parsed.recommendedItemIds,
    reason: parsed.reason.trim(),
    styleTone: parsed.styleTone.trim(),
  };
}

// AI가 반환한 ID를 사용자 옷장 데이터에 있는 아이템으로 변환한다.
function mapRecommendedItems(
  recommendedItemIds: number[],
  wardrobe: WardrobeItem[],
) {
  const wardrobeById = new Map(wardrobe.map((item) => [item.id, item]));
  const uniqueItemIds = [...new Set(recommendedItemIds)];

  return uniqueItemIds
    .map((id) => wardrobeById.get(id))
    .filter((item): item is WardrobeItem => Boolean(item))
    .map((item) => ({
      id: item.id,
      name: item.name,
      category: item.category,
      imageUrl: item.imageUrl,
    }));
}

// 인증된 사용자의 옷장과 날씨, 프롬프트를 조합해 Gemini 코디 추천을 생성한다.
export async function POST(request: Request) {
  const userId = await getSessionUserId();

  if (!userId) {
    return errorResponse("로그인이 필요합니다.", "UNAUTHORIZED", {
      status: 401,
    });
  }

  let body: unknown;

  try {
    body = await request.json();
  } catch {
    return errorResponse("요청 본문이 올바른 JSON 형식이 아닙니다.", "INVALID_REQUEST", {
      status: 400,
    });
  }

  const validation = validateCreateRecommendationInput(body);

  if (!validation.success) {
    return errorResponse(validation.message, validation.code, { status: 400 });
  }

  try {
    const user = await prisma.user.findUnique({
      where: { id: userId },
      select: { id: true },
    });

    if (!user) {
      return errorResponse("사용자를 찾을 수 없습니다.", "USER_NOT_FOUND", {
        status: 404,
      });
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
      return errorResponse("등록된 옷이 없어 추천을 생성할 수 없습니다.", "EMPTY_WARDROBE", {
        status: 400,
      });
    }

    const geminiText = await generateGeminiText({
      maxOutputTokens: 1024,
      responseMimeType: "application/json",
      systemInstruction: RECOMMENDATION_SYSTEM_INSTRUCTION,
      prompt: buildRecommendationPrompt({
        prompt: validation.data.prompt,
        weather: validation.data.weather,
        wardrobe,
      }),
      thinkingBudget: 0,
      temperature: 0.3,
    });
    const recommendation = parseGeminiRecommendation(geminiText);
    const recommendedItems = mapRecommendedItems(
      recommendation.recommendedItemIds,
      wardrobe,
    );

    if (recommendedItems.length === 0) {
      return errorResponse("추천 가능한 옷 조합을 만들지 못했습니다.", "AI_RECOMMENDATION_FAILED", {
        status: 500,
      });
    }

    return successResponse(
      {
        recommendationId: null,
        prompt: validation.data.prompt,
        weatherSummary: {
          temperature: validation.data.weather.temperature,
          feelsLike: validation.data.weather.feelsLike,
          weather: validation.data.weather.weather,
          location: validation.data.weather.location,
        },
        recommendedItems,
        reason: recommendation.reason,
        styleTone: recommendation.styleTone,
      },
      { status: 201 },
    );
  } catch {
    return errorResponse("AI 코디 추천 생성에 실패했습니다.", "AI_RECOMMENDATION_FAILED", {
      status: 500,
    });
  }
}
