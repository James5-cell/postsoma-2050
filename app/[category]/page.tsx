
import { notFound } from "next/navigation";
import type { Metadata } from "next";
import {
  getCategoryBySlug,
  CATEGORY_SLUGS,
  type Category,
} from "@/lib/design-tokens";
import { getPostsByCategory } from "@/lib/posts";
import DocLayout from "@/components/layouts/DocLayout";
import ManifestoLayout from "@/components/layouts/ManifestoLayout";
import ListLayout from "@/components/layouts/ListLayout";
import GridLayout from "@/components/layouts/GridLayout";

const SITE_URL = "https://www.postsoma-2050.com";

const CATEGORY_DESCRIPTIONS: Record<Category, string> = {
  "AI Insights": "Deep dives into artificial intelligence, machine learning, and the future of human-AI collaboration.",
  Philosophy: "Exploring consciousness, meaning, and what it means to be human in a hyper-technological world.",
  Blockchain: "On-chain intelligence: DeFi, Web3 infrastructure, and the decentralized future.",
  Investing: "Mental models, macro views, and capital allocation frameworks for the long-term investor.",
  "Sheshin Notes": "Mindfulness, self-awareness, and inner cultivation notes.",
};

export async function generateMetadata({
  params,
}: {
  params: Promise<{ category: string }>;
}): Promise<Metadata> {
  const { category: categorySlug } = await params;
  const category = getCategoryBySlug(categorySlug);
  if (!category) return {};

  const description = CATEGORY_DESCRIPTIONS[category];
  const canonicalUrl = `${SITE_URL}/${categorySlug}`;

  return {
    title: category,
    description,
    alternates: { canonical: canonicalUrl },
    openGraph: {
      type: "website",
      title: `${category} | PostSoma 2050`,
      description,
      url: canonicalUrl,
      siteName: "PostSoma 2050",
      images: [{ url: `${SITE_URL}/no-future.jpg`, width: 1200, height: 630 }],
    },
    twitter: {
      card: "summary_large_image",
      title: `${category} | PostSoma 2050`,
      description,
    },
  };
}

export async function generateStaticParams() {
  return Object.values(CATEGORY_SLUGS).map((slug) => ({ category: slug }));
}

export const revalidate = 60;

export default async function CategoryPage({
  params,
}: {
  params: Promise<{ category: string }>;
}) {

  const { category: categorySlug } = await params;
  const category = getCategoryBySlug(categorySlug);
  if (!category) notFound();

  const posts = await getPostsByCategory(categorySlug);
  const title = category; // Category type is the display name (e.g. "AI Insights")

  if (categorySlug === "blockchain") {
    return (
      <div className="mx-auto max-w-7xl px-0 sm:px-6 py-6 sm:py-12">
        <DocLayout title={title} category={category} posts={posts} />
      </div>
    );
  }

  if (categorySlug === "philosophy") {
    return (
      <div className="mx-auto max-w-4xl px-0 sm:px-6 py-6 sm:py-12">
        <ManifestoLayout title={title} category={category} posts={posts} />
      </div>
    );
  }

  if (categorySlug === "sheshin-notes") {
    return (
      <div className="mx-auto max-w-3xl px-0 sm:px-6 py-6 sm:py-12">
        <ListLayout title={title} category={category} posts={posts} />
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-7xl px-0 sm:px-6 py-6 sm:py-12">
      <GridLayout title={title} category={category} posts={posts} />
    </div>
  );
}
