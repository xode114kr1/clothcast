import Image from "next/image";
import {
  ArrowRight,
  Pencil,
  Shirt,
  Sparkles,
} from "lucide-react";

const recentRecommendations = [
  {
    date: "2024년 10월 24일",
    title: "가을 린넨 레이어링",
    description:
      "선선한 날씨에 맞춰 크림 린넨과 슬레이트 그레이 치노를 가볍게 조합했습니다.",
    src: "/images/profile-rec-linen-layering.svg",
    alt: "가을 코디 추천 플랫레이 예시 이미지",
  },
  {
    date: "2024년 10월 22일",
    title: "어반 누아르 이브닝",
    description:
      "텍스처가 있는 니트와 광택 있는 가죽으로 완성한 세련된 도심형 코디입니다.",
    src: "/images/profile-rec-urban-noir.svg",
    alt: "저녁 코디 추천 예시 이미지",
  },
  {
    date: "2024년 10월 19일",
    title: "부드러운 톤온톤 주말",
    description:
      "세이지와 오트 컬러로 편안함과 단정한 실루엣을 함께 살린 주말 코디입니다.",
    src: "/images/profile-rec-soft-tonal.svg",
    alt: "주말 코디 추천 예시 이미지",
  },
];

export default function ProfilePage() {
  return (
    <>
      <main className="mx-auto max-w-7xl space-y-24 px-8 py-24">
        <section className="flex flex-col items-center gap-12 md:flex-row md:items-end">
          <div className="relative">
            <div
              className="h-48 w-48 overflow-hidden rounded-[var(--radius-xl)] shadow-2xl"
              style={{ backgroundColor: "var(--surface-container-highest)" }}
            >
              <Image
                alt="Alex 프로필"
                className="h-full w-full object-cover"
                height={192}
                src="/images/profile-alex.svg"
                width={192}
              />
            </div>
            <div className="absolute -bottom-4 -right-4 rounded-full bg-[var(--primary)] p-4 text-white shadow-lg">
              <Pencil className="h-5 w-5" strokeWidth={2.2} />
            </div>
          </div>

          <div className="flex-1 space-y-2 text-center md:text-left">
            <span className="text-xs font-bold uppercase tracking-widest text-[var(--primary)]">
              DIGITAL ATELIER MEMBER
            </span>
            <h1
              className="text-5xl font-extrabold tracking-tighter md:text-7xl"
              style={{ fontFamily: "var(--font-display)" }}
            >
              Alex
            </h1>
            <p className="max-w-lg text-[#404753]">
              지속 가능한 소재와 모던한 실루엣을 중심으로 미니멀한 옷장을 관리하고 있습니다.
            </p>
          </div>
        </section>

        <section className="grid grid-cols-1 gap-8 md:grid-cols-2">
          <div
            className="group flex items-center justify-between rounded-[var(--radius-xl)] p-10 transition-all duration-300 hover:bg-[rgb(211_228_255_/_0.2)]"
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
                42
              </p>
            </div>
            <div className="text-[rgb(0_96_168_/_0.2)] transition-colors group-hover:text-[var(--primary)]">
              <Shirt className="h-20 w-20" strokeWidth={1.7} />
            </div>
          </div>

          <div
            className="group flex items-center justify-between rounded-[var(--radius-xl)] p-10 transition-all duration-300 hover:bg-[rgb(211_228_255_/_0.2)]"
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
                5
              </p>
            </div>
            <div className="text-[rgb(0_96_168_/_0.2)] transition-colors group-hover:text-[var(--primary)]">
              <Sparkles className="h-20 w-20" strokeWidth={1.7} />
            </div>
          </div>
        </section>

        <section className="space-y-12">
          <div className="flex items-center justify-between">
            <h2
              className="text-3xl font-bold tracking-tight"
              style={{ fontFamily: "var(--font-display)" }}
            >
              Recent Recommendations
            </h2>
            <button className="flex items-center gap-2 font-bold text-[var(--primary)] hover:underline">
              View History
              <ArrowRight className="h-4 w-4" strokeWidth={2.2} />
            </button>
          </div>

          <div className="grid grid-cols-1 gap-12 md:grid-cols-3">
            {recentRecommendations.map((item) => (
              <article key={item.title} className="space-y-6">
                <div
                  className="group relative aspect-[4/5] overflow-hidden rounded-[var(--radius-xl)]"
                  style={{ backgroundColor: "var(--surface-container-low)" }}
                >
                  <Image
                    alt={item.alt}
                    className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-105"
                    height={800}
                    src={item.src}
                    width={640}
                  />
                  <div className="absolute inset-0 flex items-end bg-gradient-to-t from-black/40 to-transparent p-8 opacity-0 transition-opacity group-hover:opacity-100">
                    <span className="font-bold text-white">빠르게 보기</span>
                  </div>
                </div>
                <div className="space-y-2">
                  <p className="text-xs font-bold uppercase tracking-widest text-[var(--primary)]">
                    {item.date}
                  </p>
                  <h3
                    className="text-xl font-bold"
                    style={{ fontFamily: "var(--font-display)" }}
                  >
                    {item.title}
                  </h3>
                  <p className="text-sm leading-relaxed text-[#404753]">
                    {item.description}
                  </p>
                </div>
              </article>
            ))}
          </div>
        </section>
      </main>
    </>
  );
}
