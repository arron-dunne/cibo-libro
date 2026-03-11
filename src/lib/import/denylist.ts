import "server-only";
import fs from "node:fs";
import path from "node:path";

const FILE_PATH = path.join(process.cwd(), "src", "config", "denylist.txt");

function normalize(input: string): string {
  // Accept URL or hostname; trim scheme/paths, lowercase, drop leading www.
  let s = input.trim();
  if (!s) return "";
  try {
    if (s.includes("://")) s = new URL(s).hostname;
  } catch {
    /* ignore */
  }
  s = s
    .toLowerCase()
    .replace(/^www\./, "")
    .replace(/\/.*$/, "")
    .replace(/\.+$/, "");
  return s;
}

function matches(host: string, pattern: string): boolean {
  if (pattern.startsWith("*.")) {
    const base = pattern.slice(2); // "example.com"
    return host === base || host.endsWith(`.${base}`);
  }
  return host === pattern;
}

let cache: { patterns: string[]; mtimeMs: number } | null = null;

function loadPatterns(): string[] {
  try {
    const stat = fs.statSync(FILE_PATH);
    if (!cache || cache.mtimeMs !== stat.mtimeMs) {
      const raw = fs.readFileSync(FILE_PATH, "utf8");
      const lines = raw
        .split(/\r?\n/)
        .map((l) => {
          // allow comments with # and inline comments after space-#
          const cleaned = l.replace(/\s+#.*$/, "");
          return normalize(cleaned);
        })
        .filter(Boolean);
      // de-dupe
      const patterns = Array.from(new Set(lines));
      cache = { patterns, mtimeMs: stat.mtimeMs };
    }
    return cache.patterns;
  } catch {
    // If file missing/unreadable, treat as empty denylist
    return [];
  }
}

/** Returns true if this domain/URL is denied for import. */
export function isDenylisted(domainOrUrl: string): boolean {
  const host = normalize(domainOrUrl);
  if (!host) return false;
  const patterns = loadPatterns();
  for (const p of patterns) {
    if (matches(host, p)) return true;
  }
  return false;
}
