import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import type { Metadata } from "next";
import StudioLockForm from "@/components/StudioLockForm";

type StudioLockPageProps = { searchParams: Promise<{ next?: string }> };

export const metadata: Metadata = {
  title: "Studio Access — Edith Clinic",
  robots: { index: false, follow: false },
};

export const dynamic = "force-dynamic";

export default async function StudioLockPage({ searchParams }: StudioLockPageProps) {
  const { next } = await searchParams;
  const destination = next && next.startsWith("/studio") ? next : "/studio";

  const passcode = process.env.STUDIO_PASSCODE;
  if (!passcode) {
    redirect(destination);
  }

  const cookieStore = await cookies();
  if (cookieStore.get("studio_passcode")?.value === passcode) {
    redirect(destination);
  }

  return <StudioLockForm destination={destination} />;
}
