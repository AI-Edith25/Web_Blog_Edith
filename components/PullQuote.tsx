export default function PullQuote({
  quote,
  name,
  role,
  avatarUrl,
}: {
  quote: string;
  name: string;
  role: string;
  avatarUrl: string;
}) {
  return (
    <aside className="not-prose my-10 rounded-lg bg-surface-container-low p-8 lg:p-10">
      <p className="eyebrow text-secondary">Expert Insight</p>
      <div className="relative mt-2">
        <span
          aria-hidden
          className="font-display absolute -left-1 -top-6 text-6xl font-bold text-outline-variant"
        >
          &rdquo;&rdquo;
        </span>
        <p className="font-display relative text-xl font-medium leading-snug text-primary lg:text-2xl">
          {quote}
        </p>
      </div>
      <div className="mt-6 flex items-center gap-3">
        {/* eslint-disable-next-line @next/next/no-img-element -- local SVG placeholder, next/image blocks unoptimized SVG */}
        <img
          src={avatarUrl}
          alt={name}
          className="h-10 w-10 rounded-full object-cover"
        />
        <div>
          <p className="text-sm font-semibold text-on-surface">{name}</p>
          <p className="text-xs text-on-surface-variant">{role}</p>
        </div>
      </div>
    </aside>
  );
}
