import type { CSSProperties } from 'react';
import { fahrenheit, TEMPERATURES, type Temperature } from '../content/drinks';
import { heat, TokkuriThermometer } from './sake-art';

/**
 * The sake serving-temperature scale: the tokkuri thermometer beside one row per step, hottest
 * first, each labelled in Japanese, romaji, °C and °F. With `onSelect` the rows become toggle
 * buttons (used by the sake page once JavaScript is running); otherwise they're plain text.
 */
export function TemperatureScale({ selected = null, onSelect, compact = false, counts, className = '' }: {
  selected?: Temperature | null;
  onSelect?: (id: Temperature) => void;
  compact?: boolean;
  /** Number of sakes per step, shown beside each row. */
  counts?: Partial<Record<Temperature, number>>;
  className?: string;
}) {
  const rows = [...TEMPERATURES].reverse();
  const rowHeight = compact ? '2.35rem' : '3.6rem';
  return (
    <div className={`grid grid-cols-[auto_1fr] gap-x-1 ${className}`} style={{ height: `calc(${rowHeight} * ${rows.length})` }}>
      <TokkuriThermometer selected={selected} className="h-full w-auto" />
      <ol className="grid" style={{ gridTemplateRows: `repeat(${rows.length}, 1fr)` }}>
        {rows.map(step => {
          const content = compact ? (
            <>
              <span lang="ja" className="min-w-[3.6rem] font-mincho text-[1rem] font-bold whitespace-nowrap">{step.ja}</span>
              <span className="temp-step__meta min-w-0 truncate text-[.8rem] text-wall-muted">
                <span className="font-bold text-current">{step.romaji}</span>
                <span className="tabular"> {step.celsius}°C·{fahrenheit(step.celsius)}°F</span>
              </span>
            </>
          ) : (
            <span className="grid min-w-0 leading-tight">
              <span className="flex items-baseline gap-2.5">
                <span lang="ja" className="font-mincho text-[1.2rem] font-bold whitespace-nowrap">{step.ja}</span>
                <span className="font-bold">{step.romaji}</span>
              </span>
              <span className="temp-step__meta mt-0.5 text-[.82rem] text-wall-muted">
                {step.english} · <span className="tabular">{step.celsius}°C / {fahrenheit(step.celsius)}°F{counts ? ` · ${counts[step.id] ?? 0} sake` : ''}</span>
              </span>
            </span>
          );
          const style = { '--t': heat(step.id) } as CSSProperties;
          const base = 'temp-step flex h-full w-full items-center gap-x-2 border-b border-dashed border-wall-muted/30 px-2 text-left';
          return (
            <li key={step.id} className="min-h-0">
              {onSelect ? (
                <button type="button" className={`${base} cursor-pointer rounded-ui`} style={style}
                  aria-pressed={selected === step.id} onClick={() => onSelect(step.id)}>
                  {content}
                </button>
              ) : (
                <div className={base} style={style}>{content}</div>
              )}
            </li>
          );
        })}
      </ol>
    </div>
  );
}
