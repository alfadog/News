export type LocaleCode = string;

export interface Site {
  slug: string;
  name: string;
  domains: string[];
  locales: LocaleCode[];
  defaultLocale: LocaleCode;
  themeConfig?: Record<string, unknown>;
  publishingPolicy?: {
    allowAutomation: boolean;
    reviewQueue: boolean;
    embargoHours?: number;
  };
}

export interface Section {
  id?: string;
  site: string | Site;
  slug: string;
  title: string;
  order?: number;
}

export interface Channel {
  id?: string;
  section: string | Section;
  slug: string;
  title: string;
  order?: number;
  aliases?: string[];
}

export interface Tag {
  site: string | Site;
  slug: string;
  title: string;
}

export interface Series {
  id?: string;
  site: string | Site;
  slug: string;
  title: string;
  description?: string;
  hero?: string;
}

export interface Source {
  id?: string;
  name: string;
  homepageUrl?: string;
  type: 'rss' | 'api' | 'manual';
  fetchConfig?: Record<string, unknown>;
  trustTier?: 1 | 2 | 3;
}

export interface RawItem {
  id?: string;
  source: string | Source;
  sourceUrl: string;
  publishedAt?: string;
  fetchedAt: string;
  rawTitle: string;
  rawText?: string;
  rawHtml?: string;
  language?: string;
  fingerprint?: string;
  status?: 'new' | 'parsed' | 'error' | 'ignored';
  debug?: Record<string, unknown>;
}

export interface Story {
  id?: string;
  site: string | Site;
  title: string;
  summary?: string;
  entities?: string[];
  trendScore?: number;
  firstSeenAt?: string;
  lastSeenAt?: string;
  sourcesAggregate?: Array<{
    source: string | Source;
    count: number;
  }>;
}

export interface Article {
  id?: string;
  site: string | Site;
  story?: string | Story;
  section: string | Section;
  channels?: Array<string | Channel>;
  tags?: Array<string | Tag>;
  series?: Array<string | Series>;
  locale: LocaleCode;
  title: string;
  dek?: string;
  body: string;
  leadImage?: string;
  gallery?: string[];
  sourceRefs?: string[];
  aiMeta?: Record<string, unknown>;
  status: 'draft' | 'review' | 'published';
  seo?: {
    title?: string;
    description?: string;
  };
  publishedAt?: string;
}

export interface PromptTemplate {
  id?: string;
  name: string;
  version: string;
  purpose: string;
  template: string;
}

export interface RoutingRuleCondition {
  field: 'source' | 'section' | 'channel' | 'tag' | 'locale';
  operator: 'eq' | 'in';
  value: string | string[];
}

export interface RoutingRuleAction {
  type: 'assignSite' | 'assignSection' | 'addChannel' | 'addTag';
  value: string;
}

export interface RoutingRule {
  id?: string;
  site: string | Site;
  conditions: RoutingRuleCondition[];
  actions: RoutingRuleAction[];
  enabled: boolean;
}

export interface JobRun {
  id?: string;
  jobType: 'ingest' | 'ai' | 'rules';
  startedAt: string;
  finishedAt?: string;
  status: 'running' | 'success' | 'error';
  counts?: Record<string, number>;
  errorDetails?: string;
  references?: string[];
}

export interface AuditLog {
  id?: string;
  actor: string;
  action: string;
  meta?: Record<string, unknown>;
  createdAt: string;
}

export interface AiMeta {
  promptTemplate: string;
  promptVersion: string;
  model?: string;
  latencyMs?: number;
  extras?: Record<string, unknown>;
}

export interface RuleContext {
  siteSlug: string;
  sectionSlug?: string;
  channelSlug?: string;
  tagSlugs?: string[];
}
