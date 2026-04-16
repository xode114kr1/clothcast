"use client";

import type { FormEvent } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";

import { fetchApiJson } from "@/lib/api/client";
import { buildClothesPayload } from "@/lib/clothes/clothes-form-utils";
import { useClothesImageUpload } from "@/lib/clothes/use-clothes-image-upload";

import { ImagePicker } from "./image-picker";
import { WardrobeItemFormFields } from "./wardrobe-item-form-fields";

export function NewWardrobeItemForm() {
  const router = useRouter();
  const {
    handleFileChange,
    previewUrl,
    selectedFile,
    uploadSelectedImage,
  } = useClothesImageUpload();
  const [errorMessage, setErrorMessage] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const errorId = "new-wardrobe-item-error";

  async function createClothes(formData: FormData, imageUrl: string) {
    await fetchApiJson("/api/v1/clothes", {
      method: "POST",
      body: buildClothesPayload(formData, imageUrl),
    }, {
      fallbackMessage: "의류 등록 중 오류가 발생했습니다.",
    });
  }

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    if (isSubmitting) {
      return;
    }

    if (!selectedFile) {
      setErrorMessage("옷 사진을 선택해주세요.");
      return;
    }

    setErrorMessage("");
    setIsSubmitting(true);

    const formData = new FormData(event.currentTarget);

    try {
      const imageUrl = await uploadSelectedImage();

      if (!imageUrl) {
        throw new Error("옷 사진을 선택해주세요.");
      }

      await createClothes(formData, imageUrl);
      router.push("/wardrobe");
      router.refresh();
    } catch (error) {
      setErrorMessage(
        error instanceof Error
          ? error.message
          : "의류 등록 중 오류가 발생했습니다.",
      );
    } finally {
      setIsSubmitting(false);
    }
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
          alt="선택한 옷 사진 미리보기"
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
            {isSubmitting ? "저장 중..." : "Save to Wardrobe"}
          </button>
        </div>
      </div>
    </form>
  );
}
