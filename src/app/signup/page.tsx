import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";

export const metadata: Metadata = {
  title: "회원가입 | ClothCast",
  description: "ClothCast 계정을 만들고 디지털 아틀리에를 시작하세요.",
};

function IconPerson() {
  return (
    <svg aria-hidden="true" className="h-5 w-5" fill="none" viewBox="0 0 24 24">
      <path
        d="M12 12a4 4 0 1 0 0-8 4 4 0 0 0 0 8Zm-7 8a7 7 0 0 1 14 0"
        stroke="currentColor"
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth="1.5"
      />
    </svg>
  );
}

function IconMail() {
  return (
    <svg aria-hidden="true" className="h-5 w-5" fill="none" viewBox="0 0 24 24">
      <path
        d="M4 6.75h16v10.5H4z"
        stroke="currentColor"
        strokeLinejoin="round"
        strokeWidth="1.5"
      />
      <path
        d="m5 8 7 5 7-5"
        stroke="currentColor"
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth="1.5"
      />
    </svg>
  );
}

function IconLock() {
  return (
    <svg aria-hidden="true" className="h-5 w-5" fill="none" viewBox="0 0 24 24">
      <path
        d="M7.75 10.75V8.5a4.25 4.25 0 1 1 8.5 0v2.25"
        stroke="currentColor"
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth="1.5"
      />
      <rect
        height="8.5"
        rx="2"
        stroke="currentColor"
        strokeWidth="1.5"
        width="12.5"
        x="5.75"
        y="10.75"
      />
    </svg>
  );
}

function IconArrowForward() {
  return (
    <svg aria-hidden="true" className="h-5 w-5" fill="none" viewBox="0 0 24 24">
      <path
        d="M5 12h14m-5-5 5 5-5 5"
        stroke="currentColor"
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth="1.7"
      />
    </svg>
  );
}

export default function SignupPage() {
  return (
    <div className="flex min-h-screen flex-col" style={{ backgroundColor: "var(--surface)" }}>
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
            <div
              className="mb-6 flex h-16 w-16 items-center justify-center overflow-hidden rounded-[1.25rem]"
              style={{
                backgroundColor: "var(--surface-container-low)",
                boxShadow: "0 24px 40px -20px rgb(0 96 168 / 0.2)",
              }}
            >
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
            <p className="mt-2 text-sm" style={{ color: "var(--muted-foreground)" }}>
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
                  <IconPerson />
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
                  <IconMail />
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
                  <IconLock />
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

            <p className="px-1 text-[11px] leading-relaxed" style={{ color: "var(--muted-foreground)" }}>
              By signing up, you agree to our{" "}
              <Link className="font-semibold hover:underline" href="#" style={{ color: "var(--primary)" }}>
                Terms of Service
              </Link>{" "}
              and{" "}
              <Link className="font-semibold hover:underline" href="#" style={{ color: "var(--primary)" }}>
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
                <IconArrowForward />
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

      <footer className="z-10 py-8" style={{ backgroundColor: "var(--surface)" }}>
        <div className="mx-auto flex max-w-7xl flex-col items-center justify-between gap-4 px-8 md:flex-row">
          <span className="text-sm font-bold" style={{ color: "var(--foreground)", fontFamily: "var(--font-display)" }}>
            ClothCast Atelier
          </span>
          <p className="text-sm tracking-wide text-slate-400">
            © 2024 ClothCast Atelier. All rights reserved.
          </p>
          <div className="flex gap-6">
            <Link className="text-sm text-slate-400 transition-colors" href="#">
              Privacy
            </Link>
            <Link className="text-sm text-slate-400 transition-colors" href="#">
              Terms
            </Link>
          </div>
        </div>
      </footer>
    </div>
  );
}
