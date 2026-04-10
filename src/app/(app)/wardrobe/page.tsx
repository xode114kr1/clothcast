import Image from "next/image";
import Link from "next/link";
import { Plus, Pencil, Trash2 } from "lucide-react";

const wardrobeItems = [
  {
    title: "실크 셔츠",
    category: "상의",
    tags: ["포멀", "미니멀"],
    src: "/images/wardrobe-raw-silk-shirt.svg",
    alt: "실크 셔츠 예시 이미지",
  },
  {
    title: "네이비 캐시미어 코트",
    category: "아우터",
    tags: ["클래식", "겨울"],
    src: "/images/wardrobe-cashmere-overcoat.svg",
    alt: "네이비 캐시미어 코트 예시 이미지",
  },
  {
    title: "셀비지 데님",
    category: "하의",
    tags: ["캐주얼", "장인"],
    src: "/images/wardrobe-selvedge-denim.svg",
    alt: "셀비지 데님 예시 이미지",
  },
  {
    title: "메리노 울 스웨터",
    category: "상의",
    tags: ["모던", "기본템"],
    src: "/images/wardrobe-merino-sweater.svg",
    alt: "메리노 울 스웨터 예시 이미지",
  },
  {
    title: "레더 첼시 부츠",
    category: "신발",
    tags: ["저녁", "포멀"],
    src: "/images/wardrobe-chelsea-boots.svg",
    alt: "레더 첼시 부츠 예시 이미지",
  },
  {
    title: "린넨 트라우저",
    category: "하의",
    tags: ["여름", "편안함"],
    src: "/images/wardrobe-linen-trousers.svg",
    alt: "린넨 트라우저 예시 이미지",
  },
];

export default function WardrobePage() {
  return (
    <>
      <main className="mx-auto max-w-7xl px-8 py-12">
        <header className="mb-16 flex flex-col justify-between gap-6 md:flex-row md:items-end">
          <div className="space-y-2">
            <span className="text-xs font-bold uppercase tracking-widest text-[var(--primary)] opacity-70">
              Digital Atelier
            </span>
            <h1
              className="text-5xl font-extrabold tracking-tighter text-[var(--foreground)] md:text-6xl"
              style={{ fontFamily: "var(--font-display)" }}
            >
              My Wardrobe
            </h1>
            <p className="max-w-md text-lg leading-relaxed text-[#404753]">
              내가 가진 옷을 한눈에 보고, 오늘의 조합을 더 쉽게 찾을 수 있습니다.
            </p>
          </div>

          <Link
            className="flex items-center gap-3 rounded-full px-11 py-4 text-lg font-bold shadow-lg transition-all hover:scale-[1.02] hover:shadow-xl active:scale-95"
            href="/wardrobe/new"
            style={{
              backgroundColor: "var(--primary-container)",
              color: "var(--on-primary-container, #002c51)",
            }}
          >
            <Plus className="h-5 w-5" strokeWidth={2.4} />
            Add Clothing
          </Link>
        </header>

        <div className="grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {wardrobeItems.map((item) => (
            <article
              key={item.title}
              className="group relative flex flex-col overflow-hidden rounded-[var(--radius-xl)] transition-all duration-500 hover:-translate-y-2 hover:shadow-2xl"
              style={{
                backgroundColor: "var(--surface-container-lowest)",
                boxShadow: "var(--shadow-ambient-sm)",
              }}
            >
              <div className="relative aspect-[3/4] overflow-hidden">
                <Image
                  alt={item.alt}
                  className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-110"
                  height={960}
                  src={item.src}
                  width={720}
                />

                <div className="absolute left-4 top-4 flex flex-wrap gap-2">
                  <span className="rounded-full bg-[rgb(255_255_255_/_0.9)] px-3 py-1 text-[10px] font-bold uppercase tracking-wider text-[var(--primary)] shadow-sm backdrop-blur">
                    {item.category}
                  </span>
                </div>

                <div className="absolute right-4 top-4 flex translate-y-4 gap-2 opacity-0 transition-all duration-300 group-hover:translate-y-0 group-hover:opacity-100">
                  <button
                    className="rounded-full bg-[rgb(255_255_255_/_0.9)] p-2 text-[var(--foreground)] shadow-sm backdrop-blur transition-colors hover:text-[var(--primary)]"
                    type="button"
                  >
                    <Pencil className="h-4 w-4" strokeWidth={2} />
                  </button>
                  <button
                    className="rounded-full bg-[rgb(255_255_255_/_0.9)] p-2 text-[var(--error)] shadow-sm backdrop-blur transition-transform hover:scale-110"
                    type="button"
                  >
                    <Trash2 className="h-4 w-4" strokeWidth={2} />
                  </button>
                </div>
              </div>

              <div className="flex flex-1 flex-col space-y-4 p-8">
                <h3 className="text-xl font-bold tracking-tight text-[var(--foreground)]">
                  {item.title}
                </h3>
                <div className="flex flex-wrap gap-2">
                  {item.tags.map((tag) => (
                    <span
                      key={tag}
                      className="rounded-full px-3 py-1 text-xs font-medium text-[#404753]"
                      style={{ backgroundColor: "var(--surface-container-low)" }}
                    >
                      {tag}
                    </span>
                  ))}
                </div>
              </div>
            </article>
          ))}
        </div>
      </main>
    </>
  );
}
