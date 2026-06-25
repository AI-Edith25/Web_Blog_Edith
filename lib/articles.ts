import { randomUUID } from "crypto";
import { getDb } from "./db";
import { slugify } from "./slugify";
import { calculateReadTime } from "./readTime";
import type { Article, ArticleInput, ArticleStatus } from "@/types/article";

interface ArticleRow {
  id: string;
  slug: string;
  title: string;
  category: string;
  authorName: string;
  authorRole: string;
  authorAvatarUrl: string;
  coverImageUrl: string;
  excerpt: string;
  bodyHtml: string;
  readTimeMinutes: number;
  seoMetaDescription: string;
  keywords: string;
  status: string;
  publishedAt: string | null;
  scheduledFor: string | null;
  createdAt: string;
  updatedAt: string;
}

function rowToArticle(row: ArticleRow): Article {
  return {
    id: row.id,
    slug: row.slug,
    title: row.title,
    category: row.category as Article["category"],
    author: {
      name: row.authorName,
      role: row.authorRole,
      avatarUrl: row.authorAvatarUrl,
    },
    coverImageUrl: row.coverImageUrl,
    excerpt: row.excerpt,
    bodyHtml: row.bodyHtml,
    readTimeMinutes: row.readTimeMinutes,
    seoMetaDescription: row.seoMetaDescription,
    keywords: JSON.parse(row.keywords || "[]"),
    status: row.status as ArticleStatus,
    publishedAt: row.publishedAt,
    scheduledFor: row.scheduledFor,
    createdAt: row.createdAt,
    updatedAt: row.updatedAt,
  };
}

export function generateUniqueSlug(title: string, excludeId?: string): string {
  const db = getDb();
  const base = slugify(title) || "article";
  let candidate = base;
  let suffix = 2;
  while (true) {
    const existing = db
      .prepare("SELECT id FROM articles WHERE slug = ?")
      .get(candidate) as { id: string } | undefined;
    if (!existing || existing.id === excludeId) break;
    candidate = `${base}-${suffix}`;
    suffix += 1;
  }
  return candidate;
}

export function listArticles(filter?: { status?: ArticleStatus }): Article[] {
  const db = getDb();
  const rows = filter?.status
    ? (db
        .prepare("SELECT * FROM articles WHERE status = ? ORDER BY updatedAt DESC")
        .all(filter.status) as ArticleRow[])
    : (db.prepare("SELECT * FROM articles ORDER BY updatedAt DESC").all() as ArticleRow[]);
  return rows.map(rowToArticle);
}

export function listPublishedArticles(): Article[] {
  const db = getDb();
  const rows = db
    .prepare("SELECT * FROM articles WHERE status = 'published' ORDER BY publishedAt DESC")
    .all() as ArticleRow[];
  return rows.map(rowToArticle);
}

export function getArticleBySlug(slug: string): Article | null {
  const db = getDb();
  const row = db.prepare("SELECT * FROM articles WHERE slug = ?").get(slug) as
    | ArticleRow
    | undefined;
  return row ? rowToArticle(row) : null;
}

export function getPublishedArticleBySlug(slug: string): Article | null {
  const db = getDb();
  const row = db
    .prepare("SELECT * FROM articles WHERE slug = ? AND status = 'published'")
    .get(slug) as ArticleRow | undefined;
  return row ? rowToArticle(row) : null;
}

export function getArticleById(id: string): Article | null {
  const db = getDb();
  const row = db.prepare("SELECT * FROM articles WHERE id = ?").get(id) as
    | ArticleRow
    | undefined;
  return row ? rowToArticle(row) : null;
}

export function getRelatedArticles(article: Article, limit = 3): Article[] {
  const db = getDb();
  const rows = db
    .prepare(
      `SELECT * FROM articles
       WHERE status = 'published' AND id != ? AND category = ?
       ORDER BY publishedAt DESC LIMIT ?`
    )
    .all(article.id, article.category, limit) as ArticleRow[];
  if (rows.length < limit) {
    const more = db
      .prepare(
        `SELECT * FROM articles
         WHERE status = 'published' AND id != ? AND category != ?
         ORDER BY publishedAt DESC LIMIT ?`
      )
      .all(article.id, article.category, limit - rows.length) as ArticleRow[];
    return [...rows, ...more].map(rowToArticle);
  }
  return rows.map(rowToArticle);
}

export function getAdjacentArticles(article: Article): {
  previous: Article | null;
  next: Article | null;
} {
  const published = listPublishedArticles();
  const index = published.findIndex((a) => a.id === article.id);
  if (index === -1) return { previous: null, next: null };
  return {
    previous: published[index + 1] ?? null,
    next: published[index - 1] ?? null,
  };
}

export function createArticle(input: ArticleInput): Article {
  const db = getDb();
  const now = new Date().toISOString();
  const id = randomUUID();
  const readTimeMinutes = calculateReadTime(input.bodyHtml);
  const publishedAt = input.status === "published" ? now : null;

  db.prepare(
    `INSERT INTO articles
     (id, slug, title, category, authorName, authorRole, authorAvatarUrl,
      coverImageUrl, excerpt, bodyHtml, readTimeMinutes, seoMetaDescription,
      keywords, status, publishedAt, scheduledFor, createdAt, updatedAt)
     VALUES (@id, @slug, @title, @category, @authorName, @authorRole, @authorAvatarUrl,
      @coverImageUrl, @excerpt, @bodyHtml, @readTimeMinutes, @seoMetaDescription,
      @keywords, @status, @publishedAt, @scheduledFor, @createdAt, @updatedAt)`
  ).run({
    id,
    slug: input.slug,
    title: input.title,
    category: input.category,
    authorName: input.author.name,
    authorRole: input.author.role,
    authorAvatarUrl: input.author.avatarUrl,
    coverImageUrl: input.coverImageUrl,
    excerpt: input.excerpt,
    bodyHtml: input.bodyHtml,
    readTimeMinutes,
    seoMetaDescription: input.seoMetaDescription,
    keywords: JSON.stringify(input.keywords),
    status: input.status,
    publishedAt,
    scheduledFor: input.scheduledFor,
    createdAt: now,
    updatedAt: now,
  });

  return getArticleById(id)!;
}

export function updateArticle(id: string, input: ArticleInput): Article | null {
  const db = getDb();
  const existing = getArticleById(id);
  if (!existing) return null;

  const now = new Date().toISOString();
  const readTimeMinutes = calculateReadTime(input.bodyHtml);
  const publishedAt =
    input.status === "published" ? existing.publishedAt ?? now : existing.publishedAt;

  db.prepare(
    `UPDATE articles SET
       slug = @slug, title = @title, category = @category,
       authorName = @authorName, authorRole = @authorRole, authorAvatarUrl = @authorAvatarUrl,
       coverImageUrl = @coverImageUrl, excerpt = @excerpt, bodyHtml = @bodyHtml,
       readTimeMinutes = @readTimeMinutes, seoMetaDescription = @seoMetaDescription,
       keywords = @keywords, status = @status, publishedAt = @publishedAt,
       scheduledFor = @scheduledFor, updatedAt = @updatedAt
     WHERE id = @id`
  ).run({
    id,
    slug: input.slug,
    title: input.title,
    category: input.category,
    authorName: input.author.name,
    authorRole: input.author.role,
    authorAvatarUrl: input.author.avatarUrl,
    coverImageUrl: input.coverImageUrl,
    excerpt: input.excerpt,
    bodyHtml: input.bodyHtml,
    readTimeMinutes,
    seoMetaDescription: input.seoMetaDescription,
    keywords: JSON.stringify(input.keywords),
    status: input.status,
    publishedAt,
    scheduledFor: input.scheduledFor,
    updatedAt: now,
  });

  return getArticleById(id);
}

export function deleteArticle(id: string): boolean {
  const db = getDb();
  const result = db.prepare("DELETE FROM articles WHERE id = ?").run(id);
  return result.changes > 0;
}
