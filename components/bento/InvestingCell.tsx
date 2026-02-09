"use client";

import Link from "next/link";

const CANDLES = [
  { top: 4, body: 12, bottom: 6, green: true },
  { top: 8, body: 14, bottom: 4, green: false },
  { top: 2, body: 8, bottom: 8, green: true },
  { top: 10, body: 16, bottom: 2, green: false },
  { top: 4, body: 10, bottom: 4, green: true },
] as const;

export default function InvestingCell() {
  return (
    <Link
      href="/investing"
      className="group relative flex h-full min-h-[140px] flex-col justify-between rounded border border-red-500 bg-neutral-900 p-4 shadow-[0_0_15px_rgba(239,68,68,0.3)] transition-[box-shadow] hover:shadow-[0_0_20px_rgba(239,68,68,0.4)] sm:p-5 animate-bento-frame-breath"
    >
      <span className="font-mono text-xs font-medium uppercase tracking-widest text-red-400/90">
        Market Sentiment
      </span>
      <h2 className="mt-1 font-mono text-lg font-semibold tracking-tight text-text-primary sm:text-xl">
        Investing
      </h2>

      {/* CSS-only candlestick chart: top wick, body, bottom wick */}
      <div className="mt-3 flex flex-1 items-end justify-between gap-0.5">
        {CANDLES.map((c, i) => (
          <div
            key={i}
            className="flex flex-1 flex-col items-center justify-end"
            style={{ minHeight: 44 }}
          >
            <div
              className={`w-0.5 flex-shrink-0 ${c.green ? "bg-emerald-400/70" : "bg-red-400/70"}`}
              style={{ height: c.top, minHeight: 2 }}
            />
            <div
              className={`w-full max-w-[14px] rounded-sm ${c.green ? "bg-emerald-500" : "bg-red-500"}`}
              style={{ height: c.body, minHeight: 8 }}
            />
            <div
              className={`w-0.5 flex-shrink-0 ${c.green ? "bg-emerald-400/70" : "bg-red-400/70"}`}
              style={{ height: c.bottom, minHeight: 2 }}
            />
          </div>
        ))}
      </div>

      <p className="mt-2 font-mono text-xs font-medium text-amber-400/90">
        FOMO LEVEL: EXTREME
      </p>
      <p className="min-w-0 truncate font-mono text-[10px] text-text-secondary/80 sm:text-xs">
        Compound Interest: LOADING...
      </p>
    </Link>
  );
}
