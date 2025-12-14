import { NextResponse } from 'next/server';
import { contentClient } from '@/lib/contentClient';

export async function GET() {
  const articles = await contentClient.listArticles();
  const items = articles
    .map(
      (article) => `\n    <item>\n      <title><![CDATA[${article.title}]]></title>\n      <link>https://example.com/article/${article.id}</link>\n      <description><![CDATA[${article.dek ?? ''}]]></description>\n      <pubDate>${article.publishedAt}</pubDate>\n    </item>`
    )
    .join('\n');

  const body = `<?xml version="1.0" encoding="UTF-8"?>
  <rss version="2.0">\n  <channel>\n    <title>Bazaar-esque</title>\n    <link>https://example.com</link>\n    <description>Demo RSS feed</description>${items}\n  </channel>\n</rss>`;

  return new NextResponse(body, { headers: { 'Content-Type': 'application/rss+xml' } });
}
