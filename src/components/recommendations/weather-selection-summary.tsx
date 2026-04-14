"use client";

import { useCurrentWeather } from "@/components/recommendations/current-weather-provider";

export function WeatherSelectionSummary() {
  const weatherState = useCurrentWeather();

  if (weatherState.status === "loading") {
    return (
      <p>
        현재 날씨를 확인한 뒤 오늘의 일정에 맞춘 조합을 정리합니다.
      </p>
    );
  }

  if (weatherState.status === "error") {
    return (
      <p>
        날씨를 불러오지 못해 기본 조건으로 격식 있는 일정에 맞춘 조합을 정리합니다.
      </p>
    );
  }

  const { data } = weatherState;

  return (
    <p>
      <span className="font-bold text-[#191c1d]">{data.temperature}°C</span>의{" "}
      {data.weather} 날씨와 습도 {data.humidity}% 조건에서 격식 있는 일정에 맞춘
      조합입니다.
    </p>
  );
}
