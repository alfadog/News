import { CollectionConfig } from 'payload/types';

export const Stories: CollectionConfig = {
  slug: 'stories',
  admin: { useAsTitle: 'title' },
  access: { read: () => true },
  fields: [
    { name: 'slug', type: 'text', required: true, unique: true },
    { name: 'site', type: 'relationship', relationTo: 'sites', required: true },
    { name: 'title', type: 'text', required: true },
    { name: 'summary', type: 'textarea' },
    { name: 'entities', type: 'array', fields: [{ name: 'value', type: 'text' }] },
    { name: 'trendScore', type: 'number' },
    { name: 'firstSeenAt', type: 'date' },
    { name: 'lastSeenAt', type: 'date' },
    {
      name: 'sourcesAggregate',
      type: 'array',
      fields: [
        { name: 'source', type: 'relationship', relationTo: 'sources', required: true },
        { name: 'count', type: 'number', required: true }
      ]
    }
  ]
};
