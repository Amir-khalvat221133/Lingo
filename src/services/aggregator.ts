import { fetchDictionary } from "./providers/dictionaryProvider";
import { fetchSynonyms, fetchAntonyms, fetchSpellingSuggestions } from "./providers/synonymProvider";
import { translateToFa } from "./providers/translationProvider";
import { confidenceFromDistance } from "../lib/levenshtein";
import { getCached, setCached } from "../lib/cache";
import type { WordResult, SentenceResult } from "../types/word";

const CONFIDENCE_THRESHOLD = 0.6;

export async function getWordResult(
  rawWord: string,
  signal?: AbortSignal
): Promise<WordResult | null> {
  const word = rawWord.trim().toLowerCase();
  if (!word) return null;

  const cacheKey = `word:${word}`;
  const cached = getCached<WordResult>(cacheKey);
  if (cached) return cached;

  const dict = await fetchDictionary(word, signal);

  if (!dict) {
    const suggestions = await fetchSpellingSuggestions(word, signal);
    const best = suggestions[0];
    if (best) {
      const confidence = confidenceFromDistance(word, best);
      if (confidence >= CONFIDENCE_THRESHOLD) {
        return { word, didYouMean: { suggestion: best, confidence } };
      }
    }
    return null;
  }

  const [synonyms, antonyms, meaningFa] = await Promise.all([
    dict.synonyms.length ? Promise.resolve(dict.synonyms) : fetchSynonyms(word, signal),
    dict.antonyms.length ? Promise.resolve(dict.antonyms) : fetchAntonyms(word, signal),
    translateToFa(word, signal),
  ]);

  const result: WordResult = {
    word: dict.word,
    ipa: dict.ipa,
    audioUrl: dict.audioUrl,
    partOfSpeech: dict.partOfSpeech,
    meaningEn: dict.meaningEn,
    meaningFa: meaningFa ?? undefined,
    synonyms,
    antonyms,
    example: dict.example,
    wordForms: dict.wordForms,
  };

  setCached(cacheKey, result);
  return result;
}

export async function getMultiWordResults(
  words: string[],
  signal?: AbortSignal
): Promise<(WordResult | null)[]> {
  const settled = await Promise.allSettled(
    words.map((w) => getWordResult(w, signal))
  );
  return settled.map((s) => (s.status === "fulfilled" ? s.value : null));
}

export async function getSentenceResult(
  sentence: string,
  signal?: AbortSignal
): Promise<SentenceResult | null> {
  const trimmed = sentence.trim();
  if (!trimmed) return null;

  const cacheKey = `sentence:${trimmed.toLowerCase()}`;
  const cached = getCached<SentenceResult>(cacheKey);
  if (cached) return cached;

  const translation = await translateToFa(trimmed, signal);
  if (!translation) return null;

  const result: SentenceResult = { original: trimmed, translation };
  setCached(cacheKey, result);
  return result;
}