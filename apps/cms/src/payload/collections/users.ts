import type { CollectionConfig } from 'payload';

export const Users: CollectionConfig = {
  slug: 'users',
  auth: true,
  admin: { useAsTitle: 'email' },
  access: { read: () => false },
  fields: [
    { name: 'role', type: 'select', options: ['admin', 'editor', 'automation'], defaultValue: 'editor' }
  ]
};
