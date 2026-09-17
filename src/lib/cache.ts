interface CacheEntry<T> {
  value: T;
  expiresAt: number;
}

const PREFIX = "lingo:cache:";

export function getCached<T>(key: string): T | null {
  try {
    const raw = localStorage.getItem(PREFIX + key);
    if (!raw) return null;
    const entry: CacheEntry<T> = JSON.parse(raw);
    if (Date.now() > entry.expiresAt) {
      localStorage.removeItem(PREFIX + key);
      return null;
    }
    return entry.value;
  } catch {
    return null;
  }
}

export function setCached<T>(key: string, value: T, ttlMs = 1000 * 60 * 60 * 24 * 7): void {
  try {
    const entry: CacheEntry<T> = { value, expiresAt: Date.now() + ttlMs };
    localStorage.setItem(PREFIX + key, JSON.stringify(entry));
  } catch {
    // localStorage پر است یا در دسترس نیست
  }
}