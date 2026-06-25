import Link from "next/link";
import type { Metadata } from "next";
import { notFound } from "next/navigation";
import Navbar from "@/components/Navbar";
import Container from "@/components/Container";
import CategoryChip from "@/components/CategoryChip";
import ArticleCard from "@/components/ArticleCard";
import NewsletterCard from "@/components/NewsletterCard";
import PullQuote from "@/components/PullQuote";
import ShareButtons from "@/components/ShareButtons";
import { getAdjacentArticles, getPublishedArticleBySlug, getRelatedArticles } from "@/lib/articles";
import { extractPullQuote } from "@/lib/extractPullQuote";
import { extractLede } from "@/lib/extractLede";
import { formatDate } from "@/lib/format";

type ArticlePageProps = { params: Promise<{ slug: string }> };

export async function generateMetadata({ params }: ArticlePageProps): Promise<Metadata> {
  const { slug } = await params;
  const article = getPublishedArticleBySlug(slug);
  if (!article) return {};
  return {
    title: `${article.title} — Edith Clinic`,
    description: article.seoMetaDescription,
  };
}

export const dynamic = "force-dynamic";

export default async function ArticlePage({ params }: ArticlePageProps) {
  const { slug } = await params;
  const article = getPublishedArticleBySlug(slug);
  if (!article) {
    notFound();
  }

  const related = getRelatedArticles(article, 3);
  const { previous, next } = getAdjacentArticles(article);

  const { beforeHtml, pullQuote, afterHtml } = extractPullQuote(article.bodyHtml);
  const { lede, rest: restOfBefore } = extractLede(beforeHtml);

  return (
    <article>
      <Navbar variant="light" />

      <Container className="py-12 lg:py-20">
        <div className="max-w-3xl">
          <CategoryChip category={article.category} variant="chip" />
          <h1 className="font-display mt-5 text-4xl font-semibold leading-[1.1] text-on-surface lg:text-6xl">
            {article.title}
          </h1>
          <div className="mt-6 flex flex-wrap items-center gap-x-3 gap-y-1 text-sm text-on-surface-variant">
            <span className="font-semibold text-secondary">{article.author.name}</span>
            <span aria-hidden>&middot;</span>
            <span>{formatDate(article.publishedAt)}</span>
            <span aria-hidden>&middot;</span>
            <span>{article.readTimeMinutes} Min Read</span>
          </div>
        </div>

        <div className="mt-10 aspect-[16/8] w-full overflow-hidden rounded-lg bg-primary">
          {/* eslint-disable-next-line @next/next/no-img-element -- local SVG placeholder, next/image blocks unoptimized SVG */}
          <img
            src={article.coverImageUrl}
            alt={article.title}
            className="h-full w-full object-cover"
          />
        </div>

        <div className="mt-12 grid grid-cols-1 gap-12 lg:grid-cols-[1fr_360px]">
          <div className="max-w-2xl">
            {lede && <p className="lede" dangerouslySetInnerHTML={{ __html: lede }} />}
            <div className="prose-edith" dangerouslySetInnerHTML={{ __html: restOfBefore }} />
            {pullQuote && (
              <PullQuote
                quote={pullQuote.quote}
                name={pullQuote.name}
                role={pullQuote.role}
                avatarUrl={pullQuote.avatarUrl}
              />
            )}
            {afterHtml && (
              <div className="prose-edith" dangerouslySetInnerHTML={{ __html: afterHtml }} />
            )}
          </div>

          <aside className="flex flex-col gap-10">
            {related.length > 0 && (
              <div>
                <p className="eyebrow text-secondary">Related Protocols</p>
                <div className="mt-4 flex flex-col gap-4">
                  {related.map((item) => (
                    <ArticleCard key={item.id} article={item} variant="related" />
                  ))}
                </div>
              </div>
            )}
            <NewsletterCard
              variant="dark"
              title="The Clinical Edit"
              description="Curated dermatological insight, delivered monthly to those who take their skin seriously."
            />
          </aside>
        </div>

        <div className="mt-16 flex flex-col gap-6 border-t border-outline-variant pt-8 sm:flex-row sm:items-center sm:justify-between">
          <ShareButtons title={article.title} />
          <div className="flex gap-3">
            {previous ? (
              <Link
                href={`/article/${previous.slug}`}
                className="rounded border border-outline-variant px-5 py-2.5 text-sm font-medium text-on-surface transition-colors hover:bg-surface-container-low"
              >
                ← Previous Article
              </Link>
            ) : (
              <span className="rounded border border-outline-variant px-5 py-2.5 text-sm font-medium text-on-surface-variant/40">
                ← Previous Article
              </span>
            )}
            {next ? (
              <Link
                href={`/article/${next.slug}`}
                className="rounded border border-outline-variant px-5 py-2.5 text-sm font-medium text-on-surface transition-colors hover:bg-surface-container-low"
              >
                Next Article →
              </Link>
            ) : (
              <span className="rounded border border-outline-variant px-5 py-2.5 text-sm font-medium text-on-surface-variant/40">
                Next Article →
              </span>
            )}
          </div>
        </div>
      </Container>
    </article>
  );
}
