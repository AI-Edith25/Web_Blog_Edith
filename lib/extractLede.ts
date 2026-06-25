export interface SplitLede {
  lede: string | null;
  rest: string;
}

const LEDE_RE = /^\s*<p[^>]*>([\s\S]*?)<\/p>/i;

export function extractLede(html: string): SplitLede {
  const match = html.match(LEDE_RE);
  if (!match) {
    return { lede: null, rest: html };
  }
  return {
    lede: match[1],
    rest: html.slice(match[0].length),
  };
}
