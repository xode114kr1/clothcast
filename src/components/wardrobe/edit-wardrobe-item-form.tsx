"use client";

import type { FormEvent } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

import { fetchApiData, fetchApiJson } from "@/lib/api/client";
import { buildClothesPayload, isClothesItem } from "@/lib/clothes/clothes-form-utils";
import type { ClothesItem } from "@/lib/clothes/clothes-form-types";
import { useClothesImageUpload } from "@/lib/clothes/use-clothes-image-upload";

import { ImagePicker } from "./image-picker";
import { WardrobeItemFormFields } from "./wardrobe-item-form-fields";

type EditWardrobeItemFormProps = {
  clothesId: string;
};

export function EditWardrobeItemForm({ clothesId }: EditWardrobeItemFormProps) {
  const router = useRouter();
  const {
    handleFileChange,
    previewUrl,
    uploadSelectedImage,
  } = useClothesImageUpload();
  const [item, setItem] = useState<ClothesItem | null>(null);
  const [errorMessage, setErrorMessage] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const errorId = "edit-wardrobe-item-error";

  useEffect(() => {
    let ignore = false;

    async function loadClothes() {
      setIsLoading(true);
      setErrorMessage("");

      try {
        const clothes = await fetchApiData<ClothesItem>(
          `/api/v1/clothes/${clothesId}`,
          {
            method: "GET",
          },
          {
            fallbackMessage: "의류 정보를 처리하는 중 오류가 발생했습니다.",
            invalidDataMessage: "의류 상세 응답이 올바르지 않습니다.",
            validateData: isClothesItem,
          },
        );

        if (!ignore) {
          setItem(clothes);
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
  }, [clothesId]);

  async function updateClothes(formData: FormData, imageUrl: string) {
    await fetchApiJson(`/api/v1/clothes/${clothesId}`, {
      method: "PATCH",
      body: buildClothesPayload(formData, imageUrl),
    }, {
      fallbackMessage: "의류 수정 중 오류가 발생했습니다.",
    });
  }

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    if (isSubmitting || !item) {
      return;
    }

    setErrorMessage("");
    setIsSubmitting(true);

    const formData = new FormData(event.currentTarget);

    try {
      const uploadedImageUrl = await uploadSelectedImage();
      await updateClothes(formData, uploadedImageUrl ?? item.imageUrl);
      router.push("/wardrobe");
      router.refresh();
    } catch (error) {
      setErrorMessage(
        error instanceof Error
          ? error.message
          : "의류 수정 중 오류가 발생했습니다.",
      );
    } finally {
      setIsSubmitting(false);
    }
  }

  if (isLoading) {
    return (
      <section
        aria-busy="true"
        className="rounded-[var(--radius-xl)] px-8 py-16 text-center"
        style={{ backgroundColor: "var(--surface-container-low)" }}
      >
        <p className="font-semibold text-[#404753]">의류 정보를 불러오는 중입니다.</p>
      </section>
    );
  }

  if (!item) {
    return (
      <section
        className="rounded-[var(--radius-xl)] px-8 py-16 text-center"
        style={{ backgroundColor: "rgb(255 218 214 / 0.32)" }}
      >
        <p className="font-semibold text-[#8c1d18]">
          {errorMessage || "의류 정보를 찾을 수 없습니다."}
        </p>
        <Link
          className="mt-6 inline-flex rounded-full px-8 py-3 text-sm font-bold text-white"
          href="/wardrobe"
          style={{ background: "var(--gradient-hero)" }}
        >
          옷장으로 돌아가기
        </Link>
      </section>
    );
  }

  return (
    <form
      aria-busy={isSubmitting}
      aria-describedby={errorMessage ? errorId : undefined}
      className="grid grid-cols-1 items-start gap-12 lg:grid-cols-12"
      onSubmit={handleSubmit}
    >
      <div className="space-y-6 lg:col-span-5">
        <ImagePicker
          alt={`${item.name} 이미지`}
          currentImageUrl={item.imageUrl}
          disabled={isSubmitting}
          onFileChange={(event) => {
            handleFileChange(event);
            setErrorMessage("");
          }}
          previewUrl={previewUrl}
        />
      </div>

      <div
        className="rounded-[var(--radius-xl)] p-8 lg:col-span-7 lg:p-10"
        style={{
          backgroundColor: "var(--surface-container-lowest)",
          boxShadow: "var(--shadow-ambient-sm)",
        }}
      >
        <WardrobeItemFormFields
          disabled={isSubmitting}
          errorId={errorId}
          errorMessage={errorMessage}
          item={item}
        />

        <div className="flex items-center justify-end gap-4 pt-8">
          <Link
            className="rounded-full px-11 py-4 text-sm font-bold text-[var(--primary)] transition-all hover:bg-[rgb(211_228_255_/_0.3)]"
            href="/wardrobe"
          >
            취소
          </Link>
          <button
            className="rounded-full px-11 py-4 text-sm font-bold text-white shadow-lg transition-all hover:scale-105 active:scale-95 disabled:cursor-not-allowed disabled:opacity-70 disabled:hover:scale-100"
            disabled={isSubmitting}
            style={{
              background:
                "linear-gradient(135deg, var(--primary) 0%, var(--primary-container) 100%)",
              boxShadow: "0 20px 30px -15px rgb(0 96 168 / 0.2)",
            }}
            type="submit"
          >
            {isSubmitting ? "저장 중..." : "Save Changes"}
          </button>
        </div>
      </div>
    </form>
  );
}
