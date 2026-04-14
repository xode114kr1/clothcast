import type { Metadata } from "next";
import Image from "next/image";

import { LoginForm } from "@/components/auth/login-form";

export const metadata: Metadata = {
  title: "로그인 | ClothCast",
  description: "ClothCast 계정으로 로그인하세요.",
};

const socialProofUsers = [
  {
    alt: "사용자 1",
    src: "https://lh3.googleusercontent.com/aida-public/AB6AXuDeRJdKyocPpL1kS0SIp0tHGBqrZEB28SKIMX5yR_edu7RBd2QzDbBS_jDVsIgeHnssT1a6YtkPP4F0P1gIPu6z8nwU0KmYc4oACxCtBLKZkTCC479ZnbWPyO3kU2HTGE6rqt6N4NZpBgCn7IRn9qXK5OptGYqxVGbDclouv5P3BBrQa1RmXEJMWDtEyMUX-oFrOrlI-EZo_IHukeDAGy691NxBnUlFrWEUzNiSIQOnudK318jbYjsWsFa2XWjosNoe5UoPPRZJosY",
  },
  {
    alt: "사용자 2",
    src: "https://lh3.googleusercontent.com/aida-public/AB6AXuALB4-extGtH1gNjeFVZ-OhMi_VqonwxGHbi4Bpckzs58Woja1779dlKl694_0WQLFVolxdWAo9AGt3uUidMNb9LH4H9Fjur3T6vvSuQeWTL1Hjq75X14br91onyOVbcP0MDWFDRVRkiZuGX7NAqKJszncIdVdGHmnvyPeNHHiwTEUrxFqHx_QIBHWh94LRk017Tuu-0gHwE8WxOp6Q_49-7_-TPO0XTNyYBE17jcZ1xLG_B92ALcdJebSbACgQH8hpVdFoy3tRURM",
  },
  {
    alt: "사용자 3",
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
              alt="ClothCast 로고"
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
            다시 오신 걸 환영해요
          </h2>

          <LoginForm />
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
            1만 명 이상의 스타일 애호가가 함께하고 있어요
          </p>
        </div>
      </div>
    </main>
  );
}
