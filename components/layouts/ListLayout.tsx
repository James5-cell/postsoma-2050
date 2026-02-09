"use client";

import { useState, useMemo } from "react";
import { motion } from "framer-motion";
import PostCard from "@/components/PostCard";
import SubCategoryFilter, { ALL_LABEL } from "@/components/SubCategoryFilter";
import type { Post } from "@/lib/posts";
import { CATEGORY_ACCENTS, type Category } from "@/lib/design-tokens";

type ListLayoutProps = {
  title: string;
  category: Category;
  posts: Post[];
};

export default function ListLayout({
  title,
  category,
  posts,
}: ListLayoutProps) {
  const accent = CATEGORY_ACCENTS[category];
  const subCategories = useMemo(
    () =>
      Array.from(
        new Set(posts.map((p) => p.subCategory).filter((x): x is string => !!x))
      ),
    [posts]
  );
  const [selectedSub, setSelectedSub] = useState(ALL_LABEL);

  const filteredPosts =
    selectedSub === ALL_LABEL
      ? posts
      : posts.filter((p) => p.subCategory === selectedSub);

  return (
    <div className="space-y-6">
      <motion.header
        initial={{ opacity: 0, y: 8 }}
        animate={{ opacity: 1, y: 0 }}
        className="border-b border-[var(--border-subtle)] pb-3"
      >
        <h1
          className="font-mono text-3xl font-semibold tracking-tight text-text-primary sm:text-4xl"
          style={{ color: accent }}
        >
          {title}
        </h1>
        <p className="mt-1 font-mono text-xs text-text-secondary">
          Dense archive. Minimal.
        </p>
      </motion.header>

      <SubCategoryFilter
        subCategories={subCategories}
        selected={selectedSub}
        onSelect={setSelectedSub}
        accent={accent}
        variant="minimal"
      />

      <motion.ul
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.1 }}
        className="space-y-0 divide-y divide-[var(--border-subtle)]"
      >
        {filteredPosts.length === 0 ? (
          <li className="py-4 font-sans text-sm text-text-secondary">
            No posts in this section.
          </li>
        ) : (
          filteredPosts.map((post, i) => (
            <motion.li
              key={post.slug}
              initial={{ opacity: 0, x: -8 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.03 * i }}
            >
              <PostCard post={post} accent={accent} size="compact" />
            </motion.li>
          ))
        )}
      </motion.ul>
    </div>
  );
}
