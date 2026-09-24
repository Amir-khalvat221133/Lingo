const PROXY_BASE = "https://lingo-proxy.amirkhalvatastam.workers.dev";

export interface WordTranslation {
  meaningFa: string | null;
  exampleFa: string | null;
}

/**
 * ترجمه‌ی یک کلمه با توجه به معنی (sense) و نقش دستوریش.
 * این‌ها به مدل کمک می‌کنن معنی درست رو انتخاب کنه (مثلاً bank = ساحل رودخانه، نه بانک).
 */
export async function translateWord(
  word: string,
  partOfSpeech?: string,
  meaningEn?: string,
  example?: string,
  signal?: AbortSignal
): Promise<WordTranslation> {
  const url = new URL(`${PROXY_BASE}/translate`);
  url.searchParams.set("word", word);
  if (partOfSpeech) url.searchParams.set("pos", partOfSpeech);
  if (meaningEn) url.searchParams.set("def", meaningEn);
  if (example) url.searchParams.set("ex", example);

  try {
    const res = await fetch(url.toString(), { signal });
    if (!res.ok) return { meaningFa: null, exampleFa: null };
    const data = await res.json();
    return {
      meaningFa: typeof data?.meaningFa === "string" ? data.meaningFa : null,
      exampleFa: typeof data?.exampleFa === "string" ? data.exampleFa : null,
    };
  } catch (err) {
    // اگه جستجو لغو شده (کاربر تایپ جدید کرده)، این خطا نباید به‌عنوان
    // "ترجمه‌ای وجود نداره" تفسیر و کش بشه؛ بذار بالا بره.
    if (err instanceof DOMException && err.name === "AbortError") throw err;
    return { meaningFa: null, exampleFa: null };
  }
}

/**
 * ترجمه‌ی یک جمله‌ی کامل به فارسی روان.
 */
export async function translateSentence(
  text: string,
  signal?: AbortSignal
): Promise<string | null> {
  const url = new URL(`${PROXY_BASE}/translate`);
  url.searchParams.set("text", text);

  try {
    const res = await fetch(url.toString(), { signal });
    if (!res.ok) return null;
    const data = await res.json();
    return typeof data?.translation === "string" ? data.translation : null;
  } catch (err) {
    if (err instanceof DOMException && err.name === "AbortError") throw err;
    return null;
  }
}
