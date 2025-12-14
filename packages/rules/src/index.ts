import { RoutingRule, RuleContext, Story } from '@shared/types/content';

export interface RoutingResult {
  site?: string;
  section?: string;
  channels?: string[];
  tags?: string[];
}

export const applyRoutingRules = (rules: RoutingRule[], context: RuleContext): RoutingResult => {
  const activeRules = rules.filter((rule) => rule.enabled && typeof rule.site === 'string' ? rule.site === context.siteSlug : true);
  const result: RoutingResult = { channels: [], tags: [] };

  for (const rule of activeRules) {
    const matches = rule.conditions.every((condition) => {
      const value = condition.field === 'locale'
        ? context.siteSlug
        : condition.field === 'section'
          ? context.sectionSlug
          : condition.field === 'channel'
            ? context.channelSlug
            : context.tagSlugs;

      if (condition.operator === 'eq') {
        return value === condition.value || (Array.isArray(value) && value.includes(condition.value as string));
      }
      return Array.isArray(value) && Array.isArray(condition.value)
        ? condition.value.every((candidate) => value.includes(candidate))
        : value === condition.value;
    });

    if (matches) {
      for (const action of rule.actions) {
        if (action.type === 'assignSite') result.site = action.value;
        if (action.type === 'assignSection') result.section = action.value;
        if (action.type === 'addChannel') result.channels?.push(action.value);
        if (action.type === 'addTag') result.tags?.push(action.value);
      }
    }
  }

  return result;
};

export interface TrendInput {
  story: Story;
  windowHours?: number;
}

export const computeTrendScore = ({ story, windowHours = 48 }: TrendInput): number => {
  const base = (story.sourcesAggregate ?? []).reduce((sum, source) => sum + source.count, 0);
  const recencyBoost = story.lastSeenAt ? Math.max(0.5, 1 - hoursAgo(story.lastSeenAt) / windowHours) : 0.5;
  return Math.round(base * 10 * recencyBoost) / 10;
};

const hoursAgo = (timestamp: string) => {
  const then = new Date(timestamp).getTime();
  const now = Date.now();
  return (now - then) / (1000 * 60 * 60);
};
