import type { Metadata } from "next";
import ArticleEditor from "@/components/ArticleEditor";

export const metadata: Metadata = {
  title: "New Article — Edith Studio",
  robots: { index: false, follow: false },
};

export default function NewArticlePage() {
  return <ArticleEditor mode="create" />;
}
