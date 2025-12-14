import { MockAiClient } from '../ai/aiClient';
import { listRawItems, createArticle } from '../clients/payloadClient';
import { Article } from '@news/shared';

const ai = new MockAiClient();

export async function translateAndSummarize() {
  const items = await listRawItems();
  for (const item of items) {
    const prompt = {
      template: 'Summarize and translate the headline',
      variables: { title: item.rawTitle }
    };
    const aiResult = await ai.generate(prompt);

    const article: Article = {
      site: 'harpers-bazaar',
      story: undefined,
      section: 'fashion',
      channels: ['news'],
      tags: [],
      series: [],
      locale: 'en-US',
      title: aiResult.text,
      dek: item.rawText,
      body: `<p>${aiResult.text}</p><p>Source: ${item.sourceUrl}</p>`,
      status: 'review',
      aiMeta: aiResult.metadata,
      sourceRefs: [item.sourceUrl],
      gallery: [],
      publishedAt: new Date().toISOString()
    };

    await createArticle(article);
  }
}
