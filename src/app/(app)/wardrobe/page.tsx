import Image from "next/image";
import Link from "next/link";
import { Plus, Pencil, Trash2 } from "lucide-react";
import { AppHeader } from "@/components/app-header";

const wardrobeItems = [
  {
    title: "Raw Silk Shirt",
    category: "TOP",
    tags: ["Formal", "Minimalist"],
    src: "/images/wardrobe-raw-silk-shirt.svg",
    alt: "Dummy raw silk shirt placeholder image",
    offset: "",
  },
  {
    title: "Navy Cashmere Overcoat",
    category: "OUTERWEAR",
    tags: ["Classic", "Winter"],
    src: "/images/wardrobe-cashmere-overcoat.svg",
    alt: "Dummy navy cashmere overcoat placeholder image",
    offset: "",
  },
  {
    title: "Selvedge Denim",
    category: "BOTTOM",
    tags: ["Casual", "Artisan"],
    src: "/images/wardrobe-selvedge-denim.svg",
    alt: "Dummy selvedge denim placeholder image",
    offset: "lg:translate-y-8",
  },
  {
    title: "Merino Wool Sweater",
    category: "TOP",
    tags: ["Modern", "Essentials"],
    src: "/images/wardrobe-merino-sweater.svg",
    alt: "Dummy merino wool sweater placeholder image",
    offset: "lg:translate-y-8",
  },
  {
    title: "Leather Chelsea Boots",
    category: "FOOTWEAR",
    tags: ["Evening", "Formal"],
    src: "/images/wardrobe-chelsea-boots.svg",
    alt: "Dummy leather chelsea boots placeholder image",
    offset: "xl:mt-4",
  },
  {
    title: "Linen Trousers",
    category: "BOTTOM",
    tags: ["Summer", "Relaxed"],
    src: "/images/wardrobe-linen-trousers.svg",
    alt: "Dummy linen trousers placeholder image",
    offset: "xl:mt-4",
  },
];

export default function WardrobePage() {
  return (
    <>
      <AppHeader active="wardrobe" />

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
              A curated collection of your finest pieces, organized for
              effortless style discovery.
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
              className={`group relative flex flex-col overflow-hidden rounded-[var(--radius-xl)] transition-all duration-500 hover:-translate-y-2 hover:shadow-2xl ${item.offset}`}
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
