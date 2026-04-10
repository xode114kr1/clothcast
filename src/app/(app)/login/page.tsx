import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { AlertTriangle, ArrowRight, Lock, Mail } from "lucide-react";

export const metadata: Metadata = {
  title: "로그인 | ClothCast",
  description: "ClothCast 계정으로 로그인하세요.",
};

const socialProofUsers = [
  {
    alt: "User 1",
    src: "https://lh3.googleusercontent.com/aida-public/AB6AXuDeRJdKyocPpL1kS0SIp0tHGBqrZEB28SKIMX5yR_edu7RBd2QzDbBS_jDVsIgeHnssT1a6YtkPP4F0P1gIPu6z8nwU0KmYc4oACxCtBLKZkTCC479ZnbWPyO3kU2HTGE6rqt6N4NZpBgCn7IRn9qXK5OptGYqxVGbDclouv5P3BBrQa1RmXEJMWDtEyMUX-oFrOrlI-EZo_IHukeDAGy691NxBnUlFrWEUzNiSIQOnudK318jbYjsWsFa2XWjosNoe5UoPPRZJosY",
  },
  {
    alt: "User 2",
    src: "https://lh3.googleusercontent.com/aida-public/AB6AXuALB4-extGtH1gNjeFVZ-OhMi_VqonwxGHbi4Bpckzs58Woja1779dlKl694_0WQLFVolxdWAo9AGt3uUidMNb9LH4H9Fjur3T6vvSuQeWTL1Hjq75X14br91onyOVbcP0MDWFDRVRkiZuGX7NAqKJszncIdVdGHmnvyPeNHHiwTEUrxFqHx_QIBHWh94LRk017Tuu-0gHwE8WxOp6Q_49-7_-TPO0XTNyYBE17jcZ1xLG_B92ALcdJebSbACgQH8hpVdFoy3tRURM",
  },
  {
    alt: "User 3",
    src: "https://lh3.googleusercontent.com/aida-public/AB6AXuDosbx7FtKP595Xb-jo0xbuNaJ826ESr1RZVvXvxJ058HwyWtB90R6lM3SrqAPrscHq-nbczjFAPx3dn-d_EQD54dEkDROQmRW0ieDnsxgBU3_7jIx0TYRz6gEuV9pECekX2ihAxHt5FQv6k3y_ND3tZRzu0kPtZgz90SjAZAsV0-oy0gLV17bRepB2Kum0SL1EC2tsYDwH4J50OcYojur299F4oLYDWF_OzQn1jxGhwGCQ1Yr31mphw8GAsVSUrgghNQSqOp17VIc",
  },
];

export default function LoginPage() {
  return (
    <main className="relative flex min-h-screen items-center justify-center overflow-hidden p-6">
      <div className="pointer-events-none absolute right-[-10%] top-[-10%] h-[40rem] w-[40rem] rounded-full bg-[rgb(211_228_255_/_0.2)] blur-[120px]" />
      <div className="pointer-events-none absolute bottom-[-5%] left-[-5%] h-[30rem] w-[30rem] rounded-full bg-[rgb(125_220_255_/_0.1)] blur-[100px]" />

      <div className="z-10 w-full max-w-md">
        <div className="mb-12 flex flex-col items-center">
          <div
            className="mb-6 flex h-16 w-16 rotate-3 items-center justify-center overflow-hidden rounded-[1rem] text-white shadow-xl"
            style={{ background: "var(--gradient-hero)" }}
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
            className="text-4xl font-extrabold tracking-tighter"
            style={{
              color: "var(--primary)",
              fontFamily: "var(--font-display)",
            }}
          >
            ClothCast
          </h1>
          <p
            className="mt-2 text-[0.6875rem] uppercase tracking-[0.1em]"
            style={{
              color: "#404753",
              fontFamily: "var(--font-body)",
            }}
          >
            Digital Wardrobe Atelier
          </p>
        </div>

        <div
          className="rounded-[var(--radius-xl)] p-10 transition-all md:p-12"
          style={{
            backgroundColor: "rgba(255,255,255,0.92)",
            boxShadow: "0 30px 60px -5px rgba(25,28,29,0.06)",
            backdropFilter: "blur(20px)",
            WebkitBackdropFilter: "blur(20px)",
          }}
        >
          <h2
            className="mb-8 text-2xl font-bold"
            style={{
              color: "#191c1d",
              fontFamily: "var(--font-display)",
            }}
          >
            Welcome back
          </h2>

          <form className="space-y-6">
            <div className="space-y-2">
              <label
                className="ml-1 block text-sm font-semibold"
                htmlFor="email"
                style={{
                  color: "#404753",
                  fontFamily: "var(--font-body)",
                }}
              >
                Email Address
              </label>
              <div className="relative">
                <span
                  className="absolute left-4 top-1/2 -translate-y-1/2"
                  style={{ color: "#707884" }}
                >
                  <Mail className="h-5 w-5" strokeWidth={1.75} />
                </span>
                <input
                  className="w-full rounded-[var(--radius-md)] border-none py-4 pl-12 pr-4 transition-all outline-none placeholder:text-[rgb(112_120_132_/_0.5)] focus:ring-0"
                  id="email"
                  placeholder="name@example.com"
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
                  Password
                </label>
                <Link
                  className="text-xs font-bold transition-opacity hover:opacity-70"
                  href="#"
                  style={{ color: "var(--primary)" }}
                >
                  Forgot?
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
                  className="w-full rounded-[var(--radius-md)] border-none py-4 pl-12 pr-4 transition-all outline-none placeholder:text-[rgb(112_120_132_/_0.5)] focus:ring-0"
                  id="password"
                  placeholder="••••••••"
                  style={{
                    backgroundColor: "var(--surface-container-highest)",
                    color: "#191c1d",
                    boxShadow: "0 0 0 0 rgba(0, 96, 168, 0)",
                  }}
                  type="password"
                />
              </div>
            </div>

            <div
              className="hidden items-center gap-2 rounded-[1rem] border px-2 py-3"
              style={{
                backgroundColor: "rgb(255 218 214 / 0.3)",
                borderColor: "rgb(186 26 26 / 0.1)",
              }}
            >
              <AlertTriangle
                className="h-5 w-5 text-[var(--error)]"
                strokeWidth={1.75}
              />
              <p className="text-sm font-medium text-[var(--on-error-container)]">
                Invalid email or password. Please try again.
              </p>
            </div>

            <div className="pt-2">
              <button
                className="flex w-full items-center justify-center gap-3 rounded-full px-8 py-4 text-lg font-bold text-white shadow-lg transition-all hover:scale-[1.02] hover:shadow-xl active:scale-95"
                style={{
                  background: "var(--gradient-hero)",
                  fontFamily: "var(--font-display)",
                }}
                type="submit"
              >
                <span>Login</span>
                <ArrowRight className="h-6 w-6" strokeWidth={1.75} />
              </button>
            </div>
          </form>

          <div className="mt-10 text-center">
            <p className="text-sm text-[#404753]">
              Don&apos;t have an account?
              <Link
                className="ml-1 font-bold transition-opacity hover:opacity-70"
                href="/signup"
                style={{ color: "var(--primary)" }}
              >
                Sign up
              </Link>
            </p>
          </div>
        </div>

        <div className="mt-12 flex flex-col items-center">
          <div className="-space-x-3 mb-4 flex">
            {socialProofUsers.map((user) => (
              <Image
                key={user.alt}
                alt={user.alt}
                className="h-8 w-8 rounded-full border-2 object-cover"
                height={32}
                src={user.src}
                style={{ borderColor: "var(--surface)" }}
                width={32}
              />
            ))}
          </div>
          <p className="text-xs font-medium text-[#707884]">
            Joined by 10k+ style enthusiasts
          </p>
        </div>
      </div>
    </main>
  );
}
