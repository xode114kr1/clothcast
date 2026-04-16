import { Shirt, Sparkles } from "lucide-react";

export function PlaceholderCards() {
  return (
    <>
      {[1, 2, 3, 4].map((item) => (
        <div
          key={item}
          className="flex flex-col rounded-[var(--radius-xl)] p-4 opacity-70"
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
    </>
  );
}

export function LoadingSummary() {
  return (
    <div
      aria-live="polite"
      className="flex min-h-96 flex-col items-center justify-center rounded-[var(--radius-xl)] p-10 text-center md:col-span-2"
      style={{ backgroundColor: "var(--surface-container-lowest)" }}
    >
      <div className="mb-5 flex h-16 w-16 items-center justify-center rounded-full bg-[rgb(211_228_255_/_0.45)] text-[var(--primary)]">
        <Sparkles className="h-8 w-8 animate-pulse" strokeWidth={1.8} />
      </div>
      <h3
        className="mb-3 text-2xl font-bold text-[#191c1d]"
        style={{ fontFamily: "var(--font-display)" }}
      >
        옷장과 날씨를 비교하는 중입니다
      </h3>
      <p className="max-w-md text-[#404753]">
        등록된 옷만 살펴보고 오늘의 일정에 맞는 조합을 고르고 있습니다.
      </p>
    </div>
  );
}

export function EmptyRecommendationState() {
  return (
    <div
      className="flex min-h-96 flex-col items-center justify-center rounded-[var(--radius-xl)] p-10 text-center md:col-span-2"
      style={{ backgroundColor: "var(--surface-container-lowest)" }}
    >
      <div className="mb-5 flex h-16 w-16 items-center justify-center rounded-full bg-[rgb(211_228_255_/_0.45)] text-[var(--primary)]">
        <Shirt className="h-8 w-8" strokeWidth={1.8} />
      </div>
      <h3
        className="mb-3 text-2xl font-bold text-[#191c1d]"
        style={{ fontFamily: "var(--font-display)" }}
      >
        오늘의 상황을 입력해주세요
      </h3>
      <p className="max-w-md text-[#404753]">
        옷장에 등록한 옷과 현재 날씨를 함께 보고 지금 입기 좋은 조합을
        정리합니다.
      </p>
    </div>
  );
}
