import { NextResponse } from 'next/server';
import { contentClient } from '@/lib/contentClient';

export async function GET() {
  try {
    const sections = await contentClient.listSections();
    const articles = await contentClient.listLatestArticles(50);
    const urls = [
      'https://example.com/',
      ...sections.map((section) => `https://example.com/${section.slug}`),
      ...articles.map((article) => `https://example.com/article/${article.slug}`)
    ]
      .map((loc) => `<url><loc>${loc}</loc></url>`)
      .join('');

    const xml = `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">${urls}</urlset>`;
    return new NextResponse(xml, { headers: { 'Content-Type': 'application/xml' } });
  } catch (error) {
    const body = `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9"><url><loc>https://example.com</loc><changefreq>daily</changefreq><priority>0.5</priority></url></urlset>`;
    const status = contentClient.isConfigError(error) ? 200 : 500;
    return new NextResponse(body, { headers: { 'Content-Type': 'application/xml' }, status });
  }
}
