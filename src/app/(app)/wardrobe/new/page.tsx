import Image from "next/image";
import {
  CirclePlus,
  ImageUp,
} from "lucide-react";

const categories = ["TOP", "OUTER", "PANTS", "SHOES"] as const;
const palette = [
  { name: "Black", color: "#0f172a", active: false },
  { name: "Light Gray", color: "#e2e8f0", active: false },
  { name: "Blue", color: "#2563eb", active: true },
  { name: "Brown", color: "#92400e", active: false },
];

const styleTags = [
  { label: "Casual", active: true },
  { label: "Formal", active: false },
  { label: "Sporty", active: false },
];

export default function NewWardrobeItemPage() {
  return (
    <>
      <main className="min-h-screen px-6 pb-24 pt-12">
        <div className="mx-auto max-w-4xl">
          <div className="mb-12">
            <span className="text-[0.6875rem] font-bold uppercase tracking-[0.05em] text-[var(--primary)]">
              The Digital Atelier
            </span>
            <h1
              className="mt-2 text-4xl font-extrabold tracking-tight text-[var(--foreground)] md:text-5xl"
              style={{ fontFamily: "var(--font-display)" }}
            >
              New Addition
            </h1>
            <p className="mt-4 max-w-lg text-[#404753]">
              Curate your digital wardrobe with precision. Each item added
              enhances your personalized style forecast.
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
                    Capture the Detail
                  </h3>
                  <p className="text-sm text-[#404753]">
                    Drag high-resolution image here or{" "}
                    <span className="font-bold text-[var(--primary)]">
                      browse
                    </span>
                  </p>
                  <p className="text-[10px] font-bold uppercase tracking-wider text-[#707884]">
                    PNG, JPG up to 10MB
                  </p>
                </div>

                <div className="pointer-events-none absolute inset-0 opacity-5">
                  <Image
                    alt="Dummy clothing upload ghost"
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
                    Product Name
                  </label>
                  <input
                    className="w-full rounded-[var(--radius-md)] border-none px-6 py-4 font-medium text-[var(--foreground)] outline-none transition-all placeholder:text-[#707884]"
                    placeholder="e.g. Italian Linen Blazer"
                    style={{ backgroundColor: "var(--surface-container-highest)" }}
                    type="text"
                  />
                </div>

                <div className="space-y-3">
                  <label className="text-[0.6875rem] font-bold uppercase tracking-[0.05em] text-[#404753]">
                    Classification
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
                    Primary Palette
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
                      Seasonal Context
                    </label>
                    <select
                      className="w-full appearance-none rounded-[var(--radius-md)] border-none px-4 py-4 font-medium text-[var(--foreground)] outline-none transition-all"
                      style={{ backgroundColor: "var(--surface-container-highest)" }}
                    >
                      <option>SPRING</option>
                      <option>SUMMER</option>
                      <option>FALL</option>
                      <option>WINTER</option>
                    </select>
                  </div>

                  <div className="space-y-3">
                    <label className="text-[0.6875rem] font-bold uppercase tracking-[0.05em] text-[#404753]">
                      Style Tags
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
                    Cancel
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
