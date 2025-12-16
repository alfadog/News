import type { CollectionConfig } from 'payload';

export const Sites: CollectionConfig = {
  slug: 'sites',
  admin: { useAsTitle: 'name' },
  access: { read: () => true },
  fields: [
    { name: 'slug', type: 'text', required: true, unique: true },
    { name: 'name', type: 'text', required: true },
    { name: 'domains', type: 'array', required: true, fields: [{ name: 'domain', type: 'text', required: true }] },
    { name: 'locales', type: 'array', required: true, fields: [{ name: 'locale', type: 'text', required: true }] },
    { name: 'defaultLocale', type: 'text', required: true },
    { name: 'themeConfig', type: 'json' },
    {
      name: 'publishingPolicy',
      type: 'group',
      fields: [
        { name: 'allowAutomation', type: 'checkbox', defaultValue: true },
        { name: 'reviewQueue', type: 'checkbox', defaultValue: true },
        { name: 'embargoHours', type: 'number', defaultValue: 0 }
      ]
    }
  ]
};
