"use client";

import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";
import { Home, Shirt, Sparkles, User } from "lucide-react";

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

const mockUser = {
  name: "Alex",
  avatarUrl:
    "https://lh3.googleusercontent.com/aida-public/AB6AXuCTnHQAJ8kxre13OPfnOgscWrd9qgaJupjzEvvverdzUdf38c8KbMfNPbMZVY1VjNDejzXDnsIR-hAHeAjjPcZNTWylqHS8TBLbRK4oxT3bi-jgzNewhAof9fe11vcmFuNs_LVY7c8LhFONoZJq1wWejRWy6RbAL2O_nNBfUCr062ncRaB6eBQzW78mngBUM2GnzpIaq7j40rNPaEC3xYNVf2-LR7s8rs6mPMWaU2cHUxr2m4qS-umHX4NHqJVTu7yl5hJHvyuz1Ns",
};

export function Header() {
  const pathname = usePathname();
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  const activeItem = navItems.find((item) => {
    if (item.href === "/") {
      return pathname === "/";
    }

    return pathname.startsWith(item.href);
  })?.key;

  const handleMockLogin = () => {
    setIsLoggedIn(true);
  };

  return (
    <header
      className="sticky top-0 z-50 w-full shadow-sm backdrop-blur-xl"
      style={{ backgroundColor: "rgb(255 255 255 / 0.7)" }}
    >
      <div
        className="mx-auto flex w-full max-w-7xl items-center justify-between px-8 py-4 tracking-tight"
        style={{ fontFamily: "var(--font-display)" }}
      >
        <div className="text-2xl font-bold tracking-tighter text-blue-700">
          ClothCast
        </div>

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
          {isLoggedIn ? (
            <div
              className="h-10 w-10 overflow-hidden rounded-full"
              style={{ backgroundColor: "var(--surface-container-high)" }}
            >
              <Image
                alt={`${mockUser.name} 프로필 아바타`}
                className="h-full w-full object-cover"
                height={40}
                src={mockUser.avatarUrl}
                width={40}
              />
            </div>
          ) : (
            <button
              className="h-10 rounded-full px-5 text-sm font-semibold text-white transition-opacity hover:opacity-90 active:scale-95"
              onClick={handleMockLogin}
              style={{ background: "var(--gradient-hero)" }}
              type="button"
            >
              Login
            </button>
          )}
        </div>
      </div>
    </header>
  );
}
