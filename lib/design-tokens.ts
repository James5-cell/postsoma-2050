/**
 * PostSoma-2050 Design Tokens
 * Single source of truth for category slugs and accent mapping.
 */

export const CATEGORIES = [
  "AI Insights",
  "Philosophy",
  "Blockchain",
  "Investing",
  "Sheshin Notes",
] as const;

export type Category = (typeof CATEGORIES)[number];

export const CATEGORY_SLUGS: Record<Category, string> = {
  "AI Insights": "ai-insights",
  Philosophy: "philosophy",
  Blockchain: "blockchain",
  Investing: "investing",
  "Sheshin Notes": "sheshin-notes",
};

export const CATEGORY_ACCENTS: Record<Category, string> = {
  "AI Insights": "#00F0FF",
  Philosophy: "#00FF41",
  Blockchain: "#F7931A",
  Investing: "#00FF41", // or use bull/bear per context
  "Sheshin Notes": "#F5F5F5",
};

export function getCategoryBySlug(slug: string): Category | undefined {
  return (Object.entries(CATEGORY_SLUGS) as [Category, string][]).find(
    ([, s]) => s === slug
  )?.[0];
}
