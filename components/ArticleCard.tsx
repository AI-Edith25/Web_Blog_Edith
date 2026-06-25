import Link from "next/link";
import type { Article } from "@/types/article";
import CategoryChip from "./CategoryChip";

export default function ArticleCard({
  article,
  variant = "list",
}: {
  article: Article;
  variant?: "featured" | "list" | "related";
}) {
  if (variant === "featured") {
    return (
      <Link
        href={`/article/${article.slug}`}
        className="group block overflow-hidden rounded-lg border border-outline-variant bg-surface-container-lowest shadow-soft transition-shadow hover:shadow-[0_8px_30px_rgba(24,30,52,0.1)]"
      >
        <div className="aspect-[16/10] w-full overflow-hidden bg-primary">
          {/* eslint-disable-next-line @next/next/no-img-element -- local SVG placeholder, next/image blocks unoptimized SVG */}
          <img
            src={article.coverImageUrl}
            alt={article.title}
            className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
          />
        </div>
        <div className="p-6 lg:p-8">
          <CategoryChip category={article.category} variant="text" />
          <h3 className="font-display mt-3 text-2xl font-semibold leading-snug text-on-surface lg:text-3xl">
            {article.title}
          </h3>
          <p className="mt-3 text-base leading-relaxed text-on-surface-variant">
            {article.excerpt}
          </p>
        </div>
      </Link>
    );
  }

  if (variant === "related") {
    return (
      <Link
        href={`/article/${article.slug}`}
        className="group flex gap-4 rounded-lg border border-outline-variant bg-surface-container-lowest p-3 transition-shadow hover:shadow-soft"
      >
        <div className="h-20 w-20 shrink-0 overflow-hidden rounded bg-primary">
          {/* eslint-disable-next-line @next/next/no-img-element -- local SVG placeholder, next/image blocks unoptimized SVG */}
          <img
            src={article.coverImageUrl}
            alt={article.title}
            className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
          />
        </div>
        <div className="min-w-0">
          <CategoryChip category={article.category} variant="text" />
          <h4 className="font-display mt-1 line-clamp-2 text-base font-semibold leading-snug text-on-surface">
            {article.title}
          </h4>
        </div>
      </Link>
    );
  }

  return (
    <Link href={`/article/${article.slug}`} className="group flex gap-4">
      <div className="h-20 w-28 shrink-0 overflow-hidden rounded bg-primary">
        {/* eslint-disable-next-line @next/next/no-img-element -- local SVG placeholder, next/image blocks unoptimized SVG */}
        <img
          src={article.coverImageUrl}
          alt={article.title}
          className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
        />
      </div>
      <div className="min-w-0">
        <CategoryChip category={article.category} variant="text" />
        <h4 className="font-display mt-1 line-clamp-2 text-lg font-semibold leading-snug text-on-surface">
          {article.title}
        </h4>
      </div>
    </Link>
  );
}
