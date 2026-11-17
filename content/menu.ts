// The food menu. Add, remove, reorder or reprice dishes here; every page reads from this file.
// Dish names, prices and specials are placeholders: replace them with your own.
// Plain strings only: text is rendered as text, never as HTML.

/* ------------------------------------------------------------------
   Today's recommendations (おすすめ). The most frequent edit: change these daily.
   3–5 entries. Point at a menu item by its `id`, or write a free-standing special.
   ------------------------------------------------------------------ */

export interface OsusumeSpecial {
  /** Unique, URL-safe id, e.g. "sanma-shioyaki". */
  id: string;
  /** English name. */
  name: string;
  /** Japanese name, written on the paper strip. */
  nameJa: string;
  /** Hepburn romaji, e.g. "sanma no shioyaki". */
  romaji: string;
  /** One short line. */
  description: string;
  price: number;
}

/** A menu item by id, or a free-standing special that isn't on the menu. */
export type Osusume = { item: string } | { special: OsusumeSpecial };

export const osusume: Osusume[] = [
  {
    special: {
      id: 'sanma-shioyaki',
      name: 'Salt-grilled Pacific saury',
      nameJa: 'さんまの塩焼き',
      romaji: 'sanma no shioyaki',
      description: 'Whole autumn saury over charcoal, grated daikon and sudachi.',
      price: 16,
    },
  },
  { item: 'tsukimi-tsukune' },
  {
    special: {
      id: 'kabocha-nimono',
      name: 'Simmered kabocha',
      nameJa: 'かぼちゃの煮物',
      romaji: 'kabocha no nimono',
      description: 'Sweet squash simmered soft in kombu dashi. Vegan.',
      price: 7,
    },
  },
  { item: 'horenso-ohitashi' },
];

/* ------------------------------------------------------------------
   The menu
   ------------------------------------------------------------------ */

/** Dietary and allergen marks shown under each tag and used by the menu filters. */
export type Diet = 'vegetarian' | 'vegan' | 'gluten-free' | 'contains-nuts' | 'contains-shellfish';

export const DIETS: Record<Diet, { label: string; short: string }> = {
  vegetarian: { label: 'Vegetarian', short: 'V' },
  vegan: { label: 'Vegan', short: 'VG' },
  'gluten-free': { label: 'Gluten-free ingredients (ask for tamari instead of soy sauce)', short: 'GF' },
  'contains-nuts': { label: 'Contains nuts', short: 'N' },
  'contains-shellfish': { label: 'Contains shellfish', short: 'SF' },
};

/** Pieces a skewer can be drawn from. See lib/skewer.ts for how each one is drawn. */
export type Piece =
  | 'thigh' | 'negi' | 'tsukune' | 'skin' | 'heart'
  | 'shiitake' | 'shishito' | 'pork-belly' | 'asparagus-pork' | 'quail-egg';

/** Salt (shio), the sweet soy glaze (tare), or the guest's choice. */
export type Seasoning = 'shio' | 'tare' | 'either';

export interface Skewer {
  /** The pieces in order from the tip of the stick to the handle. 2–6 pieces. */
  pieces: Piece[];
  seasoning: Seasoning;
  /** Skewers come this many to an order, e.g. 2. The price is per skewer. */
  perOrder: number;
}

export interface MenuItem {
  /** Unique, URL-safe id used for links such as /menu/#negima. */
  id: string;
  /** English name. */
  name: string;
  /** Japanese name, written vertically on the wooden tag. */
  nameJa: string;
  /** Hepburn romaji, e.g. "tsukimi tsukune". */
  romaji: string;
  /** One line. */
  description: string;
  /** Price in `menu.currency`, e.g. 4.5 for $4.50. For skewers, the price of one skewer. */
  price: number;
  /** For yakitori and kushiyaki: what's on the stick. */
  skewer?: Skewer;
  diet?: Diet[];
  /** Contains raw or undercooked fish, meat or egg: shows the consumer advisory. */
  raw?: boolean;
  /** Optional highlight: osusume shows a vermilion hanko stamp. */
  badge?: 'osusume' | 'seasonal' | 'new';
  /** Show on the home page ("From the grill" shows featured skewers). */
  featured?: boolean;
  /** Sold out today: the tag is turned face-down but stays on the wall. */
  soldOut?: boolean;
}

export interface MenuSection {
  /** Unique, URL-safe id used for links such as /menu/#yakitori. */
  id: string;
  /** Romaji title, e.g. "Otsumami". */
  title: string;
  /** Japanese title, e.g. "おつまみ". */
  titleJa: string;
  /** Plain English, e.g. "Small bites". */
  subtitle: string;
  /** One or two sentences under the rail. */
  description: string;
  items: MenuItem[];
}

export interface Menu {
  /** ISO 4217 currency code. */
  currency: string;
  /** Locale used to format prices, e.g. "en-US". */
  locale: string;
  sections: MenuSection[];
  /** The consumer advisory shown on the raw section and at the foot of the menu whenever an item is raw. */
  rawAdvisory: string;
  /** Allergy and gluten notes at the foot of the menu. */
  notes: string[];
}

export const menu: Menu = {
  currency: 'USD',
  locale: 'en-US',
  sections: [
    {
      id: 'otsumami',
      title: 'Otsumami',
      titleJa: 'おつまみ',
      subtitle: 'Small bites',
      description: 'Little plates to start with and keep coming back to. Good with the first drink.',
      items: [
        {
          id: 'edamame',
          name: 'Edamame',
          nameJa: '枝豆',
          romaji: 'edamame',
          description: 'Warm soybeans in the pod, flaky salt.',
          price: 6,
          diet: ['vegan', 'gluten-free'],
        },
        {
          id: 'hiyayakko',
          name: 'Chilled tofu',
          nameJa: '冷奴',
          romaji: 'hiyayakko',
          description: 'Silken tofu, grated ginger, scallion, shiso and soy.',
          price: 7,
          diet: ['vegan'],
        },
        {
          id: 'potato-salad',
          name: 'Japanese potato salad',
          nameJa: 'ポテトサラダ',
          romaji: 'poteto sarada',
          description: 'Half-mashed potato, cucumber, egg and house mayonnaise, black pepper.',
          price: 7,
          diet: ['vegetarian', 'gluten-free'],
        },
        {
          id: 'tamagoyaki',
          name: 'Rolled omelette',
          nameJa: '玉子焼き',
          romaji: 'tamagoyaki',
          description: 'Layered dashi omelette, grated daikon on the side.',
          price: 8,
        },
        {
          id: 'oshinko',
          name: 'House pickles',
          nameJa: 'お新香',
          romaji: 'oshinko',
          description: 'Rice-bran cucumber, daikon and napa cabbage, pickled here.',
          price: 5,
          diet: ['vegan', 'gluten-free'],
        },
        {
          id: 'horenso-ohitashi',
          name: 'Spinach ohitashi',
          nameJa: 'ほうれん草のおひたし',
          romaji: 'hōrensō no ohitashi',
          description: 'Blanched spinach steeped in cool kombu dashi, toasted sesame.',
          price: 7,
          diet: ['vegan'],
          badge: 'seasonal',
        },
      ],
    },
    {
      id: 'yakitori',
      title: 'Yakitori & kushiyaki',
      titleJa: '焼き鳥・串焼き',
      subtitle: 'Skewers from the charcoal grill',
      description: 'Grilled over binchōtan, two skewers to an order. Choose shio (salt) or tare (sweet soy glaze) where you see “either”.',
      items: [
        {
          id: 'negima',
          name: 'Chicken thigh and scallion',
          nameJa: 'ねぎま',
          romaji: 'negima',
          description: 'The classic: juicy thigh and sweet negi, turn and turn about.',
          price: 4.5,
          skewer: { pieces: ['thigh', 'negi', 'thigh', 'negi', 'thigh'], seasoning: 'either', perOrder: 2 },
          badge: 'osusume',
          featured: true,
        },
        {
          id: 'momo-shio',
          name: 'Chicken thigh with salt',
          nameJa: 'もも塩',
          romaji: 'momo shio',
          description: 'Thigh only, sea salt and a squeeze of lemon.',
          price: 4,
          skewer: { pieces: ['thigh', 'thigh', 'thigh', 'thigh'], seasoning: 'shio', perOrder: 2 },
          diet: ['gluten-free'],
        },
        {
          id: 'tsukimi-tsukune',
          name: 'Chicken meatballs with egg yolk',
          nameJa: '月見つくね',
          romaji: 'tsukimi tsukune',
          description: 'Hand-pressed meatballs glazed in tare, with a raw yolk to dip.',
          price: 5,
          skewer: { pieces: ['tsukune', 'tsukune', 'tsukune'], seasoning: 'tare', perOrder: 2 },
          raw: true,
          badge: 'osusume',
          featured: true,
        },
        {
          id: 'kawa',
          name: 'Crispy chicken skin',
          nameJa: '皮',
          romaji: 'kawa',
          description: 'Wound tight and grilled slowly until it crackles.',
          price: 4,
          skewer: { pieces: ['skin', 'skin', 'skin', 'skin', 'skin'], seasoning: 'either', perOrder: 2 },
          featured: true,
        },
        {
          id: 'hatsu',
          name: 'Chicken heart',
          nameJa: 'ハツ',
          romaji: 'hatsu',
          description: 'Tender, rich and quick on the grill. Tare.',
          price: 4,
          skewer: { pieces: ['heart', 'heart', 'heart', 'heart', 'heart'], seasoning: 'tare', perOrder: 2 },
        },
        {
          id: 'shiitake',
          name: 'Shiitake mushroom',
          nameJa: '椎茸',
          romaji: 'shiitake',
          description: 'Fat caps grilled gill-side up so they keep their juice.',
          price: 4,
          skewer: { pieces: ['shiitake', 'shiitake', 'shiitake'], seasoning: 'shio', perOrder: 2 },
          diet: ['vegan', 'gluten-free'],
          featured: true,
        },
        {
          id: 'shishito',
          name: 'Shishito peppers',
          nameJa: 'ししとう',
          romaji: 'shishitō',
          description: 'Blistered and salted. About one in ten is hot.',
          price: 3.5,
          skewer: { pieces: ['shishito', 'shishito', 'shishito', 'shishito'], seasoning: 'shio', perOrder: 2 },
          diet: ['vegan', 'gluten-free'],
        },
        {
          id: 'butabara',
          name: 'Pork belly',
          nameJa: '豚バラ',
          romaji: 'butabara',
          description: 'Thin-sliced belly, salt, karashi mustard on the side.',
          price: 4.5,
          skewer: { pieces: ['pork-belly', 'pork-belly', 'pork-belly', 'pork-belly'], seasoning: 'shio', perOrder: 2 },
          diet: ['gluten-free'],
          featured: true,
        },
        {
          id: 'asupara-maki',
          name: 'Asparagus wrapped in pork',
          nameJa: 'アスパラ巻き',
          romaji: 'asupara maki',
          description: 'Spring asparagus rolled in pork belly, salt and pepper.',
          price: 5,
          skewer: { pieces: ['asparagus-pork', 'asparagus-pork', 'asparagus-pork'], seasoning: 'shio', perOrder: 2 },
          diet: ['gluten-free'],
          badge: 'new',
          featured: true,
        },
        {
          id: 'uzura',
          name: 'Quail eggs',
          nameJa: 'うずら',
          romaji: 'uzura',
          description: 'Soft-boiled quail eggs, lightly glazed in tare.',
          price: 4,
          skewer: { pieces: ['quail-egg', 'quail-egg', 'quail-egg', 'quail-egg'], seasoning: 'tare', perOrder: 2 },
          diet: ['vegetarian'],
        },
      ],
    },
    {
      id: 'agemono',
      title: 'Agemono',
      titleJa: '揚げ物',
      subtitle: 'Fried',
      description: 'Fried to order in clean rice-bran oil.',
      items: [
        {
          id: 'karaage',
          name: 'Japanese fried chicken',
          nameJa: '唐揚げ',
          romaji: 'karaage',
          description: 'Ginger-and-soy marinated thigh, potato-starch crust, lemon and mayonnaise.',
          price: 11,
          badge: 'osusume',
        },
        {
          id: 'agedashi-tofu',
          name: 'Fried tofu in broth',
          nameJa: '揚げ出し豆腐',
          romaji: 'agedashi dōfu',
          description: 'Crisp silken tofu in a warm kombu-soy broth, grated daikon and scallion.',
          price: 9,
          diet: ['vegan'],
        },
        {
          id: 'korokke',
          name: 'Potato croquettes',
          nameJa: 'コロッケ',
          romaji: 'korokke',
          description: 'Potato and beef croquettes in panko, shredded cabbage and tonkatsu sauce.',
          price: 8,
          soldOut: true,
        },
      ],
    },
    {
      id: 'sashimi',
      title: 'Sashimi & raw',
      titleJa: '刺身・生もの',
      subtitle: 'Raw fish',
      description: 'From the morning market, cut at the counter. Ask what came in today.',
      items: [
        {
          id: 'sashimi-moriawase',
          name: 'Sashimi plate',
          nameJa: '刺身盛り合わせ',
          romaji: 'sashimi moriawase',
          description: 'The chef’s choice of three fish and sweet shrimp, fresh wasabi.',
          price: 26,
          diet: ['gluten-free', 'contains-shellfish'],
          raw: true,
        },
        {
          id: 'maguro-tataki',
          name: 'Seared tuna',
          nameJa: 'マグロのたたき',
          romaji: 'maguro no tataki',
          description: 'Seared outside and raw within, ponzu, garlic chips and scallion.',
          price: 18,
          raw: true,
        },
      ],
    },
    {
      id: 'gohan',
      title: 'Gohan & men',
      titleJa: 'ご飯・麺',
      subtitle: 'Rice & noodles',
      description: 'To finish the night, the way it’s done in Japan: something warm and simple.',
      items: [
        {
          id: 'onigiri',
          name: 'Rice balls',
          nameJa: 'おにぎり',
          romaji: 'onigiri',
          description: 'Two, wrapped in nori: pickled plum and grilled salmon.',
          price: 6,
        },
        {
          id: 'ochazuke',
          name: 'Rice in tea broth',
          nameJa: 'お茶漬け',
          romaji: 'ochazuke',
          description: 'Rice, grilled salmon and nori under hot roasted-tea dashi, wasabi.',
          price: 9,
        },
        {
          id: 'yaki-udon',
          name: 'Stir-fried udon',
          nameJa: '焼きうどん',
          romaji: 'yaki udon',
          description: 'Thick udon, pork, cabbage and scallion, bonito flakes on top.',
          price: 14,
        },
      ],
    },
    {
      id: 'amai',
      title: 'Amai',
      titleJa: '甘いもの',
      subtitle: 'Sweets',
      description: 'Small and not too sweet.',
      items: [
        {
          id: 'matcha-ice-cream',
          name: 'Matcha ice cream',
          nameJa: '抹茶アイス',
          romaji: 'matcha aisu',
          description: 'Stone-ground green tea ice cream, candied walnuts.',
          price: 7,
          diet: ['vegetarian', 'gluten-free', 'contains-nuts'],
        },
        {
          id: 'warabi-mochi',
          name: 'Bracken-starch mochi',
          nameJa: 'わらび餅',
          romaji: 'warabi mochi',
          description: 'Wobbly, cool mochi rolled in roasted soybean flour, black sugar syrup.',
          price: 8,
          diet: ['vegan', 'gluten-free'],
          badge: 'seasonal',
        },
      ],
    },
  ],
  rawAdvisory:
    'Consuming raw or undercooked meats, poultry, seafood, shellfish or eggs may increase your risk of foodborne illness, especially if you have certain medical conditions.',
  notes: [
    'GF marks dishes with no gluten ingredients except soy sauce and tare, which contain wheat. Ask for tamari instead.',
    'Our kitchen handles wheat, soy, sesame, fish, shellfish, eggs and nuts. Please tell us about allergies when you order.',
    'Skewers are priced each and come two to an order.',
  ],
};

/* ------------------------------------------------------------------
   Helpers used by the pages. You shouldn't need to change these.
   ------------------------------------------------------------------ */

export const allItems: MenuItem[] = menu.sections.flatMap(section => section.items);

/** Items with skewers, in menu order. */
export const skewerItems: MenuItem[] = allItems.filter(item => item.skewer);

/** "From the grill" on the home page: featured skewers that aren't sold out. */
export const featuredSkewers: MenuItem[] = skewerItems.filter(item => item.featured && !item.soldOut);

/** Any raw item on the menu means the advisory is shown. */
export const hasRawItems: boolean = allItems.some(item => item.raw);

export function findItem(id: string): MenuItem | undefined {
  return allItems.find(item => item.id === id);
}

/** A recommendation resolved to one shape, whether it points at a menu item or is a special. */
export interface OsusumeEntry {
  id: string;
  name: string;
  nameJa: string;
  romaji: string;
  description: string;
  price: number;
  /** The menu item's id when the recommendation is on the menu (for /menu/#id links). */
  itemId?: string;
}

export function resolveOsusume(list: Osusume[] = osusume): OsusumeEntry[] {
  return list.flatMap(entry => {
    if ('special' in entry) return [{ ...entry.special }];
    const item = findItem(entry.item);
    return item ? [{ id: item.id, name: item.name, nameJa: item.nameJa, romaji: item.romaji, description: item.description, price: item.price, itemId: item.id }] : [];
  });
}

const priceFormat = new Intl.NumberFormat(menu.locale, { style: 'currency', currency: menu.currency });
const wholeFormat = new Intl.NumberFormat(menu.locale, { style: 'currency', currency: menu.currency, maximumFractionDigits: 0 });

/** 4.5 → "$4.50", 4 → "$4", 0 → "Free". */
export function formatPrice(amount: number): string {
  if (amount === 0) return 'Free';
  return Number.isInteger(amount) ? wholeFormat.format(amount) : priceFormat.format(amount);
}

export const SEASONING: Record<Seasoning, { label: string; ja: string }> = {
  shio: { label: 'Shio · salt', ja: '塩' },
  tare: { label: 'Tare · soy glaze', ja: 'たれ' },
  either: { label: 'Shio or tare', ja: '塩・たれ' },
};

export const BADGES: Record<NonNullable<MenuItem['badge']>, { label: string; ja: string }> = {
  osusume: { label: 'Recommended', ja: 'おすすめ' },
  seasonal: { label: 'Seasonal', ja: '旬' },
  new: { label: 'New', ja: '新' },
};
