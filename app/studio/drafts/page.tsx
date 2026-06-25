import Link from "next/link";
import { listArticles } from "@/lib/articles";
import ArticleTable from "@/components/ArticleTable";

export const dynamic = "force-dynamic";

export default function StudioDraftsPage() {
  const articles = listArticles({ status: "drafting" });

  return (
    <div className="p-6 lg:p-10">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <h1 className="font-display text-2xl font-semibold text-on-surface">Drafts</h1>
          <p className="mt-1 text-sm text-on-surface-variant">
            Articles still being written, not yet published or scheduled.
          </p>
        </div>
        <Link
          href="/studio/new"
          className="eyebrow rounded bg-secondary px-5 py-2.5 text-on-secondary transition-opacity hover:opacity-90"
        >
          + New Article
        </Link>
      </div>

      <div className="mt-8">
        <ArticleTable articles={articles} />
      </div>
    </div>
  );
}
