interface DatamuseWord {
  word: string;
  score: number;
}

export async function fetchSynonyms(word: string, signal?: AbortSignal): Promise<string[]> {
  const res = await fetch(
    `https://api.datamuse.com/words?rel_syn=${encodeURIComponent(word)}&max=8`,
    { signal }
  );
  if (!res.ok) return [];
  const data: DatamuseWord[] = await res.json();
  return data.map((d) => d.word);
}

export async function fetchAntonyms(word: string, signal?: AbortSignal): Promise<string[]> {
  const res = await fetch(
    `https://api.datamuse.com/words?rel_ant=${encodeURIComponent(word)}&max=6`,
    { signal }
  );
  if (!res.ok) return [];
  const data: DatamuseWord[] = await res.json();
  return data.map((d) => d.word);
}

export async function fetchSpellingSuggestions(
  word: string,
  signal?: AbortSignal
): Promise<string[]> {
  const res = await fetch(
    `https://api.datamuse.com/words?sp=${encodeURIComponent(word)}&max=3`,
    { signal }
  );
  if (!res.ok) return [];
  const data: DatamuseWord[] = await res.json();
  return data.map((d) => d.word);
}