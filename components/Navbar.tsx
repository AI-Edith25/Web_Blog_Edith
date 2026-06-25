"use client";

import Link from "next/link";
import { useEffect, useMemo, useRef, useState } from "react";
import Container from "./Container";
import Logo from "./Logo";
import { CLINIC_WHATSAPP_URL, NAV_CATEGORIES } from "@/lib/constants";
import type { Article } from "@/types/article";

export default function Navbar({ variant = "light" }: { variant?: "transparent" | "light" }) {
  const [menuOpen, setMenuOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [query, setQuery] = useState("");
  const [allArticles, setAllArticles] = useState<Article[] | null>(null);
  const searchRef = useRef<HTMLDivElement>(null);

  const isTransparent = variant === "transparent";

  useEffect(() => {
    if (!searchOpen) return;
    function onClickOutside(event: MouseEvent) {
      if (searchRef.current && !searchRef.current.contains(event.target as Node)) {
        setSearchOpen(false);
      }
    }
    document.addEventListener("mousedown", onClickOutside);
    return () => document.removeEventListener("mousedown", onClickOutside);
  }, [searchOpen]);

  async function openSearch() {
    setSearchOpen(true);
    if (!allArticles) {
      try {
        const res = await fetch("/api/articles?status=published");
        const data = await res.json();
        setAllArticles(data.articles ?? []);
      } catch {
        setAllArticles([]);
      }
    }
  }

  const results = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q || !allArticles) return [];
    return allArticles.filter((a) => a.title.toLowerCase().includes(q)).slice(0, 5);
  }, [query, allArticles]);

  const textColor = isTransparent ? "text-on-primary" : "text-on-surface";
  const linkColor = isTransparent
    ? "text-on-primary/80 hover:text-on-primary"
    : "text-on-surface-variant hover:text-on-surface";

  return (
    <header
      className={
        isTransparent
          ? "absolute inset-x-0 top-0 z-30"
          : "relative z-30 border-b border-outline-variant bg-surface-container-lowest"
      }
    >
      <Container className="flex h-20 items-center justify-between">
        <Logo variant={isTransparent ? "light" : "dark"} />

        <nav className="hidden items-center gap-8 lg:flex">
          {NAV_CATEGORIES.map((category) => (
            <Link
              key={category}
              href={`/category/${encodeURIComponent(category)}`}
              className={`text-sm font-medium transition-colors ${linkColor}`}
            >
              {category}
            </Link>
          ))}
        </nav>

        <div className="flex items-center gap-3">
          <div ref={searchRef} className="relative hidden sm:block">
            <button
              type="button"
              aria-label="Search articles"
              onClick={() => (searchOpen ? setSearchOpen(false) : openSearch())}
              className={`flex h-9 w-9 items-center justify-center rounded transition-colors ${textColor} hover:bg-on-surface/5`}
            >
              <span className="material-symbols-outlined">search</span>
            </button>
            {searchOpen && (
              <div className="absolute right-0 top-12 w-72 rounded-lg border border-outline-variant bg-surface-container-lowest p-3 shadow-soft">
                <input
                  autoFocus
                  type="text"
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                  placeholder="Search articles..."
                  className="w-full rounded border border-outline-variant bg-surface px-3 py-2 text-sm text-on-surface outline-none focus-visible:outline-2"
                />
                {query.trim() && (
                  <ul className="mt-2 max-h-64 overflow-y-auto">
                    {results.length === 0 && (
                      <li className="px-2 py-2 text-sm text-on-surface-variant">No results</li>
                    )}
                    {results.map((article) => (
                      <li key={article.id}>
                        <Link
                          href={`/article/${article.slug}`}
                          onClick={() => setSearchOpen(false)}
                          className="block rounded px-2 py-2 text-sm text-on-surface hover:bg-surface-container-low"
                        >
                          {article.title}
                        </Link>
                      </li>
                    ))}
                  </ul>
                )}
              </div>
            )}
          </div>

          <a
            href={CLINIC_WHATSAPP_URL}
            target="_blank"
            rel="noopener noreferrer"
            className="eyebrow hidden rounded bg-secondary px-5 py-2.5 text-on-secondary transition-opacity hover:opacity-90 sm:inline-block"
          >
            Book Appointment
          </a>

          <button
            type="button"
            aria-label="Toggle menu"
            onClick={() => setMenuOpen((v) => !v)}
            className={`flex h-9 w-9 items-center justify-center rounded lg:hidden ${textColor}`}
          >
            <span className="material-symbols-outlined">{menuOpen ? "close" : "menu"}</span>
          </button>
        </div>
      </Container>

      {menuOpen && (
        <div className="border-t border-outline-variant bg-surface-container-lowest lg:hidden">
          <Container className="flex flex-col gap-1 py-4">
            {NAV_CATEGORIES.map((category) => (
              <Link
                key={category}
                href={`/category/${encodeURIComponent(category)}`}
                onClick={() => setMenuOpen(false)}
                className="rounded px-2 py-3 text-sm font-medium text-on-surface hover:bg-surface-container-low"
              >
                {category}
              </Link>
            ))}
            <a
              href={CLINIC_WHATSAPP_URL}
              target="_blank"
              rel="noopener noreferrer"
              className="eyebrow mt-2 rounded bg-secondary px-5 py-3 text-center text-on-secondary"
            >
              Book Appointment
            </a>
          </Container>
        </div>
      )}
    </header>
  );
}
