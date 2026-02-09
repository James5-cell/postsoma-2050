"use client";

import Link from "next/link";
import Image from "next/image";
import { CATEGORY_ACCENTS } from "@/lib/design-tokens";

const TICKERS = [
  { symbol: "BTC", value: "$1,000,000", size: "sm" as const },
  { symbol: "ETH", value: "$12,888" },
] as const;

const ROCKET_IMAGE =
  "https://images.unsplash.com/photo-1516849841032-87cbac4d88f7?w=800&q=80";

export default function BlockchainCell() {
  const accent = CATEGORY_ACCENTS["Blockchain"];

  return (
    <Link
      href="/blockchain"
      className="group relative flex h-full min-h-[140px] flex-col justify-between overflow-hidden rounded border border-orange-500 shadow-[0_0_15px_rgba(249,115,22,0.3)] transition-[box-shadow] hover:shadow-[0_0_20px_rgba(249,115,22,0.4)] animate-bento-frame-breath"
    >
      <Image
        src={ROCKET_IMAGE}
        alt=""
        fill
        className="object-cover transition-transform duration-500 group-hover:scale-105"
        sizes="(max-width: 768px) 100vw, 400px"
      />
      {/* Strong orange-to-black gradient overlay so ticker text stays readable */}
      <div
        className="absolute inset-0 bg-gradient-to-t from-black/95 via-orange-900/75 to-black/85"
        aria-hidden
      />
      <div className="relative z-10 p-5">
        <span
          className="font-mono text-xs font-medium uppercase tracking-widest opacity-90"
          style={{ color: accent }}
        >
          ticker
        </span>
        <div className="mt-3 flex flex-col gap-2 font-mono">
          {TICKERS.map((t) => (
            <div
              key={t.symbol}
              className="flex items-baseline justify-between tabular-nums text-orange-500"
            >
              <span className="text-sm font-medium text-orange-400/90">
                {t.symbol}:
              </span>
              <span
                className={`font-bold tracking-tight text-orange-400 ${"size" in t && t.size === "sm"
                    ? "text-base sm:text-lg"
                    : "text-lg sm:text-xl"
                  }`}
              >
                {t.value}
              </span>
            </div>
          ))}
        </div>
      </div>
    </Link>
  );
}
