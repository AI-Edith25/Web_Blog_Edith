import type { Metadata } from "next";
import { notFound } from "next/navigation";
import ArticleEditor from "@/components/ArticleEditor";
import { getArticleById } from "@/lib/articles";

type EditArticlePageProps = { params: Promise<{ id: string }> };

export const metadata: Metadata = {
  title: "Edit Article — Edith Studio",
  robots: { index: false, follow: false },
};

export const dynamic = "force-dynamic";

export default async function EditArticlePage({ params }: EditArticlePageProps) {
  const { id } = await params;
  const article = getArticleById(id);
  if (!article) {
    notFound();
  }

  return <ArticleEditor mode="edit" article={article} />;
}
