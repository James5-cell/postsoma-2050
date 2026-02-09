"use client";

import Link from "next/link";

type SheshinCellProps = { postCount?: number };

const FILES = [
  { icon: "📄", name: "2026-02-08_AI_Ethics.md" },
  { icon: "📘", name: "Book_Thinking_Fast.note" },
  { icon: "🧠", name: "Idea_Entropy.log" },
  { icon: "📎", name: "Ref_No_Future.clip" },
] as const;

export default function SheshinCell({ postCount = 0 }: SheshinCellProps) {
  return (
    <Link
      href="/sheshin-notes"
      className="sheshin-scanline group relative flex h-full min-h-[100px] w-full flex-col justify-between overflow-hidden rounded border border-zinc-500/60 bg-zinc-900/50 p-4 transition-[box-shadow] sm:flex-row sm:items-center sm:gap-6 sm:p-5"
      style={{
        boxShadow: "0 0 20px -4px rgba(161,161,170,0.12)",
      }}
    >
      {/* Section label */}
      <span className="mb-2 shrink-0 font-mono text-xs font-medium uppercase tracking-widest text-zinc-500 sm:mb-0">
        Recent Memory Access
      </span>

      {/* Horizontal file list (ls -la style) */}
      <div className="flex flex-1 flex-wrap items-center gap-x-4 gap-y-1 font-mono text-xs text-zinc-400 sm:gap-x-6">
        {FILES.map(({ icon, name }) => (
          <span
            key={name}
            className="flex items-center gap-1.5 truncate text-zinc-400 transition-colors group-hover:text-zinc-300"
          >
            <span className="shrink-0 opacity-80" aria-hidden>
              {icon}
            </span>
            <span className="truncate">{name}</span>
          </span>
        ))}
      </div>

      {/* Storage metrics (right side) */}
      <div className="mt-3 flex shrink-0 flex-col items-end gap-1.5 sm:mt-0 sm:items-end">
        <span className="font-mono text-[10px] uppercase tracking-wider text-zinc-500">
          Total Nodes Synchronized: [ {postCount} ]
        </span>
        <div className="h-1 w-24 overflow-hidden rounded-full bg-zinc-700/80">
          <div
            className="h-full rounded-full bg-zinc-400/90"
            style={{ width: "70%" }}
            aria-hidden
          />
        </div>
      </div>
    </Link>
  );
}
