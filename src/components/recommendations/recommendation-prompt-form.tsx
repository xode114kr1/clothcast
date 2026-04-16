import type { FormEvent } from "react";
import { AlertTriangle, Sparkles } from "lucide-react";

type RecommendationPromptFormProps = {
  canSubmit: boolean;
  errorMessage: string | null;
  isSubmitting: boolean;
  onPromptChange: (prompt: string) => void;
  onSubmit: (event: FormEvent<HTMLFormElement>) => void;
  prompt: string;
};

export function RecommendationPromptForm({
  canSubmit,
  errorMessage,
  isSubmitting,
  onPromptChange,
  onSubmit,
  prompt,
}: RecommendationPromptFormProps) {
  return (
    <section className="mb-24">
      <form
        className="rounded-[var(--radius-xl)] p-10 lg:p-16"
        onSubmit={onSubmit}
        style={{ backgroundColor: "var(--surface-container-low)" }}
      >
        <label
          className="mb-6 block text-2xl font-bold text-[#191c1d]"
          htmlFor="recommendation-prompt"
          style={{ fontFamily: "var(--font-display)" }}
        >
          오늘 어떤 일정이 있나요?
        </label>
        <div className="flex flex-col gap-4 md:flex-row">
          <div className="relative flex-grow">
            <input
              className="w-full rounded-[var(--radius-md)] border-none px-8 py-5 text-lg text-[#191c1d] outline-none placeholder:text-[#707884] focus:bg-white"
              id="recommendation-prompt"
              maxLength={300}
              onChange={(event) => onPromptChange(event.target.value)}
              placeholder="예: 오늘 친구 만나러가"
              style={{ backgroundColor: "var(--surface-container-highest)" }}
              type="text"
              value={prompt}
            />
          </div>
          <button
            className="flex items-center justify-center gap-3 rounded-full px-10 py-5 font-bold text-white shadow-lg transition-all duration-150 enabled:active:scale-95 disabled:cursor-not-allowed disabled:opacity-55"
            disabled={!canSubmit}
            style={{
              backgroundColor: "var(--primary)",
              boxShadow: "0 20px 30px -15px rgb(0 96 168 / 0.2)",
            }}
            type="submit"
          >
            <span>{isSubmitting ? "추천 생성 중" : "추천받기"}</span>
            <Sparkles className="h-5 w-5" strokeWidth={2} />
          </button>
        </div>

        {errorMessage ? (
          <div
            className="mt-5 flex items-start gap-3 rounded-[var(--radius-md)] px-5 py-4"
            role="alert"
            style={{ backgroundColor: "rgb(255 218 214 / 0.32)" }}
          >
            <AlertTriangle
              className="mt-0.5 h-5 w-5 shrink-0 text-[#8c1d18]"
              strokeWidth={2}
            />
            <div>
              <p className="font-bold text-[#8c1d18]">
                추천을 만들지 못했습니다.
              </p>
              <p className="mt-1 text-sm font-medium text-[#8c1d18]">
                {errorMessage}
              </p>
            </div>
          </div>
        ) : null}
      </form>
    </section>
  );
}
