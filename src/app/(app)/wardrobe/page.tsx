import Link from "next/link";
import { Plus } from "lucide-react";

import { WardrobeList } from "@/components/wardrobe/wardrobe-list";

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

        <WardrobeList />
      </main>
    </>
  );
}
