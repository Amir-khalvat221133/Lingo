import { useState, useEffect, useRef } from "react";
import { classifySearch } from "../lib/classifyInput";
import { getWordResult, getMultiWordResults, getSentenceResult } from "../services/aggregator";
import type { WordResult, SentenceResult } from "../types/word";

export type SearchStatus = "idle" | "loading" | "result" | "noResult" | "error";

export interface SearchResultState {
  status: SearchStatus;
  singleWord?: WordResult;
  multiWords?: (WordResult | null)[];
  sentence?: SentenceResult;
}

const DEBOUNCE_MS = 350;

export function useSearch(query: string, override?: "words" | "sentence") {
  const [state, setState] = useState<SearchResultState>({ status: "idle" });
  const abortRef = useRef<AbortController | null>(null);
  const timeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    if (timeoutRef.current) clearTimeout(timeoutRef.current);

    const trimmed = query.trim();
    if (!trimmed) {
      setState({ status: "idle" });
      return;
    }

    timeoutRef.current = setTimeout(() => {
      runSearch(trimmed, override);
    }, DEBOUNCE_MS);

    return () => {
      if (timeoutRef.current) clearTimeout(timeoutRef.current);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [query, override]);

  async function runSearch(text: string, ov?: "words" | "sentence") {
    if (abortRef.current) abortRef.current.abort();
    const controller = new AbortController();
    abortRef.current = controller;

    setState({ status: "loading" });

    try {
      const { type, words } = classifySearch(text, ov);

      if (type === "single") {
        const result = await getWordResult(words[0], controller.signal);
        if (controller.signal.aborted) return;
        setState(
          result ? { status: "result", singleWord: result } : { status: "noResult" }
        );
        return;
      }

      if (type === "multi") {
        const results = await getMultiWordResults(words, controller.signal);
        if (controller.signal.aborted) return;
        const hasAny = results.some((r) => r !== null);
        setState(
          hasAny ? { status: "result", multiWords: results } : { status: "noResult" }
        );
        return;
      }

      const sentenceResult = await getSentenceResult(text, controller.signal);
      if (controller.signal.aborted) return;
      setState(
        sentenceResult ? { status: "result", sentence: sentenceResult } : { status: "noResult" }
      );
    } catch (err) {
      if (controller.signal.aborted) return;
      setState({ status: "error" });
    }
  }

  function retry() {
    const trimmed = query.trim();
    if (!trimmed) return;
    runSearch(trimmed, override);
  }

  return { ...state, retry };
}