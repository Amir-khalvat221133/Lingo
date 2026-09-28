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
import { getStoredTheme, setTheme, type ThemeMode } from "./lib/theme";
import styles from "./App.module.css";

const THEME_ORDER: ThemeMode[] = ["auto", "light", "dark"];

const THEME_ICON: Record<ThemeMode, string> = {
  auto: "🖥️",
  light: "☀️",
  dark: "🌙",
};

const THEME_LABEL: Record<ThemeMode, string> = {
  auto: "تم خودکار (مطابق سیستم)",
  light: "تم روشن",
  dark: "تم تیره",
};

export default function App() {
  const [query, setQuery] = useState("");
  const [override, setOverride] = useState<SearchOverride | undefined>(undefined);
  const [recent, setRecent] = useState<RecentSearch[]>(getRecentSearches);
  const [themeMode, setThemeMode] = useState<ThemeMode>(getStoredTheme);

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
    const next = THEME_ORDER[(THEME_ORDER.indexOf(themeMode) + 1) % THEME_ORDER.length];
    setTheme(next);
    setThemeMode(next);
  }

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
            aria-label={`${THEME_LABEL[themeMode]} — برای تغییر بزنید`}
            title={THEME_LABEL[themeMode]}
            style={{
              width: 44,
              height: 44,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              fontSize: 20,
              lineHeight: 1,
              background: "transparent",
              border: "none",
              borderRadius: "50%",
              cursor: "pointer",
            }}
          >
            <span aria-hidden="true">{THEME_ICON[themeMode]}</span>
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