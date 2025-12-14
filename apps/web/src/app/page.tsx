import Link from 'next/link';
import { contentClient } from '@/lib/contentClient';
import { ErrorCard } from './components/ErrorCard';

export default async function HomePage() {
  try {
    const [sections, articles] = await Promise.all([
      contentClient.listSections(),
      contentClient.listLatestArticles(24)
    ]);

    const hero = articles[0];
    const rest = articles.slice(1);

    return (
      <div className="grid twocol">
        <section className="block">
          <h2>Latest</h2>
          {hero ? (
            <div>
              <p className="tagline">{typeof hero.section === 'object' ? hero.section.title : hero.section}</p>
              <h3>
                <Link href={`/article/${hero.slug}`}>{hero.title}</Link>
              </h3>
              <p>{hero.dek}</p>
            </div>
          ) : (
            <p>No articles yet.</p>
          )}
        </section>

        <section className="block">
          <h2>Sections</h2>
          <ul>
            {sections.map((section) => (
              <li key={section.slug}>
                <Link href={`/${section.slug}`}>{section.title}</Link>
              </li>
            ))}
          </ul>
          <h3 style={{ marginTop: '1rem' }}>Latest articles</h3>
          <ul>
            {rest.slice(0, 8).map((article) => (
              <li key={article.slug}>
                <Link href={`/article/${article.slug}`}>{article.title}</Link>{' '}
                <span className="tagline">{typeof article.section === 'object' ? article.section.title : ''}</span>
              </li>
            ))}
          </ul>
        </section>
      </div>
    );
  } catch (error) {
    const message = contentClient.isConfigError(error)
      ? 'Set PAYLOAD_PUBLIC_SERVER_URL so the site can fetch content from Payload.'
      : 'Unable to load content from the CMS right now.';
    return <ErrorCard message={message} />;
  }
}
