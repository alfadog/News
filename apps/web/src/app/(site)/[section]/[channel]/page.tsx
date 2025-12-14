import { notFound } from 'next/navigation';
import Link from 'next/link';
import { contentClient } from '@/lib/contentClient';
import { ErrorCard } from '@/app/components/ErrorCard';

interface Props {
  params: { section: string; channel: string };
}

export default async function ChannelPage({ params }: Props) {
  try {
    const [sections, channels, articles] = await Promise.all([
      contentClient.listSections(),
      contentClient.listChannels(params.section),
      contentClient.listArticlesByChannel(params.channel)
    ]);
    const section = sections.find((s) => s.slug === params.section);
    const channel = channels.find((c) => c.slug === params.channel);
    if (!section || !channel) return notFound();

    return (
      <div className="block">
        <h2>
          {section.title} / {channel.title}
        </h2>
        <p>Articles routed to this channel appear here.</p>
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
      : 'Unable to load this channel from the CMS.';
    return <ErrorCard message={message} />;
  }
}
