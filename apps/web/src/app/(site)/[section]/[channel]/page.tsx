import { notFound } from 'next/navigation';
import Link from 'next/link';
import { contentClient } from '@/lib/contentClient';

interface Props {
  params: { section: string; channel: string };
}

export default async function ChannelPage({ params }: Props) {
  const [sections, channels, articles] = await Promise.all([
    contentClient.listSections(),
    contentClient.listChannels(params.section),
    contentClient.listArticles()
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
        {articles
          .filter((article) => article.channels?.includes(channel.slug))
          .map((article) => (
            <li key={article.id}>
              <Link href={`/article/${article.id}`}>{article.title}</Link>
            </li>
          ))}
      </ul>
    </div>
  );
}
