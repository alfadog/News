import { NextResponse } from 'next/server';
import { contentClient } from '@/lib/contentClient';

export async function GET() {
  const sections = await contentClient.listSections();
  const articles = await contentClient.listArticles();
  const urls = [
    'https://example.com/',
    ...sections.map((section) => `https://example.com/${section.slug}`),
    ...articles.map((article) => `https://example.com/article/${article.id}`)
  ]
    .map((loc) => `<url><loc>${loc}</loc></url>`)
    .join('');

  const xml = `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">${urls}</urlset>`;
  return new NextResponse(xml, { headers: { 'Content-Type': 'application/xml' } });
}
