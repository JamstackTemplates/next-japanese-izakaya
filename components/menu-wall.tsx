'use client';

import { useEffect, useState } from 'react';
import { menu, type MenuSection } from '../content/menu';
import { MENU_FILTERS, matchesAll, visibleCounts, type MenuFilter } from '../lib/menu-filter';
import { MenuTag } from './menu-tag';

function RawAdvisory() {
  return (
    <p className="washi washi-plain mx-auto mt-8 max-w-(--measure) py-4! text-[.9rem]">
      <strong className="text-shu">* Raw or undercooked. </strong>{menu.rawAdvisory}
    </p>
  );
}

function Rail({ section, filters }: { section: MenuSection; filters: MenuFilter[] }) {
  const items = section.items.filter(item => matchesAll(item, filters));
  const hasRaw = section.items.some(item => item.raw);
  return (
    <section id={section.id} className="py-[clamp(2.5rem,5vw,4rem)]" aria-labelledby={`${section.id}-title`}>
      <div className="grid gap-x-8 gap-y-4 md:grid-cols-[4.25rem_minmax(0,1fr)]">
        {/* A narrow noren hung beside the rail, with the section's Japanese title. */}
        <div className="cloth flex h-fit min-h-48 justify-center rounded-b-[3px] px-2 pt-4 pb-6 shadow-lift max-md:hidden" aria-hidden="true">
          <span lang="ja" className="vertical font-mincho text-[1.55rem] font-bold tracking-[.18em]">{section.titleJa}</span>
        </div>
        <div className="min-w-0">
          <header className="mb-8 flex flex-wrap items-baseline gap-x-4 gap-y-1">
            <h2 id={`${section.id}-title`} className="text-[clamp(1.7rem,3.4vw,2.35rem)]">
              {section.title} <span lang="ja" className="ml-1 text-[.62em] font-bold text-wall-muted md:hidden">{section.titleJa}</span>
            </h2>
            <p className="font-bold text-wall-muted">{section.subtitle}</p>
            <p className="w-full max-w-(--measure) text-[.98rem] text-wall-muted">{section.description}</p>
          </header>
          {items.length ? (
            <ul className="tag-row">
              {items.map(item => <MenuTag key={item.id} item={item} />)}
            </ul>
          ) : (
            <p className="rounded-ui border-[1.5px] border-dashed border-wall-muted/50 p-5 text-wall-muted">Nothing on this rail matches those filters. Ask at the counter: the kitchen can often adapt a dish.</p>
          )}
          {hasRaw ? <RawAdvisory /> : null}
        </div>
      </div>
    </section>
  );
}

/**
 * The menu wall: one wooden rail of hanging tags per section, with split-noren tabs to jump between
 * rails and diet filters. The full menu is in the static HTML; filtering is a progressive
 * enhancement that only appears once JavaScript runs.
 */
export function MenuWall() {
  const [ready, setReady] = useState(false);
  const [filters, setFilters] = useState<MenuFilter[]>([]);
  useEffect(() => setReady(true), []);
  const counts = visibleCounts(menu.sections, filters);
  const total = Object.values(counts).reduce((sum, count) => sum + count, 0);
  const toggle = (id: MenuFilter) => setFilters(current => current.includes(id) ? current.filter(value => value !== id) : [...current, id]);

  return (
    <div>
      <div className="menu-toolbar sticky top-(--header-h) z-30 -mx-(--gutter) border-b border-wall-muted/25 bg-wall/92 px-(--gutter) pt-2 pb-2.5 backdrop-blur-sm print:hidden">
        <nav className="scrollbar-none flex gap-1.5 overflow-x-auto" aria-label="Menu sections">
          {menu.sections.map(section => (
            <a key={section.id} href={`#${section.id}`}
              className="cloth flex flex-none flex-col items-center rounded-b-[3px] px-3 pt-1 pb-1.5 leading-tight no-underline shadow-sheet hover:translate-y-0.5">
              <span lang="ja" className="text-[.66rem] tracking-[.1em] opacity-85" aria-hidden="true">{section.titleJa}</span>
              <span className="text-[.86rem] font-bold whitespace-nowrap">
                {section.title}
                {filters.length ? <span className="tabular ml-1.5 opacity-80">{counts[section.id]}</span> : null}
              </span>
            </a>
          ))}
        </nav>
        {ready ? (
          <div className="scrollbar-none mt-2 flex items-center gap-2 overflow-x-auto" role="group" aria-label="Show only">
            <span className="text-[.85rem] font-bold whitespace-nowrap text-wall-muted">Show only</span>
            {MENU_FILTERS.map(filter => (
              <button key={filter.id} type="button" className="chip min-h-[2.1rem] py-0.5 text-[.85rem]" aria-pressed={filters.includes(filter.id)} onClick={() => toggle(filter.id)}>
                {filter.label}
              </button>
            ))}
            {filters.length ? <button type="button" className="chip min-h-[2.1rem] border-dashed py-0.5 text-[.85rem]" onClick={() => setFilters([])}>Clear</button> : null}
            <span className="sr-only" role="status" aria-live="polite">{filters.length ? `${total} dishes match.` : ''}</span>
          </div>
        ) : null}
      </div>

      {menu.sections.map(section => <Rail key={section.id} section={section} filters={filters} />)}
    </div>
  );
}
