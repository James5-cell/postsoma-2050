import type { MetadataRoute } from "next";
import { getPublishedPosts } from "@/lib/notion";
import { CATEGORY_SLUGS } from "@/lib/design-tokens";

// Force runtime rendering: sitemap is generated on-request, not at build time.
// This prevents Notion API calls from blocking `npm run build`.
export const dynamic = "force-dynamic";
export const revalidate = 3600; // Cache for 1 hour after first request

const SITE_URL = "https://www.postsoma-2050.com";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  // 1. Static pages
  const staticRoutes: MetadataRoute.Sitemap = [
    {
      url: SITE_URL,
      lastModified: new Date(),
      changeFrequency: "daily",
      priority: 1.0,
    },
  ];

  // 2. Category pages
  const categoryRoutes: MetadataRoute.Sitemap = Object.values(CATEGORY_SLUGS).map(
    (slug) => ({
      url: `${SITE_URL}/${slug}`,
      lastModified: new Date(),
      changeFrequency: "weekly" as const,
      priority: 0.8,
    })
  );

  // 3. Individual post pages — pulled from Notion
  let postRoutes: MetadataRoute.Sitemap = [];
  try {
    const posts = await getPublishedPosts();
    postRoutes = posts.map((post) => ({
      url: `${SITE_URL}/post/${post.slug}`,
      lastModified: post.publishedDate ? new Date(post.publishedDate) : new Date(),
      changeFrequency: "monthly" as const,
      priority: post.featured ? 0.9 : 0.6,
    }));
  } catch (err) {
    console.warn("⚠️ sitemap: failed to fetch posts from Notion", err);
  }

  return [...staticRoutes, ...categoryRoutes, ...postRoutes];
}
