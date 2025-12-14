import { CollectionConfig } from 'payload/types';

export const Tags: CollectionConfig = {
  slug: 'tags',
  admin: { useAsTitle: 'title' },
  access: { read: () => true },
  fields: [
    { name: 'site', type: 'relationship', relationTo: 'sites', required: true },
    { name: 'slug', type: 'text', required: true },
    { name: 'title', type: 'text', required: true }
  ],
  hooks: {
    beforeValidate: [({ data }) => {
      if (data?.slug) data.slug = data.slug.toLowerCase();
      return data;
    }]
  }
};
