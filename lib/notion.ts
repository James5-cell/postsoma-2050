import { Client } from "@notionhq/client";
import type { PageObjectResponse } from "@notionhq/client/build/src/api-endpoints";
import type { Post } from "./posts";
import { CATEGORIES, type Category } from "./design-tokens";

/**
 * Maps our internal category slugs to exact Notion database category strings.
 * DO NOT MODIFY - these strings must match Notion exactly (including spaces and Chinese characters).
 */
const CATEGORY_MAP: Record<string, string> = {
  "ai-insights": "AI資訊 AI Insights",
  "blockchain": "區塊鏈 Blockchain",
  "investing": "投資觀念 Investing",
  "philosophy": "價值觀 Philosophy",
  "sheshin-notes": "覺觀筆記 Sheshin Notes"
};

/**
 * Reverse map: converts Notion category string to our internal Category type.
 */
const NOTION_TO_CATEGORY: Record<string, Category> = {
  "AI資訊 AI Insights": "AI Insights",
  "區塊鏈 Blockchain": "Blockchain",
  "投資觀念 Investing": "Investing",
  "價值觀 Philosophy": "Philosophy",
  "覺觀筆記 Sheshin Notes": "Sheshin Notes",
};

function getCategoryFromNotion(notionCategory: string | null): Category {
  if (!notionCategory) return "AI Insights";

  const category = NOTION_TO_CATEGORY[notionCategory];
  if (category && CATEGORIES.includes(category)) {
    return category;
  }

  console.warn(`⚠️ Unknown Notion category: "${notionCategory}", defaulting to "AI Insights"`);
  return "AI Insights";
}

function getNotionClient(): Client {
  const key = process.env.NOTION_API_KEY;
  if (!key) {
    throw new Error(
      "NOTION_API_KEY is missing. Add it to .env.local (see .env.example or README)."
    );
  }
  return new Client({ auth: key });
}

/**
 * Extract the title of a Notion page (first property of type "title").
 * Safe: never accesses [0] on an empty array.
 */
function getPageTitle(page: PageObjectResponse): string {
  try {
    const titleProp = Object.values(page.properties || {}).find(
      (p) => p && typeof p === "object" && "type" in p && p.type === "title"
    );
    if (!titleProp || !("title" in titleProp) || !Array.isArray(titleProp.title))
      return "(no title)";
    const first = titleProp.title.length > 0 ? titleProp.title[0] : null;
    const text = first && typeof first === "object" && "plain_text" in first ? (first as { plain_text?: string }).plain_text : undefined;
    return text ?? "(empty)";
  } catch {
    return "(no title)";
  }
}

/**
 * Test the Notion connection: init client, query the database, and log the first page's title.
 * Use this to confirm your integration (e.g. PostSoma-Bot) is online and the DB is shared.
 */
export async function testNotionConnection(): Promise<void> {
  const databaseId = process.env.NOTION_DATABASE_ID;
  if (!databaseId) {
    console.error(
      "NOTION_DATABASE_ID is missing. Add it to .env.local (use the ID from your Notion database URL)."
    );
    process.exitCode = 1;
    return;
  }

  try {
    const notion = getNotionClient();

    // v5 API: retrieve database to get its data_source id, then query that data source
    const db = await notion.databases.retrieve({ database_id: databaseId });
    const dataSourceId =
      "data_sources" in db && db.data_sources?.length
        ? db.data_sources[0].id
        : databaseId;

    const response = await notion.dataSources.query({
      data_source_id: dataSourceId,
      page_size: 1,
      result_type: "page",
    });

    if (response.results.length === 0) {
      console.log("Connection OK. Database is empty (no pages yet).");
      return;
    }

    const first = response.results[0];
    if (first.object !== "page" || !("properties" in first)) {
      console.log("Connection OK. First result is not a full page object.");
      return;
    }

    const title = getPageTitle(first);
    console.log("PostSoma-Bot is online. First page title:", title);
  } catch (err) {
    const message = err instanceof Error ? err.message : String(err);
    if (
      message.includes("Could not find database") ||
      message.includes("object_not_found") ||
      message.includes("unauthorized")
    ) {
      console.error(
        "Notion connection failed: the database was not found or this integration doesn’t have access.\n" +
        "In Notion, open the database → ... → Connections → Add connection → select your PostSoma-Bot integration."
      );
    } else if (message.includes("Invalid API key") || message.includes("401")) {
      console.error(
        "Notion connection failed: invalid or missing NOTION_API_KEY. Check .env.local."
      );
    } else {
      console.error("Notion connection failed:", message);
    }
    process.exitCode = 1;
  }
}

/** Safe read from Notion page properties. Never accesses [0] on empty arrays. */
function mapPageToPost(page: PageObjectResponse): Post | null {
  try {
    const p = page.properties ?? {};
    if (typeof p !== "object") return null;

    const getTitle = (key: string): string => {
      const prop = p[key];
      if (!prop || typeof prop !== "object" || !("title" in prop)) return "";
      const arr = (prop as { title?: unknown[] }).title;
      if (!Array.isArray(arr) || arr.length === 0) return "";
      const first = arr[0];
      const text = first && typeof first === "object" && "plain_text" in first ? (first as { plain_text?: string }).plain_text : undefined;
      return typeof text === "string" ? text : "";
    };

    const getRichText = (key: string): string | null => {
      const prop = p[key];
      if (!prop || typeof prop !== "object" || !("rich_text" in prop)) return null;
      const arr = (prop as { rich_text?: unknown[] }).rich_text;
      if (!Array.isArray(arr) || arr.length === 0) return null;
      const first = arr[0];
      const text = first && typeof first === "object" && "plain_text" in first ? (first as { plain_text?: string }).plain_text : undefined;
      return typeof text === "string" ? text : null;
    };

    const getSelect = (key: string): string | null => {
      const prop = p[key];
      if (!prop || typeof prop !== "object" || !("select" in prop)) return null;
      const sel = (prop as { select?: { name?: string } }).select;
      const name = sel?.name;
      return typeof name === "string" ? name : null;
    };

    const getDate = (key: string): string | null => {
      const prop = p[key];
      if (!prop || typeof prop !== "object" || !("date" in prop)) return null;
      const date = (prop as { date?: { start?: string } }).date;
      const start = date?.start;
      return typeof start === "string" ? start : null;
    };

    const getMultiSelect = (key: string): string[] => {
      const prop = p[key];
      if (!prop || typeof prop !== "object" || !("multi_select" in prop)) return [];
      const arr = (prop as { multi_select?: Array<{ name?: string }> }).multi_select;
      if (!Array.isArray(arr)) return [];
      return arr.map((x) => (x && typeof x.name === "string" ? x.name : "")).filter(Boolean);
    };

    const getCheckbox = (key: string): boolean => {
      const prop = p[key];
      if (!prop || typeof prop !== "object" || !("checkbox" in prop)) return false;
      return (prop as { checkbox?: boolean }).checkbox === true;
    };

    const name = getTitle("Name") || getPageTitle(page);
    const slugRaw = getRichText("Slug");
    const slug = typeof slugRaw === "string" && slugRaw
      ? slugRaw
      : (name ? name.toLowerCase().replace(/\s+/g, "-") : "") || (page.id ?? "");
    if (!name && !slug) return null;

    const rawCategory = getSelect("Category");
    const category: Category = getCategoryFromNotion(rawCategory);

    return {
      id: typeof page.id === "string" ? page.id : "",
      name: name || "Untitled Post",
      slug: typeof slug === "string" ? slug : String(page.id ?? ""),
      category,
      subCategory: getSelect("Sub-Category") ?? null, // Notion Select property "Sub-Category"
      summary: getRichText("Summary") ?? null,
      tags: getMultiSelect("Tags") ?? [],
      cover: null,
      publishedDate: getDate("Published Date") ?? getDate("Date") ?? null,
      featured: getCheckbox("Featured"),
    };
  } catch (err) {
    console.warn(`⚠️ Failed to parse post: ${page?.id ?? "unknown"}`, err);
    return null;
  }
}

/**
 * Fetches published posts from the Notion database.
 * Strict filter: only returns pages where Status equals "Done".
 * Optional categorySlug narrows to that category (uses CATEGORY_MAP for exact Notion value).
 */
export async function getPublishedPosts(categorySlug?: string): Promise<Post[]> {
  const databaseId = process.env.NOTION_DATABASE_ID;
  if (!databaseId || !process.env.NOTION_API_KEY) {
    console.error("❌ Missing Notion env variables (NOTION_DATABASE_ID or NOTION_API_KEY)");
    return [];
  }

  try {
    const notion = getNotionClient();
    const db = await notion.databases.retrieve({ database_id: databaseId });
    const dataSourceId =
      "data_sources" in db && Array.isArray(db.data_sources) && db.data_sources.length > 0
        ? (db.data_sources[0] as { id?: string }).id
        : databaseId;
    if (!dataSourceId) {
      console.error("❌ Could not resolve Notion data source id");
      return [];
    }

    // 1. Base filter: Status MUST be "Done"
    const andFilters: Array<{ property: string; status: { equals: string } } | { property: string; select: { equals: string } }> = [
      { property: "Status", status: { equals: "Done" } },
    ];

    // 2. Category filter: if requested, add exact Notion category value from CATEGORY_MAP
    if (categorySlug && CATEGORY_MAP[categorySlug]) {
      andFilters.push({
        property: "Category",
        select: { equals: CATEGORY_MAP[categorySlug] },
      });
    }

    const all: Post[] = [];
    let cursor: string | undefined;
    const pageSize = 100;

    do {
      const response = await notion.dataSources.query({
        data_source_id: dataSourceId,
        result_type: "page",
        page_size: pageSize,
        start_cursor: cursor,
        filter: { and: andFilters },
        // Newest first (descending: 2025 → 2024 → 2023)
        sorts: [{ property: "Published Date", direction: "descending" }],
      });

      const results = Array.isArray(response.results) ? response.results : [];
      for (const item of results) {
        if (!item || item.object !== "page" || !("properties" in item)) continue;
        try {
          const post = mapPageToPost(item as PageObjectResponse);
          if (post) all.push(post);
        } catch (err) {
          console.warn(`⚠️ Failed to process page: ${(item as { id?: string })?.id ?? "unknown"}`, err);
        }
      }

      cursor = response.next_cursor ?? undefined;
    } while (cursor);

    // Featured posts first, then newest first within each group
    all.sort((a, b) => {
      // Featured posts pinned at top
      if (a.featured !== b.featured) return a.featured ? -1 : 1;
      // Within group: newest first (descending by Published Date)
      const da = a.publishedDate ?? "";
      const db = b.publishedDate ?? "";
      return db.localeCompare(da);
    });

    return all;
  } catch (error) {
    console.error("🔥 Notion API failed:", error);
    return [];
  }
}

/**
 * Fetches a Notion page's body blocks and returns markdown.
 * Use for rendering full post content. Returns empty string on failure.
 */
export async function getPostMarkdown(pageId: string): Promise<string> {
  if (!pageId || !process.env.NOTION_API_KEY) return "";
  try {
    console.log("✅ Found Page ID:", pageId);

    const { NotionToMarkdown } = await import("notion-to-md");
    const notion = getNotionClient();
    const n2m = new NotionToMarkdown({ notionClient: notion });
    const mdBlocks = await n2m.pageToMarkdown(pageId);
    console.log("📦 Blocks Fetched Count:", mdBlocks?.length ?? 0);

    const mdString = n2m.toMarkdownString(mdBlocks);
    const rawContent =
      typeof mdString === "string" ? mdString : (mdString as { parent?: string } | null)?.parent ?? "";
    const preview = typeof rawContent === "string" ? rawContent.substring(0, 50) : "(no preview)";
    console.log("📝 Markdown Content Preview:", preview);

    return typeof rawContent === "string" ? rawContent : "";
  } catch (err) {
    console.warn("⚠️ Failed to fetch post markdown for page:", pageId, err);
    return "";
  }
}

// --- Notion Blocks API (for NotionRenderer) ---

export type NotionRichText = {
  type: "text";
  text: { content: string; link?: { url: string } | null };
  annotations?: {
    bold?: boolean;
    italic?: boolean;
    strikethrough?: boolean;
    underline?: boolean;
    code?: boolean;
    color?: string;
  };
};

export type NotionBlockContent = {
  rich_text?: NotionRichText[];
  checked?: boolean;
  type?: "file" | "external";
  file?: { url: string };
  external?: { url: string };
  caption?: NotionRichText[];
  /** When true, heading is a toggle; render as <details>/<summary> and show block.children */
  is_toggleable?: boolean;
};

export type NotionCodeContent = {
  rich_text: NotionRichText[];
  language?: string;
};

export type NotionBlock = {
  id: string;
  type: string;
  has_children?: boolean;
  children?: NotionBlock[];
  paragraph?: NotionBlockContent;
  heading_1?: NotionBlockContent;
  heading_2?: NotionBlockContent;
  heading_3?: NotionBlockContent;
  bulleted_list_item?: NotionBlockContent;
  numbered_list_item?: NotionBlockContent;
  to_do?: NotionBlockContent;
  quote?: NotionBlockContent;
  callout?: NotionBlockContent;
  image?: NotionBlockContent;
  toggle?: NotionBlockContent;
  code?: NotionCodeContent;
};

function getBlockContent(block: NotionBlock): NotionBlockContent | undefined {
  const key = block.type as keyof NotionBlock;
  const value = block[key];
  return typeof value === "object" && value !== null && "rich_text" in value
    ? (value as NotionBlockContent)
    : block.type === "image"
      ? block.image
      : undefined;
}

function getRichText(block: NotionBlock): NotionRichText[] {
  const content = getBlockContent(block);
  return Array.isArray(content?.rich_text) ? content.rich_text : [];
}

const PAGE_SIZE = 100;

/**
 * Fetches block children with pagination. Returns flat array of blocks.
 */
async function fetchBlockChildren(
  notion: Client,
  blockId: string
): Promise<NotionBlock[]> {
  const blocks: NotionBlock[] = [];
  let cursor: string | undefined;
  do {
    const response = await notion.blocks.children.list({
      block_id: blockId,
      page_size: PAGE_SIZE,
      start_cursor: cursor,
    });
    const results = Array.isArray(response.results) ? response.results : [];
    for (const b of results) {
      if (b && typeof b === "object" && "id" in b && "type" in b) {
        blocks.push(b as unknown as NotionBlock);
      }
    }
    cursor = (response as { next_cursor?: string }).next_cursor ?? undefined;
  } while (cursor);
  return blocks;
}

/**
 * Recursively fetches children for a block and attaches them to block.children.
 */
async function enrichBlockWithChildren(
  notion: Client,
  block: NotionBlock
): Promise<NotionBlock> {
  const hasChildren =
    block.has_children === true ||
    (block as { has_children?: boolean }).has_children === true;
  if (!hasChildren) {
    return { ...block, children: [] };
  }
  const childBlocks = await fetchBlockChildren(notion, block.id);
  const enrichedChildren = await Promise.all(
    childBlocks.map((c) => enrichBlockWithChildren(notion, c))
  );
  return { ...block, children: enrichedChildren };
}

/**
 * Fetches all top-level blocks of a Notion page with full recursion.
 * Toggle contents, nested lists, and any has_children blocks are populated.
 * Handles pagination (100 blocks per request).
 */
export async function getPostBlocks(pageId: string): Promise<NotionBlock[]> {
  if (!pageId || !process.env.NOTION_API_KEY) return [];
  try {
    const notion = getNotionClient();
    const topBlocks = await fetchBlockChildren(notion, pageId);
    const enriched = await Promise.all(
      topBlocks.map((b) => enrichBlockWithChildren(notion, b))
    );
    return enriched;
  } catch (err) {
    console.warn("⚠️ Failed to fetch blocks for page:", pageId, err);
    return [];
  }
}

function flattenBlocks(blocks: NotionBlock[]): NotionBlock[] {
  const out: NotionBlock[] = [];
  for (const b of blocks) {
    out.push(b);
    if (Array.isArray(b.children) && b.children.length > 0) {
      out.push(...flattenBlocks(b.children));
    }
  }
  return out;
}

/** Extract heading info from blocks (and nested children) for Table of Contents. */
export function getHeadingsFromBlocks(
  blocks: NotionBlock[]
): { text: string; level: number; slug: string }[] {
  const headings: { text: string; level: number; slug: string }[] = [];
  const flat = flattenBlocks(blocks);
  for (const block of flat) {
    const level =
      block.type === "heading_1" ? 1
        : block.type === "heading_2" ? 2
          : block.type === "heading_3" ? 3
            : 0;
    if (level === 0) continue;
    const rich = getRichText(block);
    const text = rich.map((r) => r.text?.content ?? "").join("").trim();
    if (!text) continue;
    const slug = text
      .toLowerCase()
      .replace(/\s+/g, "-")
      .replace(/[^\w\-\u4e00-\u9fa5]/g, "");
    headings.push({ text, level, slug });
  }
  return headings;
}
