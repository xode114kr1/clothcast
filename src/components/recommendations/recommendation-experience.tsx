"use client";

import type { FormEvent } from "react";
import { useState } from "react";

import { useCurrentWeather } from "@/components/recommendations/current-weather-provider";
import { RecommendationPromptForm } from "@/components/recommendations/recommendation-prompt-form";
import { RecommendationResultPanel } from "@/components/recommendations/recommendation-result-panel";
import {
  isRecommendationData,
  recommendationErrorMessages,
} from "@/lib/recommendations/recommendation-client-utils";
import { fetchApiJson } from "@/lib/api/client";
import type { RecommendationResponseData } from "@/lib/recommendations/recommendation-types";

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
      const data = await fetchApiJson<RecommendationResponseData>(
        "/api/v1/recommendations",
        {
          method: "POST",
          body: {
            prompt: trimmedPrompt,
            weather: weatherState.data,
          },
        },
        {
          fallbackMessage: "코디 추천을 생성하지 못했습니다.",
          invalidDataMessage: "코디 추천 응답이 올바르지 않습니다.",
          errorMessages: recommendationErrorMessages,
          validateData: isRecommendationData,
        },
      );

      setRecommendation(data);
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
      <RecommendationPromptForm
        canSubmit={canSubmit}
        errorMessage={errorMessage}
        isSubmitting={isSubmitting}
        onPromptChange={setPrompt}
        onSubmit={handleSubmit}
        prompt={prompt}
      />
      <RecommendationResultPanel
        isSubmitting={isSubmitting}
        recommendation={recommendation}
      />
    </>
  );
}
