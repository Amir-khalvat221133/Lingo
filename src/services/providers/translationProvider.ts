// ترجمه از طریق همون lingo-proxy فعلی، ولی حالا با یه route جدید (/translate)
// که پشتش از Cloudflare Workers AI استفاده می‌کنه (رایگان، بدون کارت، تا سقف روزانه).
const PROXY_BASE = "https://lingo-proxy.amirkhalvatastam.workers.dev";

export async function translateToFa(text: string, signal?: AbortSignal): Promise<string | null> {
  const url = new URL(`${PROXY_BASE}/translate`);
  url.searchParams.set("text", text);

  const res = await fetch(url.toString(), { signal });
  if (!res.ok) return null;

  const data = await res.json();
  const translated = data?.translation as string | undefined;
  if (!translated) return null;
  return translated;
}
