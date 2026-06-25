"use client";

import { useState, type FormEvent } from "react";

export default function NewsletterCard({
  variant = "light",
  title = "Join the Protocol",
  description = "Monthly dispatches on clinical skincare research, delivered with the same precision we bring to treatment.",
  buttonLabel = "SUBSCRIBE",
}: {
  variant?: "light" | "dark";
  title?: string;
  description?: string;
  buttonLabel?: string;
}) {
  const [submitted, setSubmitted] = useState(false);

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setSubmitted(true);
  }

  const isDark = variant === "dark";

  return (
    <div
      className={`rounded-lg p-6 lg:p-8 ${
        isDark
          ? "bg-primary text-on-primary"
          : "border border-outline-variant bg-surface-container-low text-on-surface"
      }`}
    >
      <h3 className="font-display text-xl font-semibold lg:text-2xl">{title}</h3>
      <p
        className={`mt-2 text-sm leading-relaxed ${
          isDark ? "text-on-primary/75" : "text-on-surface-variant"
        }`}
      >
        {description}
      </p>

      {submitted ? (
        <p className={`mt-4 text-sm font-medium ${isDark ? "text-secondary-container" : "text-secondary"}`}>
          Thank you — you&apos;re on the list.
        </p>
      ) : (
        <form onSubmit={handleSubmit} className="mt-5 flex flex-col gap-3 sm:flex-row">
          <input
            type="email"
            required
            placeholder="Your email address"
            className={`min-w-0 flex-1 rounded border px-4 py-2.5 text-sm outline-none focus-visible:outline-2 ${
              isDark
                ? "border-on-primary/25 bg-primary-container text-on-primary placeholder:text-on-primary/50"
                : "border-outline-variant bg-surface-container-lowest text-on-surface placeholder:text-on-surface-variant"
            }`}
          />
          <button
            type="submit"
            className={`eyebrow shrink-0 rounded px-5 py-2.5 transition-opacity hover:opacity-90 ${
              isDark ? "bg-secondary text-on-secondary" : "bg-primary text-on-primary"
            }`}
          >
            {buttonLabel}
          </button>
        </form>
      )}

      <p className={`mt-3 text-xs ${isDark ? "text-on-primary/50" : "text-on-surface-variant"}`}>
        No spam. Unsubscribe anytime.
      </p>
    </div>
  );
}
