import { DEFAULT_TAXONOMY, DEFAULT_SITE, Site, Section, Channel, Article, Story, Series } from '@news/shared';

const sampleArticles: Article[] = [
  {
    id: 'sample-article',
    site: DEFAULT_SITE.slug,
    section: 'fashion',
    channels: ['news'],
    locale: 'en-US',
    title: 'Welcome to the Bazaar-esque demo',
    dek: 'A production-ready monorepo skeleton for a modern newsroom.',
    body: '<p>Use Payload CMS to manage content and automation. Extend me freely.</p>',
    leadImage: undefined,
    gallery: [],
    sourceRefs: [],
    aiMeta: { promptTemplate: 'demo', promptVersion: 'v1' },
    status: 'review',
    publishedAt: new Date().toISOString()
  }
];

const sampleStories: Story[] = [
  {
    id: 'sample-story',
    site: DEFAULT_SITE.slug,
    title: 'Automation pipeline demo',
    summary: 'RawItems collected, AI summarized, editors approve.',
    trendScore: 3.5,
    firstSeenAt: new Date().toISOString(),
    lastSeenAt: new Date().toISOString(),
    sourcesAggregate: [{ source: 'demo', count: 1 }]
  }
];

export const contentClient = {
  async getSite(slug: string): Promise<Site> {
    return { ...DEFAULT_SITE, slug };
  },
  async listSections(): Promise<Section[]> {
    return DEFAULT_TAXONOMY.sections;
  },
  async listChannels(sectionSlug: string): Promise<Channel[]> {
    return DEFAULT_TAXONOMY.channels.filter((channel) => channel.section === sectionSlug);
  },
  async listSeries(): Promise<Series[]> {
    return DEFAULT_TAXONOMY.series;
  },
  async listArticles(): Promise<Article[]> {
    return sampleArticles;
  },
  async findArticle(slug: string): Promise<Article | undefined> {
    return sampleArticles.find((article) => article.id === slug);
  },
  async findStory(slug: string): Promise<Story | undefined> {
    return sampleStories.find((story) => story.id === slug);
  }
};
