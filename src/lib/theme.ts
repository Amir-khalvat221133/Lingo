export type ThemeMode = "auto" | "light" | "dark";

const STORAGE_KEY = "lingo-theme";

export function getStoredTheme(): ThemeMode {
  try {
    const value = localStorage.getItem(STORAGE_KEY);
    if (value === "light" || value === "dark") return value;
  } catch {
    // localStorage در دسترس نیست (مثلاً حالت خصوصی مرورگر)
  }
  return "auto";
}

export function applyTheme(mode: ThemeMode): void {
  const root = document.documentElement;
  if (mode === "auto") {
    root.removeAttribute("data-theme");
  } else {
    root.setAttribute("data-theme", mode);
  }
}

export function setTheme(mode: ThemeMode): void {
  try {
    if (mode === "auto") {
      localStorage.removeItem(STORAGE_KEY);
    } else {
      localStorage.setItem(STORAGE_KEY, mode);
    }
  } catch {
    // اگه ذخیره نشد، فقط برای همین جلسه اعمال می‌شه
  }
  applyTheme(mode);
}