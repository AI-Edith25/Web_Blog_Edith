import type { Category } from "@/types/article";

export default function CategoryChip({
  category,
  variant = "chip",
}: {
  category: Category;
  variant?: "chip" | "text";
}) {
  if (variant === "text") {
    return <span className="eyebrow text-secondary">{category}</span>;
  }

  return (
    <span className="eyebrow inline-flex items-center rounded bg-secondary-container/35 px-3 py-1.5 text-secondary">
      {category}
    </span>
  );
}
