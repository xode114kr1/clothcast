import { CurrentWeatherCard } from "@/components/recommendations/current-weather-card";
import { CurrentWeatherProvider } from "@/components/recommendations/current-weather-provider";
import { RecommendationExperience } from "@/components/recommendations/recommendation-experience";

export default function RecommendationsPage() {
  return (
    <>
      <CurrentWeatherProvider>
        <main className="mx-auto max-w-7xl px-8 py-12">
          <section className="mb-24 grid grid-cols-1 items-end gap-8 lg:grid-cols-12">
            <div className="lg:col-span-7">
              <h1
                className="mb-4 text-5xl font-extrabold tracking-tight text-[#191c1d]"
                style={{ fontFamily: "var(--font-display)" }}
              >
                Curated for your day.
              </h1>
              <p className="max-w-xl text-xl text-[#404753]">
                현재 날씨와 오늘의 상황을 반영해 입기 좋은 조합을 추천합니다.
              </p>
            </div>

            <div className="lg:col-span-5">
              <CurrentWeatherCard />
            </div>
          </section>

          <RecommendationExperience />
        </main>
      </CurrentWeatherProvider>
    </>
  );
}
