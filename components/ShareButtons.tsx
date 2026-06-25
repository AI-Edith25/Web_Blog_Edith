"use client";

import { useState } from "react";

export default function ShareButtons({ title }: { title: string }) {
  const [copied, setCopied] = useState(false);

  async function handleShare() {
    const url = window.location.href;
    if (navigator.share) {
      try {
        await navigator.share({ title, url });
        return;
      } catch {
        // user cancelled or share failed, fall through to copy
      }
    }
    await navigator.clipboard.writeText(url);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  }

  return (
    <div className="flex items-center gap-3">
      <span className="eyebrow text-on-surface-variant">Share Article</span>
      <button
        type="button"
        onClick={handleShare}
        aria-label="Share this article"
        className="flex h-9 w-9 items-center justify-center rounded border border-outline-variant text-on-surface transition-colors hover:bg-surface-container-low"
      >
        <span className="material-symbols-outlined">{copied ? "check" : "share"}</span>
      </button>
    </div>
  );
}
