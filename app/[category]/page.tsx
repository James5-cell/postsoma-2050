
import { notFound } from "next/navigation";
import {
  getCategoryBySlug,
  CATEGORY_SLUGS,
} from "@/lib/design-tokens";
import { getPostsByCategory } from "@/lib/posts";
import DocLayout from "@/components/layouts/DocLayout";
import ManifestoLayout from "@/components/layouts/ManifestoLayout";
import ListLayout from "@/components/layouts/ListLayout";
import GridLayout from "@/components/layouts/GridLayout";

export const revalidate = 60;

export async function generateStaticParams() {
  return Object.values(CATEGORY_SLUGS).map((slug) => ({ category: slug }));
}

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
      <div className="mx-auto max-w-7xl px-6 py-12">
        <DocLayout title={title} category={category} posts={posts} />
      </div>
    );
  }

  if (categorySlug === "philosophy") {
    return (
      <div className="mx-auto max-w-4xl px-6 py-12">
        <ManifestoLayout title={title} category={category} posts={posts} />
      </div>
    );
  }

  if (categorySlug === "sheshin-notes") {
    return (
      <div className="mx-auto max-w-3xl px-6 py-12">
        <ListLayout title={title} category={category} posts={posts} />
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-7xl px-6 py-12">
      <GridLayout title={title} category={category} posts={posts} />
    </div>
  );
}
