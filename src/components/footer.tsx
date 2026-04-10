import Link from "next/link";

export function Footer() {
  return (
    <footer className="z-10 py-8" style={{ backgroundColor: "var(--surface)" }}>
      <div className="mx-auto flex max-w-7xl flex-col items-center justify-between gap-4 px-8 md:flex-row">
        <span
          className="text-sm font-bold"
          style={{
            color: "var(--foreground)",
            fontFamily: "var(--font-display)",
          }}
        >
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
  );
}
