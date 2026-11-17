// The drinks list: sake, other drinks and non-alcoholic drinks.
// Sake names here are invented or generic descriptions, never real breweries or brands.
// Replace them with what you pour. Plain strings only: text is rendered as text, never as HTML.

/* ------------------------------------------------------------------
   Serving temperatures. The traditional names, from snow-chilled to hot.
   Sakes pick from these ids; the tokkuri thermometer draws them in this order.
   ------------------------------------------------------------------ */

export type Temperature =
  | 'yukibie' | 'hanabie' | 'suzubie' | 'joon'
  | 'hinatakan' | 'hitohadakan' | 'nurukan' | 'atsukan';

export interface TemperatureStep {
  id: Temperature;
  /** Japanese name. */
  ja: string;
  /** Hepburn romaji. */
  romaji: string;
  /** Plain English. */
  english: string;
  /** Approximate serving temperature in °C. */
  celsius: number;
}

/** Coldest first. */
export const TEMPERATURES: readonly TemperatureStep[] = [
  { id: 'yukibie', ja: '雪冷え', romaji: 'yuki-bie', english: 'Snow-chilled', celsius: 5 },
  { id: 'hanabie', ja: '花冷え', romaji: 'hana-bie', english: 'Fridge-cold', celsius: 10 },
  { id: 'suzubie', ja: '涼冷え', romaji: 'suzu-bie', english: 'Cool', celsius: 15 },
  { id: 'joon', ja: '常温', romaji: 'jō-on', english: 'Room temperature', celsius: 20 },
  { id: 'hinatakan', ja: '日向燗', romaji: 'hinata-kan', english: 'Sun-warmed', celsius: 30 },
  { id: 'hitohadakan', ja: '人肌燗', romaji: 'hitohada-kan', english: 'Body-warm', celsius: 35 },
  { id: 'nurukan', ja: 'ぬる燗', romaji: 'nuru-kan', english: 'Warm', celsius: 40 },
  { id: 'atsukan', ja: '熱燗', romaji: 'atsu-kan', english: 'Hot', celsius: 50 },
];

/** °C → whole °F. */
export function fahrenheit(celsius: number): number {
  return Math.round(celsius * 9 / 5 + 32);
}

/* ------------------------------------------------------------------
   Sake
   ------------------------------------------------------------------ */

export type SakeType = 'junmai' | 'junmai-ginjo' | 'junmai-daiginjo' | 'honjozo' | 'nigori' | 'sparkling' | 'koshu';

/** Display order and names for the sake groups. */
export const SAKE_TYPES: Record<SakeType, { label: string; ja: string; description: string }> = {
  junmai: { label: 'Junmai', ja: '純米', description: 'Rice, water, kōji and yeast only. Full, savoury and good warm.' },
  'junmai-ginjo': { label: 'Junmai ginjo', ja: '純米吟醸', description: 'Rice polished to 60% or less: fruity, fragrant, best cool.' },
  'junmai-daiginjo': { label: 'Junmai daiginjo', ja: '純米大吟醸', description: 'Polished to 50% or less: delicate and perfumed. Serve chilled.' },
  honjozo: { label: 'Honjozo', ja: '本醸造', description: 'A touch of distilled alcohol for a light, dry finish. The classic hot sake.' },
  nigori: { label: 'Nigori', ja: 'にごり酒', description: 'Coarsely filtered and cloudy: creamy, sweet and rich.' },
  sparkling: { label: 'Sparkling', ja: 'スパークリング', description: 'Naturally fizzy, light and low in alcohol.' },
  koshu: { label: 'Koshu', ja: '古酒', description: 'Aged sake: amber, nutty and savoury.' },
};

/** Real prefectures the sakes come from. Add one here if you pour from somewhere new. */
export const PREFECTURES = {
  akita: 'Akita', fukushima: 'Fukushima', gifu: 'Gifu', hiroshima: 'Hiroshima', hyogo: 'Hyōgo',
  kochi: 'Kōchi', kyoto: 'Kyoto', miyagi: 'Miyagi', nagano: 'Nagano', niigata: 'Niigata',
  shimane: 'Shimane', yamagata: 'Yamagata', yamaguchi: 'Yamaguchi',
} as const;

export type Prefecture = keyof typeof PREFECTURES;

export type Dryness = 'sweet' | 'medium' | 'dry' | 'very-dry';

export const DRYNESS: Record<Dryness, { label: string; ja: string; level: number }> = {
  sweet: { label: 'Sweet', ja: '甘口', level: 1 },
  medium: { label: 'Medium', ja: '中口', level: 2 },
  dry: { label: 'Dry', ja: '辛口', level: 3 },
  'very-dry': { label: 'Very dry', ja: '大辛口', level: 4 },
};

export interface Sake {
  /** Unique, URL-safe id used for links such as /sake/#house-junmai. */
  id: string;
  /** Name as listed. Use an invented or generic name, never a real brewery or brand you don't pour. */
  name: string;
  /** Japanese name where natural, e.g. "辛口純米". Leave out for names that don't translate. */
  nameJa?: string;
  type: SakeType;
  prefecture: Prefecture;
  dryness: Dryness;
  /** Recommended serving temperatures, from TEMPERATURES. At least one. */
  temperatures: Temperature[];
  /** Tasting notes and a food pairing, one or two short sentences. */
  notes: string;
  /** Price of a 90ml glass. */
  glass: number;
  /** Price of a tokkuri (180ml carafe). Leave out for sakes not poured by the carafe, such as sparkling. */
  tokkuri?: number;
  /** Optional bottle price and size. */
  bottle?: { price: number; size: string };
  /** Show on the home page "Sake tonight" (3 sakes). */
  featured?: boolean;
  /** Sold out or between bottles: shown dimmed but kept on the list. */
  soldOut?: boolean;
}

export const sake: Sake[] = [
  {
    id: 'house-junmai',
    name: 'House dry junmai',
    nameJa: '辛口純米',
    type: 'junmai',
    prefecture: 'niigata',
    dryness: 'dry',
    temperatures: ['hanabie', 'joon', 'nurukan', 'atsukan'],
    notes: 'Clean, rice-forward and crisp. Our everyday sake, and lovely warm with tare skewers.',
    glass: 9,
    tokkuri: 17,
    featured: true,
  },
  {
    id: 'kimoto-junmai',
    name: 'Kimoto junmai',
    nameJa: '生酛純米',
    type: 'junmai',
    prefecture: 'fukushima',
    dryness: 'dry',
    temperatures: ['joon', 'nurukan', 'atsukan'],
    notes: 'Made the slow, traditional way: earthy, tangy, mushroomy. Warm it with shiitake.',
    glass: 11,
    tokkuri: 21,
    bottle: { price: 62, size: '720ml' },
  },
  {
    id: 'yamahai-junmai',
    name: 'Yamahai junmai',
    nameJa: '山廃純米',
    type: 'junmai',
    prefecture: 'shimane',
    dryness: 'very-dry',
    temperatures: ['joon', 'nurukan', 'atsukan'],
    notes: 'Bold, savoury and very dry, with a long finish. Built for karaage.',
    glass: 10,
    tokkuri: 19,
  },
  {
    id: 'mountain-spring-ginjo',
    name: 'Mountain spring junmai ginjo',
    nameJa: '純米吟醸',
    type: 'junmai-ginjo',
    prefecture: 'yamagata',
    dryness: 'medium',
    temperatures: ['hanabie', 'suzubie'],
    notes: 'Melon, pear and a soft, round finish. Good with sashimi.',
    glass: 13,
    tokkuri: 25,
    bottle: { price: 68, size: '720ml' },
  },
  {
    id: 'coastal-ginjo',
    name: 'Coastal junmai ginjo',
    nameJa: '辛口純米吟醸',
    type: 'junmai-ginjo',
    prefecture: 'kochi',
    dryness: 'very-dry',
    temperatures: ['suzubie', 'joon'],
    notes: 'Bone-dry and bright, the way the southern coast likes it. Try it with seared tuna.',
    glass: 12,
    tokkuri: 23,
    bottle: { price: 64, size: '720ml' },
  },
  {
    id: 'soft-water-ginjo',
    name: 'Soft-water junmai ginjo',
    type: 'junmai-ginjo',
    prefecture: 'hiroshima',
    dryness: 'medium',
    temperatures: ['hanabie', 'suzubie', 'joon'],
    notes: 'Brewed with soft water: gentle, rice-sweet and easy. A good first sake.',
    glass: 12,
    tokkuri: 23,
  },
  {
    id: 'polished-daiginjo',
    name: 'Polished junmai daiginjo',
    nameJa: '純米大吟醸',
    type: 'junmai-daiginjo',
    prefecture: 'hyogo',
    dryness: 'medium',
    temperatures: ['yukibie', 'hanabie'],
    notes: 'Rice polished to 45%: white peach, rice blossom and a silky finish. Serve it cold.',
    glass: 18,
    tokkuri: 34,
    bottle: { price: 110, size: '720ml' },
    featured: true,
  },
  {
    id: 'highland-daiginjo',
    name: 'Highland junmai daiginjo',
    type: 'junmai-daiginjo',
    prefecture: 'nagano',
    dryness: 'dry',
    temperatures: ['yukibie', 'hanabie'],
    notes: 'Cool-climate and precise: green apple and a clean, dry edge.',
    glass: 16,
    tokkuri: 30,
  },
  {
    id: 'harbour-honjozo',
    name: 'Harbour honjozo',
    nameJa: '本醸造',
    type: 'honjozo',
    prefecture: 'miyagi',
    dryness: 'dry',
    temperatures: ['joon', 'hinatakan', 'nurukan', 'atsukan'],
    notes: 'Light, dry and warming. The tokkuri regulars order with the first skewers.',
    glass: 8,
    tokkuri: 15,
  },
  {
    id: 'cloudy-nigori',
    name: 'Cloudy nigori',
    nameJa: 'にごり酒',
    type: 'nigori',
    prefecture: 'akita',
    dryness: 'sweet',
    temperatures: ['yukibie', 'hanabie'],
    notes: 'Creamy and rice-sweet, with a little tang. Shake gently; lovely with spicy shishito.',
    glass: 10,
    tokkuri: 19,
    bottle: { price: 48, size: '500ml' },
    featured: true,
  },
  {
    id: 'sparkling-sake',
    name: 'Sparkling sake',
    nameJa: 'スパークリング日本酒',
    type: 'sparkling',
    prefecture: 'kyoto',
    dryness: 'sweet',
    temperatures: ['yukibie'],
    notes: 'Fine bubbles, white grape and 7% alcohol. To start, or with dessert.',
    glass: 12,
    bottle: { price: 30, size: '300ml' },
  },
  {
    id: 'aged-koshu',
    name: 'Three-year koshu',
    nameJa: '古酒',
    type: 'koshu',
    prefecture: 'gifu',
    dryness: 'medium',
    temperatures: ['joon', 'hitohadakan'],
    notes: 'Amber, nutty and soy-caramel. Sip it slowly, with tsukune or after dinner.',
    glass: 14,
    tokkuri: 26,
  },
];

/* ------------------------------------------------------------------
   Other drinks and non-alcoholic drinks
   ------------------------------------------------------------------ */

export interface Drink {
  /** Unique, URL-safe id. */
  id: string;
  /** English name. Use generic names, never real brands. */
  name: string;
  /** Japanese name. */
  nameJa: string;
  /** Hepburn romaji. */
  romaji: string;
  /** One short line. */
  description: string;
  price: number;
  /** Sold out today: shown dimmed but kept on the list. */
  soldOut?: boolean;
}

export const others: Drink[] = [
  { id: 'draft-lager', name: 'Draft rice lager', nameJa: '生ビール', romaji: 'nama bīru', description: 'Crisp Japanese-style lager on tap, in a frosted mug.', price: 8 },
  { id: 'bottled-lager', name: 'Bottled lager', nameJa: '瓶ビール', romaji: 'bin bīru', description: 'A large bottle to share, poured into small glasses.', price: 12 },
  { id: 'highball', name: 'Whisky highball', nameJa: 'ハイボール', romaji: 'haibōru', description: 'Japanese whisky, very cold soda and a lemon twist.', price: 11 },
  { id: 'shochu', name: 'Shochu', nameJa: '焼酎', romaji: 'shōchū', description: 'Barley or sweet potato, on the rocks or with hot water (oyuwari).', price: 9 },
  { id: 'umeshu', name: 'Plum wine', nameJa: '梅酒', romaji: 'umeshu', description: 'House-steeped ume liqueur, on the rocks or with soda.', price: 10 },
  { id: 'yuzu-sour', name: 'Yuzu sour', nameJa: '柚子サワー', romaji: 'yuzu sawā', description: 'Shochu, fresh yuzu and soda. Bright and not too sweet.', price: 10 },
];

export const nonAlcoholic: Drink[] = [
  { id: 'hojicha', name: 'Roasted green tea', nameJa: 'ほうじ茶', romaji: 'hōjicha', description: 'Toasty and low in caffeine, hot or iced. Refills on the house.', price: 4 },
  { id: 'mugicha', name: 'Barley tea', nameJa: '麦茶', romaji: 'mugicha', description: 'Iced roasted-barley tea, caffeine-free.', price: 3 },
  { id: 'marble-soda', name: 'Marble-bottle soda', nameJa: 'ラムネ', romaji: 'ramune', description: 'Lemon-lime soda in the glass bottle with a marble stopper.', price: 5 },
  { id: 'yuzu-soda', name: 'Yuzu soda', nameJa: '柚子ソーダ', romaji: 'yuzu sōda', description: 'Fresh yuzu, a little honey and sparkling water.', price: 6 },
  { id: 'alcohol-free-beer', name: 'Alcohol-free lager', nameJa: 'ノンアルコールビール', romaji: 'non-arukōru bīru', description: 'Crisp and dry, 0.0% alcohol, in a frosted mug.', price: 6 },
];

/** The alcohol notice, e.g. "21+ with ID for alcohol". */
export function ageNotice(age: number): string {
  return `${age}+ with ID for alcohol`;
}

/** Sakes grouped by type in SAKE_TYPES order; empty groups are left out. */
export function sakeByType(list: Sake[] = sake): { type: SakeType; items: Sake[] }[] {
  return (Object.keys(SAKE_TYPES) as SakeType[])
    .map(type => ({ type, items: list.filter(item => item.type === type) }))
    .filter(group => group.items.length > 0);
}

export const featuredSake: Sake[] = sake.filter(item => item.featured && !item.soldOut);
