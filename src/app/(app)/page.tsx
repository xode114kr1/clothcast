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
import { AppHeader } from "@/components/app-header";

const atelierChoices = [
  {
    title: "Merino Wool Overcoat",
    description: "Perfect for the 18°C breeze",
    src: "/images/home-overcoat.svg",
    alt: "Dummy overcoat placeholder image",
    featured: true,
  },
  {
    title: "Raw Silk Atelier Shirt",
    description: "Lightweight professional layering",
    src: "/images/home-shirt.svg",
    alt: "Dummy silk shirt placeholder image",
    featured: false,
  },
];

const valueProps = [
  {
    icon: Factory,
    title: "Precision Styling",
    description:
      "Algorithmically selected outfits that respect both your personal taste and environmental factors.",
    tone: "var(--primary-fixed)",
    color: "var(--primary)",
  },
  {
    icon: Sparkles,
    title: "Digital Mirror",
    description:
      "Visualize combinations before even stepping into your wardrobe. Save time, look better.",
    tone: "rgb(0 250 226 / 0.2)",
    color: "var(--secondary)",
  },
  {
    icon: Leaf,
    title: "Sustainable Choice",
    description:
      "Rediscover forgotten pieces in your closet. Shop your own wardrobe and reduce fashion waste.",
    tone: "rgb(115 255 111 / 0.2)",
    color: "var(--tertiary)",
  },
];

export default function Home() {
  return (
    <>
      <AppHeader active="home" />

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
            Hello, Alex!
          </h1>
          <p className="mt-2 text-lg font-light text-[#404753]">
            Your digital atelier is ready for today&apos;s forecast.
          </p>
        </header>

        <section
          className="ambient-shadow relative mb-24 overflow-hidden rounded-[var(--radius-xl)]"
          style={{ boxShadow: "var(--shadow-ambient-md)" }}
        >
          <div className="absolute inset-0 z-0">
            <Image
              alt="Dummy walk-in closet background"
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
              Based on weather and your schedule. Experience precision styling
              tailored to your daily rhythm.
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
                  Partly Cloudy
                </p>
                <p className="text-sm text-[#404753]">
                  Light breeze, ideal for layering.
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
                    <p className="font-bold text-[#191c1d]">Client Meeting</p>
                    <p className="text-sm text-[#404753]">
                      10:00 AM • Design Studio
                    </p>
                  </div>
                </div>
                <div className="flex items-start gap-4">
                  <div className="h-12 w-1.5 rounded-full bg-[var(--tertiary-container)]" />
                  <div>
                    <p className="font-bold text-[#191c1d]">Gallery Opening</p>
                    <p className="text-sm text-[#404753]">
                      07:00 PM • Soho District
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
                    The Atelier&apos;s Choice
                  </h3>
                </div>
                <Link
                  className="group flex items-center gap-2 font-bold text-[var(--primary)]"
                  href="/recommendations"
                >
                  View All
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
              We merge artisanal curation with hyper-precise data to ensure you
              never have a &apos;nothing to wear&apos; moment again.
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
