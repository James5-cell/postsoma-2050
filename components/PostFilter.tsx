"use client";

import { useState } from "react";
import Link from "next/link";
import type { Post } from "@/lib/posts";

// --- THEME CONFIGURATION (Chameleon System) ---
type ThemeConfig = {
  grid: string;
  card: string;
  title: string;
  badge: string;
  activeFilter: string;
  filterBarAlign: string;
  summary?: string;
};

const THEME_CONFIG: Record<string, ThemeConfig> = {
  // The Minimalist — Academic, thoughtful, clean
  philosophy: {
    grid: "grid-cols-1 max-w-3xl mx-auto",
    card:
      "rounded-none border-l-2 border-green-900/50 bg-transparent py-4 pl-8 transition-colors hover:border-green-400",
    title:
      "font-serif text-2xl tracking-wide text-gray-200 transition-colors group-hover:text-green-400",
    badge: "italic text-green-600/80",
    activeFilter: "border-green-400 bg-green-400/10 text-green-400",
    filterBarAlign: "justify-center",
  },

  // The Cyberpunk — Glassmorphism, glow, cyan
  "ai-insights": {
    grid: "grid-cols-1 md:grid-cols-2",
    card:
      "rounded-2xl border border-gray-800 bg-gray-900/40 p-6 backdrop-blur-sm transition-all duration-300 hover:border-cyan-500/50 hover:shadow-[0_0_20px_-10px_rgba(0,240,255,0.3)]",
    title: "text-gray-100 transition-colors group-hover:text-cyan-400",
    badge: "text-cyan-500/80",
    activeFilter:
      "border-cyan-400 bg-cyan-400/10 text-cyan-400 shadow-[0_0_10px_rgba(0,240,255,0.3)]",
    filterBarAlign: "",
  },

  // The Trader (Data Terminal) — Orange
  blockchain: {
    grid: "grid-cols-1 md:grid-cols-2",
    card:
      "rounded-xl border border-orange-900/30 bg-orange-950/10 p-6 transition-all duration-300 hover:border-orange-500/50 hover:shadow-[0_0_12px_-4px_rgba(247,147,26,0.2)]",
    title: "text-gray-100 transition-colors group-hover:text-orange-400",
    badge: "text-orange-500/80 font-mono",
    activeFilter: "border-orange-400 bg-orange-400/10 text-orange-400",
    filterBarAlign: "",
  },

  // The Trader (Data Terminal) — Green
  investing: {
    grid: "grid-cols-1 md:grid-cols-3",
    card:
      "rounded-lg border border-gray-800 bg-gray-900/60 p-4 font-mono transition-all duration-300 hover:border-emerald-500/50 hover:shadow-[0_0_12px_-4px_rgba(52,211,153,0.2)]",
    title: "text-lg text-gray-100 transition-colors group-hover:text-emerald-400",
    badge: "text-emerald-500/80 font-mono",
    activeFilter: "border-emerald-400 bg-emerald-400/10 text-emerald-400",
    filterBarAlign: "",
  },

  // The Archive — Dense list, log-file aesthetic, monospace
  "sheshin-notes": {
    grid: "grid-cols-1 gap-3 max-w-4xl",
    card:
      "rounded-none border-l-2 border-zinc-600/60 bg-zinc-950/30 py-3 pl-4 font-mono text-sm transition-colors hover:border-zinc-400",
    title: "text-base text-zinc-200 transition-colors group-hover:text-zinc-100",
    badge: "text-zinc-500 text-[10px] uppercase tracking-widest",
    activeFilter: "border-zinc-400 bg-zinc-400/10 text-zinc-300",
    filterBarAlign: "",
    summary: "text-zinc-500 text-xs line-clamp-2",
  },

  default: {
    grid: "grid-cols-1 md:grid-cols-2",
    card:
      "rounded-xl border border-gray-800 bg-gray-900/40 p-6 transition-all duration-300 hover:border-gray-500",
    title: "text-gray-100 transition-colors group-hover:text-white",
    badge: "text-gray-500",
    activeFilter: "border-white bg-white/10 text-white",
    filterBarAlign: "",
  },
};

type PostFilterProps = { posts: Post[]; category?: string };

export default function PostFilter({ posts, category }: PostFilterProps) {
  const [activeFilter, setActiveFilter] = useState("All");

  const theme = THEME_CONFIG[category ?? ""] ?? THEME_CONFIG.default;

  const subCategories = [
    "All",
    ...(Array.from(
      new Set(posts.map((p) => p.subCategory).filter(Boolean))
    ) as string[]),
  ];

  const filteredPosts =
    activeFilter === "All"
      ? posts
      : posts.filter((post) => post.subCategory === activeFilter);

  return (
    <div>
      {/* --- Filter Bar (Theme-aware alignment) --- */}
      <div
        className={`mb-12 flex flex-wrap gap-3 ${theme.filterBarAlign}`}
      >
        {subCategories.map((sub) => (
          <button
            key={sub}
            onClick={() => setActiveFilter(sub)}
            className={`
              rounded-full border px-4 py-1.5 font-mono text-sm transition-all duration-300
              ${activeFilter === sub ? theme.activeFilter : "border-gray-800 text-gray-500 hover:border-gray-600 hover:text-gray-300"}
            `}
          >
            {sub}
          </button>
        ))}
      </div>

      {/* --- Dynamic Grid / List (Theme-driven layout) --- */}
      <div className={`grid gap-8 ${theme.grid}`}>
        {filteredPosts.map((post) => (
          <Link
            key={post.slug}
            href={`/post/${post.slug}`}
            className={`group block transition-all duration-300 ${theme.card}`}
          >
            <div className="flex h-full flex-col">
              <div className="mb-3 flex items-start justify-between">
                <span className={`text-xs uppercase ${theme.badge}`}>
                  {post.subCategory ? `// ${post.subCategory}` : "// NODE"}
                </span>
                <span className="font-mono text-xs text-gray-600">
                  {post.publishedDate ?? ""}
                </span>
              </div>

              <h3 className={`mb-3 font-bold transition-colors ${theme.title}`}>
                {post.name}
              </h3>

              <p
                className={
                  theme.summary
                    ? `line-clamp-3 leading-relaxed ${theme.summary}`
                    : "line-clamp-3 text-sm leading-relaxed text-gray-400"
                }
              >
                {post.summary ?? ""}
              </p>
            </div>
          </Link>
        ))}
      </div>

      {/* Empty State */}
      {filteredPosts.length === 0 && (
        <div className="py-20 text-center font-mono text-gray-600">
          [SYSTEM]: No data found in this sector.
        </div>
      )}
    </div>
  );
}
