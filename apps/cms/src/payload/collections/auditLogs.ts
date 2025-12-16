import type { CollectionConfig } from 'payload';

export const AuditLogs: CollectionConfig = {
  slug: 'audit-logs',
  admin: { useAsTitle: 'action' },
  access: { read: () => true },
  fields: [
    { name: 'actor', type: 'text', required: true },
    { name: 'action', type: 'text', required: true },
    { name: 'meta', type: 'json' },
    { name: 'createdAt', type: 'date', required: true }
  ]
};
