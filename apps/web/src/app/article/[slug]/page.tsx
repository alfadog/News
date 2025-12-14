import { notFound } from 'next/navigation';
import { contentClient } from '@/lib/contentClient';

interface Props {
  params: { slug: string };
}

export default async function ArticlePage({ params }: Props) {
  const article = await contentClient.findArticle(params.slug);
  if (!article) return notFound();

  return (
    <article className="block">
      <p className="tagline">Status: {article.status}</p>
      <h1>{article.title}</h1>
      {article.dek && <p>{article.dek}</p>}
      <div dangerouslySetInnerHTML={{ __html: article.body }} />
    </article>
  );
}
