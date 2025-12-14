import Link from 'next/link';
import { notFound } from 'next/navigation';
import { contentClient } from '@/lib/contentClient';
import { ErrorCard } from '@/app/components/ErrorCard';

interface Props {
  params: { section: string };
}

export default async function SectionPage({ params }: Props) {
  try {
    const [sections, channels, articles] = await Promise.all([
      contentClient.listSections(),
      contentClient.listChannels(params.section),
      contentClient.listArticlesBySection(params.section)
    ]);
    const section = sections.find((s) => s.slug === params.section);
    if (!section) return notFound();

    return (
      <div className="block">
        <h2>{section.title}</h2>
        <p>Browse channels within {section.title}.</p>
        <ul>
          {channels.map((channel) => (
            <li key={channel.slug}>
              <Link href={`/${section.slug}/${channel.slug}`}>{channel.title}</Link>
            </li>
          ))}
        </ul>

        <h3 style={{ marginTop: '1rem' }}>Latest in {section.title}</h3>
        <ul>
          {articles.map((article) => (
            <li key={article.slug}>
              <Link href={`/article/${article.slug}`}>{article.title}</Link>
              {article.dek && <p className="tagline">{article.dek}</p>}
            </li>
          ))}
        </ul>
      </div>
    );
  } catch (error) {
    const message = contentClient.isConfigError(error)
      ? 'Set PAYLOAD_PUBLIC_SERVER_URL so the site can fetch content from Payload.'
      : 'Unable to load this section from the CMS.';
    return <ErrorCard message={message} />;
  }
}
