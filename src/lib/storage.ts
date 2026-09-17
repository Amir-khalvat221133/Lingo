export interface RecentSearch {
  query: string;
  timestamp: number;
}

const KEY = "lingo:recent";
const MAX = 5;

export function getRecentSearches(): RecentSearch[] {
  try {
    return JSON.parse(localStorage.getItem(KEY) || "[]");
  } catch {
    return [];
  }
}

export function addRecentSearch(query: string): void {
  const trimmed = query.trim();
  if (!trimmed) return;
  const existing = getRecentSearches().filter((s) => s.query !== trimmed);
  const updated = [{ query: trimmed, timestamp: Date.now() }, ...existing].slice(0, MAX);
  localStorage.setItem(KEY, JSON.stringify(updated));
}

export function clearRecentSearches(): void {
  localStorage.removeItem(KEY);
}