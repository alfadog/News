import path from 'path';
import dotenv from 'dotenv';
import payload from 'payload';
import { DEFAULT_SITE, DEFAULT_TAXONOMY } from '@shared';

dotenv.config({ path: path.resolve(process.cwd(), '.env.local') });

type CollectionName = 'sites' | 'sections' | 'channels' | 'series';

async function upsert(collection: CollectionName, data: Record<string, unknown>) {
  const existing = await payload.find({ collection, limit: 1, where: { slug: { equals: data.slug as string } } });
  if (existing.docs.length > 0) {
    await payload.update({ collection, id: existing.docs[0].id, data });
  } else {
    await payload.create({ collection, data });
  }
}

async function run() {
  await payload.init({
    secret: process.env.PAYLOAD_SECRET || 'dev-secret',
    local: true,
    config: (await import('../payload/payload.config')).default
  });

  await upsert('sites', DEFAULT_SITE as Record<string, unknown>);

  for (const section of DEFAULT_TAXONOMY.sections) {
    await upsert('sections', section as Record<string, unknown>);
  }

  for (const channel of DEFAULT_TAXONOMY.channels) {
    await upsert('channels', channel as Record<string, unknown>);
  }

  for (const series of DEFAULT_TAXONOMY.series) {
    await upsert('series', series as Record<string, unknown>);
  }

  // eslint-disable-next-line no-console
  console.log('Seed complete');
}

run().catch((error) => {
  // eslint-disable-next-line no-console
  console.error(error);
  process.exit(1);
});
