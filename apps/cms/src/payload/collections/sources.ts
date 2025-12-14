import { CollectionConfig } from 'payload/types';

export const Sources: CollectionConfig = {
  slug: 'sources',
  admin: { useAsTitle: 'name' },
  access: { read: () => true },
  fields: [
    { name: 'name', type: 'text', required: true },
    { name: 'homepageUrl', type: 'text' },
    {
      name: 'type',
      type: 'select',
      required: true,
      options: [
        { label: 'RSS', value: 'rss' },
        { label: 'API', value: 'api' },
        { label: 'Manual', value: 'manual' }
      ]
    },
    { name: 'fetchConfig', type: 'json' },
    {
      name: 'trustTier',
      type: 'select',
      options: [
        { label: 'Tier 1', value: 1 },
        { label: 'Tier 2', value: 2 },
        { label: 'Tier 3', value: 3 }
      ]
    }
  ]
};
