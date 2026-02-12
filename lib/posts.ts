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
  tags: string[];
  cover: string | null;
  publishedDate: string | null;
  featured: boolean;
  media: MediaItem[];
};

export async function getPosts(): Promise<Post[]> {
  return getPublishedPosts();
}

export async function getPostsByCategory(categorySlug: string): Promise<Post[]> {
  const category = getCategoryBySlug(categorySlug);
  if (!category) return [];
  return getPublishedPosts(categorySlug);
}

export async function getPostBySlug(slug: string): Promise<Post | null> {
  const posts = await getPosts();
  return posts.find((p) => p.slug === slug) ?? null;
}

export function getCategorySlug(category: Category): string {
  return CATEGORY_SLUGS[category];
}
