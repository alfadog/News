import { Site, Section, Channel, Series } from '../types/content';
import { DEFAULT_SECTIONS, DEFAULT_CHANNELS, DEFAULT_SERIES } from '../constants/taxonomy';

export const DEFAULT_SITE: Site = {
  slug: 'harpers-bazaar',
  name: "Bazaar-esque",
  domains: ['localhost'],
  locales: ['en-US'],
  defaultLocale: 'en-US',
  publishingPolicy: {
    allowAutomation: true,
    reviewQueue: true,
    embargoHours: 0
  }
};

export const DEFAULT_TAXONOMY: {
  sections: Section[];
  channels: Channel[];
  series: Series[];
} = {
  sections: DEFAULT_SECTIONS,
  channels: DEFAULT_CHANNELS,
  series: DEFAULT_SERIES
};
