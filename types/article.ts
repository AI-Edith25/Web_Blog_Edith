export const CATEGORIES = [
  "Skincare",
  "Treatments",
  "Anti-Aging",
  "Wellness",
  "Clinical Research",
] as const;

export type Category = (typeof CATEGORIES)[number];

export const STATUSES = ["drafting", "scheduled", "published"] as const;

export type ArticleStatus = (typeof STATUSES)[number];

export interface Author {
  name: string;
  role: string;
  avatarUrl: string;
}

export interface Article {
  id: string;
  slug: string;
  title: string;
  category: Category;
  author: Author;
  coverImageUrl: string;
  excerpt: string;
  bodyHtml: string;
  readTimeMinutes: number;
  seoMetaDescription: string;
  keywords: string[];
  status: ArticleStatus;
  publishedAt: string | null;
  scheduledFor: string | null;
  createdAt: string;
  updatedAt: string;
}

export type ArticleInput = {
  title: string;
  slug: string;
  category: Category;
  author: Author;
  coverImageUrl: string;
  excerpt: string;
  bodyHtml: string;
  seoMetaDescription: string;
  keywords: string[];
  status: ArticleStatus;
  scheduledFor: string | null;
};
