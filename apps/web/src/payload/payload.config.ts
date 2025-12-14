import path from 'path';
import { buildConfig } from 'payload/config';
import { Users } from './collections/users';
import { Sites } from './collections/sites';
import { Sections } from './collections/sections';
import { Channels } from './collections/channels';
import { Tags } from './collections/tags';
import { Series } from './collections/series';
import { Sources } from './collections/sources';
import { RawItems } from './collections/rawItems';
import { Stories } from './collections/stories';
import { Articles } from './collections/articles';
import { PromptTemplates } from './collections/promptTemplates';
import { RoutingRules } from './collections/routingRules';
import { JobRuns } from './collections/jobRuns';
import { AuditLogs } from './collections/auditLogs';

export default buildConfig({
  serverURL: process.env.PAYLOAD_PUBLIC_SERVER_URL ?? 'http://localhost:3000',
  admin: {
    user: Users.slug,
    disable: false
  },
  collections: [
    Users,
    Sites,
    Sections,
    Channels,
    Tags,
    Series,
    Sources,
    RawItems,
    Stories,
    Articles,
    PromptTemplates,
    RoutingRules,
    JobRuns,
    AuditLogs
  ],
  typescript: {
    outputFile: path.resolve(__dirname, 'payload-types.ts')
  },
  rateLimit: {
    trustProxy: true
  }
});
