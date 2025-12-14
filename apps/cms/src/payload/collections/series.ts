import { CollectionConfig } from 'payload/types';

export const Series: CollectionConfig = {
  slug: 'series',
  admin: { useAsTitle: 'title' },
  access: { read: () => true },
  fields: [
    { name: 'site', type: 'relationship', relationTo: 'sites', required: true },
    { name: 'slug', type: 'text', required: true },
    { name: 'title', type: 'text', required: true },
    { name: 'description', type: 'textarea' },
    { name: 'hero', type: 'text' }
  ],
  hooks: {
    beforeValidate: [({ data }) => {
      if (data?.slug) data.slug = data.slug.toLowerCase();
      return data;
    }]
  }
};
