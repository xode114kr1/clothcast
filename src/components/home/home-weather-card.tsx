"use client";

import { Cloud, CloudSun } from "lucide-react";

import { useCurrentWeather } from "@/components/recommendations/current-weather-provider";

export function HomeWeatherCard() {
  const weatherState = useCurrentWeather();

  if (weatherState.status === "loading") {
    return (
      <div
        aria-busy="true"
        className="flex h-full min-h-80 flex-col justify-between rounded-[var(--radius-xl)] p-8"
        style={{ backgroundColor: "var(--surface-container-low)" }}
      >
        <div>
          <span className="text-xs font-bold tracking-widest text-[#404753]">
            LOCAL FORECAST
          </span>
          <div className="mt-6 flex items-center gap-4">
            <CloudSun className="h-16 w-16 text-[var(--primary)]" strokeWidth={1.6} />
            <div className="h-12 w-28 animate-pulse rounded bg-[var(--surface-container-highest)]" />
          </div>
        </div>
        <p className="text-sm font-semibold text-[#404753]">
          현재 위치의 날씨를 확인하는 중입니다.
        </p>
      </div>
    );
  }

  if (weatherState.status === "error") {
    return (
      <div
        className="flex h-full min-h-80 flex-col justify-between rounded-[var(--radius-xl)] p-8"
        style={{ backgroundColor: "rgb(255 218 214 / 0.32)" }}
      >
        <div>
          <span className="text-xs font-bold tracking-widest text-[#8c1d18]">
            LOCAL FORECAST
          </span>
          <div className="mt-6 flex items-center gap-4">
            <CloudSun className="h-16 w-16 text-[#8c1d18]" strokeWidth={1.6} />
            <span
              className="text-2xl font-bold text-[#8c1d18]"
              style={{ fontFamily: "var(--font-display)" }}
            >
              조회 실패
            </span>
          </div>
        </div>
        <p className="text-sm font-semibold text-[#8c1d18]">{weatherState.message}</p>
      </div>
    );
  }

  const { data, isFallbackLocation } = weatherState;

  return (
    <div
      className="flex h-full min-h-80 flex-col justify-between rounded-[var(--radius-xl)] p-8"
      style={{ backgroundColor: "var(--surface-container-low)" }}
    >
      <div>
        <span className="text-xs font-bold tracking-widest text-[#404753]">
          LOCAL FORECAST
        </span>
        <div className="mt-6 flex items-center gap-4">
          <Cloud className="h-16 w-16 text-[var(--primary)]" strokeWidth={1.6} />
          <span
            className="text-5xl font-bold"
            style={{ fontFamily: "var(--font-display)" }}
          >
            {data.temperature}°C
          </span>
        </div>
      </div>
      <div>
        <p className="text-lg font-semibold text-[#191c1d]">
          {data.weather}
        </p>
        <p className="text-sm text-[#404753]">
          {isFallbackLocation ? `${data.location} 기본 지역 · ` : ""}
          체감 {data.feelsLike}°C · 습도 {data.humidity}% · 바람 {data.windSpeed}m/s
        </p>
      </div>
    </div>
  );
}
