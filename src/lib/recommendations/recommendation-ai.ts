import "server-only";

import { generateGeminiText } from "@/lib/ai/gemini";
import type { CurrentWeatherData } from "@/lib/weather/weather-types";

export type WardrobeItemForRecommendation = {
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

function buildRecommendationPrompt({
  prompt,
  weather,
  wardrobe,
}: {
  prompt: string;
  weather: CurrentWeatherData;
  wardrobe: WardrobeItemForRecommendation[];
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

function extractJsonText(text: string) {
  const trimmed = text.trim();
  const fencedMatch = trimmed.match(/```(?:json)?\s*([\s\S]*?)\s*```/i);

  return fencedMatch?.[1]?.trim() ?? trimmed;
}

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

export async function generateOutfitRecommendation({
  prompt,
  weather,
  wardrobe,
}: {
  prompt: string;
  weather: CurrentWeatherData;
  wardrobe: WardrobeItemForRecommendation[];
}) {
  const geminiText = await generateGeminiText({
    maxOutputTokens: 1024,
    responseMimeType: "application/json",
    systemInstruction: RECOMMENDATION_SYSTEM_INSTRUCTION,
    prompt: buildRecommendationPrompt({
      prompt,
      weather,
      wardrobe,
    }),
    thinkingBudget: 0,
    temperature: 0.3,
  });

  return parseGeminiRecommendation(geminiText);
}

export function mapRecommendedItems(
  recommendedItemIds: number[],
  wardrobe: WardrobeItemForRecommendation[],
) {
  const wardrobeById = new Map(wardrobe.map((item) => [item.id, item]));
  const uniqueItemIds = [...new Set(recommendedItemIds)];

  return uniqueItemIds
    .map((id) => wardrobeById.get(id))
    .filter((item): item is WardrobeItemForRecommendation => Boolean(item))
    .map((item) => ({
      id: item.id,
      name: item.name,
      category: item.category,
      imageUrl: item.imageUrl,
    }));
}
