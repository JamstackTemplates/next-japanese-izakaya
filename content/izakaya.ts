// Izakaya details. Edit this file to make the website yours.
// Everything here is placeholder content for a fictitious izakaya. The sample address is a public
// landmark (Kobe Terrace Park, Seattle) so the map has something to show; replace it with yours.
// Plain strings only: text is rendered as text, never as HTML.

export type Day = 'Monday' | 'Tuesday' | 'Wednesday' | 'Thursday' | 'Friday' | 'Saturday' | 'Sunday';

export const DAYS: readonly Day[] = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];

export interface OpeningHours {
  day: Day;
  /** 24-hour "HH:MM" local time, e.g. "17:00". Omit both `opens` and `closes` to mark the day closed. */
  opens?: string;
  /**
   * 24-hour "HH:MM" local time. A time *earlier* than `opens` means after midnight: Friday
   * `opens: '17:00', closes: '01:00'` stays open until 1am Saturday morning.
   */
  closes?: string;
}

export interface Faq {
  question: string;
  answer: string;
}

export interface Amenity {
  /** Short heading, e.g. "Ten counter seats". */
  title: string;
  /** One sentence of detail. */
  detail: string;
}

export interface IzakayaLink {
  label: string;
  /** Absolute https:// URL. Entries with an empty URL are not rendered. */
  url: string;
}

export interface Seating {
  /** Seats at the counter. */
  counterSeats: number;
  /** Number of tables. */
  tables: number;
  /** How walk-ins work, e.g. "Counter seats are first come, first served." */
  walkIns: string;
  /** Largest party seated as a walk-in. Bigger groups use the Contact page. */
  maxWalkInParty: number;
}

export interface Otoshi {
  /** Cover charge per guest, in the menu currency. */
  price: number;
  /** Plain explanation shown on the menu and in the FAQs. */
  explanation: string;
}

export interface Izakaya {
  /** Name in Latin letters, used in the header, page titles and structured data. */
  name: string;
  /** Name in Japanese, dyed across the noren. Each character fills one panel (3–5 characters work best). */
  nameJa: string;
  /** Kind of shop shown above the name on the noren, e.g. "居酒屋" (izakaya). */
  kindJa: string;
  /** What the name means, in English, e.g. "moonlight". */
  meaning: string;
  /** Short line under the name on the home page. */
  tagline: string;
  /** One or two sentences: the first thing visitors read. */
  introduction: string;
  /** "The counter" story paragraphs on the home page. */
  story: string[];
  /** How ordering works, one short step per line. */
  howToOrder: string[];
  /** Public contact address. Choose an address you are happy to publish. */
  email: string;
  /** Public phone number as written for people, e.g. "(206) 555-0147". Set to '' to hide it. */
  phone: string;
  address: {
    /** Optional landmark or building name, used in the map search, e.g. "Kobe Terrace Park". */
    place?: string;
    street: string;
    locality: string;
    region: string;
    postalCode: string;
    /** ISO 3166-1 alpha-2, e.g. "US". */
    country: string;
    /** Optional cross streets or landmark shown under the address. */
    note?: string;
  };
  /** Getting here on transit. */
  directions: string[];
  /** Parking and accessibility notes. */
  parking: string[];
  /** Local times in the izakaya's time zone, which is set by `timeZone` in site.config.json. */
  hours: OpeningHours[];
  /** Last order (ラストオーダー) is this many minutes before closing. */
  lastOrderMinutes: number;
  /** Optional one-off notice such as holiday hours. Set to '' to hide it. */
  notice: string;
  seating: Seating;
  /** The otōshi cover dish. Set to null to remove it everywhere. */
  otoshi: Otoshi | null;
  /** Minimum age for alcohol, shown as "21+ with ID". */
  drinkingAge: number;
  amenities: Amenity[];
  faqs: Faq[];
  /** Public profiles. Leave `url` empty to hide an entry. */
  links: IzakayaLink[];
}

export const izakaya: Izakaya = {
  name: 'Izakaya Tsukiakari',
  nameJa: '月明かり',
  kindJa: '居酒屋',
  meaning: 'moonlight',
  tagline: 'Charcoal skewers, small plates and warm sake under the moon',
  introduction:
    'A ten-seat counter, a few tables and a charcoal grill in the Chinatown–International District. Push through the noren, sit where there’s room and order a few plates at a time.',
  story: [
    'For twelve years our owner, Hiro, caught the last train home from a Tokyo office and stopped first at the same eight-seat counter, where the master grilled skewers, poured a warm tokkuri and never once asked about work.',
    'When he moved to Seattle he missed that counter more than anything, so he built one: hinoki wood, a binchōtan grill, a long sake list and a noren that goes up at five o’clock. Come alone or bring friends. There’s always a seat for one.',
  ],
  howToOrder: [
    'Sit at the counter or take a table: walk-ins only, first come, first served.',
    'Start with a drink and a couple of small plates, then add skewers as you go.',
    'Plates are made to share. Order a few at a time; the kitchen sends them as they’re ready.',
    'Ask the counter what’s good tonight: the paper strips on the wall change daily.',
  ],
  email: 'hello@example.com',
  phone: '(206) 555-0147',
  address: {
    place: 'Kobe Terrace Park',
    street: '650 S Main St',
    locality: 'Seattle',
    region: 'WA',
    postalCode: '98104',
    country: 'US',
    note: 'By Kobe Terrace Park, S Main St at 7th Ave S, in the Chinatown–International District',
  },
  directions: [
    'Link light rail: International District/Chinatown station is a five-minute walk. Head east on S Jackson St, then north up 7th Ave S.',
    'First Hill Streetcar: get off at 7th & Jackson and walk one block north.',
    'Look for the indigo noren and the red lantern on S Main St.',
  ],
  parking: [
    'Metered street parking on S Main St and 7th Ave S; free after 8pm.',
    'Pay garages along S Jackson St, two minutes away.',
    'Step-free entrance on S Main St and an accessible restroom.',
  ],
  hours: [
    { day: 'Monday' },
    { day: 'Tuesday', opens: '17:00', closes: '23:30' },
    { day: 'Wednesday', opens: '17:00', closes: '23:30' },
    { day: 'Thursday', opens: '17:00', closes: '23:30' },
    { day: 'Friday', opens: '17:00', closes: '01:00' },
    { day: 'Saturday', opens: '17:00', closes: '01:00' },
    { day: 'Sunday', opens: '17:00', closes: '22:00' },
  ],
  lastOrderMinutes: 30,
  notice: '',
  seating: {
    counterSeats: 10,
    tables: 4,
    walkIns: 'Counter seats are first come, first served.',
    maxWalkInParty: 5,
  },
  otoshi: {
    price: 4,
    explanation: 'A small seasonal starter served to every guest, as is customary in izakaya. It changes every few days and is added once per person.',
  },
  drinkingAge: 21,
  amenities: [
    { title: 'Ten counter seats', detail: 'Watch the grill and talk to the cooks. Solo guests are always welcome.' },
    { title: 'Four tables', detail: 'For groups of up to five on a walk-in. Bigger groups, send us a note.' },
    { title: 'Sake by the glass', detail: 'Every sake on the list is poured by the 90ml glass, so you can try a few.' },
    { title: 'Real non-alcoholic drinks', detail: 'Roasted tea, yuzu soda and an alcohol-free lager, not an afterthought.' },
  ],
  faqs: [
    {
      question: 'Do you take reservations?',
      answer: 'We’re walk-in only, and the counter is first come, first served. For groups of six or more, or an omakase evening at the counter, send us an enquiry through the Contact page and we’ll reply to arrange it.',
    },
    {
      question: 'What’s the otōshi?',
      answer: 'A small seasonal starter served to every guest, as is customary in izakaya: lightly pickled vegetables, a little simmered dish or something from the market. It’s added once per person on the bill.',
    },
    {
      question: 'Do you have vegetarian and vegan dishes?',
      answer: 'Yes. Every menu tag is marked, and the menu page can show only vegetarian or vegan dishes. Many of our broths use kombu rather than bonito; ask the counter if you’re unsure.',
    },
    {
      question: 'Is anything gluten-free? What about soy sauce?',
      answer: 'Dishes marked GF have no gluten ingredients except soy sauce and tare, which contain wheat. Ask for tamari and we can make most of them with it. Our kitchen handles wheat, so we can’t promise no cross-contact.',
    },
    {
      question: 'Do you serve raw fish?',
      answer: 'Yes: sashimi, seared tuna and the raw egg yolk with the tsukune. They’re marked on the menu, and every other skewer and plate is fully cooked.',
    },
    {
      question: 'Can I sit at the counter on my own?',
      answer: 'Please do. The counter was built for it. Solo guests are some of our favourite regulars.',
    },
    {
      question: 'Is there an age policy?',
      answer: 'Everyone is welcome to eat with us until 9pm. After 9pm we’re 21 and over. We serve alcohol only to guests 21+ with valid ID, and we’re happy to pour something non-alcoholic instead.',
    },
  ],
  links: [
    // Add your public profiles. Entries with an empty URL are hidden, so no dead links ship.
    { label: 'Instagram', url: '' },
    { label: 'Google Maps', url: '' },
  ],
};

/** Profile links that have a URL. */
export const publicLinks = izakaya.links.filter(link => link.url.trim() !== '');

/** Single-line postal address, e.g. "650 S Main St, Seattle, WA 98104". */
export function formatAddress(address = izakaya.address): string {
  return `${address.street}, ${address.locality}, ${address.region} ${address.postalCode}`;
}

/** The address with its landmark, for map searches and directions. */
export function mapQuery(address = izakaya.address): string {
  return address.place ? `${address.place}, ${formatAddress(address)}` : formatAddress(address);
}

/** "10 counter seats · walk-ins welcome": a static reminder, never a live count. */
export function seatingLine(seating = izakaya.seating): string {
  return `${seating.counterSeats} counter seats · walk-ins welcome`;
}

/** "tel:" link value for the phone number. */
export function telHref(phone = izakaya.phone): string {
  return `tel:${phone.replace(/[^\d+]/g, '')}`;
}
