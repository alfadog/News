import type { CollectionConfig } from 'payload';

export const PromptTemplates: CollectionConfig = {
  slug: 'prompt-templates',
  admin: { useAsTitle: 'name' },
  access: { read: () => true },
  fields: [
    { name: 'name', type: 'text', required: true },
    { name: 'version', type: 'text', required: true },
    { name: 'purpose', type: 'text', required: true },
    { name: 'template', type: 'textarea', required: true }
  ]
};
