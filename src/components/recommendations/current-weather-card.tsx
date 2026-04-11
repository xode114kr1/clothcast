"use client";

import { CloudSun, MapPin, SunMedium } from "lucide-react";

import { useCurrentWeather } from "@/components/recommendations/current-weather-provider";

export function CurrentWeatherCard() {
  const weatherState = useCurrentWeather();

  if (weatherState.status === "loading") {
    return (
      <div
        aria-busy="true"
        className="flex min-h-48 items-center justify-between rounded-[var(--radius-xl)] p-8 shadow-sm"
        style={{ backgroundColor: "var(--surface-container-lowest)" }}
      >
        <div>
          <div className="mb-4 h-4 w-28 animate-pulse rounded bg-[var(--surface-container-highest)]" />
          <div className="mb-4 h-14 w-32 animate-pulse rounded bg-[var(--surface-container-highest)]" />
          <p className="font-medium text-[#404753]">{weatherState.message}</p>
        </div>
        <div className="flex h-24 w-24 items-center justify-center rounded-full bg-[rgb(211_228_255_/_0.3)]">
          <CloudSun className="h-12 w-12 text-[var(--primary)]" strokeWidth={1.8} />
        </div>
      </div>
    );
  }

  if (weatherState.status === "error") {
    return (
      <div
        className="min-h-48 rounded-[var(--radius-xl)] p-8 shadow-sm"
        style={{ backgroundColor: "rgb(255 218 214 / 0.32)" }}
      >
        <div className="mb-3 flex items-center gap-2">
          <CloudSun className="h-5 w-5 text-[#8c1d18]" strokeWidth={2} />
          <span className="text-xs font-bold uppercase tracking-[0.05em] text-[#8c1d18]">
            날씨 조회 실패
          </span>
        </div>
        <p className="font-semibold text-[#8c1d18]">{weatherState.message}</p>
      </div>
    );
  }

  const { data, isFallbackLocation } = weatherState;

  return (
    <div
      className="flex items-center justify-between rounded-[var(--radius-xl)] p-8 shadow-sm"
      style={{ backgroundColor: "var(--surface-container-lowest)" }}
    >
      <div>
        <div className="mb-1 flex items-center gap-2">
          <MapPin className="h-4 w-4 text-[var(--primary)]" strokeWidth={2} />
          <span className="text-xs font-bold uppercase tracking-[0.05em] text-[#404753]">
            {isFallbackLocation ? `${data.location} 기본 지역` : data.location}
          </span>
        </div>
        <div
          className="text-6xl font-extrabold text-[#191c1d]"
          style={{ fontFamily: "var(--font-display)" }}
        >
          {data.temperature}°C
        </div>
        <div className="mt-1 font-medium text-[#404753]">
          {data.weather} · 체감 {data.feelsLike}°C
        </div>
        <div className="mt-2 text-sm font-medium text-[#707884]">
          습도 {data.humidity}% · 바람 {data.windSpeed}m/s
        </div>
      </div>

      <div className="flex h-24 w-24 items-center justify-center rounded-full bg-[rgb(211_228_255_/_0.3)]">
        <SunMedium className="h-12 w-12 scale-[2.1] text-[var(--primary)]" strokeWidth={1.8} />
      </div>
    </div>
  );
}
