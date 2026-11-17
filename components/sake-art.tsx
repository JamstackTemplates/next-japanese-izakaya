import type { CSSProperties } from 'react';
import { TEMPERATURES, type Temperature } from '../content/drinks';

const STEP_COUNT = TEMPERATURES.length;

/** 0 for the coldest step, 1 for the hottest: mixes the cold indigo into the hot vermilion. */
export function heat(id: Temperature): number {
  return TEMPERATURES.findIndex(step => step.id === id) / (STEP_COUNT - 1);
}

/**
 * The tokkuri thermometer: a sake flask drawn as a thermometer, hot at the neck and snow-chilled at
 * the base, with an ochoko cup beside it. Its height matches the scale rows beside it (one row per
 * step, hottest first), so the ticks line up with the labels. `selected` fills the column to that step.
 */
export function TokkuriThermometer({ selected, className = '' }: { selected?: Temperature | null; className?: string }) {
  const rowHeight = 400 / STEP_COUNT;
  // Rows run hottest (top) to coldest (bottom).
  const yFor = (index: number) => (STEP_COUNT - 1 - index) * rowHeight + rowHeight / 2;
  const level = selected ? yFor(TEMPERATURES.findIndex(step => step.id === selected)) : null;
  return (
    <svg className={className} viewBox="0 0 120 400" preserveAspectRatio="xMidYMid meet" aria-hidden="true" focusable="false">
      <defs>
        <linearGradient id="tokkuri-heat" x1="0" y1="1" x2="0" y2="0">
          <stop offset="0" stopColor="var(--cold)" />
          <stop offset="1" stopColor="var(--hot)" />
        </linearGradient>
        <clipPath id="tokkuri-level"><rect x="0" y={level ?? 400} width="120" height="400" /></clipPath>
      </defs>
      {/* The flask: flared lip, long neck, round body. */}
      <path className="tokkuri__body" d="M62 6c-9 0-14 3-14 7s4 5 6 7c2 12 1 40-4 58-6 22-26 44-32 82-8 50-6 140 2 194 3 20 14 30 42 30s39-10 42-30c8-54 10-144 2-194-6-38-26-60-32-82-5-18-6-46-4-58 2-2 6-3 6-7s-5-7-14-7Z" />
      <path className="tokkuri__glaze" opacity=".9" d="M32 300c22 10 54 10 76 0 1 30 0 60-4 82-3 14-14 18-34 18s-31-4-34-18c-4-22-5-52-4-82Z" />
      {/* The column: empty tube, filled up to the selected step. */}
      <rect className="tokkuri__tube" x="66" y="18" width="8" height="372" rx="4" />
      <rect x="66" y="18" width="8" height="372" rx="4" fill="url(#tokkuri-heat)" opacity={selected ? 1 : .55} clipPath={selected ? 'url(#tokkuri-level)' : undefined} />
      {TEMPERATURES.map((step, index) => (
        <g key={step.id}>
          <circle className="tokkuri__dot" cx="70" cy={yFor(index)} r={selected === step.id ? 7 : 4.5} style={selected === step.id ? { fill: `color-mix(in srgb, var(--hot) ${heat(step.id) * 100}%, var(--cold))`, stroke: 'none' } : undefined} />
          <line className="tokkuri__tick" x1="104" x2="120" y1={yFor(index)} y2={yFor(index)} />
        </g>
      ))}
      {/* An ochoko cup at the foot. */}
      <path className="ochoko" d="M4 368h28l-3 18c-1 6-5 8-11 8s-10-2-11-8Z" />
      <ellipse className="ochoko__sake" cx="18" cy="369" rx="12" ry="2.5" />
    </svg>
  );
}

/** Eight small marks, coldest to hottest, with the recommended temperatures filled in. */
export function MiniScale({ temperatures, className = '' }: { temperatures: Temperature[]; className?: string }) {
  const label = `Serve ${TEMPERATURES.filter(step => temperatures.includes(step.id)).map(step => `${step.romaji} (${step.celsius}°C)`).join(', ')}`;
  return (
    <span className={`mini-scale ${className}`} role="img" aria-label={label}>
      {TEMPERATURES.map(step => (
        <span key={step.id} data-on={temperatures.includes(step.id) ? 'true' : undefined} style={{ '--t': heat(step.id) } as CSSProperties} title={`${step.romaji} ${step.celsius}°C`} />
      ))}
    </span>
  );
}

/** A straw-wrapped sake barrel lid (komodaru) with a plain crest: used once, on the sake page. */
export function Komodaru({ text = '酒', className = '' }: { text?: string; className?: string }) {
  return (
    <svg className={className} viewBox="0 0 200 200" aria-hidden="true" focusable="false">
      <circle className="komodaru__straw" cx="100" cy="100" r="94" />
      {[18, 34, 50, 66, 82].map(r => <circle key={r} className="komodaru__line" cx="100" cy="100" r={r} opacity=".55" />)}
      {Array.from({ length: 24 }, (_, i) => {
        const a = (i / 24) * Math.PI * 2;
        return <line key={i} className="komodaru__line" x1={100 + Math.cos(a) * 84} y1={100 + Math.sin(a) * 84} x2={100 + Math.cos(a) * 94} y2={100 + Math.sin(a) * 94} />;
      })}
      <circle className="komodaru__rope" cx="100" cy="100" r="88" />
      <circle cx="100" cy="100" r="44" fill="var(--shu)" />
      <circle cx="100" cy="100" r="38" fill="none" stroke="var(--on-shu)" strokeWidth="2" opacity=".8" />
      <text x="100" y="102" textAnchor="middle" dominantBaseline="middle" fontSize="44" fontWeight="700" fill="var(--on-shu)" style={{ fontFamily: 'var(--font-mincho)' }}>{text}</text>
    </svg>
  );
}
