import type { Metadata } from "next";
import Image from "next/image";

import { SignupForm } from "@/components/auth/signup-form";

export const metadata: Metadata = {
  title: "회원가입 | ClothCast",
  description: "ClothCast 계정을 만들고 디지털 아틀리에를 시작하세요.",
};

export default function SignupPage() {
  return (
    <div
      className="flex min-h-screen flex-col"
      style={{ backgroundColor: "var(--surface)" }}
    >
      <div className="pointer-events-none fixed inset-0 z-0 overflow-hidden">
        <div className="absolute -right-[5%] -top-[10%] h-[60%] w-[60%] rounded-full bg-[rgb(211_228_255_/_0.2)] blur-[120px]" />
        <div className="absolute -bottom-[10%] -left-[5%] h-[50%] w-[50%] rounded-full bg-[rgb(125_220_255_/_0.1)] blur-[100px]" />
      </div>

      <main className="z-10 flex flex-grow items-center justify-center p-6">
        <div
          className="relative w-full max-w-[480px] overflow-hidden rounded-[var(--radius-xl)] border p-10 md:p-14"
          style={{
            backgroundColor: "var(--surface-container-lowest)",
            borderColor: "var(--outline-variant)",
            boxShadow: "var(--shadow-ambient-md)",
          }}
        >
          <div className="mb-12 flex flex-col items-center">
            <div className="mb-6 flex h-16 w-16 items-center justify-center overflow-hidden rounded-[1.25rem]">
              <Image
                alt="ClothCast 로고"
                className="h-full w-full object-cover"
                height={64}
                priority
                src="/images/Logo.png"
                width={64}
              />
            </div>
            <h1
              className="theme-heading text-center text-4xl font-extrabold tracking-tight"
              style={{ color: "var(--foreground)" }}
            >
              ClothCast
            </h1>
            <p
              className="mt-2 text-sm font-medium tracking-[0.08em]"
              style={{ color: "var(--muted-foreground)" }}
            >
              The Digital Atelier
            </p>
          </div>

          <div className="mb-10">
            <h2
              className="theme-heading text-[1.75rem] font-bold tracking-tight"
              style={{ color: "var(--foreground)" }}
            >
              계정 만들기
            </h2>
            <p
              className="mt-2 text-sm"
              style={{ color: "var(--muted-foreground)" }}
            >
              내 옷장에 맞춘 코디 추천을 시작하세요.
            </p>
          </div>

          <SignupForm />

          <div className="pointer-events-none absolute -bottom-12 -right-12 h-32 w-32 rounded-full bg-[rgb(0_96_168_/_0.05)] blur-3xl" />
        </div>
      </main>
    </div>
  );
}
