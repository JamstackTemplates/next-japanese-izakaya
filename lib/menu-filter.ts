import type { MenuItem, MenuSection } from '../content/menu.ts';

/** Filters offered on the menu page. Each one narrows the menu; several together must all match. */
export type MenuFilter = 'vegetarian' | 'vegan' | 'no-raw' | 'no-shellfish';

export const MENU_FILTERS: { id: MenuFilter; label: string }[] = [
  { id: 'vegetarian', label: 'Vegetarian' },
  { id: 'vegan', label: 'Vegan' },
  { id: 'no-raw', label: 'No raw' },
  { id: 'no-shellfish', label: 'No shellfish' },
];

/** Vegan dishes count as vegetarian even when not tagged twice. */
export function matchesFilter(item: MenuItem, filter: MenuFilter): boolean {
  const diet = item.diet ?? [];
  switch (filter) {
    case 'vegetarian': return diet.includes('vegetarian') || diet.includes('vegan');
    case 'vegan': return diet.includes('vegan');
    case 'no-raw': return !item.raw;
    case 'no-shellfish': return !diet.includes('contains-shellfish');
  }
}

export function matchesAll(item: MenuItem, filters: readonly MenuFilter[]): boolean {
  return filters.every(filter => matchesFilter(item, filter));
}

/** Count of matching dishes per section for the active filters. */
export function visibleCounts(sections: readonly MenuSection[], filters: readonly MenuFilter[]): Record<string, number> {
  return Object.fromEntries(sections.map(section => [section.id, section.items.filter(item => matchesAll(item, filters)).length]));
}
