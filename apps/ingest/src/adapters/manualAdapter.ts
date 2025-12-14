import { RawItem, Source } from '@news/shared';

type FetchArgs = {
  source: Source;
  siteSlug: string;
};

export async function manualAdapter({ source, siteSlug }: FetchArgs): Promise<RawItem[]> {
  return [
    {
      source: source.id || source.name,
      sourceUrl: source.homepageUrl || 'https://example.com/manual',
      fetchedAt: new Date().toISOString(),
      rawTitle: 'Manual adapter placeholder',
      rawText: 'Seed content provided manually.',
      status: 'new',
      debug: { siteSlug }
    }
  ];
}
