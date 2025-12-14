import fs from 'fs';
import path from 'path';
import dotenv from 'dotenv';
import { createLogger, RawItem, Source, fingerprintContent } from '@news/shared';
import { rssAdapter } from './adapters/rssAdapter';
import { apiAdapter } from './adapters/apiAdapter';
import { manualAdapter } from './adapters/manualAdapter';
import { ensureSource, upsertRawItem } from './clients/payloadClient';
import { recordJobRun } from './utils/audit';

function loadEnv() {
  const candidates = [
    path.resolve(process.cwd(), '.env.local'),
    path.resolve(process.cwd(), '.env'),
    path.resolve(process.cwd(), '..', '..', '.env.local'),
    path.resolve(process.cwd(), '..', '..', '.env')
  ];

  const match = candidates.find((filePath) => fs.existsSync(filePath));
  if (match) {
    dotenv.config({ path: match });
  } else {
    dotenv.config();
  }
}

loadEnv();
const logger = createLogger('ingest');

const adapters = {
  rss: rssAdapter,
  api: apiAdapter,
  manual: manualAdapter
};

async function ingestSource(source: Source) {
  const adapter = adapters[source.type];
  if (!adapter) throw new Error(`Unsupported adapter type: ${source.type}`);
  const sourceRecord = await ensureSource(source);
  const rawItems = await adapter({ source: { ...source, id: (sourceRecord as any).id }, siteSlug: 'harpers-bazaar' });

  for (const item of rawItems) {
    const prepared: RawItem = {
      ...item,
      source: (sourceRecord as any).id || source.id || source.name,
      fingerprint: item.fingerprint || fingerprintContent(item.sourceUrl),
      status: 'new'
    };
    await upsertRawItem(prepared);
  }

  return rawItems.length;
}

async function run() {
  const start = new Date().toISOString();
  logger.info('Starting ingestion job', { start });

  const demoSource: Source = {
    id: 'demo-rss',
    name: 'Demo RSS',
    type: 'rss',
    fetchConfig: { url: 'https://www.theverge.com/rss/index.xml' },
    trustTier: 2
  };

  try {
    const count = await ingestSource(demoSource);
    const finish = new Date().toISOString();
    logger.info('Ingestion complete', { count });
    await recordJobRun({
      jobType: 'ingest',
      startedAt: start,
      finishedAt: finish,
      status: 'success',
      counts: { created: count }
    });
  } catch (error) {
    const finish = new Date().toISOString();
    logger.error('Ingestion failed', { error: (error as Error).message });
    await recordJobRun({
      jobType: 'ingest',
      startedAt: start,
      finishedAt: finish,
      status: 'error',
      errorDetails: (error as Error).stack
    });
    process.exitCode = 1;
  }
}

run();
