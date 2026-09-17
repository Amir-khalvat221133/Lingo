const DE_PARAM = "lingo.app.contact@gmail.com";

export async function translateToFa(text: string, signal?: AbortSignal): Promise<string | null> {
  const url = new URL("https://api.mymemory.translated.net/get");
  url.searchParams.set("q", text);
  url.searchParams.set("langpair", "en|fa");
  url.searchParams.set("de", DE_PARAM);

  const res = await fetch(url.toString(), { signal });
  if (!res.ok) return null;
  const data = await res.json();
  const translated = data?.responseData?.translatedText as string | undefined;
  if (!translated || translated.toUpperCase().includes("MYMEMORY WARNING")) return null;
  return translated;
}