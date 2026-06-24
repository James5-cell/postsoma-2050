import { getPublishedPosts } from "./notion";
import {
  CATEGORY_SLUGS,
  getCategoryBySlug,
  type Category,
} from "./design-tokens";

export type MediaItem = {
  url: string;
  name?: string;
  mime?: string;
  kind: "image" | "video" | "audio" | "other";
};

export type Post = {
  id?: string;
  name: string;
  slug: string;
  category: Category;
  subCategory?: string | null;
  summary: string | null;
  aiSummary?: string | null;
  tags: string[];
  cover: string | null;
  publishedDate: string | null;
  featured: boolean;
  media: MediaItem[];
};

let cachedPosts: Post[] | null = null;
let lastFetchTime = 0;
const CACHE_TTL = 60 * 1000; // 60 seconds Cache Time-to-Live

export async function getPosts(): Promise<Post[]> {
  const now = Date.now();
  if (cachedPosts && (now - lastFetchTime < CACHE_TTL)) {
    return cachedPosts;
  }

  try {
    cachedPosts = await getPublishedPosts();
    lastFetchTime = now;
  } catch (err) {
    console.error("Failed to fetch posts from Notion, returning cached posts if available", err);
    if (cachedPosts) return cachedPosts;
    throw err;
  }

  return cachedPosts;
}

export async function getPostsByCategory(categorySlug: string): Promise<Post[]> {
  const category = getCategoryBySlug(categorySlug);
  if (!category) return [];
  // Note: we fetch all and filter in memory to utilize cache
  const allPosts = await getPosts();
  return allPosts.filter((p) => getCategorySlug(p.category) === categorySlug);
}

export async function getPostBySlug(slug: string): Promise<Post | null> {
  const posts = await getPosts();
  return posts.find((p) => p.slug === slug) ?? null;
}

export function getCategorySlug(category: Category): string {
  return CATEGORY_SLUGS[category];
}

/**
 * Calculates similar posts based on tag intersection count.
 * Fallbacks:
 * 1. Matching tags (sorted by count, then date descending)
 * 2. Same category posts (newest first)
 * 3. Any latest posts (newest first)
 */
export async function getRelatedPosts(currentPost: Post, limit = 3): Promise<Post[]> {
  const allPosts = await getPosts();
  
  // Filter out current post
  const otherPosts = allPosts.filter((p) => p.slug !== currentPost.slug);

  // 1. Calculate tag intersections
  const postsWithIntersections = otherPosts.map((p) => {
    const intersection = p.tags.filter((t) => currentPost.tags.includes(t)).length;
    return { post: p, intersection };
  });

  const relatedByTags = postsWithIntersections
    .filter((item) => item.intersection > 0)
    .sort((a, b) => {
      if (b.intersection !== a.intersection) {
        return b.intersection - a.intersection;
      }
      const da = a.post.publishedDate ?? "";
      const db = b.post.publishedDate ?? "";
      return db.localeCompare(da);
    })
    .map((item) => item.post);

  if (relatedByTags.length >= limit) {
    return relatedByTags.slice(0, limit);
  }

  // 2. Fallback: posts in the same category
  const relatedSlugs = new Set(relatedByTags.map((p) => p.slug));
  const sameCategoryPosts = otherPosts
    .filter((p) => p.category === currentPost.category && !relatedSlugs.has(p.slug))
    .sort((a, b) => {
      const da = a.publishedDate ?? "";
      const db = b.publishedDate ?? "";
      return db.localeCompare(da);
    });

  const combined = [...relatedByTags, ...sameCategoryPosts];
  if (combined.length >= limit) {
    return combined.slice(0, limit);
  }

  // 3. Ultimate Fallback: latest posts
  const combinedSlugs = new Set(combined.map((p) => p.slug));
  const latestPostsFallback = otherPosts
    .filter((p) => !combinedSlugs.has(p.slug))
    .sort((a, b) => {
      const da = a.publishedDate ?? "";
      const db = b.publishedDate ?? "";
      return db.localeCompare(da);
    });

  return [...combined, ...latestPostsFallback].slice(0, limit);
}
