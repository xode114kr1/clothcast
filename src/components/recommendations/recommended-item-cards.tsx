import Image from "next/image";

import type { RecommendationResponseData } from "@/lib/recommendations/recommendation-types";

function getCategoryLabel(category: string) {
  const labels: Record<string, string> = {
    TOP: "상의",
    BOTTOM: "하의",
    OUTER: "아우터",
    SHOES: "신발",
  };

  return labels[category] ?? category;
}

export function RecommendedItemCards({
  recommendation,
}: {
  recommendation: RecommendationResponseData;
}) {
  return (
    <>
      {recommendation.recommendedItems.map((item) => (
        <div
          key={item.id}
          className="group rounded-[var(--radius-xl)] p-4 transition-all hover:bg-[rgb(211_228_255_/_0.2)]"
          style={{ backgroundColor: "var(--surface-container-lowest)" }}
        >
          <div
            className="mb-6 aspect-[3/4] overflow-hidden rounded-[var(--radius-md)]"
            style={{ backgroundColor: "var(--surface-container)" }}
          >
            <Image
              alt={item.name}
              className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
              height={800}
              src={item.imageUrl}
              width={600}
              unoptimized
            />
          </div>
          <div className="px-2 pb-2">
            <span className="mb-1 block text-[10px] font-bold uppercase tracking-[0.2em] text-[var(--primary)]">
              {getCategoryLabel(item.category)}
            </span>
            <h3
              className="text-xl font-bold text-[#191c1d]"
              style={{ fontFamily: "var(--font-display)" }}
            >
              {item.name}
            </h3>
          </div>
        </div>
      ))}
    </>
  );
}
