import { CollectionConfig } from 'payload/types';

export const JobRuns: CollectionConfig = {
  slug: 'job-runs',
  admin: { useAsTitle: 'jobType' },
  access: { read: () => true },
  fields: [
    { name: 'jobType', type: 'text', required: true },
    { name: 'startedAt', type: 'date', required: true },
    { name: 'finishedAt', type: 'date' },
    {
      name: 'status',
      type: 'select',
      options: [
        { label: 'Running', value: 'running' },
        { label: 'Success', value: 'success' },
        { label: 'Error', value: 'error' }
      ],
      defaultValue: 'running'
    },
    { name: 'counts', type: 'json' },
    { name: 'errorDetails', type: 'textarea' },
    { name: 'references', type: 'array', fields: [{ name: 'ref', type: 'text' }] }
  ]
};
