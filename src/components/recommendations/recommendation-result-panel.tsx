import { CheckCircle2 } from "lucide-react";

import { RecommendedItemCards } from "@/components/recommendations/recommended-item-cards";
import {
  EmptyRecommendationState,
  LoadingSummary,
  PlaceholderCards,
} from "@/components/recommendations/recommendation-result-states";
import { RecommendationSelectionLogic } from "@/components/recommendations/recommendation-selection-logic";
import type { RecommendationResponseData } from "@/lib/recommendations/recommendation-types";

type RecommendationResultPanelProps = {
  isSubmitting: boolean;
  recommendation: RecommendationResponseData | null;
};

function getResultStatusLabel({
  isSubmitting,
  recommendation,
}: RecommendationResultPanelProps) {
  if (isSubmitting) {
    return "분석 중";
  }

  return recommendation ? recommendation.styleTone : "추천 대기 중";
}

export function RecommendationResultPanel({
  isSubmitting,
  recommendation,
}: RecommendationResultPanelProps) {
  const resultStatusLabel = getResultStatusLabel({
    isSubmitting,
    recommendation,
  });

  return (
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

          {!isSubmitting && recommendation ? (
            <RecommendedItemCards recommendation={recommendation} />
          ) : null}

          {!isSubmitting && !recommendation ? <EmptyRecommendationState /> : null}
        </div>

        <div className="lg:col-span-4">
          <RecommendationSelectionLogic
            isSubmitting={isSubmitting}
            recommendation={recommendation}
          />
        </div>
      </div>
    </section>
  );
}
