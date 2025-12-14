import { Article, RawItem } from '@news/shared';

const baseURL =
  process.env.PAYLOAD_REST_URL || `${(process.env.PAYLOAD_PUBLIC_SERVER_URL || 'http://localhost:4000').replace(/\/$/, '')}/api`;
const token = process.env.PAYLOAD_API_KEY;

function headers() {
  return {
    'Content-Type': 'application/json',
    Authorization: token ? `JWT ${token}` : ''
  };
}

async function fetchJson<T>(path: string, init?: RequestInit): Promise<T> {
  const response = await fetch(`${baseURL}${path}`, init);
  if (!response.ok) {
    const text = await response.text();
    throw new Error(`Payload request failed: ${response.status} ${text}`);
  }
  return response.json() as Promise<T>;
}

export async function listRawItems(limit = 5): Promise<RawItem[]> {
  const params = new URLSearchParams({
    limit: String(limit),
    'where[status][equals]': 'new',
    sort: '-publishedAt'
  });
  const json = await fetchJson<{ docs: RawItem[] }>(`/raw-items?${params.toString()}`);
  return json.docs ?? [];
}

export async function getIdBySlug(collection: string, slug: string): Promise<string | undefined> {
  const json = await fetchJson<{ docs: any[] }>(`/${collection}?limit=1&where[slug][equals]=${encodeURIComponent(slug)}`);
  return json.docs?.[0]?.id;
}

export async function createArticle(article: Article) {
  const created = await fetchJson<{ id: string }>('/articles', {
    method: 'POST',
    headers: headers(),
    body: JSON.stringify(article)
  });
  return created;
}

export async function markRawItemProcessed(rawItemId: string, articleId?: string) {
  return fetchJson(`/raw-items/${rawItemId}`, {
    method: 'PATCH',
    headers: headers(),
    body: JSON.stringify({ status: 'processed', processedAt: new Date().toISOString(), article: articleId })
  });
}
