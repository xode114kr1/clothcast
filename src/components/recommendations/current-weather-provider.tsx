"use client";

import {
  createContext,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react";

import type { CurrentWeatherData } from "@/lib/weather/weather-types";

type WeatherApiResponse = {
  status: "success" | "error";
  message: string;
  data?: CurrentWeatherData | { code?: string };
};

export type CurrentWeatherState =
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

const CurrentWeatherContext = createContext<CurrentWeatherState | null>(null);

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

export function CurrentWeatherProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const [weatherState, setWeatherState] = useState<CurrentWeatherState>({
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

  const contextValue = useMemo(() => weatherState, [weatherState]);

  return (
    <CurrentWeatherContext value={contextValue}>
      {children}
    </CurrentWeatherContext>
  );
}

export function useCurrentWeather() {
  const weatherState = useContext(CurrentWeatherContext);

  if (!weatherState) {
    throw new Error("useCurrentWeather must be used within CurrentWeatherProvider.");
  }

  return weatherState;
}
