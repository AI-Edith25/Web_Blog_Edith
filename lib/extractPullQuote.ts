export interface ExtractedPullQuote {
  quote: string;
  name: string;
  role: string;
  avatarUrl: string;
}

export interface SplitBody {
  beforeHtml: string;
  pullQuote: ExtractedPullQuote | null;
  afterHtml: string;
}

const PULLQUOTE_RE =
  /<blockquote[^>]*class="expert-insight"[^>]*data-name="([^"]*)"[^>]*data-role="([^"]*)"[^>]*data-avatar="([^"]*)"[^>]*>([\s\S]*?)<\/blockquote>/i;

export function extractPullQuote(bodyHtml: string): SplitBody {
  const match = bodyHtml.match(PULLQUOTE_RE);
  if (!match) {
    return { beforeHtml: bodyHtml, pullQuote: null, afterHtml: "" };
  }

  const [fullMatch, name, role, avatarUrl, innerHtml] = match;
  const quote = innerHtml.replace(/<[^>]*>/g, "").trim();
  const index = match.index ?? 0;

  return {
    beforeHtml: bodyHtml.slice(0, index),
    pullQuote: { quote, name, role, avatarUrl },
    afterHtml: bodyHtml.slice(index + fullMatch.length),
  };
}
