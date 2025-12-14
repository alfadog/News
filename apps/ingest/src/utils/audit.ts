import fetch from 'node-fetch';
import { JobRun } from '@news/shared';

const baseURL =
  process.env.PAYLOAD_REST_URL || `${(process.env.PAYLOAD_PUBLIC_SERVER_URL || 'http://localhost:4000').replace(/\/$/, '')}/api`;
const token = process.env.PAYLOAD_API_KEY;

export async function recordJobRun(job: JobRun) {
  await fetch(`${baseURL}/job-runs`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: token ? `JWT ${token}` : ''
    },
    body: JSON.stringify(job)
  });
}
