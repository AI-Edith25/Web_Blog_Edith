import { NextRequest, NextResponse } from "next/server";
import { deleteArticle, generateUniqueSlug, getArticleById, updateArticle } from "@/lib/articles";
import { validateArticleInput } from "@/lib/validateArticleInput";

export const dynamic = "force-dynamic";

type RouteContext = { params: Promise<{ id: string }> };

export async function GET(_request: NextRequest, { params }: RouteContext) {
  const { id } = await params;
  const article = getArticleById(id);
  if (!article) {
    return NextResponse.json({ error: "Article not found" }, { status: 404 });
  }
  return NextResponse.json({ article });
}

export async function PUT(request: NextRequest, { params }: RouteContext) {
  const { id } = await params;
  const existing = getArticleById(id);
  if (!existing) {
    return NextResponse.json({ error: "Article not found" }, { status: 404 });
  }

  const body = await request.json().catch(() => null);
  const result = validateArticleInput(body);
  if ("error" in result) {
    return NextResponse.json({ error: result.error }, { status: 400 });
  }

  const slug = generateUniqueSlug(result.data.slug, id);
  const article = updateArticle(id, { ...result.data, slug });
  return NextResponse.json({ article });
}

export async function DELETE(_request: NextRequest, { params }: RouteContext) {
  const { id } = await params;
  const deleted = deleteArticle(id);
  if (!deleted) {
    return NextResponse.json({ error: "Article not found" }, { status: 404 });
  }
  return NextResponse.json({ ok: true });
}
