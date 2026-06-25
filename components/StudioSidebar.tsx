"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";

const CONTENT_LINKS = [
  { label: "All Articles", href: "/studio", icon: "article" },
  { label: "Drafts", href: "/studio/drafts", icon: "edit_note" },
  { label: "Scheduled", href: "/studio/scheduled", icon: "schedule" },
  { label: "Media Library", href: "/studio/media", icon: "perm_media" },
];

const SYSTEM_LINKS = [{ label: "Settings", href: "/studio/settings", icon: "settings" }];

function NavLink({
  href,
  icon,
  label,
  active,
  onClick,
}: {
  href: string;
  icon: string;
  label: string;
  active: boolean;
  onClick?: () => void;
}) {
  return (
    <Link
      href={href}
      onClick={onClick}
      className={`flex items-center gap-3 rounded px-3 py-2.5 text-sm font-medium transition-colors ${
        active
          ? "bg-primary-container text-on-primary"
          : "text-on-primary/65 hover:bg-primary-container/60 hover:text-on-primary"
      }`}
    >
      <span className="material-symbols-outlined text-[20px]">{icon}</span>
      {label}
    </Link>
  );
}

function SidebarContent({ onNavigate }: { onNavigate?: () => void }) {
  const pathname = usePathname();

  function isActive(href: string) {
    if (href === "/studio") return pathname === "/studio";
    return pathname.startsWith(href);
  }

  return (
    <div className="flex h-full flex-col justify-between px-4 py-6">
      <div>
        <div className="flex items-center gap-2 px-2">
          <span className="font-display text-lg font-semibold text-secondary-container">
            EDITH
          </span>
          <span className="eyebrow rounded bg-primary-container px-2 py-0.5 text-[10px] text-on-primary/70">
            CMS
          </span>
        </div>

        <div className="mt-10">
          <p className="eyebrow px-3 text-on-primary/40">Content Management</p>
          <nav className="mt-3 flex flex-col gap-1">
            {CONTENT_LINKS.map((link) => (
              <NavLink key={link.href} {...link} active={isActive(link.href)} onClick={onNavigate} />
            ))}
          </nav>
        </div>

        <div className="mt-8">
          <p className="eyebrow px-3 text-on-primary/40">System</p>
          <nav className="mt-3 flex flex-col gap-1">
            {SYSTEM_LINKS.map((link) => (
              <NavLink key={link.href} {...link} active={isActive(link.href)} onClick={onNavigate} />
            ))}
          </nav>
        </div>
      </div>

      <div className="flex items-center gap-3 border-t border-on-primary/10 px-2 pt-4">
        <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-secondary text-sm font-semibold text-on-secondary">
          EC
        </span>
        <div className="min-w-0">
          <p className="truncate text-sm font-medium text-on-primary">Copywriter Team</p>
          <p className="truncate text-xs text-on-primary/50">Admin Access</p>
        </div>
      </div>
    </div>
  );
}

export default function StudioSidebar() {
  const [open, setOpen] = useState(false);

  return (
    <>
      <aside className="hidden h-screen w-64 shrink-0 bg-primary lg:sticky lg:top-0 lg:block">
        <SidebarContent />
      </aside>

      <div className="flex h-16 items-center justify-between bg-primary px-4 lg:hidden">
        <div className="flex items-center gap-2">
          <span className="font-display text-lg font-semibold text-secondary-container">
            EDITH
          </span>
          <span className="eyebrow rounded bg-primary-container px-2 py-0.5 text-[10px] text-on-primary/70">
            CMS
          </span>
        </div>
        <button
          type="button"
          aria-label="Toggle studio menu"
          onClick={() => setOpen((v) => !v)}
          className="flex h-9 w-9 items-center justify-center rounded text-on-primary"
        >
          <span className="material-symbols-outlined">{open ? "close" : "menu"}</span>
        </button>
      </div>

      {open && (
        <div className="bg-primary lg:hidden">
          <SidebarContent onNavigate={() => setOpen(false)} />
        </div>
      )}
    </>
  );
}
