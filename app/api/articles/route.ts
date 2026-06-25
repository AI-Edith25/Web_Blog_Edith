import { NextRequest, NextResponse } from "next/server";
import { createArticle, generateUniqueSlug, listArticles } from "@/lib/articles";
import { validateArticleInput } from "@/lib/validateArticleInput";
import type { ArticleStatus } from "@/types/article";
import { STATUSES } from "@/types/article";

export const dynamic = "force-dynamic";

export async function GET(request: NextRequest) {
  const statusParam = request.nextUrl.searchParams.get("status");
  if (statusParam && !STATUSES.includes(statusParam as ArticleStatus)) {
    return NextResponse.json({ error: "invalid status filter" }, { status: 400 });
  }
  const articles = listArticles(
    statusParam ? { status: statusParam as ArticleStatus } : undefined
  );
  return NextResponse.json({ articles });
}

export async function POST(request: NextRequest) {
  const body = await request.json().catch(() => null);
  const result = validateArticleInput(body);
  if ("error" in result) {
    return NextResponse.json({ error: result.error }, { status: 400 });
  }

  const slug = generateUniqueSlug(result.data.slug);
  const article = createArticle({ ...result.data, slug });
  return NextResponse.json({ article }, { status: 201 });
}
