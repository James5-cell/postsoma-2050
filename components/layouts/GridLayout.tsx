"use client";

import { useState, useMemo } from "react";
import { motion } from "framer-motion";
import PostCard from "@/components/PostCard";
import SubCategoryFilter, { ALL_LABEL } from "@/components/SubCategoryFilter";
import type { Post } from "@/lib/posts";
import { CATEGORY_ACCENTS, type Category } from "@/lib/design-tokens";

type GridLayoutProps = {
  title: string;
  category: Category;
  posts: Post[];
};

export default function GridLayout({
  title,
  category,
  posts,
}: GridLayoutProps) {
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
    <div className="space-y-8">
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

      <SubCategoryFilter
        subCategories={subCategories}
        selected={selectedSub}
        onSelect={setSelectedSub}
        accent={accent}
      />

      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.1 }}
        className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3"
      >
        {filteredPosts.length === 0 ? (
          <p className="font-sans text-text-secondary">No posts in this section.</p>
        ) : (
          filteredPosts.map((post, i) => (
            <motion.div
              key={post.slug}
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.05 * i }}
            >
              <PostCard post={post} accent={accent} />
            </motion.div>
          ))
        )}
      </motion.div>
    </div>
  );
}
