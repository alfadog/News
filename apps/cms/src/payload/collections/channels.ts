import type { CollectionConfig } from 'payload';

export const Channels: CollectionConfig = {
  slug: 'channels',
  admin: { useAsTitle: 'title' },
  access: { read: () => true },
  fields: [
    { name: 'section', type: 'relationship', relationTo: 'sections', required: true },
    { name: 'slug', type: 'text', required: true },
    { name: 'title', type: 'text', required: true },
    { name: 'order', type: 'number' },
    { name: 'aliases', type: 'array', fields: [{ name: 'value', type: 'text' }] }
  ],
  hooks: {
    beforeValidate: [({ data }) => {
      if (data?.slug) data.slug = data.slug.toLowerCase();
      return data;
    }]
  }
};
