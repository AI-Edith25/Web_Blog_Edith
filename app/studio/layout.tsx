import type { Metadata } from "next";
import type { ReactNode } from "react";
import StudioSidebar from "@/components/StudioSidebar";

export const metadata: Metadata = {
  title: "Edith Studio — CMS",
  robots: { index: false, follow: false },
};

export default function StudioLayout({ children }: { children: ReactNode }) {
  return (
    <div className="flex min-h-screen flex-col bg-surface lg:flex-row">
      <StudioSidebar />
      <main className="flex-1">{children}</main>
    </div>
  );
}
