import fs from 'fs';
import path from 'path';
import dotenv from 'dotenv';
import payload from 'payload';
import { DEFAULT_SITE, DEFAULT_TAXONOMY } from '@news/shared';

type CollectionName = 'sites' | 'sections' | 'channels' | 'series' | 'sources' | 'stories' | 'articles';

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

async function upsertBySlug(collection: CollectionName, slug: string, data: Record<string, unknown>): Promise<any> {
  const existing = await payload.find({ collection, limit: 1, where: { slug: { equals: slug } } });
  if (existing.docs.length > 0) {
    return payload.update({ collection, id: existing.docs[0].id, data: data as any });
  }

  return payload.create({ collection, data: data as any });
}

async function run() {
  await payload.init({
    secret: process.env.PAYLOAD_SECRET || 'dev-secret',
    local: true,
    config: (await import('../payload/payload.config')).default
  });

  const site = (await upsertBySlug('sites', DEFAULT_SITE.slug, DEFAULT_SITE as unknown as Record<string, unknown>)) as any;

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
      ? await payload.update({ collection: 'sections', id: record.docs[0].id, data: data as any })
      : await payload.create({ collection: 'sections', data: data as any });

    sectionIds[section.slug] = saved.id as string;
  }

  const channelIds: Record<string, string> = {};
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

    const saved = record.docs.length > 0
      ? await payload.update({ collection: 'channels', id: record.docs[0].id, data: data as any })
      : await payload.create({ collection: 'channels', data: data as any });

    channelIds[channel.slug] = saved.id as string;
  }

  const seriesIds: Record<string, string> = {};
  for (const series of DEFAULT_TAXONOMY.series) {
    const data = { ...series, site: site.id } as Record<string, unknown>;
    const saved = (await upsertBySlug('series', series.slug, data)) as any;
    seriesIds[series.slug] = saved.id as string;
  }

  const sources = [
    { slug: 'demo-rss', name: 'Demo RSS', homepageUrl: 'https://www.theverge.com', type: 'rss', fetchConfig: { url: 'https://www.theverge.com/rss/index.xml' }, trustTier: '2' },
    { slug: 'editorial-desk', name: 'Editorial Desk', homepageUrl: 'https://example.com', type: 'manual', trustTier: '1' }
  ];

  for (const source of sources) {
    await upsertBySlug('sources', source.slug, source as Record<string, unknown>);
  }

  const demoStories = [
    {
      slug: 'spring-style-report',
      title: 'Spring Style Report',
      summary: 'Seasonal trends, from tailoring to color palettes.'
    },
    {
      slug: 'culture-conversations',
      title: 'Culture Conversations',
      summary: 'Interviews and essays shaping the cultural moment.'
    },
    {
      slug: 'beauty-lab',
      title: 'Beauty Lab',
      summary: 'Product tests and ingredient explainers.'
    }
  ];

  const storyIds: Record<string, string> = {};
  for (const story of demoStories) {
    const saved = (await upsertBySlug('stories', story.slug as string, {
      ...story,
      site: site.id,
      firstSeenAt: new Date().toISOString(),
      lastSeenAt: new Date().toISOString(),
      trendScore: 3.5
    })) as any;
    storyIds[story.slug] = saved.id as string;
  }

  const now = Date.now();
  const demoArticles = [
    {
      slug: 'tailored-evening-dressing',
      title: 'Tailored Evening Dressing Is Back',
      dek: 'Sharp suiting, softened by silk layers and sculptural jewelry.',
      body: '<p>Editors are pairing sleek tuxedo jackets with liquid satin skirts and bold cuffs.</p><p>From fittings to fabric sourcing, the look balances structure with ease.</p>',
      section: 'fashion',
      channels: ['news'],
      story: 'spring-style-report',
      publishedOffsetDays: 1,
      sourceUrl: 'https://example.com/fashion/tailored-evening',
      series: 'icons'
    },
    {
      slug: 'beauty-lab-skin-minerals',
      title: 'Beauty Lab: The Rise of Skin Minerals',
      dek: 'Dermatologists explain why copper peptides and magnesium are everywhere.',
      body: '<p>We asked experts to unpack the new mineral-forward skincare launches.</p><p>Laboratory tests show calming effects when paired with ceramides.</p>',
      section: 'beauty',
      channels: ['skin'],
      story: 'beauty-lab',
      publishedOffsetDays: 2,
      sourceUrl: 'https://example.com/beauty/skin-minerals'
    },
    {
      slug: 'editors-picks-weekend-bags',
      title: "Editors' Picks: Weekender Bags That Last",
      dek: 'Structured carryalls tested on trains, planes, and short-haul escapes.',
      body: '<p>From Italian leather duffels to recycled nylon totes, we carried them all.</p><p>These are the shapes that kept their polish under pressure.</p>',
      section: 'shopping',
      channels: ['editors-picks'],
      publishedOffsetDays: 3,
      sourceUrl: 'https://example.com/shopping/weekender-bags'
    },
    {
      slug: 'red-carpet-met-gala',
      title: 'Red Carpet: Met Gala Moments to Bookmark',
      dek: 'A curated list of silhouettes that defined the night.',
      body: '<p>Voluminous trains, archival references, and midnight feathers dominated.</p><p>Designers leaned into craftsmanship to deliver spectacle.</p>',
      section: 'celebrity',
      channels: ['news'],
      story: 'spring-style-report',
      publishedOffsetDays: 4,
      sourceUrl: 'https://example.com/celebrity/met-gala'
    },
    {
      slug: 'gallery-openings-may',
      title: '5 Gallery Openings Worth Leaving the House For',
      dek: 'Curators spotlight the artists bending form and light.',
      body: '<p>From Brooklyn to Berlin, these exhibitions champion immersive installations.</p><p>Expect ceramics, kinetic sculpture, and site-specific textiles.</p>',
      section: 'culture',
      channels: ['art'],
      story: 'culture-conversations',
      publishedOffsetDays: 5,
      sourceUrl: 'https://example.com/culture/galleries'
    },
    {
      slug: 'bridal-style-modern',
      title: 'A Modern Take on Bridal Style',
      dek: 'Caped gowns, clean lines, and heirloom pearls redefine the aisle.',
      body: '<p>Stylists recommend balancing architectural silhouettes with soft veils.</p><p>Mixing vintage jewelry keeps the look personal.</p>',
      section: 'weddings',
      channels: ['style'],
      publishedOffsetDays: 6,
      sourceUrl: 'https://example.com/weddings/modern-style'
    },
    {
      slug: 'film-score-composers',
      title: 'The Film Score Composers Shaping 2024',
      dek: 'How minimalist melodies and analog synths are changing cinema.',
      body: '<p>Directors are collaborating earlier in the process to build sonic worlds.</p><p>These composers balance nostalgia with experimental edges.</p>',
      section: 'culture',
      channels: ['film-tv'],
      story: 'culture-conversations',
      publishedOffsetDays: 7,
      sourceUrl: 'https://example.com/culture/film-score'
    },
    {
      slug: 'runway-report-resort',
      title: 'Runway Report: Resort Season Highlights',
      dek: 'Fluid tailoring, citrus palettes, and sculpted sandals dominated.',
      body: '<p>Designers leaned on artisanal weaving and airy knits for transitional weather.</p><p>Travel-ready layers remain the hero.</p>',
      section: 'fashion',
      channels: ['runway'],
      story: 'spring-style-report',
      publishedOffsetDays: 8,
      sourceUrl: 'https://example.com/fashion/runway-resort'
    },
    {
      slug: 'haircut-trends-summer',
      title: 'The Haircuts Stylists Predict for Summer',
      dek: 'Weightless layers, ribbon bangs, and sculptural bobs.',
      body: '<p>Pros are prioritizing movement and easy styling routines.</p><p>We paired each cut with the products that keep shapes intact.</p>',
      section: 'beauty',
      channels: ['hair'],
      story: 'beauty-lab',
      publishedOffsetDays: 9,
      sourceUrl: 'https://example.com/beauty/haircuts-summer'
    },
    {
      slug: 'music-festivals-style',
      title: 'Music Festivals: Style That Survives the Weekend',
      dek: 'Packing lists that withstand heat, rain, and long days.',
      body: '<p>Think lightweight knits, hands-free bags, and sturdy boots.</p><p>Editors share what actually made it out of the suitcase.</p>',
      section: 'culture',
      channels: ['music'],
      publishedOffsetDays: 10,
      sourceUrl: 'https://example.com/culture/festival-style'
    },
    {
      slug: 'shopping-guides-sandals',
      title: 'The Sandal Guide: Cushioned, Minimalist, Elevated',
      dek: 'From city commutes to coastal getaways, these pairs carry the look.',
      body: '<p>Designers are investing in padded footbeds and architectural straps.</p><p>Pair with crisp shirting or linen suiting for instant polish.</p>',
      section: 'shopping',
      channels: ['guides'],
      publishedOffsetDays: 11,
      sourceUrl: 'https://example.com/shopping/sandals'
    },
    {
      slug: 'wedding-checklist-updated',
      title: 'The Updated Wedding Checklist',
      dek: 'From guest experience to sustainable florals, planners weigh in.',
      body: '<p>Focus on pacing, thoughtful favors, and flexible timelines.</p><p>We mapped the 90-day sprint with expert-approved milestones.</p>',
      section: 'weddings',
      channels: ['planning'],
      publishedOffsetDays: 12,
      sourceUrl: 'https://example.com/weddings/checklist'
    }
  ];

  for (const [index, article] of demoArticles.entries()) {
    const sectionId = sectionIds[article.section];
    const channelIdsForArticle = (article.channels || [])
      .map((channelSlug) => channelIds[channelSlug])
      .filter(Boolean);
    if (!sectionId) continue;

    const publishedAt = new Date(now - (article.publishedOffsetDays ?? index) * 24 * 60 * 60 * 1000).toISOString();

    const data: Record<string, unknown> = {
      slug: article.slug,
      site: site.id,
      section: sectionId,
      channels: channelIdsForArticle,
      story: article.story ? storyIds[article.story] : undefined,
      series: article.series ? [seriesIds[article.series]] : undefined,
      locale: 'en-US',
      title: article.title,
      dek: article.dek,
      body: article.body,
      status: 'published',
      sourceRefs: [{ url: article.sourceUrl, label: 'Source link' }],
      aiMeta: { promptVersion: 'seed-demo', generator: 'seed-script' },
      publishedAt
    };

    await upsertBySlug('articles', article.slug, data);
  }

  // eslint-disable-next-line no-console
  console.log('Seed complete: site, taxonomy, demo content ready');
}

run().catch((error) => {
  // eslint-disable-next-line no-console
  console.error(error);
  process.exit(1);
});
