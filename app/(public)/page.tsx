import Link from "next/link";
import type { Metadata } from "next";
import Navbar from "@/components/Navbar";
import Container from "@/components/Container";
import ArticleCard from "@/components/ArticleCard";
import NewsletterCard from "@/components/NewsletterCard";
import { listPublishedArticles } from "@/lib/articles";
import { CATEGORIES, type Category } from "@/types/article";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Edith Clinic — Clinical Elegance Journal",
};

const FOCUS_AREAS: { name: string; icon: string; description: string }[] = [
  {
    name: "Radiance",
    icon: "auto_awesome",
    description: "Light-reflecting protocols engineered for visible luminosity.",
  },
  {
    name: "Hydration",
    icon: "water_drop",
    description: "Multi-layer moisture therapy delivered at the dermal level.",
  },
  {
    name: "Longevity",
    icon: "hourglass_top",
    description: "Long-range collagen support for resilient, lasting structure.",
  },
  {
    name: "Medical Facial",
    icon: "face_retouching_natural",
    description: "Clinical-grade facials guided by diagnostic precision.",
  },
];

export default async function HomePage({
  searchParams,
}: {
  searchParams: Promise<{ category?: string }>;
}) {
  const { category: rawCategory } = await searchParams;
  const category = CATEGORIES.includes(rawCategory as Category)
    ? (rawCategory as Category)
    : undefined;

  const published = listPublishedArticles();
  const latestArticle = published[0];
  const filtered = category ? published.filter((a) => a.category === category) : published;
  const [featured, ...rest] = filtered;
  const list = rest.slice(0, 3);

  return (
    <>
      <section className="relative isolate overflow-hidden bg-primary">
        <Navbar variant="transparent" />

        <div aria-hidden className="pointer-events-none absolute inset-0 overflow-hidden">
          <div className="absolute right-[-220px] top-1/2 h-[600px] w-[600px] -translate-y-1/2 rounded-full border border-secondary/15" />
          <div className="absolute right-[-80px] top-1/2 h-[440px] w-[440px] -translate-y-1/2 rounded-full border border-secondary/25" />
          <div className="absolute right-[120px] top-1/2 h-[260px] w-[260px] -translate-y-1/2 rounded-full border border-secondary/35" />
          <div className="absolute right-[180px] top-1/2 h-[120px] w-[120px] -translate-y-1/2 rounded-full bg-secondary/30 blur-3xl" />
        </div>

        <Container className="relative pb-24 pt-36 lg:pb-36 lg:pt-48">
          <p className="eyebrow text-secondary-container">Clinical Elegance Edition</p>
          <h1 className="font-display mt-5 max-w-2xl text-5xl font-semibold leading-[1.08] text-on-primary lg:text-7xl">
            The Science of Subsurface Glow
          </h1>
          <p className="mt-6 max-w-lg text-base leading-relaxed text-on-primary/70 lg:text-lg">
            A clinical journal exploring the cellular mechanics behind luminous, resilient skin —
            translated from research to ritual.
          </p>
          <div className="mt-10 flex flex-wrap items-center gap-6">
            <Link
              href={latestArticle ? `/article/${latestArticle.slug}` : "/#latest-insights"}
              className="eyebrow rounded bg-secondary px-7 py-3.5 text-on-secondary transition-opacity hover:opacity-90"
            >
              Read Protocol →
            </Link>
            <div className="flex items-center gap-3 text-sm text-on-primary/60">
              <span className="h-8 w-px bg-on-primary/20" aria-hidden />
              Vol. 04 — The Renewal Series
            </div>
          </div>
        </Container>
      </section>

      <section className="py-16 lg:py-20">
        <Container className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
          {FOCUS_AREAS.map((area) => (
            <div
              key={area.name}
              className="rounded-lg border border-outline-variant bg-surface-container-lowest p-6 shadow-soft"
            >
              <span className="material-symbols-outlined text-secondary">{area.icon}</span>
              <h3 className="font-display mt-4 text-lg font-semibold text-on-surface">
                {area.name}
              </h3>
              <p className="mt-2 text-sm leading-relaxed text-on-surface-variant">
                {area.description}
              </p>
            </div>
          ))}
        </Container>
      </section>

      <section id="latest-insights" className="py-16 lg:py-28">
        <Container>
          <div className="flex flex-wrap items-end justify-between gap-4">
            <div>
              <p className="eyebrow text-secondary">Protocol Updates</p>
              <h2 className="font-display mt-3 text-3xl font-semibold text-on-surface lg:text-4xl">
                Latest Insights
              </h2>
              {category && (
                <p className="mt-2 text-sm text-on-surface-variant">
                  Filtered by <span className="font-medium text-on-surface">{category}</span>
                </p>
              )}
            </div>
            <Link
              href="/#latest-insights"
              className="eyebrow text-on-surface-variant transition-colors hover:text-secondary"
            >
              View All Articles
            </Link>
          </div>

          {filtered.length === 0 ? (
            <p className="mt-12 text-on-surface-variant">
              No published articles in this category yet.
            </p>
          ) : (
            <div className="mt-12 grid grid-cols-1 gap-10 lg:grid-cols-[1.4fr_1fr]">
              {featured && <ArticleCard article={featured} variant="featured" />}
              <div className="flex flex-col gap-8">
                {list.map((article) => (
                  <ArticleCard key={article.id} article={article} variant="list" />
                ))}
              </div>
            </div>
          )}
        </Container>
      </section>

      <section className="py-16 lg:py-28">
        <Container className="max-w-2xl">
          <NewsletterCard variant="light" />
        </Container>
      </section>
    </>
  );
}
