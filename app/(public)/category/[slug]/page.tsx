import type { Metadata } from "next";
import { notFound } from "next/navigation";
import Navbar from "@/components/Navbar";
import Container from "@/components/Container";
import ArticleCard from "@/components/ArticleCard";
import { listPublishedArticles } from "@/lib/articles";
import { CATEGORIES, type Category } from "@/types/article";

export const dynamic = "force-dynamic";

type CategoryPageProps = { params: Promise<{ slug: string }> };

function resolveCategory(slug: string): Category | null {
  const decoded = decodeURIComponent(slug);
  return CATEGORIES.find((c) => c.toLowerCase() === decoded.toLowerCase()) ?? null;
}

export async function generateMetadata({ params }: CategoryPageProps): Promise<Metadata> {
  const { slug } = await params;
  const category = resolveCategory(slug);
  if (!category) return {};
  return {
    title: `${category} — Edith Clinic`,
    description: `Editorial insights and clinical protocols filed under ${category}.`,
  };
}

export default async function CategoryPage({ params }: CategoryPageProps) {
  const { slug } = await params;
  const category = resolveCategory(slug);
  if (!category) {
    notFound();
  }

  const articles = listPublishedArticles().filter((a) => a.category === category);

  return (
    <>
      <Navbar variant="light" />

      <Container className="py-12 lg:py-20">
        <p className="eyebrow text-secondary">Protocol Updates</p>
        <h1 className="font-display mt-3 text-4xl font-semibold text-on-surface lg:text-5xl">
          {category}
        </h1>
        <p className="mt-4 max-w-xl text-on-surface-variant">
          Editorial insights and clinical protocols filed under {category}.
        </p>

        {articles.length === 0 ? (
          <p className="mt-12 text-on-surface-variant">
            No published articles in this category yet.
          </p>
        ) : (
          <div className="mt-12 grid grid-cols-1 gap-10 sm:grid-cols-2 lg:grid-cols-3">
            {articles.map((article) => (
              <ArticleCard key={article.id} article={article} variant="featured" />
            ))}
          </div>
        )}
      </Container>
    </>
  );
}
