
import { notFound } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import rehypeSlug from "rehype-slug";
import rehypeRaw from "rehype-raw";
import { getPostBySlug } from "@/lib/posts";
import {
  getPostBlocks,
  getHeadingsFromBlocks,
  getPostMarkdown,
} from "@/lib/notion";
import { CATEGORY_ACCENTS, CATEGORY_SLUGS } from "@/lib/design-tokens";
import TableOfContents from "@/components/TableOfContents";
import NotionRenderer from "@/components/NotionRenderer";

export const revalidate = 60;

function getHeadingsFromMarkdown(markdown: string) {
  const headingLines = markdown.match(/^(#{1,3})\s+(.*)$/gm) || [];
  return headingLines.map((line) => {
    const level = line.match(/^(#{1,3})/)?.[0].length || 0;
    const text = line.replace(/^(#{1,3})\s+/, "");
    const slug = text
      .toLowerCase()
      .replace(/\s+/g, "-")
      .replace(/[^\w\-\u4e00-\u9fa5]/g, "");
    return { text, level, slug };
  });
}

// Transform literal <u>...</u> to styled spans before markdown parsing
function preprocessUnderlineTags(md: string): string {
  return md.replace(
    /<u>([\s\S]*?)<\/u>/gi,
    '<span class="border-b-2 border-cyan-500">$1</span>'
  );
}

export async function generateStaticParams() {
  const { getPosts } = await import("@/lib/posts");
  const posts = await getPosts();
  return posts.map((p) => ({ slug: p.slug }));
}

export default async function PostPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {

  const { slug } = await params;
  const post = await getPostBySlug(slug);
  if (!post) notFound();

  const blocks = post.id ? await getPostBlocks(post.id) : [];
  const useBlocks = blocks.length > 0;
  const markdown =
    !useBlocks && post.id ? await getPostMarkdown(post.id) : "";

  const headings = useBlocks
    ? getHeadingsFromBlocks(blocks)
    : getHeadingsFromMarkdown(markdown);

  const accent = CATEGORY_ACCENTS[post.category];
  const categorySlug = CATEGORY_SLUGS[post.category];

  return (
    <div className="min-h-screen pb-24">
      <TableOfContents headings={headings} />

      <main className="mx-auto max-w-4xl px-6 pt-12">
        <header className="mb-12 text-center">
          <Link
            href={`/${categorySlug}`}
            className="font-mono text-sm text-text-secondary hover:text-text-primary"
            style={{ color: accent }}
          >
            ← {post.category}
          </Link>
          <h1 className="mt-4 font-mono text-3xl font-semibold tracking-tight text-text-primary sm:text-4xl">
            {post.name}
          </h1>
          <div className="mt-2 flex flex-wrap items-center justify-center gap-2 font-mono text-sm text-text-secondary">
            {post.publishedDate && <time>{post.publishedDate}</time>}
            {post.tags.length > 0 && (
              <>
                <span>·</span>
                {post.tags.map((tag) => (
                  <span key={tag}>#{tag}</span>
                ))}
              </>
            )}
          </div>
        </header>

        {/* Media section — renders images, videos, and audio from Notion Media property */}
        {post.media.length > 0 && (
          <section className="mb-10 mt-2 space-y-5">
            {post.media.map((item, idx) => {
              if (item.kind === "image") {
                return (
                  <div
                    key={idx}
                    className="relative w-full overflow-hidden rounded-lg"
                    style={{
                      border: "1px solid var(--border-subtle)",
                      boxShadow: "0 0 18px 2px rgba(0, 240, 255, 0.12)",
                    }}
                  >
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                      src={item.url}
                      alt={item.name ?? "Post media"}
                      className="w-full h-auto rounded-lg"
                      loading="lazy"
                    />
                  </div>
                );
              }
              if (item.kind === "video") {
                return (
                  <div
                    key={idx}
                    className="overflow-hidden rounded-lg"
                    style={{ border: "1px solid var(--border-subtle)" }}
                  >
                    <video
                      src={item.url}
                      controls
                      preload="metadata"
                      className="w-full rounded-lg"
                    >
                      Your browser does not support video playback.
                    </video>
                  </div>
                );
              }
              if (item.kind === "audio") {
                return (
                  <div
                    key={idx}
                    className="rounded-lg px-4 py-3"
                    style={{
                      border: "1px solid var(--border-subtle)",
                      background: "rgba(255,255,255,0.03)",
                    }}
                  >
                    {item.name && (
                      <p className="mb-2 font-mono text-xs text-text-secondary">
                        🎵 {item.name}
                      </p>
                    )}
                    <audio src={item.url} controls preload="metadata" className="w-full">
                      Your browser does not support audio playback.
                    </audio>
                  </div>
                );
              }
              // kind === "other" — render a download link
              return (
                <a
                  key={idx}
                  href={item.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-2 rounded-lg px-4 py-3 font-mono text-sm text-text-secondary transition-colors hover:text-text-primary"
                  style={{
                    border: "1px solid var(--border-subtle)",
                    background: "rgba(255,255,255,0.03)",
                  }}
                >
                  📎 {item.name ?? "Download file"}
                </a>
              );
            })}
          </section>
        )}

        {useBlocks ? (
          <article>
            <NotionRenderer blocks={blocks} accent={accent} />
          </article>
        ) : markdown ? (
          <article className="prose prose-invert prose-lg max-w-none prose-headings:font-mono prose-a:text-cyan-400 hover:prose-a:text-cyan-300 prose-img:rounded-lg prose-img:mx-auto">
            <ReactMarkdown
              remarkPlugins={[remarkGfm]}
              rehypePlugins={[rehypeRaw, rehypeSlug]}
              components={{
                a: ({ node, ...props }) => (
                  <a target="_blank" rel="noopener noreferrer" {...props} />
                ),
              }}
            >
              {preprocessUnderlineTags(markdown)}
            </ReactMarkdown>
          </article>
        ) : post.summary ? (
          <p className="text-text-secondary">{post.summary}</p>
        ) : (
          <p className="text-text-secondary">
            (Post body: connect Notion or add content.)
          </p>
        )}
      </main>
    </div>
  );
}
