import { CATEGORIES, STATUSES } from "@/types/article";
import type { ArticleInput } from "@/types/article";

export function validateArticleInput(body: unknown): { error: string } | { data: ArticleInput } {
  if (typeof body !== "object" || body === null) {
    return { error: "Request body must be an object" };
  }
  const b = body as Record<string, unknown>;

  if (typeof b.title !== "string" || b.title.trim().length === 0) {
    return { error: "title is required" };
  }
  if (!CATEGORIES.includes(b.category as never)) {
    return { error: `category must be one of: ${CATEGORIES.join(", ")}` };
  }
  if (!STATUSES.includes(b.status as never)) {
    return { error: `status must be one of: ${STATUSES.join(", ")}` };
  }
  const author = b.author as Record<string, unknown> | undefined;
  if (
    !author ||
    typeof author.name !== "string" ||
    typeof author.role !== "string" ||
    typeof author.avatarUrl !== "string"
  ) {
    return { error: "author { name, role, avatarUrl } is required" };
  }

  const data: ArticleInput = {
    title: b.title.trim(),
    slug: typeof b.slug === "string" && b.slug.trim() ? b.slug.trim() : b.title.trim(),
    category: b.category as ArticleInput["category"],
    author: {
      name: author.name,
      role: author.role,
      avatarUrl: author.avatarUrl,
    },
    coverImageUrl: typeof b.coverImageUrl === "string" ? b.coverImageUrl : "",
    excerpt: typeof b.excerpt === "string" ? b.excerpt : "",
    bodyHtml: typeof b.bodyHtml === "string" ? b.bodyHtml : "",
    seoMetaDescription:
      typeof b.seoMetaDescription === "string" ? b.seoMetaDescription.slice(0, 160) : "",
    keywords: Array.isArray(b.keywords) ? b.keywords.filter((k) => typeof k === "string") : [],
    status: b.status as ArticleInput["status"],
    scheduledFor: typeof b.scheduledFor === "string" ? b.scheduledFor : null,
  };

  return { data };
}
