import Link from "next/link";
import { Share2 } from "lucide-react";

export function Footer() {
  return (
    <footer
      className="mt-24 w-full py-12 text-sm tracking-wide"
      style={{
        backgroundColor: "var(--surface-container-low)",
        fontFamily: "var(--font-body)",
      }}
    >
      <div className="mx-auto flex max-w-7xl flex-col items-center justify-between px-8 py-12 md:flex-row">
        <div className="mb-8 text-center md:mb-0 md:text-left">
          <span
            className="mb-2 block text-xl font-bold"
            style={{
              color: "#0f172a",
              fontFamily: "var(--font-display)",
            }}
          >
            ClothCast Atelier
          </span>
          <p className="mt-2 text-slate-400">
            © 2024 ClothCast Atelier. 모든 권리 보유.
          </p>
        </div>
        <div className="flex gap-8">
          <Link className="text-slate-400 transition-colors hover:text-blue-500" href="#">
            개인정보
          </Link>
          <Link className="text-slate-400 transition-colors hover:text-blue-500" href="#">
            약관
          </Link>
          <Link className="text-slate-400 transition-colors hover:text-blue-500" href="#">
            고객지원
          </Link>
          <Link className="text-slate-400 transition-colors hover:text-blue-500" href="#">
            소개
          </Link>
        </div>

        <div className="mt-8 flex gap-4 md:mt-0">
          <button
            className="flex h-10 w-10 items-center justify-center rounded-full bg-slate-200 text-slate-600"
            type="button"
          >
            <Share2 className="h-4 w-4" strokeWidth={2} />
          </button>
        </div>
      </div>
    </footer>
  );
}
