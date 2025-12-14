import { RawItem, Source, fingerprintContent } from '@news/shared';

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

export async function ensureSource(source: Source) {
  const slug = (source as any).slug || source.name.toLowerCase().replace(/[^a-z0-9]+/g, '-');
  const existing = await fetchJson<{ docs: any[] }>(
    `/sources?limit=1&where[slug][equals]=${encodeURIComponent(slug)}`
  );

  if (existing.docs?.length) return existing.docs[0];

  const created = await fetchJson<unknown>('/sources', {
    method: 'POST',
    headers: headers(),
    body: JSON.stringify({ ...source, slug })
  });
  return created;
}

export async function upsertRawItem(rawItem: RawItem) {
  const fingerprint = rawItem.fingerprint || fingerprintContent(rawItem.sourceUrl);
  const existing = await fetchJson<{ docs: any[] }>(
    `/raw-items?limit=1&where[fingerprint][equals]=${encodeURIComponent(fingerprint)}`
  );

  if (existing.docs?.length) {
    return existing.docs[0];
  }

  const created = await fetchJson<unknown>('/raw-items', {
    method: 'POST',
    headers: headers(),
    body: JSON.stringify({ ...rawItem, fingerprint })
  });
  return created;
}
