import { notFound } from 'next/navigation';
import { contentClient } from '@/lib/contentClient';

interface Props {
  params: { slug: string };
}

export default async function SeriesPage({ params }: Props) {
  const series = (await contentClient.listSeries()).find((item) => item.slug === params.slug);
  if (!series) return notFound();

  return (
    <section className="block">
      <h1>{series.title}</h1>
      {series.description && <p>{series.description}</p>}
    </section>
  );
}
