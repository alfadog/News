import Parser from 'rss-parser';
import { RawItem, Source } from '@news/shared';

const parser = new Parser();

type FetchArgs = {
  source: Source;
  siteSlug: string;
};

export async function rssAdapter({ source, siteSlug }: FetchArgs): Promise<RawItem[]> {
  const url = source.fetchConfig?.url as string | undefined;
  if (!url) throw new Error('RSS source missing url');

  const feed = await parser.parseURL(url);
  const now = new Date().toISOString();

  return (
    feed.items?.slice(0, 10).map((item) => ({
      source: source.id || source.name,
      sourceUrl: item.link || '',
      fetchedAt: now,
      publishedAt: item.isoDate || item.pubDate || now,
      rawTitle: item.title || 'Untitled',
      rawText: item.contentSnippet || item.content || '',
      language: item.isoDate ? 'en-US' : 'en-US',
      status: 'new',
      debug: { siteSlug }
    })) || []
  );
}
