"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import type { FormEvent } from "react";
import { useState } from "react";
import { AlertTriangle, ArrowRight, Lock, Mail, User } from "lucide-react";

import { fetchApiJson } from "@/lib/api/client";

export function SignupForm() {
  const router = useRouter();
  const [errorMessage, setErrorMessage] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const errorId = "signup-error-message";
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
      await fetchApiJson("/api/v1/auth/signup", {
        method: "POST",
        body: {
          nickname: formData.get("nickname"),
          email: formData.get("email"),
          password: formData.get("password"),
        },
      }, {
        fallbackMessage: "회원가입 처리 중 오류가 발생했습니다.",
      });

      router.push("/login");
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
      <form className="space-y-6" onSubmit={handleSubmit}>
        <div className="space-y-2">
          <label
            className="ml-1 block text-sm font-semibold"
            htmlFor="nickname"
            style={{
              color: "#404753",
              fontFamily: "var(--font-body)",
            }}
          >
            닉네임
          </label>
          <div className="relative">
            <span
              className="absolute left-4 top-1/2 -translate-y-1/2"
              style={{ color: "#707884" }}
            >
              <User className="h-5 w-5" strokeWidth={1.75} />
            </span>
            <input
              aria-describedby={hasError ? errorId : undefined}
              aria-invalid={hasError}
              autoComplete="nickname"
              className="w-full rounded-[var(--radius-md)] border-none py-4 pl-12 pr-4 transition-all outline-none placeholder:text-[rgb(112_120_132_/_0.5)] focus:ring-0"
              disabled={isSubmitting}
              id="nickname"
              name="nickname"
              placeholder="패션러버"
              required
              style={{
                backgroundColor: "var(--surface-container-highest)",
                color: "#191c1d",
                boxShadow: "0 0 0 0 rgba(0, 96, 168, 0)",
              }}
              type="text"
            />
          </div>
        </div>

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
          <label
            className="ml-1 block text-sm font-semibold"
            htmlFor="password"
            style={{
              color: "#404753",
              fontFamily: "var(--font-body)",
            }}
          >
            비밀번호
          </label>
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
              autoComplete="new-password"
              className="w-full rounded-[var(--radius-md)] border-none py-4 pl-12 pr-4 transition-all outline-none placeholder:text-[rgb(112_120_132_/_0.5)] focus:ring-0"
              disabled={isSubmitting}
              id="password"
              minLength={8}
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

        <p
          className="px-1 text-[11px] leading-relaxed"
          style={{ color: "var(--muted-foreground)" }}
        >
          회원가입하면 ClothCast의{" "}
          <Link
            className="font-semibold hover:underline"
            href="#"
            style={{ color: "var(--primary)" }}
          >
            서비스 이용약관
          </Link>{" "}
          및{" "}
          <Link
            className="font-semibold hover:underline"
            href="#"
            style={{ color: "var(--primary)" }}
          >
            개인정보 처리방침
          </Link>
          에 동의하게 됩니다.
        </p>

        <button
          className="flex w-full items-center justify-center gap-3 rounded-full px-8 py-4 text-lg font-bold text-white shadow-lg transition-all hover:scale-[1.02] hover:shadow-xl active:scale-95 disabled:cursor-not-allowed disabled:opacity-70 disabled:active:scale-100"
          disabled={isSubmitting}
          style={{
            background: "var(--gradient-hero)",
            fontFamily: "var(--font-display)",
          }}
          type="submit"
        >
          {isSubmitting ? "가입 중..." : "회원가입"}
          <ArrowRight className="h-6 w-6" strokeWidth={1.75} />
        </button>
      </form>

      <div className="mt-10 text-center">
        <p className="text-sm text-[#404753]">
          이미 계정이 있나요?
          <Link
            className="ml-1 font-bold transition-opacity hover:opacity-70"
            href="/login"
            style={{ color: "var(--primary)" }}
          >
            로그인
          </Link>
        </p>
      </div>
    </>
  );
}
