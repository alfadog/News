import { notFound } from 'next/navigation';
import { contentClient } from '@/lib/contentClient';
import { ErrorCard } from '@/app/components/ErrorCard';

interface Props {
  params: { slug: string };
}

export default async function StoryPage({ params }: Props) {
  try {
    const story = await contentClient.getStory(params.slug);
    if (!story) return notFound();

    return (
      <section className="block">
        <h1>{story.title}</h1>
        {story.summary && <p>{story.summary}</p>}
        <p>Trend score: {story.trendScore ?? 'n/a'}</p>
        <div>
          <h3>Sources</h3>
          <ul>
            {(story.sourcesAggregate ?? []).map((source: any) => (
              <li key={`${story.id}-${String(source.source)}`}> {String(source.source)} ({source.count})</li>
            ))}
          </ul>
        </div>
      </section>
    );
  } catch (error) {
    const message = contentClient.isConfigError(error)
      ? 'Set PAYLOAD_PUBLIC_SERVER_URL so the site can fetch content from Payload.'
      : 'Unable to load this story from the CMS.';
    return <ErrorCard message={message} />;
  }
}
