import { MockAiClient } from '../ai/aiClient';
import { listRawItems, createArticle, getIdBySlug, markRawItemProcessed } from '../clients/payloadClient';
import { Article } from '@news/shared';

const ai = new MockAiClient();

function slugify(input: string) {
  return input
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/(^-|-$)+/g, '');
}

export async function translateAndSummarize() {
  const items = await listRawItems();
  const siteId = await getIdBySlug('sites', 'harpers-bazaar');
  const defaultSectionId = await getIdBySlug('sections', 'fashion');
  const defaultChannelId = await getIdBySlug('channels', 'news');

  if (!siteId || !defaultSectionId) {
    throw new Error('Site or default section missing; run seed first.');
  }

  for (const item of items) {
    const prompt = {
      template: 'Summarize and translate the headline',
      variables: { title: item.rawTitle }
    };
    const aiResult = await ai.generate(prompt);

    const article: Article = {
      slug: slugify(item.rawTitle) || `article-${item.id}`,
      site: siteId,
      story: undefined,
      section: defaultSectionId,
      channels: defaultChannelId ? [defaultChannelId] : [],
      tags: [],
      series: [],
      locale: 'en-US',
      title: aiResult.text,
      dek: item.rawText,
      body: `<p>${aiResult.text}</p><p>Source: ${item.sourceUrl}</p>`,
      status: 'review',
      aiMeta: aiResult.metadata,
      sourceRefs: item.sourceUrl ? [{ url: item.sourceUrl, label: 'Original source' }] : [],
      gallery: [],
      publishedAt: item.publishedAt || new Date().toISOString()
    };

    const created = await createArticle(article);
    if (item.id) {
      await markRawItemProcessed(item.id, (created as any).id);
    }
  }
}
