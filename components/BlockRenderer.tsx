"use client";

import { useState, useCallback } from "react";
import Image from "next/image";
import { Copy, ChevronRight } from "lucide-react";
import TextRenderer from "@/components/TextRenderer";
import type { NotionBlock, NotionRichText } from "@/lib/notion";

function getRichTextFromBlock(block: NotionBlock): NotionRichText[] {
  const key = block.type as keyof NotionBlock;
  const value = block[key];
  if (typeof value === "object" && value !== null && "rich_text" in value) {
    const rt = (value as { rich_text?: NotionRichText[] }).rich_text;
    return Array.isArray(rt) ? rt : [];
  }
  return [];
}

function slugify(text: string): string {
  return text
    .toLowerCase()
    .replace(/\s+/g, "-")
    .replace(/[^\w\-\u4e00-\u9fa5]/g, "");
}

type BlockRendererProps = {
  blocks: NotionBlock[];
  accent?: string;
};

export default function BlockRenderer({
  blocks,
  accent = "#00F0FF",
}: BlockRendererProps) {
  if (!blocks?.length) return null;

  const [copiedId, setCopiedId] = useState<string | null>(null);
  const copyCode = useCallback(async (id: string, text: string) => {
    try {
      await navigator.clipboard.writeText(text);
      setCopiedId(id);
      setTimeout(() => setCopiedId(null), 2000);
    } catch {
      setCopiedId(null);
    }
  }, []);

  const nodes: React.ReactNode[] = [];
  let i = 0;

  while (i < blocks.length) {
    const block = blocks[i];

    if (block.type === "bulleted_list_item") {
      const items: NotionBlock[] = [];
      while (i < blocks.length && blocks[i].type === "bulleted_list_item") {
        items.push(blocks[i]);
        i++;
      }
      nodes.push(
        <ul key={block.id} className="my-4 list-disc pl-6 space-y-2 text-gray-300">
          {items.map((b) => (
            <li key={b.id}>
              <TextRenderer
                richText={
                  Array.isArray(b.bulleted_list_item?.rich_text)
                    ? b.bulleted_list_item!.rich_text!
                    : []
                }
              />
              {Array.isArray(b.children) && b.children.length > 0 && (
                <BlockRenderer blocks={b.children} accent={accent} />
              )}
            </li>
          ))}
        </ul>
      );
      continue;
    }

    if (block.type === "numbered_list_item") {
      const items: NotionBlock[] = [];
      while (i < blocks.length && blocks[i].type === "numbered_list_item") {
        items.push(blocks[i]);
        i++;
      }
      nodes.push(
        <ol key={block.id} className="my-4 list-decimal pl-6 space-y-2 text-gray-300">
          {items.map((b) => (
            <li key={b.id}>
              <TextRenderer
                richText={
                  Array.isArray(b.numbered_list_item?.rich_text)
                    ? b.numbered_list_item!.rich_text!
                    : []
                }
              />
              {Array.isArray(b.children) && b.children.length > 0 && (
                <BlockRenderer blocks={b.children} accent={accent} />
              )}
            </li>
          ))}
        </ol>
      );
      continue;
    }

    const rich = getRichTextFromBlock(block);
    const children = block.children;

    switch (block.type) {
      case "paragraph":
        nodes.push(
          <p key={block.id} className="my-6 leading-8 text-gray-300">
            <TextRenderer richText={rich} />
          </p>
        );
        break;

      case "heading_1":
      case "heading_2":
      case "heading_3": {
        const headingKey = block.type as "heading_1" | "heading_2" | "heading_3";
        const data = block[headingKey];
        const Tag = headingKey === "heading_1" ? "h1" : headingKey === "heading_2" ? "h2" : "h3";
        const headingRich =
          Array.isArray(data?.rich_text) && data!.rich_text!.length > 0
            ? data!.rich_text!
            : rich;
        const text = headingRich.map((r) => r.text?.content ?? "").join("").trim();
        const fontSize =
          headingKey === "heading_1"
            ? "text-3xl sm:text-4xl"
            : headingKey === "heading_2"
              ? "text-2xl"
              : "text-xl";
        const isToggleable = !!(data && "is_toggleable" in data && (data as { is_toggleable?: boolean }).is_toggleable);

        if (isToggleable) {
          nodes.push(
            <details
              key={block.id}
              className="group my-4 rounded-lg border-l-2 border-cyan-500/30 pl-4 open:bg-gray-900/20 transition-all duration-300"
            >
              <summary className="flex cursor-pointer list-none items-center py-2 [&::-webkit-details-marker]:hidden">
                <span className="mr-3 shrink-0 text-cyan-500 transition-transform group-open:rotate-90" aria-hidden>
                  ▶
                </span>
                <Tag
                  className={`${fontSize} font-mono font-bold text-white m-0 inline-block`}
                  id={slugify(text) || undefined}
                >
                  <TextRenderer richText={headingRich} />
                </Tag>
              </summary>
              {Array.isArray(children) && children.length > 0 && (
                <div className="mt-2 space-y-4 border-l border-gray-800 pl-2 ml-1.5">
                  <BlockRenderer blocks={children} accent={accent} />
                </div>
              )}
            </details>
          );
        } else {
          nodes.push(
            <Tag
              key={block.id}
              id={slugify(text) || undefined}
              className={`${fontSize} font-mono font-bold text-white mt-10 mb-4 scroll-mt-20 ${headingKey === "heading_3" ? "mt-6 mb-3" : ""}`}
            >
              <TextRenderer richText={headingRich} />
            </Tag>
          );
        }
        break;
      }

      case "to_do": {
        const checked = block.to_do?.checked ?? false;
        nodes.push(
          <div key={block.id} className="my-3 flex items-start gap-3">
            <span
              className="mt-1.5 h-5 w-5 shrink-0 rounded border border-gray-600 bg-gray-800 flex items-center justify-center"
              aria-hidden
            >
              {checked && (
                <span className="text-cyan-400" style={{ fontSize: 12 }}>
                  ✓
                </span>
              )}
            </span>
            <span
              className={
                checked ? "text-gray-500 line-through" : "text-gray-300"
              }
            >
              <TextRenderer richText={rich} />
            </span>
            {Array.isArray(children) && children.length > 0 && (
              <div className="ml-8 mt-2">
                <BlockRenderer blocks={children} accent={accent} />
              </div>
            )}
          </div>
        );
        break;
      }

      case "quote":
        nodes.push(
          <blockquote
            key={block.id}
            className="border-l-4 border-green-500 py-1 px-4 my-4 italic bg-gray-900/50 text-gray-300"
          >
            <TextRenderer richText={rich} />
          </blockquote>
        );
        break;

      case "callout":
        nodes.push(
          <div
            key={block.id}
            className="my-4 rounded-lg border border-gray-700 bg-gray-900/80 p-4"
          >
            <TextRenderer richText={rich} />
            {Array.isArray(children) && children.length > 0 && (
              <div className="mt-3">
                <BlockRenderer blocks={children} accent={accent} />
              </div>
            )}
          </div>
        );
        break;

      case "toggle":
        nodes.push(
          <details
            key={block.id}
            className="group my-4 rounded border border-gray-700 bg-gray-900/40 overflow-hidden"
          >
            <summary className="flex cursor-pointer list-none items-center gap-2 px-4 py-3 font-mono text-sm text-gray-300 hover:bg-gray-800/60 hover:text-green-400 transition-colors [&::-webkit-details-marker]:hidden">
              <ChevronRight
                className="h-4 w-4 shrink-0 transition-transform group-open:rotate-90 text-green-500"
                aria-hidden
              />
              <TextRenderer richText={rich} />
            </summary>
            <div className="border-t border-gray-800 px-4 py-3 pl-8">
              {Array.isArray(children) && children.length > 0 ? (
                <BlockRenderer blocks={children} accent={accent} />
              ) : null}
            </div>
          </details>
        );
        break;

      case "code": {
        const codeContent = block.code;
        const codeText = Array.isArray(codeContent?.rich_text)
          ? codeContent!.rich_text!
              .map((r) => r.text?.content ?? "")
              .join("")
          : "";
        const lang = codeContent?.language ?? "plaintext";
        nodes.push(
          <div key={block.id} className="my-6 rounded-lg overflow-hidden border border-gray-700 bg-gray-900">
            <div className="flex items-center justify-between border-b border-gray-700 bg-gray-800/80 px-3 py-2">
              <span className="font-mono text-xs text-gray-500 uppercase tracking-wider">
                {lang}
              </span>
              <button
                type="button"
                onClick={() => copyCode(block.id, codeText)}
                className="flex items-center gap-1.5 rounded px-2 py-1 font-mono text-xs text-gray-400 hover:text-cyan-400 hover:bg-gray-700/50 transition-colors"
              >
                <Copy className="h-3.5 w-3.5" />
                {copiedId === block.id ? "Copied" : "Copy"}
              </button>
            </div>
            <pre className="p-4 overflow-x-auto text-sm">
              <code className="font-mono text-pink-400/95 bg-transparent">
                {codeText}
              </code>
            </pre>
          </div>
        );
        break;
      }

      case "divider":
        nodes.push(
          <hr key={block.id} className="my-6 border-gray-700" />
        );
        break;

      case "table": {
        const tableData = (block as { table?: { has_column_header?: boolean } }).table;
        const rows = block.children ?? [];

        nodes.push(
          <div
            key={block.id}
            className="my-8 w-full overflow-x-auto rounded-lg border border-gray-800 bg-[#0a0a0a] shadow-[0_0_10px_rgba(0,0,0,0.3)]"
          >
            <table className="w-full border-collapse text-sm">
              <tbody>
                {rows.map((rowBlock, rowIndex) => {
                  if (rowBlock.type !== "table_row") return null;
                  const rowData = (rowBlock as { table_row?: { cells?: NotionRichText[][] } }).table_row;
                  const cells = rowData?.cells ?? [];
                  const isHeaderRow = !!(tableData?.has_column_header && rowIndex === 0);

                  return (
                    <tr
                      key={rowBlock.id}
                      className={
                        isHeaderRow ? "bg-gray-900/80" : "hover:bg-gray-800/30 transition-colors"
                      }
                    >
                      {cells.map((cell, cellIndex) => {
                        const CellTag = isHeaderRow ? "th" : "td";
                        const cellClasses = isHeaderRow
                          ? "border-b border-gray-700 px-4 py-3 text-left font-mono font-bold text-cyan-400 tracking-wide whitespace-nowrap"
                          : "min-w-[120px] border-b border-gray-800 px-4 py-3 text-gray-300";

                        return (
                          <CellTag key={`${rowBlock.id}-${cellIndex}`} className={cellClasses}>
                            <TextRenderer richText={Array.isArray(cell) ? cell : []} />
                          </CellTag>
                        );
                      })}
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        );
        break;
      }

      case "child_page":
      case "child_database":
      case "unsupported":
        break;

      case "image": {
        const img = block.image;
        const url =
          img?.type === "file"
            ? img.file?.url
            : img?.type === "external"
              ? img.external?.url
              : null;
        const alt =
          (img?.caption ?? [])
            .map((c) => (c as NotionRichText).text?.content ?? "")
            .join("")
            .trim() || "Post image";
        if (url) {
          nodes.push(
            <div key={block.id} className="my-8 flex justify-center">
              <Image
                src={url}
                alt={alt}
                width={800}
                height={450}
                className="mx-auto rounded-lg shadow-lg max-w-full h-auto"
                unoptimized
                sizes="(max-width: 768px) 100vw, 800px"
              />
            </div>
          );
        }
        break;
      }

      default:
        if (rich.length > 0) {
          nodes.push(
            <p key={block.id} className="my-6 text-gray-300">
              <TextRenderer richText={rich} />
            </p>
          );
        }
        if (Array.isArray(children) && children.length > 0) {
          nodes.push(
            <div key={`${block.id}-children`} className="ml-4">
              <BlockRenderer blocks={children} accent={accent} />
            </div>
          );
        }
    }
    i++;
  }

  return <>{nodes}</>;
}
