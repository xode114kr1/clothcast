import Image from "next/image";
import Link from "next/link";
import { ArrowRight, Leaf, Sparkles, Factory, Heart } from "lucide-react";

import { HomeWeatherCard } from "@/components/home/home-weather-card";
import { WeatherAwareChoiceDescription } from "@/components/home/weather-aware-choice-description";
import { CurrentWeatherProvider } from "@/components/recommendations/current-weather-provider";
import { getCurrentSessionUser } from "@/lib/auth/current-user";
import { prisma } from "@/lib/prisma";

const valueProps = [
  {
    icon: Factory,
    title: "정교한 스타일링",
    description:
      "취향과 날씨 조건을 함께 반영해 오늘 입기 좋은 조합을 고릅니다.",
    tone: "var(--primary-fixed)",
    color: "var(--primary)",
  },
  {
    icon: Sparkles,
    title: "Digital Mirror",
    description: "옷장 앞에서 고민하기 전에 어울리는 조합을 먼저 확인하세요.",
    tone: "rgb(0 250 226 / 0.2)",
    color: "var(--secondary)",
  },
  {
    icon: Leaf,
    title: "지속 가능한 선택",
    description:
      "잊고 있던 옷을 다시 발견하고, 내 옷장 안에서 새로운 코디를 만듭니다.",
    tone: "rgb(115 255 111 / 0.2)",
    color: "var(--tertiary)",
  },
];

async function getHomeUser() {
  const session = await getCurrentSessionUser();

  if (!session) {
    return null;
  }

  try {
    return await prisma.user.findUnique({
      where: { id: session.userId },
      select: {
        id: true,
        nickname: true,
      },
    });
  } catch {
    return null;
  }
}

async function getRecentClothes(userId: number) {
  try {
    return await prisma.clothes.findMany({
      where: { userId },
      orderBy: { createdAt: "desc" },
      take: 3,
      select: {
        id: true,
        name: true,
        imageUrl: true,
        category: true,
        createdAt: true,
      },
    });
  } catch {
    return [];
  }
}

export default async function Home() {
  const user = await getHomeUser();
  const recentClothes = user ? await getRecentClothes(user.id) : [];
  const heroEyebrow = user ? "TODAY'S CLOTHCAST" : "CLOTHCAST";
  const greeting = user
    ? `${user.nickname}님, 오늘 입을 옷을 골라볼까요?`
    : "날씨와 일정에 맞는 코디를 더 쉽게 고르세요";
  const intro = user
    ? "현재 날씨와 오늘의 일정을 함께 보고, 내 옷장 속 아이템으로 어울리는 조합을 준비합니다."
    : "옷장을 등록하면 ClothCast가 현재 날씨와 오늘의 상황을 바탕으로 입기 좋은 조합을 추천합니다.";

  return (
    <>
      <CurrentWeatherProvider>
        <main className="mx-auto max-w-7xl px-8 pb-24 pt-12">
          <header className="mb-16 grid gap-6 lg:grid-cols-[minmax(0,1fr)_minmax(20rem,24rem)] lg:items-end">
            <div>
              <div
                className="mb-4 inline-block rounded-full px-4 py-1.5 text-xs font-bold tracking-widest"
                style={{
                  backgroundColor: "var(--primary-fixed)",
                  color: "var(--on-primary-fixed-variant, #004880)",
                }}
              >
                {heroEyebrow}
              </div>
              <h1
                className="text-4xl font-extrabold tracking-tighter text-[#191c1d] md:text-5xl"
                style={{ fontFamily: "var(--font-display)" }}
              >
                {greeting}
              </h1>
              <p className="mt-2 max-w-3xl text-lg font-light text-[#404753]">
                {intro}
              </p>
            </div>
            <div className="w-full lg:justify-self-end">
              <HomeWeatherCard />
            </div>
          </header>

          <section
            className="ambient-shadow relative mb-24 overflow-hidden rounded-[var(--radius-xl)]"
            style={{ boxShadow: "var(--shadow-ambient-md)" }}
          >
            <div className="absolute inset-0 z-0">
              <Image
                alt="옷장 배경 이미지"
                className="h-full w-full object-cover"
                fill
                priority
                src="/images/home-hero.svg"
              />
              <div className="absolute inset-0 bg-gradient-to-r from-[var(--background)] via-[rgb(248_249_250_/_0.4)] to-transparent" />
            </div>

            <div className="relative z-10 max-w-2xl px-12 py-24">
              <h2
                className="mb-6 text-6xl font-extrabold leading-[1.1] tracking-tighter text-[#191c1d]"
                style={{ fontFamily: "var(--font-display)" }}
              >
                오늘의 날씨와 일정에 맞춘 코디 추천
              </h2>
              <p className="mb-10 max-w-md text-xl text-[#404753]">
                기온, 체감 온도, 일정의 분위기를 함께 반영해 내 옷장 안에서 바로
                입을 수 있는 조합을 찾습니다.
              </p>
              <div className="flex flex-wrap gap-4">
                <Link
                  className="rounded-full px-11 py-4 font-bold text-white transition-all active:scale-95 hover:opacity-90"
                  href="/recommendations"
                  style={{
                    background: "var(--gradient-hero)",
                    boxShadow: "var(--shadow-ambient-md)",
                  }}
                >
                  코디 추천 받기
                </Link>
                <Link
                  className="rounded-full border px-11 py-4 font-bold text-[var(--primary)] transition-all active:scale-95 hover:bg-[var(--surface-container-low)]"
                  href="/wardrobe"
                  style={{
                    backgroundColor: "var(--surface-container-lowest)",
                    borderColor: "rgb(191 199 213 / 0.15)",
                  }}
                >
                  내 옷장 관리
                </Link>
              </div>
            </div>
          </section>

          <div
            className="h-full rounded-[var(--radius-xl)] p-8"
            style={{
              backgroundColor: "var(--surface-container-lowest)",
              boxShadow: "var(--shadow-ambient-md)",
            }}
          >
            <div className="mb-12 flex items-end justify-between">
              <div>
                <span className="text-xs font-bold tracking-widest text-[#404753]">
                  TODAYS EDIT
                </span>
                <h3
                  className="mt-2 text-3xl font-bold"
                  style={{ fontFamily: "var(--font-display)" }}
                >
                  오늘의 예시 코디
                </h3>
              </div>
              <Link
                className="group flex items-center gap-2 font-bold text-[var(--primary)]"
                href="/recommendations"
              >
                모두 보기
                <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
              </Link>
            </div>

            {recentClothes.length > 0 ? (
              <div className="flex gap-6 overflow-hidden">
                {recentClothes.map((item, index) => {
                  const featured = index === 0;

                  return (
                    <div
                      key={item.id}
                      className={`overflow-hidden rounded-[var(--radius-xl)] ${
                        featured
                          ? "w-80 flex-shrink-0 group"
                          : "origin-left scale-95 opacity-60"
                      }`}
                      style={{
                        backgroundColor: "var(--surface-container-low)",
                      }}
                    >
                      <div className="relative h-96">
                        <Image
                          alt={`${item.name} 이미지`}
                          className={`h-full w-full object-cover ${
                            featured
                              ? "transition-transform duration-700 group-hover:scale-105"
                              : ""
                          }`}
                          fill
                          src={item.imageUrl}
                          unoptimized
                        />
                        {featured ? (
                          <div className="absolute right-4 top-4 rounded-full bg-[rgb(255_255_255_/_0.8)] p-2 backdrop-blur-md">
                            <Heart className="h-5 w-5 text-[var(--primary)]" strokeWidth={2} />
                          </div>
                        ) : null}
                      </div>
                      <div className="p-6">
                        <h4 className="text-xl font-bold text-[#191c1d]">
                          {item.name}
                        </h4>
                        <p className="mt-1 text-sm text-[#404753]">
                          {featured
                            ? (
                              <WeatherAwareChoiceDescription />
                            )
                            : "최근 등록한 옷장에서 가져온 아이템"}
                        </p>
                      </div>
                    </div>
                  );
                })}
              </div>
            ) : (
              <div
                className="rounded-[var(--radius-xl)] p-10 text-center"
                style={{ backgroundColor: "var(--surface-container-low)" }}
              >
                <p className="text-lg font-semibold text-[#191c1d]">
                  아직 등록한 옷이 없습니다.
                </p>
                <p className="mt-2 text-sm text-[#404753]">
                  첫 옷을 등록하면 오늘의 예시 코디에 바로 반영됩니다.
                </p>
                <Link
                  className="mt-6 inline-flex rounded-full px-8 py-3 text-sm font-bold text-white"
                  href={user ? "/wardrobe/new" : "/login"}
                  style={{ background: "var(--gradient-hero)" }}
                >
                  {user ? "첫 옷 등록하기" : "로그인하고 옷 등록하기"}
                </Link>
              </div>
            )}
          </div>

          <section
            className="mt-24 rounded-[var(--radius-xl)] px-12 py-24"
            style={{ backgroundColor: "var(--surface-container-low)" }}
          >
            <div className="mx-auto mb-16 max-w-2xl text-center">
              <h2
                className="mb-4 text-4xl font-bold tracking-tight"
                style={{ fontFamily: "var(--font-display)" }}
              >
                The Art of Dressing
              </h2>
              <p className="text-[#404753]">
                세심한 큐레이션과 날씨 데이터를 결합해 매일의 코디 고민을
                줄입니다.
              </p>
            </div>

            <div className="grid grid-cols-1 gap-12 md:grid-cols-3">
              {valueProps.map((item) => {
                const Icon = item.icon;

                return (
                  <div key={item.title} className="text-center">
                    <div
                      className="mx-auto mb-6 flex h-16 w-16 items-center justify-center rounded-full"
                      style={{ backgroundColor: item.tone }}
                    >
                      <Icon
                        className="h-8 w-8"
                        strokeWidth={1.8}
                        style={{ color: item.color }}
                      />
                    </div>
                    <h4
                      className="mb-3 text-xl font-bold"
                      style={{ fontFamily: "var(--font-display)" }}
                    >
                      {item.title}
                    </h4>
                    <p className="text-sm leading-relaxed text-[#404753]">
                      {item.description}
                    </p>
                  </div>
                );
              })}
            </div>
          </section>
        </main>
      </CurrentWeatherProvider>
    </>
  );
}
