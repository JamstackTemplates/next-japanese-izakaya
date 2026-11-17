'use client';

import { useEffect, useState } from 'react';
import { DRYNESS, fahrenheit, PREFECTURES, sake, sakeByType, SAKE_TYPES, TEMPERATURES, type Sake, type Temperature } from '../content/drinks';
import { formatPrice } from '../content/menu';
import { MiniScale } from './sake-art';
import { TemperatureScale } from './temperature-scale';

const counts = Object.fromEntries(TEMPERATURES.map(step => [step.id, sake.filter(item => item.temperatures.includes(step.id)).length])) as Record<Temperature, number>;

function SakeEntry({ item, dim }: { item: Sake; dim: boolean }) {
  const temps = TEMPERATURES.filter(step => item.temperatures.includes(step.id));
  return (
    <li id={item.id} className="border-b border-dashed border-line py-5 last:border-0" data-dim={dim ? 'true' : undefined}>
      <div className="flex flex-wrap items-baseline justify-between gap-x-4 gap-y-1">
        <h4 className="text-[1.2rem] leading-snug">
          {item.name}
          {item.nameJa ? <span lang="ja" className="ml-2 text-[.82em] font-medium text-muted">{item.nameJa}</span> : null}
        </h4>
        <p className="text-[.88rem] font-bold text-muted">{PREFECTURES[item.prefecture]} · {DRYNESS[item.dryness].label} <span lang="ja" className="font-normal">{DRYNESS[item.dryness].ja}</span></p>
      </div>
      <p className="mt-1.5 text-[.96rem]">{item.notes}{item.soldOut ? <strong className="text-shu"> Between bottles tonight.</strong> : null}</p>
      <div className="mt-3 flex flex-wrap items-center gap-x-5 gap-y-2 text-[.88rem]">
        <span className="inline-flex items-center gap-2.5">
          <MiniScale temperatures={item.temperatures} />
          <span className="text-muted">{temps.map(step => step.romaji).join(' · ')}</span>
        </span>
        <span className="tabular ml-auto flex flex-wrap gap-x-4 font-bold">
          <span><span className="font-normal text-muted">Glass 90ml</span> {formatPrice(item.glass)}</span>
          {item.tokkuri !== undefined ? <span><span className="font-normal text-muted">Tokkuri 180ml</span> {formatPrice(item.tokkuri)}</span> : null}
          {item.bottle ? <span><span className="font-normal text-muted">Bottle {item.bottle.size}</span> {formatPrice(item.bottle.price)}</span> : null}
        </span>
      </div>
    </li>
  );
}

/**
 * The sake list with the tokkuri temperature scale. Selecting a temperature highlights the sakes
 * that suit it (a progressive enhancement: the scale is plain text, and every sake is listed,
 * without JavaScript).
 */
export function SakeExplorer() {
  const [ready, setReady] = useState(false);
  const [selected, setSelected] = useState<Temperature | null>(null);
  useEffect(() => setReady(true), []);
  const step = TEMPERATURES.find(candidate => candidate.id === selected);

  return (
    <div className="grid items-start gap-[clamp(2rem,5vw,4rem)] lg:grid-cols-[minmax(0,25rem)_minmax(0,1fr)]">
      <div id="temperatures" className="lg:sticky lg:top-[calc(var(--header-h)+1.5rem)]">
        <h2 className="text-[1.6rem]">Serving temperatures <span lang="ja" className="ml-1 text-[.7em] text-wall-muted">温度</span></h2>
        <p className="mt-1.5 mb-5 text-[.95rem] text-wall-muted">
          From <em>yuki-bie</em>, snow-chilled, to <em>atsu-kan</em>, hot. {ready ? 'Choose a temperature to see the sakes that suit it.' : 'Each sake below lists the temperatures it’s best at.'}
        </p>
        <TemperatureScale selected={selected} counts={counts}
          onSelect={ready ? id => setSelected(current => current === id ? null : id) : undefined} />
        <p className="mt-4 min-h-[1.7em] text-[.95rem] font-bold" role="status" aria-live="polite">
          {step ? <>{counts[step.id]} sakes suit {step.romaji} ({step.celsius}°C / {fahrenheit(step.celsius)}°F). <button type="button" className="text-link cursor-pointer" onClick={() => setSelected(null)}>Show all</button></> : ''}
        </p>
      </div>

      <div className="washi">
        <h2 id="sake-list" className="mb-1 flex items-baseline gap-3 text-[clamp(1.7rem,3.2vw,2.3rem)]">
          The sake list <span lang="ja" className="text-[.6em] text-muted">日本酒</span>
        </h2>
        <p className="text-[.95rem] text-muted">Every sake is poured by the 90ml glass. A tokkuri is a 180ml carafe to share.</p>
        {sakeByType().map(group => (
          <section key={group.type} className="mt-8" aria-labelledby={`type-${group.type}`}>
            <h3 id={`type-${group.type}`} className="flex flex-wrap items-baseline gap-x-3 border-b-2 border-ink pb-1.5 text-[1.3rem]">
              {SAKE_TYPES[group.type].label} <span lang="ja" className="text-[.8em] font-medium text-muted">{SAKE_TYPES[group.type].ja}</span>
            </h3>
            <p className="mt-2 text-[.9rem] text-muted">{SAKE_TYPES[group.type].description}</p>
            <ul>
              {group.items.map(item => <SakeEntry key={item.id} item={item} dim={Boolean(selected && !item.temperatures.includes(selected))} />)}
            </ul>
          </section>
        ))}
      </div>
    </div>
  );
}
