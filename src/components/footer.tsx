import Link from "next/link";

export function Footer() {
  return (
    <footer
      className="w-full border-t py-12 text-sm tracking-wide"
      style={{
        backgroundColor: "#f8fafc",
        borderColor: "#e2e8f0",
        fontFamily: "var(--font-body)",
      }}
    >
      <div className="mx-auto flex max-w-7xl flex-col items-center justify-between gap-8 px-8 md:flex-row md:items-start">
        <div className="text-center md:text-left">
          <span
            className="font-bold"
            style={{
              color: "#0f172a",
              fontFamily: "var(--font-display)",
            }}
          >
            ClothCast Atelier
          </span>
          <p className="mt-2 text-slate-400">
            © 2024 ClothCast Atelier. All rights reserved.
          </p>
        </div>
        <div className="flex flex-wrap justify-center gap-x-8 gap-y-3">
          <Link className="text-slate-400 transition-colors hover:text-blue-500" href="#">
            Privacy
          </Link>
          <Link className="text-slate-400 transition-colors hover:text-blue-500" href="#">
            Terms
          </Link>
          <Link className="text-slate-400 transition-colors hover:text-blue-500" href="#">
            Support
          </Link>
          <Link className="text-slate-400 transition-colors hover:text-blue-500" href="#">
            About
          </Link>
        </div>
      </div>
    </footer>
  );
}
