import dotenv from 'dotenv';
import { createLogger, RawItem, Source } from '@shared';
import { rssAdapter } from './adapters/rssAdapter';
import { apiAdapter } from './adapters/apiAdapter';
import { manualAdapter } from './adapters/manualAdapter';
import { createRawItem } from './clients/payloadClient';
import { recordJobRun } from './utils/audit';

dotenv.config();
const logger = createLogger('ingest');

const adapters = {
  rss: rssAdapter,
  api: apiAdapter,
  manual: manualAdapter
};

async function ingestSource(source: Source) {
  const adapter = adapters[source.type];
  if (!adapter) throw new Error(`Unsupported adapter type: ${source.type}`);
  const rawItems = await adapter.fetchItems({ source, siteSlug: 'harpers-bazaar' });

  for (const item of rawItems) {
    await createRawItem(item as RawItem);
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
