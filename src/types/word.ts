export type SearchType = "single" | "multi" | "sentence";
export type DetectedLanguage = "fa" | "en" | "mixed";

export interface WordForm {
  form: string;
  label: string;
}

export interface WordResult {
  word: string;
  ipa?: string;
  audioUrl?: string;
  partOfSpeech?: string;
  meaningFa?: string;
  meaningEn?: string;
  synonyms?: string[];
  usageDifference?: string;
  antonyms?: string[];
  wordForms?: WordForm[];
  example?: string;
  exampleFa?: string;
  commonPhrases?: string[];
  collocations?: string[];
  idioms?: string[];
  didYouMean?: { suggestion: string; confidence: number };
}

export interface SentenceResult {
  original: string;
  translation: string;
}