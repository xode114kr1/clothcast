import { NewWardrobeItemForm } from "@/components/wardrobe/new-wardrobe-item-form";

export default function NewWardrobeItemPage() {
  return (
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

        <NewWardrobeItemForm />
      </div>
    </main>
  );
}
