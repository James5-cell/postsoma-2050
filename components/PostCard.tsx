"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import type { Post } from "@/lib/posts";
import { CATEGORY_ACCENTS, type Category } from "@/lib/design-tokens";

type PostCardProps = {
  post: Post;
  accent?: string;
  size?: "default" | "compact" | "feature";
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
}: PostCardProps) {
  const color = accent ?? CATEGORY_ACCENTS[post.category];
  const glowShadow = `0 0 20px -4px ${hexToRgba(color, 0.35)}, 0 0 40px -8px ${hexToRgba(color, 0.2)}`;

  if (size === "compact") {
    return (
      <Link href={`/post/${post.slug}`}>
        <motion.article
          whileHover={{ x: 2 }}
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

  return (
    <Link href={`/post/${post.slug}`}>
      <motion.article
        whileHover={{ y: -2 }}
        className="group block rounded border border-[var(--border-subtle)] bg-neutral-900 p-4 transition-[box-shadow]"
        style={{
          borderColor: color,
          boxShadow: glowShadow,
        }}
      >
        <h2 className="font-mono text-base font-semibold text-text-primary">
          {post.name}
        </h2>
        {post.summary && (
          <p className="mt-1.5 font-sans text-sm text-text-secondary line-clamp-2">
            {post.summary}
          </p>
        )}
        {post.tags.length > 0 && (
          <div className="mt-2 flex flex-wrap gap-1.5">
            {post.tags.map((tag) => (
              <span
                key={tag}
                className="font-mono text-xs text-text-secondary/80"
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
