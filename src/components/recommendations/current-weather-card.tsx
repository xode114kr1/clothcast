"use client";

import { useEffect, useState } from "react";
import { CloudSun, MapPin, SunMedium } from "lucide-react";

import type { CurrentWeatherData } from "@/lib/weather/weather-types";

type WeatherApiResponse = {
  status: "success" | "error";
  message: string;
  data?: CurrentWeatherData | { code?: string };
};

type WeatherState =
  | {
      status: "loading";
      message: string;
    }
  | {
      status: "success";
      data: CurrentWeatherData;
      isFallbackLocation: boolean;
    }
  | {
      status: "error";
      message: string;
    };

const SEOUL_COORDINATES = {
  lat: 37.5665,
  lon: 126.978,
};

function isCurrentWeatherData(value: unknown): value is CurrentWeatherData {
  return (
    typeof value === "object" &&
    value !== null &&
    "temperature" in value &&
    typeof value.temperature === "number" &&
    "feelsLike" in value &&
    typeof value.feelsLike === "number" &&
    "weather" in value &&
    typeof value.weather === "string" &&
    "humidity" in value &&
    typeof value.humidity === "number" &&
    "windSpeed" in value &&
    typeof value.windSpeed === "number" &&
    "location" in value &&
    typeof value.location === "string"
  );
}

function getResponseMessage(data: unknown) {
  if (
    typeof data === "object" &&
    data !== null &&
    "message" in data &&
    typeof data.message === "string"
  ) {
    return data.message;
  }

  return "날씨를 불러오지 못했습니다.";
}

function getCurrentPosition() {
  return new Promise<GeolocationPosition>((resolve, reject) => {
    if (!navigator.geolocation) {
      reject(new Error("Geolocation is not supported."));
      return;
    }

    navigator.geolocation.getCurrentPosition(resolve, reject, {
      enableHighAccuracy: false,
      maximumAge: 10 * 60 * 1000,
      timeout: 5000,
    });
  });
}

async function fetchWeather({
  lat,
  lon,
}: {
  lat: number;
  lon: number;
}) {
  const params = new URLSearchParams({
    lat: String(lat),
    lon: String(lon),
  });
  const response = await fetch(`/api/v1/weather/current?${params.toString()}`, {
    method: "GET",
  });
  const data = (await response.json().catch(() => null)) as WeatherApiResponse | null;

  if (!response.ok || data?.status !== "success" || !isCurrentWeatherData(data.data)) {
    throw new Error(getResponseMessage(data));
  }

  return data.data;
}

export function CurrentWeatherCard() {
  const [weatherState, setWeatherState] = useState<WeatherState>({
    status: "loading",
    message: "현재 위치의 날씨를 불러오는 중입니다.",
  });

  useEffect(() => {
    let ignore = false;

    async function loadWeather() {
      try {
        const position = await getCurrentPosition();
        const weather = await fetchWeather({
          lat: position.coords.latitude,
          lon: position.coords.longitude,
        });

        if (!ignore) {
          setWeatherState({
            status: "success",
            data: weather,
            isFallbackLocation: false,
          });
        }
      } catch {
        try {
          const weather = await fetchWeather(SEOUL_COORDINATES);

          if (!ignore) {
            setWeatherState({
              status: "success",
              data: weather,
              isFallbackLocation: true,
            });
          }
        } catch {
          if (!ignore) {
            setWeatherState({
              status: "error",
              message: "날씨를 불러오지 못했습니다. 잠시 후 다시 시도해주세요.",
            });
          }
        }
      }
    }

    void loadWeather();

    return () => {
      ignore = true;
    };
  }, []);

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
