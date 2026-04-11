import Image from "next/image";
import {
  Brain,
  BriefcaseBusiness,
  CheckCircle2,
  Snowflake,
  Sparkles,
} from "lucide-react";

import { CurrentWeatherCard } from "@/components/recommendations/current-weather-card";

const recommendationItems = [
  {
    category: "아우터",
    title: "메리노 울 오버코트",
    src: "https://lh3.googleusercontent.com/aida-public/AB6AXuCUQp3zyr_pFxwNqX4mLQ37Pgp3wh4U5vpyqpQ82K0NUquLIc3aPNzQcS3YmpwIdBOLKVVX1t6gQJ8BxRlYect0cINUnCnndqwyKhWCuFV72Z9wM5zX6uGOjH0CKwM8SldklIswkDZDM5tE6ShmsTqkjP6vBss2aO45MkgagP7_Fg-gGOsxlUxAALgV1QQFmYWlSm1ntN01gkz6J7bplDDX9NaQOunMRJjDcZXkqi2kxaM6CVbZbUlgHTunVFAODMsNCcBWuV-fRs0",
    alt: "차콜 색상의 메리노 울 오버코트",
  },
  {
    category: "상의",
    title: "포플린 버튼다운 셔츠",
    src: "https://lh3.googleusercontent.com/aida-public/AB6AXuDTV-tl3pgIzXbZiqbXIDLx7iFEZ37He_oRXdHcLyjr3LZA4X6ccsdAnChlbT7UbsOjOD9SVGeHzcyW1-OoTCwr9SXmws3xdv8m9kpLJQ39IF6tbL-2c1rf1Q0DaekduwoDuPAE2l4OGlEH8G7NfW4vOihja0eJzm6EcwJeK453xRZpWPsnkETBV6mOwZ4fr5fsHa6ADnEX1xQ5bgr9oqYgrEOjlsZQ-M5HNHZpjKjhZJYtP_f3qv3b8gg1DWY_TPBnSZ73hR02Udg",
    alt: "깔끔하게 접힌 화이트 코튼 버튼다운 셔츠",
  },
];

export default function RecommendationsPage() {
  return (
    <>
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

        <section className="mb-24">
          <div
            className="rounded-[var(--radius-xl)] p-10 lg:p-16"
            style={{ backgroundColor: "var(--surface-container-low)" }}
          >
            <label
              className="mb-6 block text-2xl font-bold text-[#191c1d]"
              style={{ fontFamily: "var(--font-display)" }}
            >
              오늘 어떤 일정이 있나요?
            </label>
            <div className="flex flex-col gap-4 md:flex-row">
              <div className="relative flex-grow">
                <input
                  className="w-full rounded-[var(--radius-md)] border-none px-8 py-5 text-lg text-[#191c1d] outline-none placeholder:text-[#707884]"
                  placeholder="예: 오늘 면접이 있어"
                  style={{ backgroundColor: "var(--surface-container-highest)" }}
                  type="text"
                />
              </div>
              <button
                className="flex items-center justify-center gap-3 rounded-full px-10 py-5 font-bold text-white shadow-lg transition-all duration-150 active:scale-95"
                style={{
                  backgroundColor: "var(--primary)",
                  boxShadow: "0 20px 30px -15px rgb(0 96 168 / 0.2)",
                }}
                type="button"
              >
                <span>Get Recommendation</span>
                <Sparkles className="h-5 w-5" strokeWidth={2} />
              </button>
            </div>
          </div>
        </section>

        <section>
          <div className="mb-12 flex items-baseline justify-between">
            <h2
              className="text-3xl font-bold"
              style={{ fontFamily: "var(--font-display)" }}
            >
              Suggested Ensemble
            </h2>
            <div className="flex items-center gap-2 text-[var(--primary)]">
              <CheckCircle2 className="h-4 w-4" strokeWidth={2.2} />
              <span className="text-sm font-bold uppercase tracking-wider">
                바로 입기 좋음
              </span>
            </div>
          </div>

          <div className="grid grid-cols-1 gap-12 lg:grid-cols-12">
            <div className="grid grid-cols-1 gap-8 md:grid-cols-2 lg:col-span-8">
              {recommendationItems.map((item) => (
                <div
                  key={item.title}
                  className="group rounded-[var(--radius-xl)] p-4 transition-all hover:bg-[rgb(211_228_255_/_0.2)]"
                  style={{ backgroundColor: "var(--surface-container-lowest)" }}
                >
                  <div
                    className="mb-6 aspect-[3/4] overflow-hidden rounded-[var(--radius-md)]"
                    style={{ backgroundColor: "var(--surface-container)" }}
                  >
                    <Image
                      alt={item.alt}
                      className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
                      height={800}
                      src={item.src}
                      width={600}
                    />
                  </div>
                  <div className="px-2 pb-2">
                    <span className="mb-1 block text-[10px] font-bold uppercase tracking-[0.2em] text-[var(--primary)]">
                      {item.category}
                    </span>
                    <h3
                      className="text-xl font-bold text-[#191c1d]"
                      style={{ fontFamily: "var(--font-display)" }}
                    >
                      {item.title}
                    </h3>
                  </div>
                </div>
              ))}

              {[1, 2].map((item) => (
                <div
                  key={item}
                  className="flex flex-col rounded-[var(--radius-xl)] p-4 opacity-60"
                  style={{ backgroundColor: "var(--surface-container-low)" }}
                >
                  <div
                    className="mb-6 aspect-[3/4] animate-pulse rounded-[var(--radius-md)]"
                    style={{ backgroundColor: "var(--surface-container-highest)" }}
                  />
                  <div className="space-y-3 px-2">
                    <div
                      className="h-2 w-16 animate-pulse rounded"
                      style={{ backgroundColor: "var(--surface-container-highest)" }}
                    />
                    <div
                      className="h-5 w-3/4 animate-pulse rounded"
                      style={{ backgroundColor: "var(--surface-container-highest)" }}
                    />
                  </div>
                </div>
              ))}
            </div>

            <div className="lg:col-span-4">
              <div
                className="sticky top-28 rounded-[var(--radius-xl)] border p-8"
                style={{
                  backgroundColor: "rgb(0 96 168 / 0.05)",
                  borderColor: "rgb(0 96 168 / 0.1)",
                }}
              >
                <div className="mb-6 flex items-center gap-3">
                  <div className="flex h-10 w-10 items-center justify-center rounded-full bg-[var(--primary)] text-white">
                    <Brain className="h-5 w-5" strokeWidth={2} />
                  </div>
                  <h4
                    className="text-lg font-bold"
                    style={{ fontFamily: "var(--font-display)" }}
                  >
                    Selection Logic
                  </h4>
                </div>

                <div className="space-y-6 leading-relaxed text-[#404753]">
                  <p>
                    <span className="font-bold text-[#191c1d]">18°C</span>의 날씨와
                    습도 45% 조건에서 격식 있는 일정에 맞춘 조합입니다.
                  </p>

                  <div className="rounded-[var(--radius-md)] bg-white p-6 shadow-sm">
                    <p className="italic">
                      &quot;메리노 울 오버코트는 면접에 어울리는 단정한 실루엣을 만들고,
                      선선한 기온에서도 답답하지 않은 보온감을 줍니다. 포플린 셔츠를
                      함께 입으면 실내에서도 깔끔하고 편안하게 유지됩니다.&quot;
                    </p>
                  </div>

                  <div className="flex flex-col gap-4 pt-4">
                    <div className="flex items-center gap-3">
                      <Snowflake className="h-5 w-5 text-[var(--secondary)]" strokeWidth={2} />
                      <span className="text-sm">보온감: 적당함</span>
                    </div>
                    <div className="flex items-center gap-3">
                      <BriefcaseBusiness
                        className="h-5 w-5 text-[var(--secondary)]"
                        strokeWidth={2}
                      />
                      <span className="text-sm">
                        상황: 포멀 / 비즈니스
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>
      </main>
    </>
  );
}
