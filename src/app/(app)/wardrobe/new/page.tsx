import Image from "next/image";
import {
  CirclePlus,
  ImageUp,
} from "lucide-react";

const categories = ["상의", "아우터", "하의", "신발"] as const;
const palette = [
  { name: "블랙", color: "#0f172a", active: false },
  { name: "라이트 그레이", color: "#e2e8f0", active: false },
  { name: "블루", color: "#2563eb", active: true },
  { name: "브라운", color: "#92400e", active: false },
];

const styleTags = [
  { label: "캐주얼", active: true },
  { label: "포멀", active: false },
  { label: "스포티", active: false },
];

export default function NewWardrobeItemPage() {
  return (
    <>
      <main className="min-h-screen px-6 pb-24 pt-12">
        <div className="mx-auto max-w-4xl">
          <div className="mb-12">
            <span className="text-[0.6875rem] font-bold uppercase tracking-[0.05em] text-[var(--primary)]">
              Digital Atelier
            </span>
            <h1
              className="mt-2 text-4xl font-extrabold tracking-tight text-[var(--foreground)] md:text-5xl"
              style={{ fontFamily: "var(--font-display)" }}
            >
              New Addition
            </h1>
            <p className="mt-4 max-w-lg text-[#404753]">
              내 옷장에 아이템을 추가하면 더 정확한 코디 추천을 받을 수 있습니다.
            </p>
          </div>

          <div className="grid grid-cols-1 items-start gap-12 lg:grid-cols-12">
            <div className="space-y-6 lg:col-span-5">
              <div
                className="group relative flex aspect-[3/4] cursor-pointer flex-col items-center justify-center overflow-hidden rounded-[var(--radius-xl)] border-2 border-dashed transition-all"
                style={{
                  backgroundColor: "var(--surface-container-low)",
                  borderColor: "rgba(191, 199, 213, 1)",
                }}
              >
                <div className="space-y-4 p-8 text-center">
                  <div
                    className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full transition-transform duration-300 group-hover:scale-110"
                    style={{ backgroundColor: "var(--primary-fixed)" }}
                  >
                    <ImageUp className="h-8 w-8 text-[var(--primary)]" strokeWidth={2} />
                  </div>
                  <h3
                    className="font-bold text-[var(--foreground)]"
                    style={{ fontFamily: "var(--font-display)" }}
                  >
                    옷 사진 추가
                  </h3>
                  <p className="text-sm text-[#404753]">
                    고화질 이미지를 여기에 끌어오거나{" "}
                    <span className="font-bold text-[var(--primary)]">
                      파일을 선택하세요
                    </span>
                  </p>
                  <p className="text-[10px] font-bold uppercase tracking-wider text-[#707884]">
                    PNG, JPG 최대 10MB
                  </p>
                </div>

                <div className="pointer-events-none absolute inset-0 opacity-5">
                  <Image
                    alt="옷 업로드 예시 이미지"
                    className="h-full w-full object-cover"
                    fill
                    src="/images/add-clothing-ghost.svg"
                  />
                </div>
              </div>
            </div>

            <div
              className="rounded-[var(--radius-xl)] border p-8 lg:col-span-7 lg:p-10"
              style={{
                backgroundColor: "var(--surface-container-lowest)",
                borderColor: "rgb(191 199 213 / 0.1)",
                boxShadow: "var(--shadow-ambient-sm)",
              }}
            >
              <form className="space-y-8">
                <div className="space-y-2">
                  <label className="text-[0.6875rem] font-bold uppercase tracking-[0.05em] text-[#404753]">
                    옷 이름
                  </label>
                  <input
                    className="w-full rounded-[var(--radius-md)] border-none px-6 py-4 font-medium text-[var(--foreground)] outline-none transition-all placeholder:text-[#707884]"
                    placeholder="예: 이탈리안 린넨 블레이저"
                    style={{ backgroundColor: "var(--surface-container-highest)" }}
                    type="text"
                  />
                </div>

                <div className="space-y-3">
                  <label className="text-[0.6875rem] font-bold uppercase tracking-[0.05em] text-[#404753]">
                    카테고리
                  </label>
                  <div className="flex flex-wrap gap-3">
                    {categories.map((category, index) => (
                      <label key={category} className="cursor-pointer">
                        <input
                          className="peer hidden"
                          defaultChecked={index === 0}
                          name="category"
                          type="radio"
                        />
                        <div className="rounded-full border border-[#bfc7d5] px-6 py-2 text-sm font-semibold transition-all peer-checked:border-[var(--primary)] peer-checked:bg-[var(--primary)] peer-checked:text-white">
                          {category}
                        </div>
                      </label>
                    ))}
                  </div>
                </div>

                <div className="space-y-3">
                  <label className="text-[0.6875rem] font-bold uppercase tracking-[0.05em] text-[#404753]">
                    대표 색상
                  </label>
                  <div className="flex gap-4">
                    {palette.map((item) => (
                      <button
                        key={item.name}
                        className={`h-10 w-10 rounded-full border-2 border-white transition-all ${
                          item.active
                            ? "ring-2 ring-[var(--primary)]"
                            : "ring-2 ring-transparent focus:ring-[var(--primary)]"
                        }`}
                        style={{ backgroundColor: item.color }}
                        type="button"
                      />
                    ))}
                    <button
                      className="flex h-10 w-10 items-center justify-center rounded-full border border-[#bfc7d5] bg-white ring-2 ring-transparent transition-all focus:ring-[var(--primary)]"
                      type="button"
                    >
                      <CirclePlus className="h-4 w-4 text-[#404753]" strokeWidth={2} />
                    </button>
                  </div>
                </div>

                <div className="grid grid-cols-1 gap-8 md:grid-cols-2">
                  <div className="space-y-3">
                    <label className="text-[0.6875rem] font-bold uppercase tracking-[0.05em] text-[#404753]">
                      계절
                    </label>
                    <select
                      className="w-full appearance-none rounded-[var(--radius-md)] border-none px-4 py-4 font-medium text-[var(--foreground)] outline-none transition-all"
                      style={{ backgroundColor: "var(--surface-container-highest)" }}
                    >
                      <option>봄</option>
                      <option>여름</option>
                      <option>가을</option>
                      <option>겨울</option>
                    </select>
                  </div>

                  <div className="space-y-3">
                    <label className="text-[0.6875rem] font-bold uppercase tracking-[0.05em] text-[#404753]">
                      스타일 태그
                    </label>
                    <div className="flex flex-wrap gap-2">
                      {styleTags.map((tag) => (
                        <span
                          key={tag.label}
                          className={`cursor-pointer rounded-full px-3 py-1 text-xs font-bold transition-colors ${
                            tag.active
                              ? "bg-[var(--primary-fixed)] text-[var(--on-primary-fixed-variant,#004880)]"
                              : "text-[#404753] hover:bg-[var(--primary-fixed)]"
                          }`}
                          style={
                            tag.active
                              ? undefined
                              : { backgroundColor: "var(--surface-container-high)" }
                          }
                        >
                          {tag.label}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>

                <div className="flex items-center justify-end gap-4 pt-8">
                  <button
                    className="rounded-full px-11 py-4 text-sm font-bold text-[var(--primary)] transition-all hover:bg-[rgb(211_228_255_/_0.3)]"
                    type="button"
                  >
                    취소
                  </button>
                  <button
                    className="rounded-full px-11 py-4 text-sm font-bold text-white shadow-lg transition-all hover:scale-105 active:scale-95"
                    style={{
                      background: "linear-gradient(135deg, var(--primary) 0%, var(--primary-container) 100%)",
                      boxShadow: "0 20px 30px -15px rgb(0 96 168 / 0.2)",
                    }}
                    type="submit"
                  >
                    Save to Wardrobe
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      </main>
    </>
  );
}
