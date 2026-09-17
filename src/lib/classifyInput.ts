import type { SearchType } from "../types/word";

const PERSIAN_RE = /[\u0600-\u06FF]/;
const LATIN_RE = /[a-zA-Z]/;
const SENTENCE_END_RE = /[.!?؟]\s*$/;

export function detectLanguage(text: string): "fa" | "en" | "mixed" {
  const hasFa = PERSIAN_RE.test(text);
  const hasEn = LATIN_RE.test(text);
  if (hasFa && hasEn) return "mixed";
  return hasFa ? "fa" : "en";
}

function splitWords(text: string): string[] {
  return text.trim().split(/\s+/).filter(Boolean);
}

export function classifySearch(
  rawText: string,
  override?: "words" | "sentence"
): { type: SearchType; words: string[]; language: ReturnType<typeof detectLanguage> } {
  const text = rawText.trim().replace(/\s+/g, " ");
  const words = splitWords(text);
  const language = detectLanguage(text);

  if (words.length === 1 && !override) {
    return { type: "single", words, language };
  }

  if (override === "sentence") return { type: "sentence", words, language };
  if (override === "words") return { type: "multi", words, language };

  const looksLikeSentence = SENTENCE_END_RE.test(text) || words.length > 6;

  return {
    type: looksLikeSentence ? "sentence" : "multi",
    words,
    language,
  };
}