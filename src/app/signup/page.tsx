import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import {
  ArrowForwardIcon,
  LockIcon,
  MailIcon,
  PersonIcon,
} from "@/components/icons";

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
                alt="ClothCast logo"
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
              Create your account
            </h2>
            <p
              className="mt-2 text-sm"
              style={{ color: "var(--muted-foreground)" }}
            >
              Join the community of digital fashion curators.
            </p>
          </div>

          <form action="#" className="space-y-6">
            <div className="space-y-2">
              <label
                className="ml-1 block text-xs font-bold uppercase tracking-[0.05em] text-[var(--muted-foreground)]"
                htmlFor="nickname"
              >
                Nickname
              </label>
              <div className="group relative">
                <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-5 text-[color:var(--muted-foreground)] transition-colors group-focus-within:text-[var(--primary)]">
                  <PersonIcon className="h-5 w-5" />
                </div>
                <input
                  className="w-full rounded-[var(--radius-md)] border-none py-4 pl-12 pr-4 outline-none transition-all duration-300"
                  id="nickname"
                  placeholder="FashionEnthusiast"
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
                Email Address
              </label>
              <div className="group relative">
                <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-5 text-[color:var(--muted-foreground)] transition-colors group-focus-within:text-[var(--primary)]">
                  <MailIcon className="h-5 w-5" />
                </div>
                <input
                  className="w-full rounded-[var(--radius-md)] border-none py-4 pl-12 pr-4 outline-none transition-all duration-300"
                  id="email"
                  placeholder="name@atelier.com"
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
                Password
              </label>
              <div className="group relative">
                <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-5 text-[color:var(--muted-foreground)] transition-colors group-focus-within:text-[var(--primary)]">
                  <LockIcon className="h-5 w-5" />
                </div>
                <input
                  className="w-full rounded-[var(--radius-md)] border-none py-4 pl-12 pr-4 outline-none transition-all duration-300"
                  id="password"
                  placeholder="••••••••"
                  style={{
                    backgroundColor: "var(--surface-container-highest)",
                    color: "var(--foreground)",
                  }}
                  type="password"
                />
              </div>
            </div>

            <p
              className="px-1 text-[11px] leading-relaxed"
              style={{ color: "var(--muted-foreground)" }}
            >
              By signing up, you agree to our{" "}
              <Link
                className="font-semibold hover:underline"
                href="#"
                style={{ color: "var(--primary)" }}
              >
                Terms of Service
              </Link>{" "}
              and{" "}
              <Link
                className="font-semibold hover:underline"
                href="#"
                style={{ color: "var(--primary)" }}
              >
                Privacy Policy
              </Link>
              .
            </p>

            <button
              className="group mt-4 flex w-full items-center justify-center gap-2 rounded-full px-8 py-4 font-bold text-white transition-all duration-150 hover:opacity-90 active:scale-[0.98]"
              style={{
                background: "var(--gradient-hero)",
                boxShadow: "0 24px 40px -20px rgb(0 96 168 / 0.35)",
              }}
              type="submit"
            >
              Sign up
              <span className="transition-transform group-hover:translate-x-1">
                <ArrowForwardIcon className="h-5 w-5" />
              </span>
            </button>
          </form>

          <div className="mt-10 pt-8 text-center">
            <p className="text-sm" style={{ color: "var(--muted-foreground)" }}>
              Already have an account?
              <Link
                className="ml-1 font-bold transition-colors"
                href="#"
                style={{ color: "var(--primary)" }}
              >
                Login
              </Link>
            </p>
          </div>

          <div className="pointer-events-none absolute -bottom-12 -right-12 h-32 w-32 rounded-full bg-[rgb(0_96_168_/_0.05)] blur-3xl" />
        </div>
      </main>
    </div>
  );
}
