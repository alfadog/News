import { Section, Channel, Series } from '../types/content';

export const DEFAULT_SECTIONS: Section[] = [
  { site: 'harpers-bazaar', slug: 'fashion', title: 'Fashion', order: 1 },
  { site: 'harpers-bazaar', slug: 'beauty', title: 'Beauty', order: 2 },
  { site: 'harpers-bazaar', slug: 'shopping', title: 'Shopping', order: 3 },
  { site: 'harpers-bazaar', slug: 'celebrity', title: 'Celebrity', order: 4 },
  { site: 'harpers-bazaar', slug: 'culture', title: 'Culture', order: 5 },
  { site: 'harpers-bazaar', slug: 'weddings', title: 'Weddings', order: 6 }
];

export const DEFAULT_CHANNELS: Channel[] = [
  { section: 'fashion', slug: 'news', title: 'News', order: 1 },
  { section: 'fashion', slug: 'trends', title: 'Trends', order: 2 },
  { section: 'fashion', slug: 'runway', title: 'Runway', order: 3 },
  { section: 'beauty', slug: 'makeup', title: 'Makeup', order: 1 },
  { section: 'beauty', slug: 'hair', title: 'Hair', order: 2 },
  { section: 'beauty', slug: 'skin', title: 'Skin', order: 3 },
  { section: 'shopping', slug: 'editors-picks', title: "Editor's Picks", order: 1 },
  { section: 'shopping', slug: 'guides', title: 'Guides', order: 2 },
  { section: 'celebrity', slug: 'style', title: 'Style', order: 1 },
  { section: 'celebrity', slug: 'news', title: 'News', order: 2 },
  { section: 'culture', slug: 'art', title: 'Art', order: 1 },
  { section: 'culture', slug: 'film-tv', title: 'Film & TV', order: 2 },
  { section: 'culture', slug: 'music', title: 'Music', order: 3 },
  { section: 'weddings', slug: 'planning', title: 'Planning', order: 1 },
  { section: 'weddings', slug: 'style', title: 'Style', order: 2 }
];

export const DEFAULT_SERIES: Series[] = [
  {
    site: 'harpers-bazaar',
    slug: 'icons',
    title: 'Icons',
    description: 'Profile series celebrating influential creators and leaders.'
  }
];
