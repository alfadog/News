import { redirect } from 'next/navigation';

export const dynamic = 'force-dynamic';

const baseURL = (process.env.PAYLOAD_PUBLIC_SERVER_URL || 'http://localhost:4000').replace(/\/$/, '');

export default function AdminRedirect({ params }: { params: { slug?: string[] } }) {
  const slugPath = params.slug?.length ? `/${params.slug.join('/')}` : '';
  redirect(`${baseURL}/admin${slugPath}`);
}
