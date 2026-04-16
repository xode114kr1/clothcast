"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import type { FormEvent } from "react";
import { useState } from "react";
import { AlertTriangle, ArrowRight, Lock, Mail } from "lucide-react";

import { fetchApiJson } from "@/lib/api/client";

export function LoginForm() {
  const router = useRouter();
  const [errorMessage, setErrorMessage] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const errorId = "login-error-message";
  const hasError = Boolean(errorMessage);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    if (isSubmitting) {
      return;
    }

    setErrorMessage("");
    setIsSubmitting(true);

    const formData = new FormData(event.currentTarget);

    try {
      await fetchApiJson("/api/v1/auth/login", {
        method: "POST",
        body: {
          email: formData.get("email"),
          password: formData.get("password"),
        },
      }, {
        fallbackMessage: "로그인 처리 중 오류가 발생했습니다.",
      });

      router.push("/");
      router.refresh();
    } catch (error) {
      setErrorMessage(
        error instanceof Error
          ? error.message
          : "네트워크 오류가 발생했습니다. 다시 시도해주세요.",
      );
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <>
      <form aria-busy={isSubmitting} className="space-y-6" onSubmit={handleSubmit}>
        <div className="space-y-2">
          <label
            className="ml-1 block text-sm font-semibold"
            htmlFor="email"
            style={{
              color: "#404753",
              fontFamily: "var(--font-body)",
            }}
          >
            이메일
          </label>
          <div className="relative">
            <span
              className="absolute left-4 top-1/2 -translate-y-1/2"
              style={{ color: "#707884" }}
            >
              <Mail className="h-5 w-5" strokeWidth={1.75} />
            </span>
            <input
              aria-describedby={hasError ? errorId : undefined}
              aria-invalid={hasError}
              autoComplete="email"
              className="w-full rounded-[var(--radius-md)] border-none py-4 pl-12 pr-4 transition-all outline-none placeholder:text-[rgb(112_120_132_/_0.5)] focus:ring-0"
              disabled={isSubmitting}
              id="email"
              name="email"
              placeholder="name@example.com"
              required
              style={{
                backgroundColor: "var(--surface-container-highest)",
                color: "#191c1d",
                boxShadow: "0 0 0 0 rgba(0, 96, 168, 0)",
              }}
              type="email"
            />
          </div>
        </div>

        <div className="space-y-2">
          <div className="flex items-center justify-between px-1">
            <label
              className="text-sm font-semibold"
              htmlFor="password"
              style={{
                color: "#404753",
                fontFamily: "var(--font-body)",
              }}
            >
              비밀번호
            </label>
            <Link
              className="text-xs font-bold transition-opacity hover:opacity-70"
              href="#"
              style={{ color: "var(--primary)" }}
            >
              비밀번호 찾기
            </Link>
          </div>
          <div className="relative">
            <span
              className="absolute left-4 top-1/2 -translate-y-1/2"
              style={{ color: "#707884" }}
            >
              <Lock className="h-5 w-5" strokeWidth={1.75} />
            </span>
            <input
              aria-describedby={hasError ? errorId : undefined}
              aria-invalid={hasError}
              autoComplete="current-password"
              className="w-full rounded-[var(--radius-md)] border-none py-4 pl-12 pr-4 transition-all outline-none placeholder:text-[rgb(112_120_132_/_0.5)] focus:ring-0"
              disabled={isSubmitting}
              id="password"
              name="password"
              placeholder="••••••••"
              required
              style={{
                backgroundColor: "var(--surface-container-highest)",
                color: "#191c1d",
                boxShadow: "0 0 0 0 rgba(0, 96, 168, 0)",
              }}
              type="password"
            />
          </div>
        </div>

        {hasError ? (
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
              className="h-5 w-5 shrink-0 text-[var(--error)]"
              strokeWidth={1.75}
            />
            <p className="text-sm font-medium">{errorMessage}</p>
          </div>
        ) : null}

        <div className="pt-2">
          <button
            className="flex w-full items-center justify-center gap-3 rounded-full px-8 py-4 text-lg font-bold text-white shadow-lg transition-all hover:scale-[1.02] hover:shadow-xl active:scale-95 disabled:cursor-not-allowed disabled:opacity-70 disabled:active:scale-100"
            disabled={isSubmitting}
            style={{
              background: "var(--gradient-hero)",
              fontFamily: "var(--font-display)",
            }}
            type="submit"
          >
            <span aria-live="polite">
              {isSubmitting ? "로그인 중..." : "로그인"}
            </span>
            <ArrowRight className="h-6 w-6" strokeWidth={1.75} />
          </button>
        </div>
      </form>

      <div className="mt-10 text-center">
        <p className="text-sm text-[#404753]">
          아직 계정이 없나요?
          <Link
            className="ml-1 font-bold transition-opacity hover:opacity-70"
            href="/signup"
            style={{ color: "var(--primary)" }}
          >
            회원가입
          </Link>
        </p>
      </div>
    </>
  );
}
