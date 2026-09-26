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
import styles from "./App.module.css";

export default function App() {
  const [query, setQuery] = useState("");
  const [override, setOverride] = useState<SearchOverride | undefined>(undefined);
  const [recent, setRecent] = useState<RecentSearch[]>(getRecentSearches);

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

  return (
    <div className={styles.page}>
      <div className={styles.container}>
        <header className={styles.header}>
          <span className={styles.logo}>Lingo</span>
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