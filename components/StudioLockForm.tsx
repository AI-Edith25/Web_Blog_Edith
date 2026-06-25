"use client";

import { useRouter } from "next/navigation";
import { useState, type FormEvent } from "react";

export default function StudioLockForm({ destination }: { destination: string }) {
  const router = useRouter();
  const [passcode, setPasscode] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setSubmitting(true);
    setError(null);

    const res = await fetch("/api/studio-auth", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ passcode }),
    });

    if (!res.ok) {
      const data = await res.json().catch(() => ({}));
      setError(data.error ?? "Incorrect passcode");
      setSubmitting(false);
      return;
    }

    router.push(destination);
    router.refresh();
  }

  return (
    <main className="flex min-h-screen items-center justify-center bg-primary px-6">
      <div className="w-full max-w-sm rounded-lg bg-surface-container-lowest p-8 shadow-soft">
        <p className="eyebrow text-secondary">Edith Studio</p>
        <h1 className="font-display mt-2 text-2xl font-semibold text-on-surface">Restricted Access</h1>
        <p className="mt-2 text-sm text-on-surface-variant">
          Enter the studio passcode to continue to the CMS.
        </p>

        <form onSubmit={handleSubmit} className="mt-6 flex flex-col gap-3">
          <input
            type="password"
            autoFocus
            required
            value={passcode}
            onChange={(e) => setPasscode(e.target.value)}
            placeholder="Passcode"
            className="rounded border border-outline-variant bg-surface px-4 py-2.5 text-sm text-on-surface outline-none focus-visible:outline-2"
          />
          {error && <p className="text-sm text-error">{error}</p>}
          <button
            type="submit"
            disabled={submitting}
            className="eyebrow rounded bg-secondary px-5 py-2.5 text-on-secondary transition-opacity hover:opacity-90 disabled:opacity-50"
          >
            {submitting ? "Checking..." : "Unlock Studio"}
          </button>
        </form>
      </div>
    </main>
  );
}
