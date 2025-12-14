import fetch from 'node-fetch';
import { RawItem } from '@news/shared';

const baseURL = process.env.PAYLOAD_REST_URL || 'http://localhost:3000/api';
const token = process.env.PAYLOAD_API_KEY;

export async function createRawItem(rawItem: RawItem) {
  await fetch(`${baseURL}/raw-items`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: token ? `JWT ${token}` : ''
    },
    body: JSON.stringify(rawItem)
  });
}
