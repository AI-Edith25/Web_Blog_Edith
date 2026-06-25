"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useRef, useState } from "react";
import { CATEGORIES } from "@/types/article";
import type { Article, ArticleInput, ArticleStatus, Category } from "@/types/article";
import StatusBadge from "./StatusBadge";
import { slugify } from "@/lib/slugify";
import { deriveExcerpt } from "@/lib/excerpt";
import { formatRelativeTime } from "@/lib/format";
import { DEFAULT_AUTHOR, DEFAULT_COVER_IMAGE } from "@/lib/constants";

const UPLOAD_ACCEPT = "image/jpeg,image/png,image/webp,image/gif";

function toDatetimeLocalValue(iso: string | null): string {
  if (!iso) return "";
  const d = new Date(iso);
  const pad = (n: number) => String(n).padStart(2, "0");
  return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}T${pad(d.getHours())}:${pad(d.getMinutes())}`;
}

function ToolbarButton({
  icon,
  label,
  ariaLabel,
  onClick,
}: {
  icon?: string;
  label?: string;
  ariaLabel: string;
  onClick: () => void;
}) {
  return (
    <button
      type="button"
      aria-label={ariaLabel}
      onMouseDown={(e) => e.preventDefault()}
      onClick={onClick}
      className="flex h-9 min-w-9 items-center justify-center rounded px-2 text-sm font-medium text-on-surface-variant transition-colors hover:bg-surface-container-low hover:text-on-surface"
    >
      {icon ? <span className="material-symbols-outlined text-[20px]">{icon}</span> : label}
    </button>
  );
}

export default function ArticleEditor({
  mode,
  article,
}: {
  mode: "create" | "edit";
  article?: Article;
}) {
  const router = useRouter();
  const bodyRef = useRef<HTMLDivElement>(null);
  const bodyInitialized = useRef(false);
  const bodyImageInputRef = useRef<HTMLInputElement>(null);
  const coverInputRef = useRef<HTMLInputElement>(null);
  const savedRangeRef = useRef<Range | null>(null);

  const [title, setTitle] = useState(article?.title ?? "");
  const [slug, setSlug] = useState(article?.slug ?? "");
  const [slugTouched, setSlugTouched] = useState(mode === "edit");
  const [category, setCategory] = useState<Category>(article?.category ?? CATEGORIES[0]);
  const [coverImageUrl, setCoverImageUrl] = useState(article?.coverImageUrl ?? "");
  const [coverUploading, setCoverUploading] = useState(false);
  const [seoMetaDescription, setSeoMetaDescription] = useState(article?.seoMetaDescription ?? "");
  const [keywords, setKeywords] = useState<string[]>(article?.keywords ?? []);
  const [keywordInputOpen, setKeywordInputOpen] = useState(false);
  const [keywordInputValue, setKeywordInputValue] = useState("");
  const [scheduledForInput, setScheduledForInput] = useState(toDatetimeLocalValue(article?.scheduledFor ?? null));
  const [status, setStatus] = useState<ArticleStatus>(article?.status ?? "drafting");
  const [lastSavedAt, setLastSavedAt] = useState<string | null>(article?.updatedAt ?? null);
  const [readTimeMinutes, setReadTimeMinutes] = useState(article?.readTimeMinutes ?? 1);
  const [saving, setSaving] = useState<"idle" | "draft" | "publish" | "schedule">("idle");
  const [error, setError] = useState<string | null>(null);

  function recomputeReadTime() {
    const text = bodyRef.current?.innerText ?? "";
    const words = text.trim().split(/\s+/).filter(Boolean);
    setReadTimeMinutes(Math.max(1, Math.round(words.length / 200)));
  }

  function bodyEditorRef(node: HTMLDivElement | null) {
    bodyRef.current = node;
    if (node && !bodyInitialized.current) {
      node.innerHTML = article?.bodyHtml ?? "";
      bodyInitialized.current = true;
    }
  }

  function exec(command: string, value?: string) {
    bodyRef.current?.focus();
    document.execCommand(command, false, value);
    recomputeReadTime();
  }

  function handleLink() {
    const url = window.prompt("Enter link URL");
    if (!url) return;
    exec("createLink", url);
  }

  function handleInsertImageClick() {
    const sel = window.getSelection();
    savedRangeRef.current = sel && sel.rangeCount > 0 ? sel.getRangeAt(0).cloneRange() : null;
    bodyImageInputRef.current?.click();
  }

  async function handleBodyImageFile(file: File | undefined) {
    if (!file) return;
    const formData = new FormData();
    formData.append("file", file);
    const res = await fetch("/api/upload", { method: "POST", body: formData });
    if (!res.ok) {
      setError("Image upload failed");
      return;
    }
    const data = await res.json();
    bodyRef.current?.focus();
    const sel = window.getSelection();
    if (sel && savedRangeRef.current) {
      sel.removeAllRanges();
      sel.addRange(savedRangeRef.current);
    }
    document.execCommand("insertImage", false, data.url);
    recomputeReadTime();
  }

  async function handleCoverFile(file: File | undefined) {
    if (!file) return;
    setCoverUploading(true);
    setError(null);
    const formData = new FormData();
    formData.append("file", file);
    const res = await fetch("/api/upload", { method: "POST", body: formData });
    setCoverUploading(false);
    if (!res.ok) {
      const data = await res.json().catch(() => ({}));
      setError(data.error ?? "Cover upload failed");
      return;
    }
    const data = await res.json();
    setCoverImageUrl(data.url);
  }

  function handleTitleChange(value: string) {
    setTitle(value);
    if (!slugTouched) {
      setSlug(slugify(value));
    }
  }

  function addKeyword() {
    const value = keywordInputValue.trim();
    if (value && !keywords.includes(value)) {
      setKeywords([...keywords, value]);
    }
    setKeywordInputValue("");
    setKeywordInputOpen(false);
  }

  function removeKeyword(index: number) {
    setKeywords(keywords.filter((_, i) => i !== index));
  }

  async function handleSave(targetStatus: ArticleStatus, scheduledFor: string | null = null) {
    if (!title.trim()) {
      setError("Title is required");
      return;
    }
    setError(null);
    setSaving(targetStatus === "published" ? "publish" : targetStatus === "scheduled" ? "schedule" : "draft");

    const bodyHtml = bodyRef.current?.innerHTML ?? "";
    const payload: ArticleInput = {
      title: title.trim(),
      slug: slug || slugify(title),
      category,
      author: mode === "edit" && article ? article.author : DEFAULT_AUTHOR,
      coverImageUrl: coverImageUrl || DEFAULT_COVER_IMAGE,
      excerpt: deriveExcerpt(bodyHtml),
      bodyHtml,
      seoMetaDescription,
      keywords,
      status: targetStatus,
      scheduledFor: targetStatus === "scheduled" ? scheduledFor : null,
    };

    const res = await fetch(
      mode === "create" ? "/api/articles" : `/api/articles/${article!.id}`,
      {
        method: mode === "create" ? "POST" : "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      }
    );

    if (!res.ok) {
      const data = await res.json().catch(() => ({}));
      setError(data.error ?? "Failed to save article");
      setSaving("idle");
      return;
    }

    const data = await res.json();
    const saved: Article = data.article;
    setSaving("idle");
    setStatus(saved.status);
    setLastSavedAt(saved.updatedAt);
    setSlug(saved.slug);

    if (mode === "create") {
      router.push(`/studio/edit/${saved.id}`);
    } else {
      router.refresh();
    }
  }

  function handleSchedule() {
    if (!scheduledForInput) return;
    handleSave("scheduled", new Date(scheduledForInput).toISOString());
  }

  return (
    <div className="flex min-h-screen flex-col">
      <div className="flex flex-wrap items-center justify-between gap-4 border-b border-outline-variant bg-surface-container-lowest px-6 py-4 lg:px-10">
        <p className="text-sm text-on-surface-variant">
          <Link href="/studio" className="hover:text-on-surface">
            Articles
          </Link>
          <span className="px-1.5" aria-hidden>
            ›
          </span>
          <span className="text-on-surface">
            {mode === "create" ? "New Editorial Draft" : `Edit · ${title || "Untitled"}`}
          </span>
        </p>
        <div className="flex items-center gap-3">
          {error && <span className="text-sm text-error">{error}</span>}
          <button
            type="button"
            onClick={() => handleSave("drafting")}
            disabled={saving !== "idle"}
            className="rounded border border-outline-variant px-5 py-2.5 text-sm font-medium text-on-surface transition-colors hover:bg-surface-container-low disabled:opacity-40"
          >
            {saving === "draft" ? "Saving..." : "Save Draft"}
          </button>
          <button
            type="button"
            onClick={() => handleSave("published")}
            disabled={saving !== "idle"}
            className="eyebrow rounded bg-secondary px-5 py-2.5 text-on-secondary transition-opacity hover:opacity-90 disabled:opacity-40"
          >
            {saving === "publish" ? "Publishing..." : "Publish Article"}
          </button>
        </div>
      </div>

      <div className="grid flex-1 grid-cols-1 lg:grid-cols-[1fr_340px]">
        <div className="border-outline-variant lg:border-r">
          <div className="flex flex-wrap items-center gap-1 border-b border-outline-variant bg-surface-container-lowest px-4 py-2">
            <ToolbarButton label="H1" ariaLabel="Heading 1" onClick={() => exec("formatBlock", "<h2>")} />
            <ToolbarButton label="H2" ariaLabel="Heading 2" onClick={() => exec("formatBlock", "<h3>")} />
            <span className="mx-1 h-5 w-px bg-outline-variant" aria-hidden />
            <ToolbarButton icon="format_bold" ariaLabel="Bold" onClick={() => exec("bold")} />
            <ToolbarButton icon="format_italic" ariaLabel="Italic" onClick={() => exec("italic")} />
            <ToolbarButton icon="format_underlined" ariaLabel="Underline" onClick={() => exec("underline")} />
            <span className="mx-1 h-5 w-px bg-outline-variant" aria-hidden />
            <ToolbarButton icon="link" ariaLabel="Insert link" onClick={handleLink} />
            <ToolbarButton icon="image" ariaLabel="Insert image" onClick={handleInsertImageClick} />
            <ToolbarButton
              icon="format_list_bulleted"
              ariaLabel="Bullet list"
              onClick={() => exec("insertUnorderedList")}
            />
            <input
              ref={bodyImageInputRef}
              type="file"
              accept={UPLOAD_ACCEPT}
              className="hidden"
              onChange={(e) => handleBodyImageFile(e.target.files?.[0])}
            />
          </div>

          <div className="px-6 pt-8 lg:px-12">
            <input
              value={title}
              onChange={(e) => handleTitleChange(e.target.value)}
              placeholder="Enter Article Title..."
              className="font-display w-full border-none bg-transparent text-3xl font-semibold text-on-surface outline-none placeholder:text-on-surface-variant/50 lg:text-4xl"
            />
            <div className="mt-3 flex items-center gap-1 text-sm text-on-surface-variant">
              <span>/article/</span>
              <input
                value={slug}
                onChange={(e) => {
                  setSlug(slugify(e.target.value));
                  setSlugTouched(true);
                }}
                placeholder="article-slug"
                className="min-w-0 flex-1 rounded border border-transparent bg-transparent px-1 py-0.5 font-mono text-xs text-on-surface-variant outline-none hover:border-outline-variant focus-visible:border-outline-variant"
              />
            </div>
          </div>

          <div
            ref={bodyEditorRef}
            contentEditable
            suppressContentEditableWarning
            data-placeholder={"Begin your narrative here...\nClinical excellence meets aesthetic artistry..."}
            onInput={recomputeReadTime}
            className="prose-edith min-h-[420px] px-6 py-8 text-on-surface outline-none lg:px-12"
          />
        </div>

        <div className="space-y-8 p-6 lg:p-8">
          <div>
            <p className="eyebrow text-on-surface-variant">Treatment Category</p>
            <select
              value={category}
              onChange={(e) => setCategory(e.target.value as Category)}
              className="mt-3 w-full rounded border border-outline-variant bg-surface-container-lowest px-3 py-2.5 text-sm text-on-surface outline-none focus-visible:outline-2"
            >
              {CATEGORIES.map((c) => (
                <option key={c} value={c}>
                  {c}
                </option>
              ))}
            </select>
          </div>

          <div>
            <p className="eyebrow text-on-surface-variant">Featured Image</p>
            <input
              ref={coverInputRef}
              type="file"
              accept={UPLOAD_ACCEPT}
              className="hidden"
              onChange={(e) => handleCoverFile(e.target.files?.[0])}
            />
            {coverImageUrl ? (
              <div className="mt-3 overflow-hidden rounded-lg border border-outline-variant">
                <div className="aspect-[16/9] w-full bg-surface-container">
                  {/* eslint-disable-next-line @next/next/no-img-element -- arbitrary uploaded/local placeholder image, not optimized */}
                  <img src={coverImageUrl} alt="Cover preview" className="h-full w-full object-cover" />
                </div>
                <div className="flex items-center justify-between gap-2 border-t border-outline-variant bg-surface-container-lowest px-3 py-2">
                  <button
                    type="button"
                    onClick={() => coverInputRef.current?.click()}
                    disabled={coverUploading}
                    className="text-xs font-medium text-on-surface hover:text-secondary"
                  >
                    {coverUploading ? "Uploading..." : "Replace"}
                  </button>
                  <button
                    type="button"
                    onClick={() => setCoverImageUrl("")}
                    className="text-xs font-medium text-error hover:opacity-70"
                  >
                    Remove
                  </button>
                </div>
              </div>
            ) : (
              <button
                type="button"
                onClick={() => coverInputRef.current?.click()}
                disabled={coverUploading}
                className={`mt-3 flex w-full flex-col items-center justify-center gap-2 rounded-lg border-2 border-dashed border-outline-variant bg-surface-container-lowest px-4 py-8 text-center transition-colors hover:border-secondary ${
                  coverUploading ? "pointer-events-none opacity-60" : ""
                }`}
              >
                <span className="material-symbols-outlined text-3xl text-secondary">cloud_upload</span>
                <span className="text-sm font-medium text-on-surface">
                  {coverUploading ? "Uploading..." : "Upload High-Res Cover"}
                </span>
                <span className="text-xs text-on-surface-variant">JPEG, PNG, WEBP or GIF</span>
              </button>
            )}
          </div>

          <div>
            <div className="flex items-baseline justify-between">
              <p className="eyebrow text-on-surface-variant">SEO Meta Description</p>
            </div>
            <textarea
              value={seoMetaDescription}
              onChange={(e) => setSeoMetaDescription(e.target.value.slice(0, 160))}
              maxLength={160}
              rows={4}
              placeholder="Summarize this article for search engines..."
              className="mt-3 w-full rounded border border-outline-variant bg-surface-container-lowest px-3 py-2.5 text-sm text-on-surface outline-none focus-visible:outline-2"
            />
            <p className="mt-1 text-xs text-on-surface-variant">{seoMetaDescription.length} / 160 characters</p>
          </div>

          <div>
            <p className="eyebrow text-on-surface-variant">Keywords</p>
            <div className="mt-3 flex flex-wrap items-center gap-2">
              {keywords.map((keyword, index) => (
                <span
                  key={keyword}
                  className="eyebrow inline-flex items-center gap-1.5 rounded bg-primary px-2.5 py-1 text-on-primary"
                >
                  {keyword}
                  <button
                    type="button"
                    onClick={() => removeKeyword(index)}
                    aria-label={`Remove ${keyword}`}
                    className="flex items-center"
                  >
                    <span className="material-symbols-outlined text-[14px]">close</span>
                  </button>
                </span>
              ))}
              {keywordInputOpen ? (
                <input
                  autoFocus
                  value={keywordInputValue}
                  onChange={(e) => setKeywordInputValue(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === "Enter") {
                      e.preventDefault();
                      addKeyword();
                    }
                    if (e.key === "Escape") {
                      setKeywordInputValue("");
                      setKeywordInputOpen(false);
                    }
                  }}
                  onBlur={addKeyword}
                  placeholder="Type and press Enter"
                  className="min-w-0 rounded border border-outline-variant bg-surface-container-lowest px-2.5 py-1 text-xs text-on-surface outline-none focus-visible:outline-2"
                />
              ) : (
                <button
                  type="button"
                  onClick={() => setKeywordInputOpen(true)}
                  className="eyebrow rounded border border-dashed border-outline-variant px-2.5 py-1 text-on-surface-variant transition-colors hover:border-secondary hover:text-secondary"
                >
                  + Add Tag
                </button>
              )}
            </div>
          </div>

          <div className="rounded-lg bg-surface-container-low p-4 text-sm">
            <p className="eyebrow text-on-surface-variant">Status</p>
            <dl className="mt-3 space-y-2.5">
              <div className="flex items-center justify-between">
                <dt className="text-on-surface-variant">Status</dt>
                <dd>
                  <StatusBadge status={status} />
                </dd>
              </div>
              <div className="flex items-center justify-between">
                <dt className="text-on-surface-variant">Last Saved</dt>
                <dd className="font-medium text-on-surface">
                  {lastSavedAt ? formatRelativeTime(lastSavedAt) : "Not yet saved"}
                </dd>
              </div>
              <div className="flex items-center justify-between">
                <dt className="text-on-surface-variant">Read Time</dt>
                <dd className="font-medium text-on-surface">{readTimeMinutes} min</dd>
              </div>
            </dl>

            <div className="mt-4 border-t border-outline-variant pt-4">
              <label className="eyebrow text-on-surface-variant" htmlFor="scheduledFor">
                Schedule For
              </label>
              <input
                id="scheduledFor"
                type="datetime-local"
                value={scheduledForInput}
                onChange={(e) => setScheduledForInput(e.target.value)}
                className="mt-1.5 w-full rounded border border-outline-variant bg-surface-container-lowest px-3 py-2 text-sm text-on-surface outline-none focus-visible:outline-2"
              />
              <button
                type="button"
                onClick={handleSchedule}
                disabled={!scheduledForInput || saving !== "idle"}
                className="mt-2 w-full rounded border border-outline-variant py-2 text-sm font-medium text-on-surface transition-colors hover:bg-surface-container disabled:opacity-40"
              >
                {saving === "schedule" ? "Scheduling..." : "Schedule"}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
