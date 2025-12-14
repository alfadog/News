import Link from 'next/link';
import { notFound } from 'next/navigation';
import { contentClient } from '@/lib/contentClient';

interface Props {
  params: { section: string };
}

export default async function SectionPage({ params }: Props) {
  const [sections, channels] = await Promise.all([
    contentClient.listSections(),
    contentClient.listChannels(params.section)
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
    </div>
  );
}
