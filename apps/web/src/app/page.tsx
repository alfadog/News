import Link from 'next/link';
import { contentClient } from '@/lib/contentClient';

export default async function HomePage() {
  const [sections, articles] = await Promise.all([
    contentClient.listSections(),
    contentClient.listArticles()
  ]);

  return (
    <div className="grid twocol">
      <section className="block">
        <h2>Hero</h2>
        {articles[0] ? (
          <div>
            <h3>
              <Link href={`/article/${articles[0].id}`}>{articles[0].title}</Link>
            </h3>
            <p>{articles[0].dek}</p>
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
      </section>
    </div>
  );
}
