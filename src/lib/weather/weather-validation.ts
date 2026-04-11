type WeatherValidationCode = "INVALID_REQUEST";

export type CurrentWeatherQuery = {
  lat: number;
  lon: number;
};

export type CurrentWeatherQueryValidationResult =
  | {
      success: true;
      data: CurrentWeatherQuery;
    }
  | {
      success: false;
      message: string;
      code: WeatherValidationCode;
    };

function parseCoordinate(value: string | null) {
  if (!value) {
    return null;
  }

  const coordinate = Number(value);

  return Number.isFinite(coordinate) ? coordinate : null;
}

// 현재 날씨 조회 query string의 위도/경도가 유효한 좌표 범위인지 검사한다.
export function validateCurrentWeatherQuery(
  searchParams: URLSearchParams,
): CurrentWeatherQueryValidationResult {
  const lat = parseCoordinate(searchParams.get("lat"));
  const lon = parseCoordinate(searchParams.get("lon"));

  if (lat === null || lon === null) {
    return {
      success: false,
      message: "위도와 경도 좌표가 필요합니다.",
      code: "INVALID_REQUEST",
    };
  }

  if (lat < -90 || lat > 90) {
    return {
      success: false,
      message: "위도는 -90부터 90 사이여야 합니다.",
      code: "INVALID_REQUEST",
    };
  }

  if (lon < -180 || lon > 180) {
    return {
      success: false,
      message: "경도는 -180부터 180 사이여야 합니다.",
      code: "INVALID_REQUEST",
    };
  }

  return {
    success: true,
    data: {
      lat,
      lon,
    },
  };
}
