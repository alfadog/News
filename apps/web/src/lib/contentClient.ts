import { Article, Channel, Section, Series, Story } from '@news/shared';

class CmsConfigError extends Error {
  constructor(message: string) {
    super(message);
    this.name = 'CmsConfigError';
  }
}

type PayloadList<T> = { docs: T[] };

function getRestBase() {
  const base = process.env.PAYLOAD_PUBLIC_SERVER_URL;
  if (!base) {
    throw new CmsConfigError('PAYLOAD_PUBLIC_SERVER_URL is not configured. Set it in Vercel or .env.local.');
  }
  return `${base.replace(/\/$/, '')}/api`;
}

async function fetchPayload<T>(path: string, init?: RequestInit): Promise<T> {
  const response = await fetch(`${getRestBase()}${path}`, {
    next: { revalidate: 30 },
    cache: 'no-store',
    ...init
  });

  if (!response.ok) {
    const body = await response.text();
    throw new Error(`Failed to load ${path}: ${response.status} ${body}`);
  }

  return response.json() as Promise<T>;
}

function normalizeSection(section: any): Section {
  if (!section) throw new Error('Section missing');
  return {
    id: section.id ?? section,
    site: typeof section.site === 'object' ? section.site.slug : section.site,
    slug: section.slug ?? section,
    title: section.title ?? section.slug,
    order: section.order
  };
}

function normalizeChannel(channel: any): Channel {
  if (!channel) throw new Error('Channel missing');
  const section = channel.section ? normalizeSection(channel.section) : channel.section;
  return {
    id: channel.id ?? channel,
    section,
    slug: channel.slug ?? channel,
    title: channel.title ?? channel.slug,
    order: channel.order
  } as Channel;
}

function normalizeArticle(article: any): Article {
  const section = article.section ? normalizeSection(article.section) : article.section;
  const channels = (article.channels || []).map((channel: any) => normalizeChannel(channel));

  return {
    ...article,
    id: article.id,
    slug: article.slug,
    section,
    channels,
    sourceRefs: (article.sourceRefs || []).map((ref: any) => ({ url: ref.url, label: ref.label }))
  } as Article;
}

export const contentClient = {
  isConfigError(error: unknown) {
    return error instanceof CmsConfigError;
  },

  async listSections(): Promise<Section[]> {
    const params = new URLSearchParams({ limit: '50', sort: 'order' });
    const data = await fetchPayload<PayloadList<Section>>(`/sections?${params.toString()}`);
    return data.docs.map(normalizeSection);
  },

  async listChannels(sectionSlug?: string): Promise<Channel[]> {
    const params = new URLSearchParams({ limit: '200', depth: '1', sort: 'order' });
    const data = await fetchPayload<PayloadList<Channel>>(`/channels?${params.toString()}`);
    const channels = data.docs.map(normalizeChannel);

    if (!sectionSlug) return channels;
    return channels.filter((channel) => {
      const sectionValue = channel.section as Section | string;
      const slug = typeof sectionValue === 'object' ? sectionValue.slug : sectionValue;
      return slug === sectionSlug;
    });
  },

  async listSeries(): Promise<Series[]> {
    const params = new URLSearchParams({ limit: '50', sort: 'title' });
    const data = await fetchPayload<PayloadList<Series>>(`/series?${params.toString()}`);
    return data.docs as Series[];
  },

  async listStories(): Promise<Story[]> {
    const params = new URLSearchParams({ limit: '50', sort: '-lastSeenAt' });
    const data = await fetchPayload<PayloadList<Story>>(`/stories?${params.toString()}`);
    return data.docs as Story[];
  },

  async getStory(slug: string): Promise<Story | undefined> {
    const stories = await this.listStories();
    return stories.find((story) => story.slug === slug);
  },

  async listLatestArticles(limit = 25): Promise<Article[]> {
    const params = new URLSearchParams({
      limit: String(limit),
      depth: '2',
      sort: '-publishedAt',
      'where[status][equals]': 'published'
    });
    const data = await fetchPayload<PayloadList<Article>>(`/articles?${params.toString()}`);
    return data.docs.map(normalizeArticle);
  },

  async listArticlesBySection(sectionSlug: string, limit = 20): Promise<Article[]> {
    const articles = await this.listLatestArticles(limit * 2);
    return articles.filter((article) => {
      const sectionValue = article.section as Section | string;
      const slug = typeof sectionValue === 'object' ? sectionValue.slug : sectionValue;
      return slug === sectionSlug;
    });
  },

  async listArticlesByChannel(channelSlug: string, limit = 20): Promise<Article[]> {
    const articles = await this.listLatestArticles(limit * 2);
    return articles.filter((article) => {
      const channels = (article.channels || []) as Array<Channel | string>;
      return channels.some((channel) => {
        const slug = typeof channel === 'object' ? channel.slug : channel;
        return slug === channelSlug;
      });
    });
  },

  async getArticle(slugOrId: string): Promise<Article | undefined> {
    const params = new URLSearchParams({
      limit: '1',
      depth: '2',
      'where[slug][equals]': slugOrId
    });
    const bySlug = await fetchPayload<PayloadList<Article>>(`/articles?${params.toString()}`);
    if (bySlug.docs?.length) return normalizeArticle(bySlug.docs[0]);

    try {
      const byId = await fetchPayload<Article>(`/articles/${slugOrId}?depth=2`);
      return normalizeArticle(byId);
    } catch (error) {
      if ((error as Error).message.includes('Failed to load')) return undefined;
      throw error;
    }
  },

  async searchArticles(query: string): Promise<Article[]> {
    if (!query) return [];
    const params = new URLSearchParams({
      depth: '2',
      limit: '20',
      'where[title][contains]': query
    });
    const data = await fetchPayload<PayloadList<Article>>(`/articles?${params.toString()}`);
    return data.docs.map(normalizeArticle);
  }
};

export type ContentClientError = CmsConfigError;
