"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { ArrowRight } from "lucide-react";
import type { Post } from "@/lib/posts";
import { CATEGORY_ACCENTS, type Category } from "@/lib/design-tokens";

type PostCardProps = {
  post: Post;
  accent?: string;
  size?: "default" | "compact" | "feature";
  isPrimary?: boolean;
};

function hexToRgba(hex: string, a: number): string {
  const r = parseInt(hex.slice(1, 3), 16);
  const g = parseInt(hex.slice(3, 5), 16);
  const b = parseInt(hex.slice(5, 7), 16);
  return `rgba(${r},${g},${b},${a})`;
}

export default function PostCard({
  post,
  accent,
  size = "default",
  isPrimary = false,
}: PostCardProps) {
  const color = accent ?? CATEGORY_ACCENTS[post.category];
  const glowShadow = `0 0 20px -4px ${hexToRgba(color, 0.35)}, 0 0 40px -8px ${hexToRgba(color, 0.2)}`;
  const hoverGlowShadow = `0 0 24px -2px ${hexToRgba(color, 0.45)}, 0 0 48px -4px ${hexToRgba(color, 0.25)}`;

  if (size === "compact") {
    return (
      <Link href={`/post/${post.slug}`}>
        <motion.article
          whileHover={{ x: 2 }}
          whileTap={{ scale: 0.99 }}
          className="group rounded border-l-2 border-[var(--border-subtle)] bg-neutral-900/80 py-2 pl-3 pr-2 font-sans text-sm text-text-secondary transition-colors hover:text-text-primary"
          style={{
            borderLeftColor: color,
            boxShadow: `0 0 16px -4px ${hexToRgba(color, 0.25)}`,
          }}
        >
          <span className="font-medium text-text-primary group-hover:underline">
            {post.name}
          </span>
          {post.publishedDate && (
            <span className="ml-2 text-text-secondary/80">{post.publishedDate}</span>
          )}
        </motion.article>
      </Link>
    );
  }

  if (size === "feature") {
    return (
      <Link href={`/post/${post.slug}`}>
        <motion.article
          whileHover={{ y: -4 }}
          whileTap={{ scale: 0.98 }}
          className="group block rounded border border-[var(--border-subtle)] bg-neutral-900 p-6 transition-[box-shadow]"
          style={{
            borderColor: color,
            boxShadow: glowShadow,
          }}
        >
          <h2
            className="font-mono text-xl font-semibold text-text-primary transition-colors group-hover:opacity-90"
            style={{ color }}
          >
            {post.name}
          </h2>
          {post.summary && (
            <p className="mt-2 font-sans text-sm text-text-secondary line-clamp-2">
              {post.summary}
            </p>
          )}
          {post.publishedDate && (
            <p className="mt-2 font-mono text-xs text-text-secondary/80">
              {post.publishedDate}
            </p>
          )}
        </motion.article>
      </Link>
    );
  }

  // default size
  return (
    <Link href={`/post/${post.slug}`} className="h-full flex flex-col">
      <motion.article
        whileHover={{ y: -3 }}
        whileTap={{ scale: 0.98 }}
        className="group relative flex flex-col h-full rounded border bg-neutral-900 p-3.5 sm:p-4 transition-all duration-350 hover:border-[var(--accent-color)] hover:shadow-[var(--glow-shadow-hover)]"
        style={{
          borderColor: isPrimary ? color : "var(--border-subtle)",
          boxShadow: isPrimary ? glowShadow : "none",
          "--accent-color": color,
          "--glow-shadow-hover": hoverGlowShadow,
        } as React.CSSProperties}
      >
        {/* Neon Glow Corner for Primary Cards */}
        {isPrimary && (
          <div 
            className="absolute -right-6 -top-6 h-12 w-12 rounded-full blur-lg pointer-events-none opacity-20"
            style={{ backgroundColor: color }}
          />
        )}

        <div className="flex-grow flex flex-col">
          {/* 1. Header category or primary badge */}
          {isPrimary ? (
            <div 
              className="mb-2 font-mono text-[10px] font-bold uppercase tracking-widest flex items-center gap-1.5"
              style={{ color }}
            >
              <span className="relative flex h-1.5 w-1.5">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-current opacity-75"></span>
                <span className="relative inline-flex rounded-full h-1.5 w-1.5 bg-current"></span>
              </span>
              Highly Related // 強烈推薦
            </div>
          ) : (
            <div className="mb-1 font-mono text-[9px] uppercase tracking-widest text-text-secondary/50">
              {post.category}
            </div>
          )}

          {/* 2. Title and Click Indicator */}
          <div className="flex items-start justify-between gap-2 mb-2">
            <h2 
              className="font-mono text-sm sm:text-base font-semibold text-text-primary transition-colors duration-300 group-hover:text-[var(--hover-color)]"
              style={{ "--hover-color": color } as React.CSSProperties}
            >
              {post.name}
            </h2>
            <ArrowRight 
              size={16} 
              className="mt-0.5 shrink-0 text-text-secondary/40 transition-all duration-300 group-hover:translate-x-1.5 group-hover:text-[var(--hover-color)]"
              style={{ "--hover-color": color } as React.CSSProperties}
            />
          </div>

          {/* 3. Muted Summary (hidden on mobile, line-clamp on desktop) */}
          {post.summary && (
            <p className="mt-1 mb-3 font-sans text-xs text-text-secondary/70 line-clamp-2 hidden sm:block">
              {post.summary}
            </p>
          )}
        </div>

        {/* 4. Muted Tags (limited to 3) */}
        {post.tags.length > 0 && (
          <div className="mt-auto flex flex-wrap gap-1.5">
            {post.tags.slice(0, 3).map((tag) => (
              <span
                key={tag}
                className="font-mono text-[10px] text-text-secondary/50 border border-white/5 bg-white/[0.01] px-1.5 py-0.5 rounded transition-colors group-hover:border-white/10"
              >
                #{tag}
              </span>
            ))}
          </div>
        )}
      </motion.article>
    </Link>
  );
}
