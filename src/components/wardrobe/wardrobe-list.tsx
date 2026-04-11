"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { Pencil, Trash2 } from "lucide-react";

type ClothesItem = {
  id: number;
  name: string;
  category: "TOP" | "BOTTOM" | "OUTER" | "SHOES";
  color: string;
  fit: "oversized" | "regular" | "slim";
  formality: number;
  material: string | null;
  pattern: string | null;
  imageUrl: string;
  createdAt?: string;
};

type ClothesListResponse = {
  status: "success" | "error";
  message: string;
  data?: ClothesItem[] | { code?: string };
};

const categoryLabels: Record<ClothesItem["category"], string> = {
  TOP: "상의",
  BOTTOM: "하의",
  OUTER: "아우터",
  SHOES: "신발",
};

const fitLabels: Record<ClothesItem["fit"], string> = {
  oversized: "오버사이즈",
  regular: "레귤러",
  slim: "슬림",
};

// 알 수 없는 API 응답에서 사용자에게 보여줄 메시지를 추출한다.
function getResponseMessage(data: unknown) {
  if (
    typeof data === "object" &&
    data !== null &&
    "message" in data &&
    typeof data.message === "string"
  ) {
    return data.message;
  }

  return "옷장 데이터를 처리하는 중 오류가 발생했습니다.";
}

// GET /api/v1/clothes 응답의 data가 의류 배열인지 확인한다.
function isClothesList(value: unknown): value is ClothesItem[] {
  return Array.isArray(value);
}

export function WardrobeList() {
  const [items, setItems] = useState<ClothesItem[]>([]);
  const [errorMessage, setErrorMessage] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const [deletingId, setDeletingId] = useState<number | null>(null);

  // 옷장 진입 시 로그인 사용자의 의류 목록을 불러온다.
  useEffect(() => {
    let ignore = false;

    async function loadClothes() {
      setIsLoading(true);
      setErrorMessage("");

      try {
        const response = await fetch("/api/v1/clothes", {
          method: "GET",
        });
        const data = (await response.json().catch(() => null)) as ClothesListResponse | null;

        if (!response.ok || data?.status !== "success" || !isClothesList(data.data)) {
          if (!ignore) {
            setErrorMessage(getResponseMessage(data));
          }
          return;
        }

        if (!ignore) {
          setItems(data.data);
        }
      } catch {
        if (!ignore) {
          setErrorMessage("네트워크 오류가 발생했습니다. 다시 시도해주세요.");
        }
      } finally {
        if (!ignore) {
          setIsLoading(false);
        }
      }
    }

    void loadClothes();

    return () => {
      ignore = true;
    };
  }, []);

  // 삭제 버튼 클릭 시 확인 후 API를 호출하고 성공한 항목을 화면에서 제거한다.
  async function handleDelete(item: ClothesItem) {
    if (deletingId) {
      return;
    }

    const confirmed = window.confirm(`${item.name}을(를) 옷장에서 삭제할까요?`);

    if (!confirmed) {
      return;
    }

    setDeletingId(item.id);
    setErrorMessage("");

    try {
      const response = await fetch(`/api/v1/clothes/${item.id}`, {
        method: "DELETE",
      });
      const data = await response.json().catch(() => null);

      if (!response.ok) {
        setErrorMessage(getResponseMessage(data));
        return;
      }

      setItems((currentItems) =>
        currentItems.filter((currentItem) => currentItem.id !== item.id),
      );
    } catch {
      setErrorMessage("네트워크 오류가 발생했습니다. 다시 시도해주세요.");
    } finally {
      setDeletingId(null);
    }
  }

  if (isLoading) {
    return (
      <section
        aria-busy="true"
        className="rounded-[var(--radius-xl)] px-8 py-16 text-center"
        style={{ backgroundColor: "var(--surface-container-low)" }}
      >
        <p className="font-semibold text-[#404753]">옷장을 불러오는 중입니다.</p>
      </section>
    );
  }

  if (errorMessage) {
    return (
      <section
        className="rounded-[var(--radius-xl)] px-8 py-16 text-center"
        style={{ backgroundColor: "rgb(255 218 214 / 0.32)" }}
      >
        <p className="font-semibold text-[#8c1d18]">{errorMessage}</p>
        <Link
          className="mt-6 inline-flex rounded-full px-8 py-3 text-sm font-bold text-white"
          href="/login"
          style={{ background: "var(--gradient-hero)" }}
        >
          로그인하기
        </Link>
      </section>
    );
  }

  if (items.length === 0) {
    return (
      <section
        className="rounded-[var(--radius-xl)] px-8 py-16 text-center"
        style={{ backgroundColor: "var(--surface-container-low)" }}
      >
        <p className="text-2xl font-extrabold text-[var(--foreground)]">
          아직 등록된 옷이 없습니다.
        </p>
        <p className="mx-auto mt-3 max-w-md text-[#404753]">
          자주 입는 옷부터 추가하면 추천 결과가 바로 현실적인 조합으로 바뀝니다.
        </p>
        <Link
          className="mt-8 inline-flex rounded-full px-10 py-4 text-sm font-bold text-white"
          href="/wardrobe/new"
          style={{ background: "var(--gradient-hero)" }}
        >
          첫 옷 등록하기
        </Link>
      </section>
    );
  }

  return (
    <div className="grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
      {items.map((item) => (
        <article
          key={item.id}
          className="group relative flex flex-col overflow-hidden rounded-[var(--radius-xl)] transition-all duration-500 hover:-translate-y-2 hover:shadow-2xl"
          style={{
            backgroundColor: "var(--surface-container-lowest)",
            boxShadow: "var(--shadow-ambient-sm)",
          }}
        >
          <div className="relative aspect-[3/4] overflow-hidden">
            <Image
              alt={`${item.name} 이미지`}
              className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-110"
              fill
              src={item.imageUrl}
              unoptimized
            />

            <div className="absolute left-4 top-4 flex flex-wrap gap-2">
              <span className="rounded-full bg-[rgb(255_255_255_/_0.9)] px-3 py-1 text-[10px] font-bold uppercase tracking-wider text-[var(--primary)] shadow-sm backdrop-blur">
                {categoryLabels[item.category]}
              </span>
            </div>

            <div className="absolute right-4 top-4 flex translate-y-4 gap-2 opacity-0 transition-all duration-300 group-hover:translate-y-0 group-hover:opacity-100">
              <Link
                className="rounded-full bg-[rgb(255_255_255_/_0.9)] p-2 text-[var(--foreground)] shadow-sm backdrop-blur transition-colors hover:text-[var(--primary)]"
                href={`/wardrobe/${item.id}/edit`}
                title="의류 수정"
              >
                <Pencil className="h-4 w-4" strokeWidth={2} />
              </Link>
              <button
                className="rounded-full bg-[rgb(255_255_255_/_0.9)] p-2 text-[var(--error,#ba1a1a)] shadow-sm backdrop-blur transition-transform hover:scale-110 disabled:cursor-not-allowed disabled:opacity-60 disabled:hover:scale-100"
                disabled={deletingId === item.id}
                onClick={() => handleDelete(item)}
                title="의류 삭제"
                type="button"
              >
                <Trash2 className="h-4 w-4" strokeWidth={2} />
              </button>
            </div>
          </div>

          <div className="flex flex-1 flex-col space-y-4 p-8">
            <div>
              <h3 className="text-xl font-bold tracking-tight text-[var(--foreground)]">
                {item.name}
              </h3>
              <p className="mt-1 text-sm font-semibold text-[#404753]">
                {item.color}
              </p>
            </div>
            <div className="flex flex-wrap gap-2">
              <span
                className="rounded-full px-3 py-1 text-xs font-medium text-[#404753]"
                style={{ backgroundColor: "var(--surface-container-low)" }}
              >
                {fitLabels[item.fit]}
              </span>
              <span
                className="rounded-full px-3 py-1 text-xs font-medium text-[#404753]"
                style={{ backgroundColor: "var(--surface-container-low)" }}
              >
                포멀 {item.formality}
              </span>
              {item.material ? (
                <span
                  className="rounded-full px-3 py-1 text-xs font-medium text-[#404753]"
                  style={{ backgroundColor: "var(--surface-container-low)" }}
                >
                  {item.material}
                </span>
              ) : null}
              {item.pattern ? (
                <span
                  className="rounded-full px-3 py-1 text-xs font-medium text-[#404753]"
                  style={{ backgroundColor: "var(--surface-container-low)" }}
                >
                  {item.pattern}
                </span>
              ) : null}
            </div>
          </div>
        </article>
      ))}
    </div>
  );
}
