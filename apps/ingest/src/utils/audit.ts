import fetch from 'node-fetch';
import { JobRun } from '@news/shared';

const baseURL = process.env.PAYLOAD_REST_URL || 'http://localhost:3000/api';
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
