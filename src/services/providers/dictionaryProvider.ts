import type { WordForm } from "../../types/word";

interface MWEntry {
  meta: { id: string; stems: string[] };
  hwi?: { hw: string; prs?: { ipa?: string; sound?: { audio?: string } }[] };
  fl?: string;
  ins?: { if?: string; il?: string }[];
  shortdef?: string[];
  def?: any[];
}

export interface DictionaryData {
  word: string;
  ipa?: string;
  audioUrl?: string;
  partOfSpeech?: string;
  meaningEn?: string;
  example?: string;
  synonyms: string[];
  antonyms: string[];
  wordForms: WordForm[];
}

function cleanText(text: string): string {
  return text
    .replace(/\{bc\}/g, "")
    .replace(/\{it\}(.*?)\{\/it\}/g, "$1")
    .replace(/\{phrase\}(.*?)\{\/phrase\}/g, "$1")
    .replace(/\{ldquo\}/g, "\u201c")
    .replace(/\{rdquo\}/g, "\u201d")
    .replace(/\{sx\|([^|]*)\|.*?\}/g, "$1")
    .replace(/\{dx\}.*?\{\/dx\}/g, "")
    .replace(/\{[^}]*\}/g, "")
    .trim();
}

function audioUrlFromFilename(filename: string): string {
  let subdir = filename[0];
  if (filename.startsWith("bix")) subdir = "bix";
  else if (filename.startsWith("gg")) subdir = "gg";
  else if (/^[0-9]/.test(filename) || /^[^a-zA-Z]/.test(filename)) subdir = "number";
  return `https://media.merriam-webster.com/audio/prons/en/us/mp3/${subdir}/${filename}.mp3`;
}

function extractFirstExample(entry: MWEntry): string | undefined {
  try {
    const sseq = entry.def?.[0]?.sseq;
    for (const group of sseq ?? []) {
      for (const item of group) {
        if (item[0] === "sense") {
          const dt = item[1]?.dt ?? [];
          for (const [type, value] of dt) {
            if (type === "vis" && Array.isArray(value) && value[0]?.t) {
              return cleanText(value[0].t);
            }
          }
        }
      }
    }
  } catch {
    // نادیده گرفتن خطای پارس
  }
  return undefined;
}

export async function fetchDictionary(
  word: string,
  signal?: AbortSignal
): Promise<DictionaryData | null> {
  const res = await fetch(
    `https://lingo-proxy.amirkhalvatastam.workers.dev/?word=${encodeURIComponent(word)}`,
    { signal }
  );
  if (!res.ok) return null;

  const data = await res.json();
  if (!Array.isArray(data) || data.length === 0) return null;

  // اگر اولین آیتم رشته باشه یعنی کلمه پیدا نشده، فقط پیشنهاد داده
  if (typeof data[0] === "string") return null;

  const entries: MWEntry[] = data;
  const exactMatch =
    entries.find((e) => e.meta?.id === word) ??
    entries.find((e) => e.meta?.stems?.includes(word)) ??
    entries[0];

  if (!exactMatch) return null;

  const pron = exactMatch.hwi?.prs?.[0];
  const audioFile = pron?.sound?.audio;

  const wordForms: WordForm[] = (exactMatch.ins ?? [])
    .filter((i) => i.if)
    .map((i) => ({
      form: (i.if as string).replace(/\*/g, ""),
      label: i.il ?? "",
    }));

  return {
    word: exactMatch.hwi?.hw?.replace(/\*/g, "") ?? word,
    ipa: pron?.ipa,
    audioUrl: audioFile ? audioUrlFromFilename(audioFile) : undefined,
    partOfSpeech: exactMatch.fl,
    meaningEn: exactMatch.shortdef?.[0]
      ? cleanText(exactMatch.shortdef[0])
      : undefined,
    example: extractFirstExample(exactMatch),
    synonyms: [],
    antonyms: [],
    wordForms,
  };
}