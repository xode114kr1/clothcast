import { Brain, BriefcaseBusiness, Snowflake } from "lucide-react";

import { WeatherSelectionSummary } from "@/components/recommendations/weather-selection-summary";
import type { RecommendationResponseData } from "@/lib/recommendations/recommendation-types";

type RecommendationSelectionLogicProps = {
  isSubmitting: boolean;
  recommendation: RecommendationResponseData | null;
};

export function RecommendationSelectionLogic({
  isSubmitting,
  recommendation,
}: RecommendationSelectionLogicProps) {
  return (
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
              {recommendation ? recommendation.prompt : "오늘의 일정 반영"}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}
