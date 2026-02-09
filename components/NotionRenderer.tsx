"use client";

import BlockRenderer from "@/components/BlockRenderer";
import type { NotionBlock } from "@/lib/notion";

type NotionRendererProps = {
  blocks: NotionBlock[];
  /** Accent for quote/callout border (e.g. category color). */
  accent?: string;
};

/**
 * Universal Notion-to-Cyberpunk renderer.
 * Uses recursive BlockRenderer for all block types (including toggles and nested content).
 */
export default function NotionRenderer({
  blocks,
  accent = "#00F0FF",
}: NotionRendererProps) {
  if (!blocks?.length) return null;

  return (
    <div
      className="
        prose prose-invert prose-lg max-w-none
        prose-headings:font-mono prose-headings:text-white
        prose-a:text-cyan-400 hover:prose-a:text-cyan-300
        prose-img:rounded-lg prose-img:mx-auto
      "
    >
      <BlockRenderer blocks={blocks} accent={accent} />
    </div>
  );
}
