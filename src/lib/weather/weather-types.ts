export type CurrentWeatherData = {
  temperature: number;
  feelsLike: number;
  weather: string;
  humidity: number;
  windSpeed: number;
  location: string;
};

export type OpenWeatherCurrentResponse = {
  weather: Array<{
    main: string;
    description: string;
  }>;
  main: {
    temp: number;
    feels_like: number;
    humidity: number;
  };
  wind: {
    speed: number;
  };
  name: string;
};
