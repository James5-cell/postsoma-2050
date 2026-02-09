"use client";

import Link from "next/link";
import { CATEGORY_ACCENTS } from "@/lib/design-tokens";

const STATUS_ITEMS = (
  postCount: number
): Array<{ status: string; label: string; labelClass: string }> => [
    { status: "ONLINE", label: "Reasoning Core", labelClass: "text-text-primary" },
    { status: "SYNCING", label: "Vector Index", labelClass: "text-text-primary" },
    { status: "FAILED", label: "Turing Test", labelClass: "text-red-400/90" },
    { status: "OK", label: `Total Nodes: ${postCount}`, labelClass: "text-text-primary" },
  ];

const STATUS_TAG_CLASS: Record<string, string> = {
  ONLINE: "text-emerald-400",
  SYNCING: "text-amber-400",
  FAILED: "text-red-400",
};

type AIInsightsCellProps = { postCount?: number };

export default function AIInsightsCell({ postCount = 0 }: AIInsightsCellProps) {
  const accent = CATEGORY_ACCENTS["AI Insights"];
  const items = STATUS_ITEMS(postCount);

  return (
    <Link
      href="/ai-insights"
      className="bento-glitch group relative flex h-full min-h-[140px] flex-col justify-between rounded border border-cyan-400 bg-neutral-900 p-5 shadow-[0_0_15px_rgba(34,211,238,0.3)] transition-[box-shadow] hover:shadow-[0_0_20px_rgba(34,211,238,0.4)] animate-bento-frame-breath"
    >
      <span
        className="font-mono text-xs font-medium uppercase tracking-widest opacity-70"
        style={{ color: accent }}
      >
        system status
      </span>
      <ul className="mt-3 flex flex-1 flex-wrap flex-col justify-center gap-0 font-mono text-[10px] leading-6 sm:flex-nowrap sm:text-xs sm:leading-6 md:text-sm md:leading-7 lg:whitespace-nowrap">
        {items.map(({ status, label, labelClass }) => (
          <li
            key={label}
            className="flex min-w-0 flex-shrink items-center gap-2 font-mono sm:gap-3 lg:flex-nowrap"
          >
            <span
              className={`shrink-0 font-medium sm:w-[5.5rem] ${STATUS_TAG_CLASS[status]}`}
            >
              [{status}]
            </span>
            <span className={`min-w-0 truncate ${labelClass}`}>{label}</span>
          </li>
        ))}
      </ul>
    </Link>
  );
}
