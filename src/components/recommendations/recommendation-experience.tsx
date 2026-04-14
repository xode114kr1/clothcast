"use client";

import Image from "next/image";
import {
  AlertTriangle,
  Brain,
  BriefcaseBusiness,
  CheckCircle2,
  Shirt,
  Snowflake,
  Sparkles,
} from "lucide-react";
import { FormEvent, useState } from "react";

import { useCurrentWeather } from "@/components/recommendations/current-weather-provider";
import { WeatherSelectionSummary } from "@/components/recommendations/weather-selection-summary";
import type { RecommendationResponseData } from "@/lib/recommendations/recommendation-types";

type RecommendationApiResponse = {
  status: "success" | "error";
  message: string;
  data?: RecommendationResponseData | { code?: string };
};

// 알 수 없는 API 응답 값이 추천 결과 데이터 형태인지 확인한다.
function isRecommendationData(value: unknown): value is RecommendationResponseData {
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

// API 실패 응답에서 사용자에게 보여줄 메시지를 꺼낸다.
function getResponseMessage(data: unknown) {
  if (
    typeof data === "object" &&
    data !== null &&
    "message" in data &&
    typeof data.message === "string"
  ) {
    return data.message;
  }

  return "코디 추천을 생성하지 못했습니다.";
}

// DB enum으로 내려온 의류 카테고리를 화면 표시용 문구로 바꾼다.
function getCategoryLabel(category: string) {
  const labels: Record<string, string> = {
    TOP: "상의",
    BOTTOM: "하의",
    OUTER: "아우터",
    SHOES: "신발",
  };

  return labels[category] ?? category;
}

// 추천 결과나 현재 상태에 맞는 상단 배지 문구를 만든다.
function getResultStatusLabel({
  isSubmitting,
  recommendation,
}: {
  isSubmitting: boolean;
  recommendation: RecommendationResponseData | null;
}) {
  if (isSubmitting) {
    return "분석 중";
  }

  return recommendation ? recommendation.styleTone : "추천 대기 중";
}

// 추천 생성 중 표시할 의류 카드 스켈레톤을 렌더링한다.
function PlaceholderCards() {
  return (
    <>
      {[1, 2, 3, 4].map((item) => (
        <div
          key={item}
          className="flex flex-col rounded-[var(--radius-xl)] p-4 opacity-70"
          style={{ backgroundColor: "var(--surface-container-low)" }}
        >
          <div
            className="mb-6 aspect-[3/4] animate-pulse rounded-[var(--radius-md)]"
            style={{ backgroundColor: "var(--surface-container-highest)" }}
          />
          <div className="space-y-3 px-2">
            <div
              className="h-2 w-16 animate-pulse rounded"
              style={{ backgroundColor: "var(--surface-container-highest)" }}
            />
            <div
              className="h-5 w-3/4 animate-pulse rounded"
              style={{ backgroundColor: "var(--surface-container-highest)" }}
            />
          </div>
        </div>
      ))}
    </>
  );
}

// 추천 생성 중 현재 처리 상태를 문장으로 보여준다.
function LoadingSummary() {
  return (
    <div
      aria-live="polite"
      className="flex min-h-96 flex-col items-center justify-center rounded-[var(--radius-xl)] p-10 text-center md:col-span-2"
      style={{ backgroundColor: "var(--surface-container-lowest)" }}
    >
      <div className="mb-5 flex h-16 w-16 items-center justify-center rounded-full bg-[rgb(211_228_255_/_0.45)] text-[var(--primary)]">
        <Sparkles className="h-8 w-8 animate-pulse" strokeWidth={1.8} />
      </div>
      <h3
        className="mb-3 text-2xl font-bold text-[#191c1d]"
        style={{ fontFamily: "var(--font-display)" }}
      >
        옷장과 날씨를 비교하는 중입니다
      </h3>
      <p className="max-w-md text-[#404753]">
        등록된 옷만 살펴보고 오늘의 일정에 맞는 조합을 고르고 있습니다.
      </p>
    </div>
  );
}

// 추천 전 빈 결과 영역에서 다음 행동을 안내한다.
function EmptyRecommendationState() {
  return (
    <div
      className="flex min-h-96 flex-col items-center justify-center rounded-[var(--radius-xl)] p-10 text-center md:col-span-2"
      style={{ backgroundColor: "var(--surface-container-lowest)" }}
    >
      <div className="mb-5 flex h-16 w-16 items-center justify-center rounded-full bg-[rgb(211_228_255_/_0.45)] text-[var(--primary)]">
        <Shirt className="h-8 w-8" strokeWidth={1.8} />
      </div>
      <h3
        className="mb-3 text-2xl font-bold text-[#191c1d]"
        style={{ fontFamily: "var(--font-display)" }}
      >
        오늘의 상황을 입력해주세요
      </h3>
      <p className="max-w-md text-[#404753]">
        옷장에 등록한 옷과 현재 날씨를 함께 보고 지금 입기 좋은 조합을 정리합니다.
      </p>
    </div>
  );
}

// 프롬프트 입력, 추천 API 호출, 추천 결과 표시를 담당한다.
export function RecommendationExperience() {
  const weatherState = useCurrentWeather();
  const [prompt, setPrompt] = useState("");
  const [recommendation, setRecommendation] =
    useState<RecommendationResponseData | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const canSubmit =
    prompt.trim().length > 0 &&
    weatherState.status === "success" &&
    !isSubmitting;
  const resultStatusLabel = getResultStatusLabel({
    isSubmitting,
    recommendation,
  });

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    if (weatherState.status !== "success") {
      setErrorMessage("날씨를 불러온 뒤 추천을 받을 수 있습니다.");
      return;
    }

    const trimmedPrompt = prompt.trim();

    if (!trimmedPrompt) {
      setErrorMessage("오늘의 일정이나 상황을 입력해주세요.");
      return;
    }

    setIsSubmitting(true);
    setErrorMessage(null);

    try {
      const response = await fetch("/api/v1/recommendations", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          prompt: trimmedPrompt,
          weather: weatherState.data,
        }),
      });
      const data = (await response.json().catch(() => null)) as
        | RecommendationApiResponse
        | null;

      if (
        !response.ok ||
        data?.status !== "success" ||
        !isRecommendationData(data.data)
      ) {
        throw new Error(getResponseMessage(data));
      }

      setRecommendation(data.data);
    } catch (error) {
      setRecommendation(null);
      setErrorMessage(
        error instanceof Error
          ? error.message
          : "코디 추천을 생성하지 못했습니다.",
      );
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <>
      <section className="mb-24">
        <form
          className="rounded-[var(--radius-xl)] p-10 lg:p-16"
          onSubmit={handleSubmit}
          style={{ backgroundColor: "var(--surface-container-low)" }}
        >
          <label
            className="mb-6 block text-2xl font-bold text-[#191c1d]"
            htmlFor="recommendation-prompt"
            style={{ fontFamily: "var(--font-display)" }}
          >
            오늘 어떤 일정이 있나요?
          </label>
          <div className="flex flex-col gap-4 md:flex-row">
            <div className="relative flex-grow">
              <input
                className="w-full rounded-[var(--radius-md)] border-none px-8 py-5 text-lg text-[#191c1d] outline-none placeholder:text-[#707884] focus:bg-white"
                id="recommendation-prompt"
                maxLength={300}
                onChange={(event) => setPrompt(event.target.value)}
                placeholder="예: 오늘 친구 만나러가"
                style={{ backgroundColor: "var(--surface-container-highest)" }}
                type="text"
                value={prompt}
              />
            </div>
            <button
              className="flex items-center justify-center gap-3 rounded-full px-10 py-5 font-bold text-white shadow-lg transition-all duration-150 enabled:active:scale-95 disabled:cursor-not-allowed disabled:opacity-55"
              disabled={!canSubmit}
              style={{
                backgroundColor: "var(--primary)",
                boxShadow: "0 20px 30px -15px rgb(0 96 168 / 0.2)",
              }}
              type="submit"
            >
              <span>{isSubmitting ? "추천 생성 중" : "추천받기"}</span>
              <Sparkles className="h-5 w-5" strokeWidth={2} />
            </button>
          </div>
          {errorMessage ? (
            <div
              className="mt-5 flex items-start gap-3 rounded-[var(--radius-md)] px-5 py-4"
              role="alert"
              style={{ backgroundColor: "rgb(255 218 214 / 0.32)" }}
            >
              <AlertTriangle
                className="mt-0.5 h-5 w-5 shrink-0 text-[#8c1d18]"
                strokeWidth={2}
              />
              <div>
                <p className="font-bold text-[#8c1d18]">추천을 만들지 못했습니다.</p>
                <p className="mt-1 text-sm font-medium text-[#8c1d18]">
                  {errorMessage}
                </p>
              </div>
            </div>
          ) : null}
        </form>
      </section>

      <section>
        <div className="mb-12 flex flex-col gap-3 md:flex-row md:items-baseline md:justify-between">
          <h2
            className="text-3xl font-bold"
            style={{ fontFamily: "var(--font-display)" }}
          >
            Suggested Ensemble
          </h2>
          <div className="flex items-center gap-2 text-[var(--primary)]">
            <CheckCircle2 className="h-4 w-4" strokeWidth={2.2} />
            <span className="text-sm font-bold uppercase tracking-wider">
              {resultStatusLabel}
            </span>
          </div>
        </div>

        <div className="grid grid-cols-1 gap-12 lg:grid-cols-12">
          <div className="grid grid-cols-1 gap-8 md:grid-cols-2 lg:col-span-8">
            {isSubmitting ? (
              <>
                <LoadingSummary />
                <PlaceholderCards />
              </>
            ) : null}

            {!isSubmitting && recommendation
              ? recommendation.recommendedItems.map((item) => (
                  <div
                    key={item.id}
                    className="group rounded-[var(--radius-xl)] p-4 transition-all hover:bg-[rgb(211_228_255_/_0.2)]"
                    style={{ backgroundColor: "var(--surface-container-lowest)" }}
                  >
                    <div
                      className="mb-6 aspect-[3/4] overflow-hidden rounded-[var(--radius-md)]"
                      style={{ backgroundColor: "var(--surface-container)" }}
                    >
                      <Image
                        alt={item.name}
                        className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
                        height={800}
                        src={item.imageUrl}
                        width={600}
                      />
                    </div>
                    <div className="px-2 pb-2">
                      <span className="mb-1 block text-[10px] font-bold uppercase tracking-[0.2em] text-[var(--primary)]">
                        {getCategoryLabel(item.category)}
                      </span>
                      <h3
                        className="text-xl font-bold text-[#191c1d]"
                        style={{ fontFamily: "var(--font-display)" }}
                      >
                        {item.name}
                      </h3>
                    </div>
                  </div>
                ))
              : null}

            {!isSubmitting && !recommendation ? <EmptyRecommendationState /> : null}
          </div>

          <div className="lg:col-span-4">
            <div
              className="sticky top-28 rounded-[var(--radius-xl)] p-8"
              style={{ backgroundColor: "rgb(0 96 168 / 0.05)" }}
            >
              <div className="mb-6 flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-full bg-[var(--primary)] text-white">
                  <Brain className="h-5 w-5" strokeWidth={2} />
                </div>
                <h4
                  className="text-lg font-bold"
                  style={{ fontFamily: "var(--font-display)" }}
                >
                  Selection Logic
                </h4>
              </div>

                <div className="space-y-6 leading-relaxed text-[#404753]">
                  <WeatherSelectionSummary />

                  {recommendation ? (
                    <div
                      className="grid grid-cols-2 gap-3 rounded-[var(--radius-md)] p-4"
                      style={{ backgroundColor: "rgb(255 255 255 / 0.68)" }}
                    >
                      <div>
                        <p className="text-[10px] font-bold uppercase tracking-[0.12em] text-[#707884]">
                          아이템
                        </p>
                        <p className="mt-1 font-bold text-[#191c1d]">
                          {recommendation.recommendedItems.length}개
                        </p>
                      </div>
                      <div>
                        <p className="text-[10px] font-bold uppercase tracking-[0.12em] text-[#707884]">
                          무드
                        </p>
                        <p className="mt-1 font-bold text-[#191c1d]">
                          {recommendation.styleTone}
                        </p>
                      </div>
                    </div>
                  ) : null}

                  <div className="rounded-[var(--radius-md)] bg-white p-6 shadow-sm">
                    <p className="italic">
                      {isSubmitting
                        ? "옷장 데이터와 날씨 조건을 비교하고 있습니다."
                        : recommendation
                          ? `"${recommendation.reason}"`
                          : "일정과 날씨를 입력하면 옷장 속 아이템만 골라 추천합니다."}
                    </p>
                  </div>

                <div className="flex flex-col gap-4 pt-4">
                  <div className="flex items-center gap-3">
                    <Snowflake
                      className="h-5 w-5 text-[var(--secondary)]"
                      strokeWidth={2}
                    />
                    <span className="text-sm">
                      {recommendation
                        ? `${recommendation.weatherSummary.temperature}°C · 체감 ${recommendation.weatherSummary.feelsLike}°C`
                        : "현재 날씨 반영"}
                    </span>
                  </div>
                  <div className="flex items-center gap-3">
                    <BriefcaseBusiness
                      className="h-5 w-5 text-[var(--secondary)]"
                      strokeWidth={2}
                    />
                    <span className="text-sm">
                      {recommendation
                        ? recommendation.prompt
                        : "오늘의 일정 반영"}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
