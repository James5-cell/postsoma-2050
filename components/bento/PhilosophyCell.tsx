"use client";

import Link from "next/link";
import { CATEGORY_ACCENTS } from "@/lib/design-tokens";

export default function PhilosophyCell() {
  const accent = CATEGORY_ACCENTS["Philosophy"];

  return (
    <Link
      href="/philosophy"
      className="group relative flex h-full min-h-[200px] flex-col justify-between overflow-hidden rounded border border-green-500 bg-green-900/10 p-4 shadow-[0_0_15px_rgba(34,197,94,0.3)] transition-[box-shadow] hover:shadow-[0_0_20px_rgba(34,197,94,0.4)] sm:p-5 animate-bento-frame-breath"
    >
      <span
        className="font-mono text-xs font-medium uppercase tracking-widest opacity-70"
        style={{ color: accent }}
      >
        terminal
      </span>
      <div className="mt-3 flex flex-1 items-center font-mono text-sm text-green-500 sm:text-base">
        <span>{" > "}</span>
        <span>Ecclesiastes 1:9 God Is Great.</span>
        <span
          className="ml-0.5 h-4 w-0.5 animate-blink bg-current sm:h-5"
          style={{ color: accent }}
          aria-hidden
        />
      </div>
    </Link>
  );
}
