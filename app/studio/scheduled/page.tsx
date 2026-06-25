import { listArticles } from "@/lib/articles";
import ArticleTable from "@/components/ArticleTable";

export const dynamic = "force-dynamic";

export default function StudioScheduledPage() {
  const articles = listArticles({ status: "scheduled" });

  return (
    <div className="p-6 lg:p-10">
      <h1 className="font-display text-2xl font-semibold text-on-surface">Scheduled</h1>
      <p className="mt-1 text-sm text-on-surface-variant">
        Articles queued to publish automatically at a future date.
      </p>

      <div className="mt-8">
        <ArticleTable articles={articles} dateColumn="scheduledFor" />
      </div>
    </div>
  );
}
