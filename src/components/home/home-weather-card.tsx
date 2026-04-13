"use client";

import { Cloud, CloudSun, MapPin } from "lucide-react";

import { useCurrentWeather } from "@/components/recommendations/current-weather-provider";

export function HomeWeatherCard() {
  const weatherState = useCurrentWeather();

  if (weatherState.status === "loading") {
    return (
      <div
        aria-busy="true"
        className="rounded-[var(--radius-lg)] p-5"
        style={{ backgroundColor: "var(--surface-container-low)" }}
      >
        <div className="flex items-center justify-between gap-4">
          <div>
            <span className="text-xs font-bold tracking-widest text-[#404753]">
              LOCAL FORECAST
            </span>
            <div className="mt-3 h-8 w-24 animate-pulse rounded bg-[var(--surface-container-highest)]" />
          </div>
          <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-[rgb(211_228_255_/_0.45)]">
            <CloudSun
              className="h-6 w-6 text-[var(--primary)]"
              strokeWidth={1.6}
            />
          </div>
        </div>
        <p className="mt-3 text-sm font-semibold text-[#404753]">
          날씨 확인 중
        </p>
      </div>
    );
  }

  if (weatherState.status === "error") {
    return (
      <div
        className="rounded-[var(--radius-lg)] p-5"
        style={{ backgroundColor: "rgb(255 218 214 / 0.32)" }}
      >
        <div className="flex items-center justify-between gap-4">
          <div>
            <span className="text-xs font-bold tracking-widest text-[#8c1d18]">
              LOCAL FORECAST
            </span>
            <p
              className="mt-3 text-xl font-bold text-[#8c1d18]"
              style={{ fontFamily: "var(--font-display)" }}
            >
              조회 실패
            </p>
          </div>
          <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-[rgb(255_255_255_/_0.56)]">
            <CloudSun className="h-6 w-6 text-[#8c1d18]" strokeWidth={1.6} />
          </div>
        </div>
        <p className="mt-3 text-sm font-semibold text-[#8c1d18]">
          {weatherState.message}
        </p>
      </div>
    );
  }

  const { data, isFallbackLocation } = weatherState;

  return (
    <div
      className="rounded-[var(--radius-lg)] p-5"
      style={{ backgroundColor: "var(--surface-container-low)" }}
    >
      <div className="flex items-center justify-between gap-4">
        <div>
          <span className="text-xs font-bold tracking-widest text-[#404753]">
            LOCAL FORECAST
          </span>
          <div className="mt-3 flex items-end gap-2">
            <span
              className="text-4xl font-bold leading-none"
              style={{ fontFamily: "var(--font-display)" }}
            >
              {data.temperature}°C
            </span>
            <span className="pb-0.5 text-sm font-semibold text-[#404753]">
              {data.weather}
            </span>
          </div>
        </div>
        <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-[rgb(211_228_255_/_0.45)]">
          <Cloud className="h-6 w-6 text-[var(--primary)]" strokeWidth={1.6} />
        </div>
      </div>
      <div className="mt-3 flex items-center gap-2 text-sm font-bold text-[#404753]">
        <MapPin className="h-4 w-4 text-[var(--primary)]" strokeWidth={2} />
        <span>
          {isFallbackLocation ? `${data.location} 기본 지역` : data.location}
        </span>
      </div>
    </div>
  );
}
