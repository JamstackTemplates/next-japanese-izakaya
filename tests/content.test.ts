// Content invariants for the izakaya, its menu and drinks. Runs with Node's built-in TypeScript type stripping.
// When one of these fails after an edit, the message names the item, sake or section to fix.
import assert from 'node:assert/strict';
import { existsSync } from 'node:fs';
import { test } from 'node:test';
import { formatAddress, izakaya, mapQuery, publicLinks, seatingLine } from '../content/izakaya.ts';
import {
  allItems, BADGES, DIETS, featuredSkewers, formatPrice, hasRawItems, menu, osusume, resolveOsusume, SEASONING,
} from '../content/menu.ts';
import {
  ageNotice, DRYNESS, fahrenheit, featuredSake, nonAlcoholic, others, PREFECTURES, sake, sakeByType, SAKE_TYPES, TEMPERATURES,
} from '../content/drinks.ts';
import { matchesAll, matchesFilter, visibleCounts } from '../lib/menu-filter.ts';
import { mapDirectionsUrl, mapEmbedUrl, mapSearchUrl } from '../lib/maps.ts';
import { timeZoneLabel } from '../lib/time-zone.ts';

const SLUG = /^[a-z0-9]+(?:-[a-z0-9]+)*$/;
const JAPANESE = /[぀-ヿ㐀-鿿]/;
const validPrice = (amount: number) => Number.isFinite(amount) && amount > 0 && Math.round(amount * 100) === amount * 100;

test('menu sections and dishes have unique, URL-safe ids', () => {
  assert.ok(menu.sections.length >= 1, 'Add at least one menu section.');
  const specials = osusume.flatMap(entry => 'special' in entry ? [entry.special.id] : []);
  const ids = [...menu.sections.map(section => section.id), ...allItems.map(item => item.id), ...specials];
  for (const id of ids) assert.match(id, SLUG, `"${id}" must be lowercase words joined by hyphens`);
  const duplicates = ids.filter((id, index) => ids.indexOf(id) !== index);
  assert.deepEqual(duplicates, [], `ids must be unique across sections, dishes and specials: ${duplicates.join(', ')}`);
});

test('every section and dish is complete, in English, Japanese and romaji', () => {
  for (const section of menu.sections) {
    for (const key of ['title', 'titleJa', 'subtitle', 'description'] as const) assert.ok(section[key].trim(), `section ${section.id}.${key}`);
    assert.match(section.titleJa, JAPANESE, `section ${section.id}.titleJa should be written in Japanese`);
    assert.ok(section.items.length >= 1, `section ${section.id} has no dishes`);
  }
  for (const item of allItems) {
    for (const key of ['name', 'nameJa', 'romaji', 'description'] as const) assert.ok(item[key].trim(), `${item.id}.${key}`);
    assert.match(item.nameJa, JAPANESE, `${item.id}.nameJa should be written in Japanese`);
    assert.doesNotMatch(item.romaji, JAPANESE, `${item.id}.romaji should be in Latin letters`);
    assert.ok(validPrice(item.price), `${item.id} price ${item.price} must be positive with at most two decimals`);
    for (const diet of item.diet ?? []) assert.ok(diet in DIETS, `${item.id} has unknown diet mark "${diet}"`);
    assert.equal(new Set(item.diet).size, item.diet?.length ?? 0, `${item.id} repeats a diet mark`);
    if (item.diet?.includes('vegan')) assert.ok(!item.diet.includes('vegetarian'), `${item.id}: vegan already implies vegetarian, so drop "vegetarian"`);
    if (item.badge) assert.ok(item.badge in BADGES, `${item.id} has unknown badge "${item.badge}"`);
  }
});

test('skewers list their pieces, seasoning and order size', () => {
  const skewers = allItems.filter(item => item.skewer);
  const yakitori = menu.sections.find(section => section.id === 'yakitori');
  assert.ok(skewers.length >= 1, 'Add at least one skewer');
  for (const item of skewers) {
    const skewer = item.skewer!;
    assert.ok(skewer.pieces.length >= 2 && skewer.pieces.length <= 6, `${item.id} needs 2–6 pieces on the stick (it has ${skewer.pieces.length})`);
    assert.ok(skewer.seasoning in SEASONING, `${item.id}.skewer.seasoning must be shio, tare or either`);
    assert.ok(Number.isInteger(skewer.perOrder) && skewer.perOrder >= 1, `${item.id}.skewer.perOrder must be a whole number`);
  }
  if (yakitori) assert.ok(yakitori.items.length >= 8 && yakitori.items.length <= 12, 'Keep 8–12 yakitori and kushiyaki');
});

test('the menu covers vegetarian and vegan guests and shows a sold-out tag', () => {
  const vegetarian = allItems.filter(item => matchesFilter(item, 'vegetarian'));
  const vegan = allItems.filter(item => matchesFilter(item, 'vegan'));
  assert.ok(vegetarian.length >= 6, `Only ${vegetarian.length} vegetarian dishes: keep at least six`);
  assert.ok(vegan.length >= 3, `Only ${vegan.length} vegan dishes: keep at least three`);
  assert.ok(allItems.some(item => !item.soldOut), 'Something must be available');
});

test('raw dishes show the consumer advisory', () => {
  assert.equal(hasRawItems, allItems.some(item => item.raw));
  if (hasRawItems) {
    assert.match(menu.rawAdvisory, /raw or undercooked/i, 'menu.rawAdvisory must keep the standard “raw or undercooked” wording');
    assert.match(menu.rawAdvisory, /foodborne illness/i, 'menu.rawAdvisory must mention the risk of foodborne illness');
  }
  for (const item of menu.sections.find(section => section.id === 'sashimi')?.items ?? []) {
    assert.ok(item.raw, `${item.id} is in the raw section, so set raw: true`);
  }
});

test('today’s recommendations point at real dishes that are not sold out', () => {
  assert.ok(osusume.length >= 3 && osusume.length <= 5, `Keep 3–5 osusume entries (there are ${osusume.length})`);
  for (const entry of osusume) {
    if ('item' in entry) {
      const item = allItems.find(candidate => candidate.id === entry.item);
      assert.ok(item, `osusume points at "${entry.item}", which isn't on the menu`);
      assert.ok(!item.soldOut, `osusume "${entry.item}" is sold out today: take it off the recommendations`);
    } else {
      const special = entry.special;
      for (const key of ['name', 'nameJa', 'romaji', 'description'] as const) assert.ok(special[key].trim(), `osusume special ${special.id}.${key}`);
      assert.ok(validPrice(special.price), `osusume special ${special.id} price ${special.price}`);
    }
  }
  assert.equal(resolveOsusume().length, osusume.length);
});

test('the home page has skewers for the grill rail', () => {
  assert.ok(featuredSkewers.length >= 3 && featuredSkewers.length <= 6, `Mark 3–6 skewers featured: true (there are ${featuredSkewers.length})`);
});

test('prices format in the menu currency', () => {
  assert.equal(formatPrice(4.5), '$4.50');
  assert.equal(formatPrice(4), '$4');
  assert.equal(formatPrice(0), 'Free');
  assert.doesNotThrow(() => new Intl.NumberFormat(menu.locale, { style: 'currency', currency: menu.currency }));
});

test('the menu filters: vegan implies vegetarian; no raw and no shellfish exclude them', () => {
  const base = allItems[0];
  const vegan = { ...base, diet: ['vegan' as const], raw: false };
  const sashimi = { ...base, diet: ['contains-shellfish' as const], raw: true };
  assert.ok(matchesFilter(vegan, 'vegetarian') && matchesFilter(vegan, 'no-raw') && matchesFilter(vegan, 'no-shellfish'));
  assert.ok(!matchesFilter(sashimi, 'no-raw') && !matchesFilter(sashimi, 'no-shellfish') && !matchesFilter(sashimi, 'vegetarian'));
  assert.ok(matchesAll(vegan, ['vegan', 'vegetarian']) && !matchesAll(sashimi, ['no-raw']));
  assert.equal(Object.values(visibleCounts(menu.sections, [])).reduce((a, b) => a + b, 0), allItems.length);
});

test('sakes have unique ids, known types, prefectures, dryness and temperatures', () => {
  assert.ok(sake.length >= 10 && sake.length <= 14, `Keep 10–14 sakes (there are ${sake.length})`);
  const ids = [...sake.map(item => item.id), ...others.map(item => item.id), ...nonAlcoholic.map(item => item.id)];
  for (const id of ids) assert.match(id, SLUG, `"${id}" must be lowercase words joined by hyphens`);
  const duplicates = ids.filter((id, index) => ids.indexOf(id) !== index);
  assert.deepEqual(duplicates, [], `drink ids must be unique: ${duplicates.join(', ')}`);
  const steps = TEMPERATURES.map(step => step.id);
  for (const item of sake) {
    assert.ok(item.name.trim() && item.notes.trim(), `${item.id} needs a name and notes`);
    assert.ok(item.type in SAKE_TYPES, `${item.id} has unknown type "${item.type}"`);
    assert.ok(item.prefecture in PREFECTURES, `${item.id} has unknown prefecture "${item.prefecture}": add it to PREFECTURES`);
    assert.ok(item.dryness in DRYNESS, `${item.id} has unknown dryness "${item.dryness}"`);
    assert.ok(item.temperatures.length >= 1, `${item.id} needs at least one serving temperature`);
    for (const temperature of item.temperatures) assert.ok(steps.includes(temperature), `${item.id} has unknown temperature "${temperature}"`);
    assert.equal(new Set(item.temperatures).size, item.temperatures.length, `${item.id} repeats a temperature`);
    assert.ok(validPrice(item.glass), `${item.id} glass price ${item.glass}`);
    if (item.tokkuri !== undefined) assert.ok(validPrice(item.tokkuri), `${item.id} tokkuri price ${item.tokkuri}`);
    if (item.bottle) assert.ok(validPrice(item.bottle.price) && item.bottle.size.trim(), `${item.id} bottle price and size`);
    if (item.nameJa) assert.match(item.nameJa, JAPANESE, `${item.id}.nameJa should be written in Japanese`);
  }
});

test('the sake list covers every type and every temperature step', () => {
  for (const type of Object.keys(SAKE_TYPES)) assert.ok(sake.some(item => item.type === type), `No sake of type "${type}": add one or remove the type`);
  for (const step of TEMPERATURES) assert.ok(sake.some(item => item.temperatures.includes(step.id)), `No sake is recommended ${step.romaji} (${step.id})`);
  assert.ok(sake.some(item => item.temperatures.includes('atsukan')), 'Recommend at least one sake hot (atsukan)');
  assert.ok(sake.some(item => item.temperatures.includes('yukibie')), 'Recommend at least one sake well chilled (yukibie)');
  assert.equal(sakeByType().reduce((sum, group) => sum + group.items.length, 0), sake.length);
  assert.equal(featuredSake.length, 3, `Mark exactly 3 sakes featured: true for “Sake tonight” (there are ${featuredSake.length})`);
});

test('the temperature scale runs cold to hot, in Japanese, romaji, °C and °F', () => {
  assert.equal(TEMPERATURES.length, 8);
  for (const [index, step] of TEMPERATURES.entries()) {
    assert.match(step.ja, JAPANESE, `${step.id}.ja`);
    assert.ok(step.romaji.trim() && step.english.trim(), step.id);
    if (index > 0) assert.ok(step.celsius > TEMPERATURES[index - 1].celsius, `${step.id} must be warmer than the step before`);
  }
  assert.equal(fahrenheit(5), 41);
  assert.equal(fahrenheit(50), 122);
});

test('other drinks and a real non-alcoholic list', () => {
  assert.ok(nonAlcoholic.length >= 4, `Keep at least four non-alcoholic drinks (there are ${nonAlcoholic.length})`);
  for (const drink of [...others, ...nonAlcoholic]) {
    for (const key of ['name', 'nameJa', 'romaji', 'description'] as const) assert.ok(drink[key].trim(), `${drink.id}.${key}`);
    assert.ok(validPrice(drink.price), `${drink.id} price ${drink.price}`);
  }
  assert.equal(ageNotice(izakaya.drinkingAge), '21+ with ID for alcohol');
});

test('the izakaya details are complete and publishable', () => {
  assert.match(izakaya.nameJa, JAPANESE);
  assert.ok(izakaya.nameJa.length >= 2 && izakaya.nameJa.length <= 6, 'nameJa fills one noren panel per character: keep it 2–6 characters');
  assert.match(izakaya.email, /^[^\s@]+@[^\s@]+\.[^\s@]+$/);
  for (const link of publicLinks) assert.match(link.url, /^https:\/\//, link.url);
  assert.ok(izakaya.story.length >= 1 && izakaya.howToOrder.length >= 1 && izakaya.faqs.length >= 1);
  assert.ok(Number.isInteger(izakaya.lastOrderMinutes) && izakaya.lastOrderMinutes >= 0 && izakaya.lastOrderMinutes <= 120, 'lastOrderMinutes');
  const { seating } = izakaya;
  assert.ok(seating.counterSeats >= 1 && seating.tables >= 0 && seating.maxWalkInParty >= 1 && seating.walkIns.trim(), 'seating');
  assert.equal(seatingLine(), `${seating.counterSeats} counter seats · walk-ins welcome`);
  if (izakaya.otoshi) assert.ok(validPrice(izakaya.otoshi.price) && izakaya.otoshi.explanation.trim(), 'otoshi needs a price and an explanation, or set it to null');
  assert.ok(existsSync(new URL('../public/og.png', import.meta.url)), 'public/og.png social image');
});

test('time zones read naturally next to the hours', () => {
  assert.equal(timeZoneLabel('America/Los_Angeles'), 'Pacific Time');
  assert.equal(timeZoneLabel('America/New_York'), 'Eastern Time');
  assert.equal(timeZoneLabel('UTC'), 'UTC');
  assert.equal(timeZoneLabel(''), '');
});

test('the address is complete and Google Maps links are keyless and encoded', () => {
  for (const key of ['street', 'locality', 'region', 'postalCode', 'country'] as const) assert.ok(izakaya.address[key].trim(), `address.${key}`);
  assert.match(izakaya.address.country, /^[A-Z]{2}$/);
  assert.equal(formatAddress(), '650 S Main St, Seattle, WA 98104');
  const query = mapQuery();
  assert.equal(query, 'Kobe Terrace Park, 650 S Main St, Seattle, WA 98104');
  assert.equal(mapSearchUrl('A & B, #1'), 'https://www.google.com/maps/search/?api=1&query=A%20%26%20B%2C%20%231');
  assert.ok(mapDirectionsUrl(query).startsWith('https://www.google.com/maps/dir/?api=1&destination=Kobe%20Terrace%20Park'));
  assert.ok(mapEmbedUrl(query).startsWith('https://www.google.com/maps/embed?origin=mfe&pb=!1m3!2m1!1sKobe+Terrace+Park%2C+650+S+Main+St'));
  for (const url of [mapSearchUrl(query), mapDirectionsUrl(query), mapEmbedUrl(query)]) assert.doesNotMatch(url, /key=/);
});
