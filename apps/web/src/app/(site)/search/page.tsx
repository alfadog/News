import Link from 'next/link';
import { contentClient } from '@/lib/contentClient';
import { ErrorCard } from '@/app/components/ErrorCard';

interface Props {
  searchParams: { q?: string };
}

export default async function SearchPage({ searchParams }: Props) {
  const query = searchParams.q || '';

  try {
    const results = query ? await contentClient.searchArticles(query) : [];

    return (
      <div className="block">
        <h2>Search</h2>
        <p className="tagline">Query the Payload CMS content</p>
        <form>
          <input type="text" name="q" defaultValue={query} placeholder="Search titles" />
          <button type="submit">Search</button>
        </form>

        {query && (
          <div style={{ marginTop: '1rem' }}>
            <p className="tagline">{results.length} results for “{query}”</p>
            <ul>
              {results.map((article) => (
                <li key={article.slug}>
                  <Link href={`/article/${article.slug}`}>{article.title}</Link>
                  {article.dek && <p className="tagline">{article.dek}</p>}
                </li>
              ))}
            </ul>
            {results.length === 0 && <p>No matches found yet.</p>}
          </div>
        )}
      </div>
    );
  } catch (error) {
    const message = contentClient.isConfigError(error)
      ? 'Set PAYLOAD_PUBLIC_SERVER_URL so the site can fetch content from Payload.'
      : 'Unable to run search against the CMS.';
    return <ErrorCard message={message} />;
  }
}
