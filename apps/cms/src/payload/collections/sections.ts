import { CollectionConfig } from 'payload/types';

export const Sections: CollectionConfig = {
  slug: 'sections',
  admin: { useAsTitle: 'title' },
  access: { read: () => true },
  fields: [
    { name: 'site', type: 'relationship', relationTo: 'sites', required: true },
    { name: 'slug', type: 'text', required: true },
    { name: 'title', type: 'text', required: true },
    { name: 'order', type: 'number' }
  ],
  hooks: {
    beforeValidate: [({ data }) => {
      if (data?.slug) data.slug = data.slug.toLowerCase();
      return data;
    }]
  }
};
