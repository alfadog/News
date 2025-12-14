import { CollectionConfig } from 'payload/types';

export const Articles: CollectionConfig = {
  slug: 'articles',
  admin: { useAsTitle: 'title' },
  access: { read: () => true },
  fields: [
    { name: 'slug', type: 'text', required: true, unique: true },
    { name: 'site', type: 'relationship', relationTo: 'sites', required: true },
    { name: 'story', type: 'relationship', relationTo: 'stories' },
    { name: 'section', type: 'relationship', relationTo: 'sections', required: true },
    { name: 'channels', type: 'relationship', relationTo: 'channels', hasMany: true },
    { name: 'tags', type: 'relationship', relationTo: 'tags', hasMany: true },
    { name: 'series', type: 'relationship', relationTo: 'series', hasMany: true },
    { name: 'locale', type: 'text', required: true },
    { name: 'title', type: 'text', required: true },
    { name: 'dek', type: 'textarea' },
    { name: 'body', type: 'textarea', required: true },
    { name: 'leadImage', type: 'text' },
    { name: 'gallery', type: 'array', fields: [{ name: 'url', type: 'text' }] },
    {
      name: 'sourceRefs',
      type: 'array',
      fields: [
        { name: 'url', type: 'text', required: true },
        { name: 'label', type: 'text' }
      ]
    },
    { name: 'aiMeta', type: 'json' },
    {
      name: 'status',
      type: 'select',
      options: [
        { label: 'Draft', value: 'draft' },
        { label: 'Review', value: 'review' },
        { label: 'Published', value: 'published' }
      ],
      defaultValue: 'review'
    },
    {
      name: 'seo',
      type: 'group',
      fields: [
        { name: 'title', type: 'text' },
        { name: 'description', type: 'textarea' }
      ]
    },
    { name: 'publishedAt', type: 'date' }
  ]
};
