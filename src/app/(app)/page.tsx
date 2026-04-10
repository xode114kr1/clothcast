import Image from "next/image";
import Link from "next/link";
import {
  ArrowRight,
  Cloud,
  Leaf,
  Sparkles,
  Factory,
  Heart,
} from "lucide-react";

const atelierChoices = [
  {
    title: "메리노 울 오버코트",
    description: "18도 바람에 알맞은 아우터",
    src: "/images/home-overcoat.svg",
    alt: "오버코트 예시 이미지",
    featured: true,
  },
  {
    title: "Raw Silk Atelier Shirt",
    description: "가볍고 단정한 레이어링",
    src: "/images/home-shirt.svg",
    alt: "실크 셔츠 예시 이미지",
    featured: false,
  },
];

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
    description:
      "옷장 앞에서 고민하기 전에 어울리는 조합을 먼저 확인하세요.",
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

export default function Home() {
  return (
    <>
      <main className="mx-auto max-w-7xl px-8 pb-24 pt-12">
        <header className="mb-16">
          <div
            className="mb-4 inline-block rounded-full px-4 py-1.5 text-xs font-bold tracking-widest"
            style={{
              backgroundColor: "var(--primary-fixed)",
              color: "var(--on-primary-fixed-variant, #004880)",
            }}
          >
            WELCOME BACK
          </div>
          <h1
            className="text-5xl font-extrabold tracking-tighter text-[#191c1d]"
            style={{ fontFamily: "var(--font-display)" }}
          >
            안녕하세요, Alex님!
          </h1>
          <p className="mt-2 text-lg font-light text-[#404753]">
            오늘의 forecast에 맞춰 Digital Atelier가 준비되었습니다.
          </p>
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
              Smart Outfit Recommendations
            </h2>
            <p className="mb-10 max-w-md text-xl text-[#404753]">
              현재 날씨와 오늘의 일정을 바탕으로 내 옷장 속 아이템을 조합합니다.
            </p>
            <div className="flex flex-wrap gap-4">
              <button
                className="rounded-full px-11 py-4 font-bold text-white transition-all active:scale-95 hover:opacity-90"
                style={{
                  background: "var(--gradient-hero)",
                  boxShadow: "var(--shadow-ambient-md)",
                }}
                type="button"
              >
                Get Recommendation
              </button>
              <button
                className="rounded-full border px-11 py-4 font-bold text-[var(--primary)] transition-all active:scale-95 hover:bg-[var(--surface-container-low)]"
                style={{
                  backgroundColor: "var(--surface-container-lowest)",
                  borderColor: "rgb(191 199 213 / 0.15)",
                }}
                type="button"
              >
                Manage Wardrobe
              </button>
            </div>
          </div>
        </section>

        <div className="grid grid-cols-1 gap-8 md:grid-cols-12">
          <div className="flex flex-col gap-8 md:col-span-4">
            <div
              className="flex aspect-square flex-col justify-between rounded-[var(--radius-xl)] p-8"
              style={{ backgroundColor: "var(--surface-container-low)" }}
            >
              <div>
                <span className="text-xs font-bold tracking-widest text-[#404753]">
                  LOCAL FORECAST
                </span>
                <div className="mt-6 flex items-center gap-4">
                  <Cloud className="h-16 w-16 text-[var(--primary)]" strokeWidth={1.6} />
                  <span
                    className="text-5xl font-bold"
                    style={{ fontFamily: "var(--font-display)" }}
                  >
                    18°C
                  </span>
                </div>
              </div>
              <div>
                <p className="text-lg font-semibold text-[#191c1d]">
                  구름 조금
                </p>
                <p className="text-sm text-[#404753]">
                  가벼운 바람이 불어 레이어링하기 좋습니다.
                </p>
              </div>
            </div>

            <div
              className="flex-grow rounded-[var(--radius-xl)] p-8"
              style={{
                backgroundColor: "var(--surface-container-lowest)",
                boxShadow: "var(--shadow-ambient-md)",
              }}
            >
              <span className="text-xs font-bold tracking-widest text-[#404753]">
                TODAY&apos;S SCHEDULE
              </span>
              <div className="mt-8 space-y-6">
                <div className="flex items-start gap-4">
                  <div className="h-12 w-1.5 rounded-full bg-[var(--primary)]" />
                  <div>
                    <p className="font-bold text-[#191c1d]">고객 미팅</p>
                    <p className="text-sm text-[#404753]">
                      오전 10:00 • 디자인 스튜디오
                    </p>
                  </div>
                </div>
                <div className="flex items-start gap-4">
                  <div className="h-12 w-1.5 rounded-full bg-[var(--tertiary-container)]" />
                  <div>
                    <p className="font-bold text-[#191c1d]">갤러리 오프닝</p>
                    <p className="text-sm text-[#404753]">
                      오후 7:00 • 소호 지구
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="md:col-span-8">
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
                    CURATED FOR YOU
                  </span>
                  <h3
                    className="mt-2 text-3xl font-bold"
                    style={{ fontFamily: "var(--font-display)" }}
                  >
                    Atelier&apos;s Choice
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

              <div className="flex gap-6 overflow-hidden">
                {atelierChoices.map((item) => (
                  <div
                    key={item.title}
                    className={`overflow-hidden rounded-[var(--radius-xl)] ${
                      item.featured
                        ? "w-80 flex-shrink-0 group"
                        : "origin-left scale-95 opacity-60"
                    }`}
                    style={{ backgroundColor: "var(--surface-container-low)" }}
                  >
                    <div className="relative h-96">
                      <Image
                        alt={item.alt}
                        className={`h-full w-full object-cover ${
                          item.featured
                            ? "transition-transform duration-700 group-hover:scale-105"
                            : ""
                        }`}
                        height={768}
                        src={item.src}
                        width={512}
                      />
                      {item.featured ? (
                        <div className="absolute right-4 top-4 rounded-full bg-[rgb(255_255_255_/_0.8)] p-2 backdrop-blur-md">
                          <Heart className="h-5 w-5 text-[var(--primary)]" strokeWidth={2} />
                        </div>
                      ) : null}
                    </div>
                    <div className="p-6">
                      <h4 className="text-xl font-bold text-[#191c1d]">
                        {item.title}
                      </h4>
                      <p className="mt-1 text-sm text-[#404753]">
                        {item.description}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
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
              세심한 큐레이션과 날씨 데이터를 결합해 매일의 코디 고민을 줄입니다.
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
                    <Icon className="h-8 w-8" strokeWidth={1.8} style={{ color: item.color }} />
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
    </>
  );
}
