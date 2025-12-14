import { notFound } from 'next/navigation';
import { contentClient } from '@/lib/contentClient';
import { ErrorCard } from '@/app/components/ErrorCard';

interface Props {
  params: { slug: string };
}

export default async function ArticlePage({ params }: Props) {
  try {
    const article = await contentClient.getArticle(params.slug);
    if (!article) return notFound();

    const sectionTitle = typeof article.section === 'object' ? article.section.title : article.section;
    const channelTitle = (article.channels || [])
      .map((channel: any) => (typeof channel === 'object' ? channel.title : channel))
      .join(', ');

    return (
      <article className="block">
        <p className="tagline">
          {sectionTitle}
          {channelTitle ? ` • ${channelTitle}` : ''}
        </p>
        <h1>{article.title}</h1>
        {article.dek && <p>{article.dek}</p>}
        <div dangerouslySetInnerHTML={{ __html: article.body }} />
        {article.sourceRefs && article.sourceRefs.length > 0 && (
          <p className="tagline">
            Source:{' '}
            <a href={article.sourceRefs[0].url} target="_blank" rel="noreferrer">
              {article.sourceRefs[0].label || article.sourceRefs[0].url}
            </a>
          </p>
        )}
        {article.publishedAt && <p className="tagline">Published {new Date(article.publishedAt).toLocaleString()}</p>}
      </article>
    );
  } catch (error) {
    const message = contentClient.isConfigError(error)
      ? 'Set PAYLOAD_PUBLIC_SERVER_URL so the site can fetch content from Payload.'
      : 'Unable to load this article from the CMS.';
    return <ErrorCard message={message} />;
  }
}
