import path from 'path';
import dotenv from 'dotenv';
import payload from 'payload';
import { DEFAULT_SITE, DEFAULT_TAXONOMY } from '@news/shared';

dotenv.config({ path: path.resolve(process.cwd(), '.env.local') });

type CollectionName = 'sites' | 'sections' | 'channels' | 'series';

async function upsertBySlug(collection: CollectionName, slug: string, data: Record<string, unknown>) {
  const existing = await payload.find({ collection, limit: 1, where: { slug: { equals: slug } } });
  if (existing.docs.length > 0) {
    return payload.update({ collection, id: existing.docs[0].id, data });
  }

  return payload.create({ collection, data });
}

async function run() {
  await payload.init({
    secret: process.env.PAYLOAD_SECRET || 'dev-secret',
    local: true,
    config: (await import('../payload/payload.config')).default
  });

  const site = await upsertBySlug('sites', DEFAULT_SITE.slug, DEFAULT_SITE as Record<string, unknown>);

  const sectionIds: Record<string, string> = {};
  for (const section of DEFAULT_TAXONOMY.sections) {
    const record = await payload.find({
      collection: 'sections',
      limit: 1,
      where: {
        and: [
          { slug: { equals: section.slug } },
          { site: { equals: site.id } }
        ]
      }
    });

    const data = { ...section, site: site.id } as Record<string, unknown>;

    const saved = record.docs.length > 0
      ? await payload.update({ collection: 'sections', id: record.docs[0].id, data })
      : await payload.create({ collection: 'sections', data });

    sectionIds[section.slug] = saved.id as string;
  }

  for (const channel of DEFAULT_TAXONOMY.channels) {
    const sectionId = sectionIds[channel.section as string];
    if (!sectionId) continue;

    const record = await payload.find({
      collection: 'channels',
      limit: 1,
      where: {
        and: [
          { slug: { equals: channel.slug } },
          { section: { equals: sectionId } }
        ]
      }
    });

    const data = { ...channel, section: sectionId } as Record<string, unknown>;

    if (record.docs.length > 0) {
      await payload.update({ collection: 'channels', id: record.docs[0].id, data });
    } else {
      await payload.create({ collection: 'channels', data });
    }
  }

  for (const series of DEFAULT_TAXONOMY.series) {
    const data = { ...series, site: site.id } as Record<string, unknown>;
    await upsertBySlug('series', series.slug, data);
  }

  // eslint-disable-next-line no-console
  console.log('Seed complete');
}

run().catch((error) => {
  // eslint-disable-next-line no-console
  console.error(error);
  process.exit(1);
});
