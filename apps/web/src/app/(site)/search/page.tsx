import { contentClient } from '@/lib/contentClient';

export default async function SearchPage({ searchParams }: { searchParams: { q?: string } }) {
  const term = searchParams.q?.toLowerCase() ?? '';
  const articles = await contentClient.listArticles();
  const results = term
    ? articles.filter((article) => article.title.toLowerCase().includes(term) || (article.dek ?? '').toLowerCase().includes(term))
    : [];

  return (
    <section className="block">
      <h2>Search</h2>
      <p>Type a query in the URL (?q=) to filter the demo dataset.</p>
      <ul>
        {results.map((article) => (
          <li key={article.id}>{article.title}</li>
        ))}
      </ul>
    </section>
  );
}
