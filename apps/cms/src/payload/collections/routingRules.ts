import { CollectionConfig } from 'payload/types';

export const RoutingRules: CollectionConfig = {
  slug: 'routing-rules',
  admin: { useAsTitle: 'site' },
  access: { read: () => true },
  fields: [
    { name: 'site', type: 'relationship', relationTo: 'sites', required: true },
    {
      name: 'conditions',
      type: 'array',
      required: true,
      fields: [
        { name: 'field', type: 'text', required: true },
        { name: 'operator', type: 'text', required: true },
        { name: 'value', type: 'text', required: true }
      ]
    },
    {
      name: 'actions',
      type: 'array',
      required: true,
      fields: [
        { name: 'type', type: 'text', required: true },
        { name: 'value', type: 'text', required: true }
      ]
    },
    { name: 'enabled', type: 'checkbox', defaultValue: true }
  ]
};
