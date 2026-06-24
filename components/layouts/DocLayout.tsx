"use client";

import { useState, useMemo } from "react";
import { motion } from "framer-motion";
import PostCard from "@/components/PostCard";
import type { Post } from "@/lib/posts";
import { CATEGORY_ACCENTS, type Category } from "@/lib/design-tokens";

const ALL_LABEL = "All";

type DocLayoutProps = {
  title: string;
  category: Category;
  posts: Post[];
};

function SubNavButton({
  label,
  isActive,
  accent,
  onClick,
  className = "",
}: {
  label: string;
  isActive: boolean;
  accent: string;
  onClick: () => void;
  className?: string;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`
        font-mono text-sm transition-colors
        ${className}
        ${isActive
          ? "text-text-primary"
          : "text-text-secondary hover:text-text-primary"}
      `}
      style={isActive ? { color: accent } : undefined}
    >
      {label}
    </button>
  );
}

export default function DocLayout({
  title,
  category,
  posts,
}: DocLayoutProps) {
  const accent = CATEGORY_ACCENTS[category];
  const subCategories = useMemo(
    () =>
      Array.from(
        new Set(posts.map((p) => p.subCategory).filter((x): x is string => !!x))
      ),
    [posts]
  );

  const [selectedSub, setSelectedSub] = useState<string | null>(ALL_LABEL);

  const filteredPosts =
    !selectedSub || selectedSub === ALL_LABEL
      ? posts
      : posts.filter((p) => p.subCategory === selectedSub);

  const navItems = [ALL_LABEL, ...subCategories];

  return (
    <div className="flex flex-col gap-8 lg:flex-row lg:gap-12">
      {/* Mobile: horizontal scrollable capsules at top */}
      <nav
        className="flex shrink-0 gap-2 overflow-x-auto pb-2 lg:hidden"
        aria-label="Sub-category filter"
      >
        {navItems.map((sub) => {
          const isActive =
            sub === ALL_LABEL ? !selectedSub || selectedSub === ALL_LABEL : selectedSub === sub;
          return (
            <button
              key={sub}
              type="button"
              onClick={() => setSelectedSub(sub === ALL_LABEL ? ALL_LABEL : sub)}
              className={`
                shrink-0 rounded-full border px-4 py-2 font-mono text-sm transition-all
                ${isActive
                  ? "border-current"
                  : "border-gray-700 text-text-secondary hover:border-gray-600 hover:text-text-primary"}
              `}
              style={
                isActive
                  ? {
                      borderColor: accent,
                      color: accent,
                      boxShadow: `0 0 12px -4px ${accent}4D`,
                    }
                  : undefined
              }
            >
              {sub}
            </button>
          );
        })}
      </nav>

      {/* Desktop: sticky left sidebar */}
      <motion.aside
        initial={{ opacity: 0, x: -12 }}
        animate={{ opacity: 1, x: 0 }}
        className="hidden shrink-0 lg:block lg:w-56"
      >
        <nav
          className="sticky top-24 space-y-2 border-l pl-4"
          style={{ borderLeftColor: accent }}
          aria-label="Sub-category navigation"
        >
          {navItems.length > 0 ? (
            navItems.map((sub) => {
              const isActive =
                sub === ALL_LABEL
                  ? !selectedSub || selectedSub === ALL_LABEL
                  : selectedSub === sub;
              return (
                <SubNavButton
                  key={sub}
                  label={sub}
                  isActive={isActive}
                  accent={accent}
                  onClick={() =>
                    setSelectedSub(sub === ALL_LABEL ? ALL_LABEL : sub)
                  }
                  className="block w-full text-left"
                />
              );
            })
          ) : (
            <span className="font-mono text-sm text-text-secondary">
              All posts
            </span>
          )}
        </nav>
      </motion.aside>

      {/* Main content: filtered list */}
      <div className="min-w-0 flex-1">
        <motion.header
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          className="border-b border-[var(--border-subtle)] pb-4"
        >
          <h1
            className="font-mono text-3xl font-semibold tracking-tight sm:text-4xl"
            style={{ color: accent }}
          >
            {title}
          </h1>
        </motion.header>
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.1 }}
          className="mt-6 space-y-6"
        >
          {filteredPosts.length === 0 ? (
            <p className="font-sans text-text-secondary">No posts in this section.</p>
          ) : (
            filteredPosts.map((post, i) => (
              <motion.section
                key={post.slug}
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.05 * i }}
              >
                <PostCard post={post} accent={accent} size="compact" />
              </motion.section>
            ))
          )}
        </motion.div>
      </div>
    </div>
  );
}
