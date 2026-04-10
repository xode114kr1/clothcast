"use client";

import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Bell, Settings } from "lucide-react";

const navItems = [
  { key: "home", label: "Home", href: "/" },
  { key: "wardrobe", label: "Wardrobe", href: "/wardrobe" },
  { key: "recommendations", label: "Recommendations", href: "/recommendations" },
  { key: "profile", label: "Profile", href: "/profile" },
] as const;

export function Header() {
  const pathname = usePathname();

  const activeItem = navItems.find((item) => {
    if (item.href === "/") {
      return pathname === "/";
    }

    return pathname.startsWith(item.href);
  })?.key;

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

        <nav className="hidden items-center space-x-8 md:flex">
          {navItems.map((item) => {
            const isActive = item.key === activeItem;

            return (
              <Link
                key={item.key}
                className={
                  isActive
                    ? "border-b-2 border-blue-700 pb-1 font-bold text-blue-700"
                    : "text-slate-500 transition-colors hover:text-blue-600"
                }
                href={item.href}
              >
                {item.label}
              </Link>
            );
          })}
        </nav>

        <div className="flex items-center space-x-5">
          <button
            className="flex items-center text-[#404753] transition-all hover:opacity-80"
            type="button"
          >
            <Bell className="h-5 w-5" strokeWidth={1.9} />
          </button>
          <button
            className="flex items-center text-[#404753] transition-all hover:opacity-80"
            type="button"
          >
            <Settings className="h-5 w-5" strokeWidth={1.9} />
          </button>
          <div
            className="h-10 w-10 overflow-hidden rounded-full"
            style={{ backgroundColor: "var(--surface-container-high)" }}
          >
            <Image
              alt="User profile avatar"
              className="h-full w-full object-cover"
              height={40}
              src="https://lh3.googleusercontent.com/aida-public/AB6AXuCTnHQAJ8kxre13OPfnOgscWrd9qgaJupjzEvvverdzUdf38c8KbMfNPbMZVY1VjNDejzXDnsIR-hAHeAjjPcZNTWylqHS8TBLbRK4oxT3bi-jgzNewhAof9fe11vcmFuNs_LVY7c8LhFONoZJq1wWejRWy6RbAL2O_nNBfUCr062ncRaB6eBQzW78mngBUM2GnzpIaq7j40rNPaEC3xYNVf2-LR7s8rs6mPMWaU2cHUxr2m4qS-umHX4NHqJVTu7yl5hJHvyuz1Ns"
              width={40}
            />
          </div>
        </div>
      </div>
    </header>
  );
}
