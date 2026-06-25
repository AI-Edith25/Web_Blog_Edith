import type { ArticleStatus } from "@/types/article";

const STYLES: Record<ArticleStatus, string> = {
  published: "bg-primary text-on-primary",
  scheduled: "bg-secondary-container text-secondary",
  drafting: "bg-surface-container text-on-surface-variant",
};

const LABELS: Record<ArticleStatus, string> = {
  published: "Published",
  scheduled: "Scheduled",
  drafting: "Drafting",
};

export default function StatusBadge({ status }: { status: ArticleStatus }) {
  return (
    <span className={`eyebrow inline-flex items-center rounded px-2.5 py-1 ${STYLES[status]}`}>
      {LABELS[status]}
    </span>
  );
}
