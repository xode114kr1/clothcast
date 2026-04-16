"use client";

import type { FormEvent } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

import {
  type ApiResponse,
  buildClothesPayload,
  getClothesItem,
  getResponseMessage,
} from "./clothes-form-utils";
import { ImagePicker } from "./image-picker";
import { useClothesImageUpload } from "./use-clothes-image-upload";
import { WardrobeItemFormFields } from "./wardrobe-item-form-fields";
import type { ClothesItem } from "./wardrobe-item-form-types";

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
        const response = await fetch(`/api/v1/clothes/${clothesId}`);
        const data = (await response.json().catch(() => null)) as ApiResponse | null;

        if (!response.ok || data?.status !== "success") {
          if (!ignore) {
            setErrorMessage(getResponseMessage(data));
          }
          return;
        }

        const clothes = getClothesItem(data);

        if (!clothes) {
          if (!ignore) {
            setErrorMessage("의류 상세 응답이 올바르지 않습니다.");
          }
          return;
        }

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
    const response = await fetch(`/api/v1/clothes/${clothesId}`, {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(buildClothesPayload(formData, imageUrl)),
    });
    const data = (await response.json().catch(() => null)) as ApiResponse | null;

    if (!response.ok || data?.status !== "success") {
      throw new Error(
        getResponseMessage(data, "의류 수정 중 오류가 발생했습니다."),
      );
    }
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
        className="rounded-[var(--radius-xl)] border p-8 lg:col-span-7 lg:p-10"
        style={{
          backgroundColor: "var(--surface-container-lowest)",
          borderColor: "rgb(191 199 213 / 0.1)",
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
