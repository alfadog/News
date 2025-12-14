import fetch from 'node-fetch';
import { Article, RawItem } from '@news/shared';

const baseURL =
  process.env.PAYLOAD_REST_URL || `${(process.env.PAYLOAD_PUBLIC_SERVER_URL || 'http://localhost:4000').replace(/\/$/, '')}/api`;
const token = process.env.PAYLOAD_API_KEY;

export async function listRawItems(limit = 5): Promise<RawItem[]> {
  const response = await fetch(`${baseURL}/raw-items?limit=${limit}`);
  const json = (await response.json()) as { docs: RawItem[] };
  return json.docs ?? [];
}

export async function createArticle(article: Article) {
  await fetch(`${baseURL}/articles`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: token ? `JWT ${token}` : ''
    },
    body: JSON.stringify(article)
  });
}
