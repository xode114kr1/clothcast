"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { FormEvent, useState } from "react";
import { AlertTriangle, ArrowRight, Lock, Mail, User } from "lucide-react";

type SignupApiResponse = {
  status: "success" | "error";
  message: string;
  data?: unknown;
};

function getResponseMessage(data: unknown) {
  if (
    typeof data === "object" &&
    data !== null &&
    "message" in data &&
    typeof data.message === "string"
  ) {
    return data.message;
  }

  return "회원가입 처리 중 오류가 발생했습니다.";
}

export function SignupForm() {
  const router = useRouter();
  const [errorMessage, setErrorMessage] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setErrorMessage("");
    setIsSubmitting(true);

    const formData = new FormData(event.currentTarget);

    try {
      const response = await fetch("/api/v1/auth/signup", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          nickname: formData.get("nickname"),
          email: formData.get("email"),
          password: formData.get("password"),
        }),
      });
      const data = (await response.json().catch(() => null)) as SignupApiResponse | null;

      if (!response.ok || data?.status !== "success") {
        setErrorMessage(getResponseMessage(data));
        return;
      }

      router.push("/login");
      router.refresh();
    } catch {
      setErrorMessage("네트워크 오류가 발생했습니다. 다시 시도해주세요.");
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <>
      <form className="space-y-6" onSubmit={handleSubmit}>
        <div className="space-y-2">
          <label
            className="ml-1 block text-xs font-bold uppercase tracking-[0.05em] text-[var(--muted-foreground)]"
            htmlFor="nickname"
          >
            닉네임
          </label>
          <div className="group relative">
            <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-5 text-[color:var(--muted-foreground)] transition-colors group-focus-within:text-[var(--primary)]">
              <User className="h-5 w-5" strokeWidth={1.75} />
            </div>
            <input
              autoComplete="nickname"
              className="w-full rounded-[var(--radius-md)] border-none py-4 pl-12 pr-4 outline-none transition-all duration-300"
              disabled={isSubmitting}
              id="nickname"
              name="nickname"
              placeholder="패션러버"
              required
              style={{
                backgroundColor: "var(--surface-container-highest)",
                color: "var(--foreground)",
              }}
              type="text"
            />
          </div>
        </div>

        <div className="space-y-2">
          <label
            className="ml-1 block text-xs font-bold uppercase tracking-[0.05em] text-[var(--muted-foreground)]"
            htmlFor="email"
          >
            이메일
          </label>
          <div className="group relative">
            <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-5 text-[color:var(--muted-foreground)] transition-colors group-focus-within:text-[var(--primary)]">
              <Mail className="h-5 w-5" strokeWidth={1.75} />
            </div>
            <input
              autoComplete="email"
              className="w-full rounded-[var(--radius-md)] border-none py-4 pl-12 pr-4 outline-none transition-all duration-300"
              disabled={isSubmitting}
              id="email"
              name="email"
              placeholder="name@example.com"
              required
              style={{
                backgroundColor: "var(--surface-container-highest)",
                color: "var(--foreground)",
              }}
              type="email"
            />
          </div>
        </div>

        <div className="space-y-2">
          <label
            className="ml-1 block text-xs font-bold uppercase tracking-[0.05em] text-[var(--muted-foreground)]"
            htmlFor="password"
          >
            비밀번호
          </label>
          <div className="group relative">
            <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-5 text-[color:var(--muted-foreground)] transition-colors group-focus-within:text-[var(--primary)]">
              <Lock className="h-5 w-5" strokeWidth={1.75} />
            </div>
            <input
              autoComplete="new-password"
              className="w-full rounded-[var(--radius-md)] border-none py-4 pl-12 pr-4 outline-none transition-all duration-300"
              disabled={isSubmitting}
              id="password"
              minLength={8}
              name="password"
              placeholder="••••••••"
              required
              style={{
                backgroundColor: "var(--surface-container-highest)",
                color: "var(--foreground)",
              }}
              type="password"
            />
          </div>
        </div>

        {errorMessage ? (
          <div
            className="flex items-center gap-2 rounded-[1rem] px-4 py-3"
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
          className="group mt-4 flex w-full items-center justify-center gap-2 rounded-full px-8 py-4 font-bold text-white transition-all duration-150 hover:opacity-90 active:scale-[0.98] disabled:cursor-not-allowed disabled:opacity-70 disabled:active:scale-100"
          disabled={isSubmitting}
          style={{
            background: "var(--gradient-hero)",
            boxShadow: "0 24px 40px -20px rgb(0 96 168 / 0.35)",
          }}
          type="submit"
        >
          {isSubmitting ? "가입 중..." : "회원가입"}
          <span className="transition-transform group-hover:translate-x-1">
            <ArrowRight className="h-5 w-5" strokeWidth={1.75} />
          </span>
        </button>
      </form>

      <div className="mt-10 pt-8 text-center">
        <p className="text-sm" style={{ color: "var(--muted-foreground)" }}>
          이미 계정이 있나요?
          <Link
            className="ml-1 font-bold transition-colors"
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
