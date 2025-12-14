import { CollectionConfig } from 'payload/types';

export const RawItems: CollectionConfig = {
  slug: 'raw-items',
  admin: { useAsTitle: 'rawTitle' },
  access: { read: () => true },
  fields: [
    { name: 'source', type: 'relationship', relationTo: 'sources', required: true },
    { name: 'sourceUrl', type: 'text', required: true },
    { name: 'publishedAt', type: 'date' },
    { name: 'fetchedAt', type: 'date', required: true },
    { name: 'rawTitle', type: 'text', required: true },
    { name: 'rawText', type: 'textarea' },
    { name: 'rawHtml', type: 'textarea' },
    { name: 'language', type: 'text' },
    { name: 'fingerprint', type: 'text' },
    {
      name: 'status',
      type: 'select',
      options: [
        { label: 'New', value: 'new' },
        { label: 'Parsed', value: 'parsed' },
        { label: 'Error', value: 'error' },
        { label: 'Ignored', value: 'ignored' }
      ],
      defaultValue: 'new'
    },
    { name: 'debug', type: 'json' }
  ]
};
