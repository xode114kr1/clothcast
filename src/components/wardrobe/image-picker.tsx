import Image from "next/image";
import type { ChangeEvent } from "react";
import { ImageUp } from "lucide-react";

type ImagePickerProps = {
  alt: string;
  disabled: boolean;
  onFileChange: (event: ChangeEvent<HTMLInputElement>) => void;
  previewUrl: string;
  currentImageUrl?: string;
};

export function ImagePicker({
  alt,
  currentImageUrl,
  disabled,
  onFileChange,
  previewUrl,
}: ImagePickerProps) {
  const imageUrl = previewUrl || currentImageUrl;

  return (
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
        disabled={disabled}
        name="file"
        onChange={onFileChange}
        type="file"
      />

      {imageUrl ? (
        <>
          <Image
            alt={alt}
            className="h-full w-full object-cover"
            fill
            src={imageUrl}
            unoptimized
          />
          <div className="absolute inset-x-6 bottom-6 rounded-[var(--radius-md)] bg-[rgb(255_255_255_/_0.88)] px-4 py-3 text-center shadow-sm backdrop-blur">
            <div className="flex items-center justify-center gap-2 text-sm font-bold text-[var(--primary)]">
              <ImageUp className="h-4 w-4" strokeWidth={2} />
              사진 변경
            </div>
            <p className="mt-1 text-[10px] font-bold uppercase tracking-wider text-[#707884]">
              JPG, PNG, WEBP 최대 5MB
            </p>
          </div>
        </>
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
  );
}
