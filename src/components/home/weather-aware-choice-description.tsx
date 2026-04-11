"use client";

import { useCurrentWeather } from "@/components/recommendations/current-weather-provider";

export function WeatherAwareChoiceDescription() {
  const weatherState = useCurrentWeather();

  if (weatherState.status !== "success") {
    return "현재 날씨에 맞춰 알맞은 아우터";
  }

  return `${weatherState.data.temperature}도 ${weatherState.data.weather}에 알맞은 아우터`;
}
