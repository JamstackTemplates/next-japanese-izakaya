import type { CSSProperties, ReactNode } from 'react';

/**
 * A small split noren hung above each section title, with the Japanese title dyed across it.
 * Sections are separated by these, never by rules or colour bands.
 */
/** Splits a Japanese title into 1–3 panels of a few characters each, so no slit cuts through a character. */
export function dividerPanels(ja: string): string[] {
  const chars = [...ja];
  const count = chars.length <= 3 ? chars.length : Math.min(3, Math.ceil(chars.length / 3));
  const panels: string[] = [];
  let start = 0;
  for (let i = 0; i < count; i++) {
    const size = Math.ceil((chars.length - start) / (count - i));
    panels.push(chars.slice(start, start + size).join(''));
    start += size;
  }
  return panels;
}

function dividerWidth(ja: string): string {
  const panels = dividerPanels(ja);
  const widest = Math.max(...panels.map(panel => [...panel].length));
  return `${(widest * 1.45 + 1.6) * panels.length}rem`;
}

/**
 * A small split noren hung above each section title, with the Japanese title dyed across it.
 * Sections are separated by these, never by rules or colour bands.
 */
export function NorenDivider({ ja, className = '' }: { ja: string; className?: string }) {
  const panels = dividerPanels(ja);
  return (
    <div className={`divider-noren ${className}`} style={{ '--panels': panels.length, '--w': dividerWidth(ja) } as CSSProperties} aria-hidden="true">
      {panels.map((text, i) => (
        <span key={i} className="cloth grid place-items-center pb-[14%]">
          <span lang="ja" className="font-mincho text-[1.3rem] font-bold tracking-[.06em] whitespace-nowrap">{text}</span>
        </span>
      ))}
    </div>
  );
}

/** Section heading: split-noren divider, the English title and an optional lede. */
export function SectionHead({ id, ja, title, children, align = 'center', className = '' }: {
  id: string;
  /** Japanese title dyed on the divider, e.g. "本日のおすすめ". */
  ja: string;
  title: ReactNode;
  children?: ReactNode;
  align?: 'center' | 'start';
  className?: string;
}) {
  const centred = align === 'center';
  return (
    <header className={`mb-9 grid ${centred ? 'justify-items-center text-center' : 'justify-items-start'} ${className}`}>
      <div className="noren-rod mb-[-6px] h-2.5" style={{ width: `calc(${dividerWidth(ja)} + 1.25rem)` }} aria-hidden="true" />
      <NorenDivider ja={ja} />
      <h2 id={id} className="mt-5 text-[clamp(1.85rem,3.8vw,2.7rem)] text-wall-ink">{title}</h2>
      {children ? <div className={`mt-3 max-w-(--measure) text-[1.05rem] text-wall-muted ${centred ? 'mx-auto' : ''}`}>{children}</div> : null}
    </header>
  );
}
