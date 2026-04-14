"use client";

import type { ChangeEvent, FormEvent } from "react";
import { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { AlertTriangle, ImageUp } from "lucide-react";

type ApiResponse = {
  status: "success" | "error";
  message: string;
  data?: unknown;
};

type UploadResponseData = {
  imageUrl: string;
};

const categories = [
  { label: "상의", value: "TOP" },
  { label: "하의", value: "BOTTOM" },
  { label: "아우터", value: "OUTER" },
  { label: "신발", value: "SHOES" },
] as const;

const fits = [
  { label: "오버사이즈", value: "oversized" },
  { label: "레귤러", value: "regular" },
  { label: "슬림", value: "slim" },
] as const;

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

  return "의류 등록 중 오류가 발생했습니다.";
}

// 이미지 업로드 응답에 저장 가능한 imageUrl이 포함되어 있는지 확인한다.
function getUploadedImageUrl(data: ApiResponse | null) {
  const payload = data?.data as UploadResponseData | undefined;

  if (typeof payload?.imageUrl === "string") {
    return payload.imageUrl;
  }

  return null;
}

export function NewWardrobeItemForm() {
  const router = useRouter();
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const errorId = "new-wardrobe-item-error";

  // 선택한 로컬 이미지 파일을 미리보기 URL로 만들고 컴포넌트 정리 시 해제한다.
  useEffect(() => {
    if (!selectedFile) {
      setPreviewUrl("");
      return;
    }

    const nextPreviewUrl = URL.createObjectURL(selectedFile);
    setPreviewUrl(nextPreviewUrl);

    return () => {
      URL.revokeObjectURL(nextPreviewUrl);
    };
  }, [selectedFile]);

  // 파일 input 변경 시 이미지 파일을 저장하고 이전 에러를 지운다.
  function handleFileChange(event: ChangeEvent<HTMLInputElement>) {
    const file = event.target.files?.[0] ?? null;

    setSelectedFile(file);
    setErrorMessage("");
  }

  // 선택된 파일을 S3 업로드 API로 전송하고 imageUrl을 반환받는다.
  async function uploadImage(file: File) {
    const formData = new FormData();
    formData.append("file", file);

    const response = await fetch("/api/v1/uploads/clothes-image", {
      method: "POST",
      body: formData,
    });
    const data = (await response.json().catch(() => null)) as ApiResponse | null;

    if (!response.ok || data?.status !== "success") {
      throw new Error(getResponseMessage(data));
    }

    const imageUrl = getUploadedImageUrl(data);

    if (!imageUrl) {
      throw new Error("이미지 업로드 응답이 올바르지 않습니다.");
    }

    return imageUrl;
  }

  // 이미지 업로드 후 반환된 imageUrl과 폼 값을 조합해 의류 등록 API를 호출한다.
  async function createClothes(formData: FormData, imageUrl: string) {
    const response = await fetch("/api/v1/clothes", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        name: formData.get("name"),
        category: formData.get("category"),
        color: formData.get("color"),
        fit: formData.get("fit"),
        formality: Number(formData.get("formality")),
        material: formData.get("material"),
        pattern: formData.get("pattern"),
        imageUrl,
      }),
    });
    const data = (await response.json().catch(() => null)) as ApiResponse | null;

    if (!response.ok || data?.status !== "success") {
      throw new Error(getResponseMessage(data));
    }
  }

  // 등록 폼 제출 시 이미지 업로드와 의류 DB 저장을 순서대로 실행한다.
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
      const imageUrl = await uploadImage(selectedFile);
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
        <label
          className="group relative flex aspect-[3/4] cursor-pointer flex-col items-center justify-center overflow-hidden rounded-[var(--radius-xl)] border-2 border-dashed transition-all"
          style={{
            backgroundColor: "var(--surface-container-low)",
            borderColor: "rgba(191, 199, 213, 1)",
          }}
        >
          <input
            accept="image/jpeg,image/png,image/webp"
            className="sr-only"
            disabled={isSubmitting}
            name="file"
            onChange={handleFileChange}
            type="file"
          />

          {previewUrl ? (
            <Image
              alt="선택한 옷 사진 미리보기"
              className="h-full w-full object-cover"
              fill
              src={previewUrl}
              unoptimized
            />
          ) : (
            <>
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
                  옷 사진 추가
                </h3>
                <p className="text-sm text-[#404753]">
                  고화질 이미지를 여기에 끌어오거나{" "}
                  <span className="font-bold text-[var(--primary)]">
                    파일을 선택하세요
                  </span>
                </p>
                <p className="text-[10px] font-bold uppercase tracking-wider text-[#707884]">
                  JPG, PNG, WEBP 최대 5MB
                </p>
              </div>

              <div className="pointer-events-none absolute inset-0 opacity-5">
                <Image
                  alt="옷 업로드 예시 이미지"
                  className="h-full w-full object-cover"
                  fill
                  src="/images/add-clothing-ghost.svg"
                />
              </div>
            </>
          )}
        </label>
      </div>

      <div
        className="rounded-[var(--radius-xl)] border p-8 lg:col-span-7 lg:p-10"
        style={{
          backgroundColor: "var(--surface-container-lowest)",
          borderColor: "rgb(191 199 213 / 0.1)",
          boxShadow: "var(--shadow-ambient-sm)",
        }}
      >
        <div className="space-y-8">
          <div className="space-y-2">
            <label
              className="text-[0.6875rem] font-bold uppercase tracking-[0.05em] text-[#404753]"
              htmlFor="name"
            >
              옷 이름
            </label>
            <input
              className="w-full rounded-[var(--radius-md)] border-none px-6 py-4 font-medium text-[var(--foreground)] outline-none transition-all placeholder:text-[#707884]"
              disabled={isSubmitting}
              id="name"
              name="name"
              placeholder="예: 네이비 블레이저"
              required
              style={{ backgroundColor: "var(--surface-container-highest)" }}
              type="text"
            />
          </div>

          <div className="space-y-3">
            <span className="text-[0.6875rem] font-bold uppercase tracking-[0.05em] text-[#404753]">
              카테고리
            </span>
            <div className="flex flex-wrap gap-3">
              {categories.map((category, index) => (
                <label key={category.value} className="cursor-pointer">
                  <input
                    className="peer hidden"
                    defaultChecked={index === 0}
                    disabled={isSubmitting}
                    name="category"
                    type="radio"
                    value={category.value}
                  />
                  <span className="block rounded-full border border-[#bfc7d5] px-6 py-2 text-sm font-semibold transition-all peer-checked:border-[var(--primary)] peer-checked:bg-[var(--primary)] peer-checked:text-white">
                    {category.label}
                  </span>
                </label>
              ))}
            </div>
          </div>

          <div className="grid grid-cols-1 gap-8 md:grid-cols-2">
            <div className="space-y-2">
              <label
                className="text-[0.6875rem] font-bold uppercase tracking-[0.05em] text-[#404753]"
                htmlFor="color"
              >
                색상
              </label>
              <input
                className="w-full rounded-[var(--radius-md)] border-none px-6 py-4 font-medium text-[var(--foreground)] outline-none transition-all placeholder:text-[#707884]"
                disabled={isSubmitting}
                id="color"
                name="color"
                placeholder="예: NAVY 또는 네이비"
                required
                style={{ backgroundColor: "var(--surface-container-highest)" }}
                type="text"
              />
            </div>

            <div className="space-y-2">
              <label
                className="text-[0.6875rem] font-bold uppercase tracking-[0.05em] text-[#404753]"
                htmlFor="fit"
              >
                핏
              </label>
              <select
                className="w-full appearance-none rounded-[var(--radius-md)] border-none px-6 py-4 font-medium text-[var(--foreground)] outline-none transition-all"
                disabled={isSubmitting}
                id="fit"
                name="fit"
                required
                style={{ backgroundColor: "var(--surface-container-highest)" }}
              >
                {fits.map((fit) => (
                  <option key={fit.value} value={fit.value}>
                    {fit.label}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div className="grid grid-cols-1 gap-8 md:grid-cols-2">
            <div className="space-y-2">
              <label
                className="text-[0.6875rem] font-bold uppercase tracking-[0.05em] text-[#404753]"
                htmlFor="formality"
              >
                포멀함
              </label>
              <select
                className="w-full appearance-none rounded-[var(--radius-md)] border-none px-6 py-4 font-medium text-[var(--foreground)] outline-none transition-all"
                defaultValue="3"
                disabled={isSubmitting}
                id="formality"
                name="formality"
                required
                style={{ backgroundColor: "var(--surface-container-highest)" }}
              >
                <option value="1">1 아주 캐주얼</option>
                <option value="2">2 캐주얼</option>
                <option value="3">3 균형</option>
                <option value="4">4 단정함</option>
                <option value="5">5 포멀</option>
              </select>
            </div>

            <div className="space-y-2">
              <label
                className="text-[0.6875rem] font-bold uppercase tracking-[0.05em] text-[#404753]"
                htmlFor="material"
              >
                소재
              </label>
              <input
                className="w-full rounded-[var(--radius-md)] border-none px-6 py-4 font-medium text-[var(--foreground)] outline-none transition-all placeholder:text-[#707884]"
                disabled={isSubmitting}
                id="material"
                name="material"
                placeholder="예: 울, 코튼"
                style={{ backgroundColor: "var(--surface-container-highest)" }}
                type="text"
              />
            </div>
          </div>

          <div className="space-y-2">
            <label
              className="text-[0.6875rem] font-bold uppercase tracking-[0.05em] text-[#404753]"
              htmlFor="pattern"
            >
              패턴
            </label>
            <input
              className="w-full rounded-[var(--radius-md)] border-none px-6 py-4 font-medium text-[var(--foreground)] outline-none transition-all placeholder:text-[#707884]"
              disabled={isSubmitting}
              id="pattern"
              name="pattern"
              placeholder="예: 솔리드, 스트라이프"
              style={{ backgroundColor: "var(--surface-container-highest)" }}
              type="text"
            />
          </div>

          {errorMessage ? (
            <div
              className="flex items-center gap-2 rounded-[1rem] px-4 py-3"
              id={errorId}
              role="alert"
              style={{
                backgroundColor: "rgb(255 218 214 / 0.3)",
                color: "var(--on-error-container)",
              }}
            >
              <AlertTriangle
                className="h-5 w-5 shrink-0 text-[var(--error,#ba1a1a)]"
                strokeWidth={1.75}
              />
              <p className="text-sm font-medium">{errorMessage}</p>
            </div>
          ) : null}

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
      </div>
    </form>
  );
}
