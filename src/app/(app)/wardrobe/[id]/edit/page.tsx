import { EditWardrobeItemForm } from "@/components/wardrobe/edit-wardrobe-item-form";

type EditWardrobeItemPageProps = {
  params: Promise<{
    id: string;
  }>;
};

export default async function EditWardrobeItemPage({
  params,
}: EditWardrobeItemPageProps) {
  const { id } = await params;

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
            Edit Clothing
          </h1>
          <p className="mt-4 max-w-lg text-[#404753]">
            옷 정보를 현재 상태에 맞게 조정하면 추천 결과도 더 정확해집니다.
          </p>
        </div>

        <EditWardrobeItemForm clothesId={id} />
      </div>
    </main>
  );
}
