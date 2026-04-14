"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { LogOut, Shirt, Sparkles } from "lucide-react";
import { useState } from "react";

export function ProfileActions() {
  const router = useRouter();
  const [isLoggingOut, setIsLoggingOut] = useState(false);

  async function handleLogout() {
    if (isLoggingOut) {
      return;
    }

    setIsLoggingOut(true);

    try {
      await fetch("/api/v1/auth/logout", {
        method: "POST",
      });
    } finally {
      setIsLoggingOut(false);
      router.push("/login");
      router.refresh();
    }
  }

  return (
    <div className="flex flex-col gap-3 sm:flex-row">
      <Link className="theme-button-primary" href="/wardrobe">
        <Shirt className="h-5 w-5" strokeWidth={2.2} />
        옷장 관리
      </Link>
      <Link className="theme-button-secondary" href="/recommendations">
        <Sparkles className="h-5 w-5" strokeWidth={2.2} />
        추천 받기
      </Link>
      <button
        className="inline-flex min-h-14 items-center justify-center gap-2 rounded-full bg-[rgb(255_255_255_/_0.55)] px-11 py-4 font-bold text-[#8c1d18] transition-opacity hover:opacity-80 disabled:cursor-not-allowed disabled:opacity-60"
        disabled={isLoggingOut}
        onClick={handleLogout}
        type="button"
      >
        <LogOut className="h-5 w-5" strokeWidth={2.2} />
        {isLoggingOut ? "로그아웃 중" : "로그아웃"}
      </button>
    </div>
  );
}
