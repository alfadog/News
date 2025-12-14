import { RawItem, Source } from '@news/shared';

type FetchArgs = {
  source: Source;
  siteSlug: string;
};

export async function apiAdapter({ source, siteSlug }: FetchArgs): Promise<RawItem[]> {
  return [
    {
      source: source.id || source.name,
      sourceUrl: `${source.homepageUrl || 'https://example.com'}/api-demo`,
      fetchedAt: new Date().toISOString(),
      rawTitle: 'API adapter stub',
      rawText: 'Replace with real API ingestion.',
      status: 'new',
      debug: { siteSlug }
    }
  ];
}
