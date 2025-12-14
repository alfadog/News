import { notFound } from 'next/navigation';
import { contentClient } from '@/lib/contentClient';

interface Props {
  params: { slug: string };
}

export default async function StoryPage({ params }: Props) {
  const story = await contentClient.findStory(params.slug);
  if (!story) return notFound();

  return (
    <section className="block">
      <h1>{story.title}</h1>
      {story.summary && <p>{story.summary}</p>}
      <p>Trend score: {story.trendScore ?? 'n/a'}</p>
      <div>
        <h3>Sources</h3>
        <ul>
          {(story.sourcesAggregate ?? []).map((source) => (
            <li key={`${story.id}-${String(source.source)}`}> {String(source.source)} ({source.count})</li>
          ))}
        </ul>
      </div>
    </section>
  );
}
