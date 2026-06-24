"use client";

import { useEffect, useState } from "react";
import PostCard from "./PostCard";
import type { Post } from "@/lib/posts";

type FurtherReadSectionProps = {
  initialRelatedPosts: Post[];
  currentPostSlug: string;
  accent: string;
};

export default function FurtherReadSection({
  initialRelatedPosts,
  currentPostSlug,
  accent,
}: FurtherReadSectionProps) {
  // Use the first 3 posts as the initial state to ensure server-side rendering matches 
  // the initial client-side paint (avoiding React hydration warnings).
  const [displayPosts, setDisplayPosts] = useState<Post[]>(() => 
    initialRelatedPosts.slice(0, 3)
  );

  useEffect(() => {
    const STORAGE_KEY = "postsoma_reading_history";
    let history: string[] = [];

    // 1. Retrieve the reading history from localStorage
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      if (stored) {
        history = JSON.parse(stored);
      }
    } catch (e) {
      console.warn("⚠️ Failed to parse reading history from localStorage", e);
    }

    // 2. Filter out related posts that the user has already read
    const unreadRelated = initialRelatedPosts.filter((p) => !history.includes(p.slug));

    // 3. Fallback: if we have fewer than 3 unread posts, top up with recently read posts
    let finalPosts = unreadRelated;
    if (finalPosts.length < 3) {
      const readRelated = initialRelatedPosts.filter((p) => history.includes(p.slug));
      finalPosts = [...finalPosts, ...readRelated];
    }

    // 4. Slice to exactly 3 and update state
    const sliced = finalPosts.slice(0, 3);
    setDisplayPosts(sliced);

    // 5. Append current post to the reading history (limit to last 10 posts)
    const updatedHistory = [
      currentPostSlug,
      ...history.filter((slug) => slug !== currentPostSlug),
    ].slice(0, 10);

    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(updatedHistory));
    } catch (e) {
      console.warn("⚠️ Failed to save reading history to localStorage", e);
    }
  }, [initialRelatedPosts, currentPostSlug]);

  if (displayPosts.length === 0) return null;

  return (
    <section className="mt-16 border-t border-[var(--border-subtle)] pt-12">
      <h3 
        className="font-mono text-lg font-bold tracking-widest uppercase flex items-center gap-2"
        style={{ color: accent }}
      >
        <span className="h-1.5 w-1.5 rounded-full bg-current" />
        Further Read // 延伸閱讀
      </h3>
      <div className="mt-6 grid grid-cols-1 gap-4 sm:gap-6 sm:grid-cols-3">
        {displayPosts.map((relatedPost, index) => (
          <PostCard 
            key={relatedPost.slug} 
            post={relatedPost} 
            size="default" 
            accent={accent} 
            isPrimary={index === 0} 
          />
        ))}
      </div>
    </section>
  );
}
