import { notFound } from 'next/navigation';
import { contentClient } from '@/lib/contentClient';
import { ErrorCard } from '@/app/components/ErrorCard';

interface Props {
  params: { slug: string };
}

export default async function SeriesPage({ params }: Props) {
  try {
    const series = (await contentClient.listSeries()).find((item) => item.slug === params.slug);
    if (!series) return notFound();

    return (
      <section className="block">
        <h1>{series.title}</h1>
        {series.description && <p>{series.description}</p>}
      </section>
    );
  } catch (error) {
    const message = contentClient.isConfigError(error)
      ? 'Set PAYLOAD_PUBLIC_SERVER_URL so the site can fetch content from Payload.'
      : 'Unable to load this series from the CMS.';
    return <ErrorCard message={message} />;
  }
}
