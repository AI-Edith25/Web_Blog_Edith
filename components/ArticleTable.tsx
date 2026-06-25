import Link from "next/link";
import type { Article } from "@/types/article";
import StatusBadge from "./StatusBadge";
import DeleteArticleButton from "./DeleteArticleButton";
import { formatDate, formatRelativeTime } from "@/lib/format";

export default function ArticleTable({
  articles,
  dateColumn = "updated",
}: {
  articles: Article[];
  dateColumn?: "updated" | "scheduledFor";
}) {
  if (articles.length === 0) {
    return (
      <p className="rounded-lg border border-dashed border-outline-variant p-10 text-center text-sm text-on-surface-variant">
        No articles here yet.
      </p>
    );
  }

  return (
    <div className="overflow-x-auto rounded-lg border border-outline-variant bg-surface-container-lowest">
      <table className="w-full min-w-[640px] text-left text-sm">
        <thead>
          <tr className="border-b border-outline-variant text-xs text-on-surface-variant">
            <th className="eyebrow px-5 py-3 font-medium">Title</th>
            <th className="eyebrow px-5 py-3 font-medium">Category</th>
            <th className="eyebrow px-5 py-3 font-medium">Status</th>
            <th className="eyebrow px-5 py-3 font-medium">
              {dateColumn === "scheduledFor" ? "Scheduled For" : "Updated"}
            </th>
            <th className="eyebrow px-5 py-3 font-medium">Actions</th>
          </tr>
        </thead>
        <tbody>
          {articles.map((article) => (
            <tr key={article.id} className="border-b border-outline-variant last:border-0">
              <td className="px-5 py-4">
                <Link
                  href={`/studio/edit/${article.id}`}
                  className="font-medium text-on-surface hover:text-secondary"
                >
                  {article.title}
                </Link>
              </td>
              <td className="px-5 py-4 text-on-surface-variant">{article.category}</td>
              <td className="px-5 py-4">
                <StatusBadge status={article.status} />
              </td>
              <td className="px-5 py-4 text-on-surface-variant">
                {dateColumn === "scheduledFor"
                  ? formatDate(article.scheduledFor)
                  : formatRelativeTime(article.updatedAt)}
              </td>
              <td className="px-5 py-4">
                <div className="flex items-center gap-4">
                  <Link
                    href={`/studio/edit/${article.id}`}
                    className="text-sm font-medium text-on-surface hover:text-secondary"
                  >
                    Edit
                  </Link>
                  <DeleteArticleButton id={article.id} title={article.title} />
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
