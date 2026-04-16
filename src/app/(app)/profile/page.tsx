import Link from "next/link";
import { redirect } from "next/navigation";
import { ArrowRight, CalendarDays, Shirt, Sparkles, User } from "lucide-react";

import { getCurrentSessionUser } from "@/lib/auth/current-user";
import { prisma } from "@/lib/prisma";
import type { RecommendedOutfitItem } from "@/lib/recommendations/recommendation-types";
import { ProfileActions } from "@/components/profile/profile-actions";

type RecentRecommendation = {
  recommendationId: number;
  prompt: string;
  reason: string;
  styleTone: string;
  recommendedItems: RecommendedOutfitItem[];
  createdAt: Date;
};

type ProfileData = {
  email: string;
  nickname: string;
  createdAt: Date;
  clothesCount: number;
  recommendationsCount: number;
  recentRecommendations: RecentRecommendation[];
};

type RecommendationHistoryRow = {
  id: number;
  prompt: string;
  reason: string;
  styleTone: string;
  recommendedItems: unknown;
  createdAt: Date;
};

function isRecommendedOutfitItems(value: unknown): value is RecommendedOutfitItem[] {
  return (
    Array.isArray(value) &&
    value.every((item) => {
      if (typeof item !== "object" || item === null || Array.isArray(item)) {
        return false;
      }

      const payload = item as Record<string, unknown>;

      return (
        typeof payload.id === "number" &&
        typeof payload.name === "string" &&
        typeof payload.category === "string" &&
        typeof payload.imageUrl === "string"
      );
    })
  );
}

async function getProfileData(): Promise<ProfileData | null> {
  const session = await getCurrentSessionUser();

  if (!session) {
    return null;
  }

  const user = await prisma.user.findUnique({
    where: { id: session.userId },
    select: {
      id: true,
      email: true,
      nickname: true,
      createdAt: true,
      _count: {
        select: {
          clothes: true,
        },
      },
    },
  });

  if (!user) {
    return null;
  }

  const [recommendationsCount, recentRecommendations] = await Promise.all([
    prisma.$queryRaw<[{ count: bigint }]>`
      SELECT COUNT(*)::bigint AS count
      FROM "Recommendation"
      WHERE "userId" = ${user.id}
    `,
    prisma.$queryRaw<RecommendationHistoryRow[]>`
      SELECT
        "id",
        "prompt",
        "reason",
        "styleTone",
        "recommendedItems",
        "createdAt"
      FROM "Recommendation"
      WHERE "userId" = ${user.id}
      ORDER BY "createdAt" DESC
      LIMIT 3
    `,
  ]).catch(() => [null, [] as RecommendationHistoryRow[]] as const);

  return {
    email: user.email,
    nickname: user.nickname,
    createdAt: user.createdAt,
    clothesCount: user._count.clothes,
    recommendationsCount: Number(recommendationsCount?.[0]?.count ?? 0),
    recentRecommendations: recentRecommendations.map((recommendation) => ({
      recommendationId: recommendation.id,
      prompt: recommendation.prompt,
      reason: recommendation.reason,
      styleTone: recommendation.styleTone,
      recommendedItems: isRecommendedOutfitItems(recommendation.recommendedItems)
        ? recommendation.recommendedItems
        : [],
      createdAt: recommendation.createdAt,
    })),
  };
}

function formatJoinedDate(date: Date) {
  return new Intl.DateTimeFormat("ko-KR", {
    year: "numeric",
    month: "long",
    day: "numeric",
  }).format(date);
}

function getAvatarLabel(profile: ProfileData) {
  return (
    profile.nickname.trim().charAt(0).toUpperCase() ||
    profile.email.charAt(0).toUpperCase()
  );
}

function getRecommendationSummary(items: RecommendedOutfitItem[]) {
  if (items.length === 0) {
    return "추천 아이템 정보 없음";
  }

  return items.map((item) => item.name).join(" / ");
}

export default async function ProfilePage() {
  const profile = await getProfileData();

  if (!profile) {
    redirect("/login");
  }

  const joinedDate = formatJoinedDate(profile.createdAt);

  return (
    <main className="mx-auto max-w-7xl space-y-24 px-8 py-24">
      <section className="grid grid-cols-1 items-end gap-12 lg:grid-cols-12">
        <div className="lg:col-span-4">
          <div
            className="flex aspect-square max-w-72 items-center justify-center rounded-[var(--radius-xl)] text-8xl font-extrabold text-white shadow-[var(--shadow-ambient-md)]"
            style={{
              background: "var(--gradient-hero)",
              fontFamily: "var(--font-display)",
            }}
          >
            {getAvatarLabel(profile)}
          </div>
        </div>

        <div className="space-y-5 lg:col-span-8">
          <span className="text-xs font-bold uppercase tracking-widest text-[var(--primary)]">
            DIGITAL ATELIER MEMBER
          </span>
          <div className="space-y-3">
            <h1
              className="text-5xl font-extrabold tracking-tighter md:text-7xl"
              style={{ fontFamily: "var(--font-display)" }}
            >
              {profile.nickname}
            </h1>
            <p className="max-w-2xl text-lg leading-relaxed text-[#404753]">
              오늘 입을 옷을 더 빠르게 고를 수 있도록 옷장과 추천 흐름을 한곳에서
              관리합니다.
            </p>
          </div>
          <ProfileActions />
          <dl className="grid max-w-2xl grid-cols-1 gap-4 sm:grid-cols-2">
            <div
              className="rounded-[var(--radius-md)] px-6 py-5"
              style={{ backgroundColor: "var(--surface-container-lowest)" }}
            >
              <dt className="text-xs font-bold uppercase tracking-wider text-[#707884]">
                Email
              </dt>
              <dd className="mt-2 break-words font-semibold text-[#404753]">
                {profile.email}
              </dd>
            </div>
            <div
              className="rounded-[var(--radius-md)] px-6 py-5"
              style={{ backgroundColor: "var(--surface-container-lowest)" }}
            >
              <dt className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-[#707884]">
                <CalendarDays className="h-4 w-4" strokeWidth={1.8} />
                Joined
              </dt>
              <dd className="mt-2 font-semibold text-[#404753]">{joinedDate}</dd>
            </div>
          </dl>
        </div>
      </section>

      <section className="grid grid-cols-1 gap-8 md:grid-cols-2">
        <Link
          className="group flex items-center justify-between rounded-[var(--radius-xl)] p-10 shadow-[var(--shadow-ambient-sm)] transition-all duration-300 hover:bg-[rgb(211_228_255_/_0.2)] hover:shadow-[var(--shadow-ambient-md)]"
          href="/wardrobe"
          style={{ backgroundColor: "var(--surface-container-lowest)" }}
        >
          <div className="space-y-1">
            <p className="text-xs uppercase tracking-wider text-[#707884]">
              등록한 옷
            </p>
            <p
              className="text-6xl font-bold"
              style={{ fontFamily: "var(--font-display)" }}
            >
              {profile.clothesCount}
            </p>
            <p className="flex items-center gap-2 text-sm font-bold text-[var(--primary)]">
              옷장으로 이동
              <ArrowRight className="h-4 w-4" strokeWidth={2.2} />
            </p>
          </div>
          <div className="text-[rgb(0_96_168_/_0.2)] transition-colors group-hover:text-[var(--primary)]">
            <Shirt className="h-20 w-20" strokeWidth={1.7} />
          </div>
        </Link>

        <Link
          className="group flex items-center justify-between rounded-[var(--radius-xl)] p-10 shadow-[var(--shadow-ambient-sm)] transition-all duration-300 hover:bg-[rgb(211_228_255_/_0.2)] hover:shadow-[var(--shadow-ambient-md)]"
          href="/recommendations"
          style={{ backgroundColor: "var(--surface-container-lowest)" }}
        >
          <div className="space-y-1">
            <p className="text-xs uppercase tracking-wider text-[#707884]">
              Recent Picks
            </p>
            <p
              className="text-6xl font-bold"
              style={{ fontFamily: "var(--font-display)" }}
            >
              {profile.recommendationsCount}
            </p>
            <p className="flex items-center gap-2 text-sm font-bold text-[var(--primary)]">
              추천 받으러 가기
              <ArrowRight className="h-4 w-4" strokeWidth={2.2} />
            </p>
          </div>
          <div className="text-[rgb(0_96_168_/_0.2)] transition-colors group-hover:text-[var(--primary)]">
            <Sparkles className="h-20 w-20" strokeWidth={1.7} />
          </div>
        </Link>
      </section>

      <section className="space-y-8">
        <div className="flex flex-col justify-between gap-4 md:flex-row md:items-end">
          <div>
            <span className="text-xs font-bold uppercase tracking-widest text-[var(--primary)] opacity-70">
              Recommendation History
            </span>
            <h2
              className="mt-2 text-3xl font-bold tracking-tight"
              style={{ fontFamily: "var(--font-display)" }}
            >
              최근 추천 기록
            </h2>
          </div>
          <Link
            className="inline-flex items-center gap-2 font-bold text-[var(--primary)]"
            href="/recommendations"
          >
            새 추천 받기
            <ArrowRight className="h-4 w-4" strokeWidth={2.2} />
          </Link>
        </div>

        {profile.recentRecommendations.length > 0 ? (
          <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
            {profile.recentRecommendations.map((recommendation) => (
              <article
                key={recommendation.recommendationId}
                className="rounded-[var(--radius-xl)] p-8 shadow-[var(--shadow-ambient-sm)]"
                style={{ backgroundColor: "var(--surface-container-lowest)" }}
              >
                <p className="text-xs font-bold uppercase tracking-widest text-[var(--primary)]">
                  {formatJoinedDate(recommendation.createdAt)}
                </p>
                <h3
                  className="mt-4 text-xl font-bold text-[var(--foreground)]"
                  style={{ fontFamily: "var(--font-display)" }}
                >
                  {recommendation.styleTone}
                </h3>
                <p className="mt-2 line-clamp-2 text-sm font-semibold text-[#404753]">
                  {recommendation.prompt}
                </p>
                <p className="mt-6 text-sm leading-relaxed text-[#404753]">
                  {getRecommendationSummary(recommendation.recommendedItems)}
                </p>
                <p className="mt-4 line-clamp-3 text-sm leading-relaxed text-[#707884]">
                  {recommendation.reason}
                </p>
              </article>
            ))}
          </div>
        ) : (
          <div
            className="flex flex-col items-center justify-center rounded-[var(--radius-xl)] px-8 py-16 text-center"
            style={{ backgroundColor: "var(--surface-container-low)" }}
          >
            <User
              className="h-12 w-12 text-[rgb(0_96_168_/_0.35)]"
              strokeWidth={1.7}
            />
            <p className="mt-6 text-2xl font-extrabold text-[var(--foreground)]">
              아직 저장된 추천 기록이 없습니다.
            </p>
            <p className="mx-auto mt-3 max-w-lg text-[#404753]">
              오늘의 일정과 날씨를 바탕으로 추천을 받으면 이곳에서 최근 코디를
              다시 볼 수 있습니다.
            </p>
          </div>
        )}
      </section>
    </main>
  );
}
