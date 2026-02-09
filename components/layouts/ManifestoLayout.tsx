"use client";

import { useState, useMemo } from "react";
import { motion } from "framer-motion";
import PostCard from "@/components/PostCard";
import type { Post } from "@/lib/posts";
import { CATEGORY_ACCENTS, type Category } from "@/lib/design-tokens";

type ManifestoLayoutProps = {
  title: string;
  category: Category;
  posts: Post[];
};

export default function ManifestoLayout({
  title,
  category,
  posts,
}: ManifestoLayoutProps) {
  const accent = CATEGORY_ACCENTS[category];
  const uniqueCategories = useMemo(
    () =>
      [
        "All",
        ...Array.from(
          new Set(
            posts.map((p) => p.subCategory).filter((x): x is string => !!x)
          )
        ),
      ],
    [posts]
  );
  const [activeFilter, setActiveFilter] = useState("All");

  const filteredPosts =
    activeFilter === "All"
      ? posts
      : posts.filter((post) => post.subCategory === activeFilter);

  return (
    <div className="mx-auto max-w-2xl space-y-16">
      <motion.header
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-center"
      >
        <h1
          className="font-mono text-4xl font-semibold tracking-tight sm:text-5xl"
          style={{ color: accent }}
        >
          {title}
        </h1>
        <p className="mt-4 font-sans text-lg text-text-secondary">
          Single column. Thought as artifact.
        </p>
      </motion.header>

      {/* Green Terminal Filter */}
      {uniqueCategories.length > 1 && (
        <div className="flex flex-wrap justify-center gap-3 px-4 overflow-x-auto py-2">
          {uniqueCategories.map((cat) => (
            <button
              key={cat}
              type="button"
              onClick={() => setActiveFilter(cat)}
              className={`
                shrink-0 rounded-full border px-4 py-1.5 font-mono text-sm transition-all duration-300
                ${activeFilter === cat
                  ? "border-green-500 text-green-400 shadow-[0_0_10px_rgba(74,222,128,0.2)] bg-green-900/10"
                  : "border-gray-800 text-gray-500 hover:border-green-900 hover:text-green-300"}
              `}
            >
              {cat === "All" ? "[ ALL ]" : `[ ${cat.toUpperCase()} ]`}
            </button>
          ))}
        </div>
      )}

      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.15 }}
        className="space-y-12"
      >
        {filteredPosts.length === 0 ? (
          <p className="font-sans text-center text-text-secondary">
            {posts.length === 0
              ? "No posts yet."
              : "No posts in this section."}
          </p>
        ) : (
          filteredPosts.map((post, i) => (
            <motion.article
              key={post.slug}
              initial={{ opacity: 0, y: 24 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.08 * i }}
              className="border-l-4 border-[var(--border-subtle)] pl-6"
              style={{ borderLeftColor: accent }}
            >
              <PostCard post={post} accent={accent} size="feature" />
            </motion.article>
          ))
        )}
      </motion.div>
    </div>
  );
}
