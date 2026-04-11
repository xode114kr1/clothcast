import type {
  CurrentWeatherData,
  OpenWeatherCurrentResponse,
} from "@/lib/weather/weather-types";

const OPENWEATHER_CURRENT_URL = "https://api.openweathermap.org/data/2.5/weather";

// OpenWeather 연동에 필요한 서버 환경 변수를 읽고 누락 시 즉시 실패시킨다.
function getRequiredEnv(name: string) {
  const value = process.env[name];

  if (!value) {
    throw new Error(`${name} is not set.`);
  }

  return value;
}

function buildCurrentWeatherUrl({
  lat,
  lon,
}: {
  lat: number;
  lon: number;
}) {
  const url = new URL(OPENWEATHER_CURRENT_URL);

  url.searchParams.set("lat", String(lat));
  url.searchParams.set("lon", String(lon));
  url.searchParams.set("appid", getRequiredEnv("OPENWEATHER_API_KEY"));
  url.searchParams.set("units", "metric");
  url.searchParams.set("lang", "kr");

  return url;
}

function mapCurrentWeatherResponse(
  data: OpenWeatherCurrentResponse,
): CurrentWeatherData {
  return {
    temperature: Math.round(data.main.temp),
    feelsLike: Math.round(data.main.feels_like),
    weather: data.weather[0]?.description ?? data.weather[0]?.main ?? "Unknown",
    humidity: data.main.humidity,
    windSpeed: data.wind.speed,
    location: data.name,
  };
}

// 위도/경도 기준 현재 날씨를 OpenWeather에서 조회하고 API 응답 형식에 맞게 정규화한다.
export async function fetchCurrentWeather({
  lat,
  lon,
}: {
  lat: number;
  lon: number;
}) {
  const response = await fetch(buildCurrentWeatherUrl({ lat, lon }), {
    headers: {
      Accept: "application/json",
    },
  });

  if (!response.ok) {
    throw new Error(`OpenWeather request failed with status ${response.status}.`);
  }

  const data = (await response.json()) as OpenWeatherCurrentResponse;

  return mapCurrentWeatherResponse(data);
}
