import { AlertTriangle } from "lucide-react";

import {
  clothingCategoryOptions,
  clothingFitOptions,
  type ClothesItem,
} from "@/lib/clothes/clothes-form-types";

type WardrobeItemFormFieldsProps = {
  disabled: boolean;
  errorId: string;
  errorMessage: string;
  item?: ClothesItem;
};

export function WardrobeItemFormFields({
  disabled,
  errorId,
  errorMessage,
  item,
}: WardrobeItemFormFieldsProps) {
  return (
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
          defaultValue={item?.name}
          disabled={disabled}
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
          {clothingCategoryOptions.map((category, index) => (
            <label key={category.value} className="cursor-pointer">
              <input
                className="peer hidden"
                defaultChecked={
                  item ? category.value === item.category : index === 0
                }
                disabled={disabled}
                name="category"
                type="radio"
                value={category.value}
              />
              <span className="block rounded-full bg-[var(--surface-container-low)] px-6 py-2 text-sm font-semibold transition-all peer-checked:bg-[var(--primary)] peer-checked:text-white">
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
            defaultValue={item?.color}
            disabled={disabled}
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
            defaultValue={item?.fit}
            disabled={disabled}
            id="fit"
            name="fit"
            required
            style={{ backgroundColor: "var(--surface-container-highest)" }}
          >
            {clothingFitOptions.map((fit) => (
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
            defaultValue={item ? String(item.formality) : "3"}
            disabled={disabled}
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
            defaultValue={item?.material ?? ""}
            disabled={disabled}
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
          defaultValue={item?.pattern ?? ""}
          disabled={disabled}
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
    </div>
  );
}
