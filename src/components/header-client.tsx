"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useState } from "react";
import { Home, LogOut, Shirt, Sparkles, User } from "lucide-react";

const navItems = [
  { key: "home", label: "Home", href: "/", icon: Home },
  { key: "wardrobe", label: "Wardrobe", href: "/wardrobe", icon: Shirt },
  {
    key: "recommendations",
    label: "Recommendation",
    href: "/recommendations",
    icon: Sparkles,
  },
  { key: "profile", label: "Profile", href: "/profile", icon: User },
] as const;

type HeaderUser = {
  nickname: string;
  email: string;
};

type HeaderClientProps = {
  user: HeaderUser | null;
};

function getAvatarLabel(user: HeaderUser) {
  return user.nickname.trim().charAt(0).toUpperCase() || user.email.charAt(0).toUpperCase();
}

export function HeaderClient({ user }: HeaderClientProps) {
  const pathname = usePathname();
  const router = useRouter();
  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);
  const [isLoggingOut, setIsLoggingOut] = useState(false);

  const activeItem = navItems.find((item) => {
    if (item.href === "/") {
      return pathname === "/";
    }

    return pathname.startsWith(item.href);
  })?.key;

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
      setIsUserMenuOpen(false);
      setIsLoggingOut(false);
      router.push("/login");
      router.refresh();
    }
  }

  return (
    <header
      className="sticky top-0 z-50 w-full shadow-sm backdrop-blur-xl"
      style={{ backgroundColor: "rgb(255 255 255 / 0.7)" }}
    >
      <div
        className="mx-auto flex w-full max-w-7xl items-center justify-between px-8 py-4 tracking-tight"
        style={{ fontFamily: "var(--font-display)" }}
      >
        <Link className="text-2xl font-bold tracking-tighter text-blue-700" href="/">
          ClothCast
        </Link>

        <nav className="flex items-center gap-2 md:gap-3">
          {navItems.map((item) => {
            const isActive = item.key === activeItem;
            const Icon = item.icon;

            return (
              <Link
                key={item.key}
                aria-label={item.label}
                className={
                  isActive
                    ? "flex h-10 items-center gap-2 rounded-full bg-[rgb(211_228_255_/_0.45)] px-3 font-semibold text-blue-700 transition-colors md:px-4"
                    : "flex h-10 items-center gap-2 rounded-full px-3 font-semibold text-slate-500 transition-colors hover:bg-[rgb(211_228_255_/_0.2)] hover:text-blue-600 md:px-4"
                }
                href={item.href}
              >
                <Icon className="h-5 w-5 shrink-0" strokeWidth={2} />
                <span className="hidden lg:inline">{item.label}</span>
              </Link>
            );
          })}
        </nav>

        <div className="flex items-center">
          {user ? (
            <div className="relative">
              <button
                aria-expanded={isUserMenuOpen}
                aria-haspopup="menu"
                aria-label={`${user.nickname} 사용자 메뉴 열기`}
                className="flex h-10 w-10 items-center justify-center rounded-full text-sm font-bold text-white shadow-sm transition-opacity hover:opacity-90"
                onClick={() => setIsUserMenuOpen((current) => !current)}
                style={{ background: "var(--gradient-hero)" }}
                title={user.nickname}
                type="button"
              >
                {getAvatarLabel(user)}
              </button>

              {isUserMenuOpen ? (
                <div
                  className="absolute right-0 mt-3 w-48 rounded-[var(--radius-md)] p-2 shadow-[0_24px_60px_-24px_rgb(25_28_29_/_0.35)]"
                  role="menu"
                  style={{ backgroundColor: "var(--surface-container-lowest)" }}
                >
                  <Link
                    className="block rounded-[var(--radius-sm)] px-3 py-2 text-sm font-semibold text-[#404753] transition-colors hover:bg-[rgb(211_228_255_/_0.25)]"
                    href="/profile"
                    onClick={() => setIsUserMenuOpen(false)}
                    role="menuitem"
                  >
                    프로필
                  </Link>
                  <button
                    className="flex w-full items-center gap-2 rounded-[var(--radius-sm)] px-3 py-2 text-left text-sm font-semibold text-[#404753] transition-colors hover:bg-[rgb(211_228_255_/_0.25)] disabled:cursor-not-allowed disabled:opacity-70"
                    disabled={isLoggingOut}
                    onClick={handleLogout}
                    role="menuitem"
                    type="button"
                  >
                    <LogOut className="h-4 w-4" strokeWidth={1.75} />
                    {isLoggingOut ? "로그아웃 중..." : "로그아웃"}
                  </button>
                </div>
              ) : null}
            </div>
          ) : (
            <Link
              className="flex h-10 items-center rounded-full px-5 text-sm font-semibold text-white transition-opacity hover:opacity-90 active:scale-95"
              href="/login"
              style={{ background: "var(--gradient-hero)" }}
            >
              Login
            </Link>
          )}
        </div>
      </div>
    </header>
  );
}
