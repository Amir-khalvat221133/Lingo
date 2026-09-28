import { useEffect, useState } from "react";
import { SearchBox, type SearchOverride } from "./components/SearchBox";
import { WordResultCard } from "./components/WordResultCard";
import { MultiWordResults } from "./components/MultiWordResults";
import { SentenceResult } from "./components/SentenceResult";
import { LoadingSkeleton } from "./components/LoadingSkeleton";
import { NoResult } from "./components/NoResult";
import { RecentSearches } from "./components/RecentSearches";
import { Footer } from "./components/Footer";
import { useSearch } from "./hooks/useSearch";
import {
  addRecentSearch,
  clearRecentSearches,
  getRecentSearches,
  type RecentSearch,
} from "./lib/storage";
import { getStoredTheme, setTheme } from "./lib/theme";
import styles from "./App.module.css";

type ActiveTheme = "light" | "dark";

function getActiveTheme(): ActiveTheme {
  const stored = getStoredTheme();
  if (stored === "light" || stored === "dark") return stored;
  return window.matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light";
}

const BRAND_GREEN = "#1db954";

function SunIcon() {
  return (
    <svg
      width="22"
      height="22"
      viewBox="0 0 24 24"
      fill="none"
      stroke={BRAND_GREEN}
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      <circle cx="12" cy="12" r="4" />
      <path d="M12 2v2M12 20v2M4.93 4.93l1.41 1.41M17.66 17.66l1.41 1.41M2 12h2M20 12h2M4.93 19.07l1.41-1.41M17.66 6.34l1.41-1.41" />
    </svg>
  );
}

function MoonIcon() {
  return (
    <svg
      width="22"
      height="22"
      viewBox="0 0 24 24"
      fill="none"
      stroke={BRAND_GREEN}
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z" />
    </svg>
  );
}

export default function App() {
  const [query, setQuery] = useState("");
  const [override, setOverride] = useState<SearchOverride | undefined>(undefined);
  const [recent, setRecent] = useState<RecentSearch[]>(getRecentSearches);
  const [activeTheme, setActiveTheme] = useState<ActiveTheme>(getActiveTheme);

  const state = useSearch(query, override);

  useEffect(() => {
    if (state.status === "result") {
      addRecentSearch(query.trim());
      setRecent(getRecentSearches());
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [state.status]);

  function handleAcceptSuggestion(word: string) {
    setQuery(word);
  }

  function handleClearRecent() {
    clearRecentSearches();
    setRecent([]);
  }

  function handleThemeToggle() {
    const next: ActiveTheme = activeTheme === "dark" ? "light" : "dark";
    setTheme(next);
    setActiveTheme(next);
  }

  const themeLabel =
    activeTheme === "dark" ? "تغییر به تم روشن" : "تغییر به تم تیره";

  return (
    <div className={styles.page}>
      <div className={styles.container}>
        <header
          className={styles.header}
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
          }}
        >
          <span className={styles.logo}>Lingo</span>
          <button
            type="button"
            onClick={handleThemeToggle}
            aria-label={themeLabel}
            title={themeLabel}
            style={{
              width: 44,
              height: 44,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              background: "transparent",
              border: "none",
              borderRadius: "50%",
              cursor: "pointer",
              padding: 0,
            }}
          >
            {activeTheme === "dark" ? <SunIcon /> : <MoonIcon />}
          </button>
        </header>

        <SearchBox
          value={query}
          onChange={setQuery}
          override={override}
          onOverrideChange={setOverride}
        />

        {recent.length > 0 && (
          <RecentSearches items={recent} onSelect={setQuery} onClear={handleClearRecent} />
        )}

        <main className={styles.results}>
          {state.status === "loading" && <LoadingSkeleton />}
          {state.status === "noResult" && <NoResult variant="noResult" />}
          {state.status === "error" && <NoResult variant="error" onRetry={state.retry} />}

          {state.status === "result" && state.singleWord && (
            <WordResultCard data={state.singleWord} onAcceptSuggestion={handleAcceptSuggestion} />
          )}

          {state.status === "result" && state.multiWords && (
            <MultiWordResults results={state.multiWords} />
          )}

          {state.status === "result" && state.sentence && (
            <SentenceResult data={state.sentence} />
          )}
        </main>

        <Footer />
      </div>
    </div>
  );
}