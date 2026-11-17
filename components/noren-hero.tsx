import type { CSSProperties } from 'react';
import { izakaya } from '../content/izakaya';
import { Lantern } from './lantern';

/** The warm room seen through and below the noren: shelves of tokkuri and bottles, a lamp and the counter. */
function Room() {
  const bottles = [80, 150, 205, 300, 360, 470, 540, 610, 960, 1030, 1100, 1180, 1250, 1330];
  return (
    <svg viewBox="0 0 1440 600" preserveAspectRatio="xMidYMax slice" aria-hidden="true" focusable="false">
      <rect className="noren-room__shelf" x="0" y="250" width="1440" height="10" />
      <rect className="noren-room__shelf" x="0" y="360" width="1440" height="10" />
      {bottles.map((x, i) => (
        <g key={x} className="noren-room__bottle">
          {i % 3 === 0
            ? <path d={`M${x} 360c-14 0-18-14-18-30s8-24 12-30v-14h12v14c4 6 12 14 12 30s-4 30-18 30Z`} />
            : <path d={`M${x - 11} 250v-62c0-10 7-14 7-24v-20h8v20c0 10 7 14 7 24v62Z`} />}
        </g>
      ))}
      <rect className="noren-room__shelf" x="0" y="520" width="1440" height="80" opacity=".9" />
      <rect className="noren-room__shelf" x="0" y="510" width="1440" height="12" />
    </svg>
  );
}

/**
 * The home page hero: a full-width noren of 3–5 indigo panels with the shop name dyed across them.
 * On load (or hover) the panels part slightly to show the warm room; under reduced motion they
 * simply hang, a little apart. The visual is decorative; the heading text is read from the h1.
 */
export function NorenHero() {
  const chars = [...izakaya.nameJa];
  const panels = chars.length;
  // The romanised name is dyed across the cloth. With two words on an even number of panels, each word
  // sits on its own side of the centre slit, so no slit cuts through a word.
  const words = izakaya.name.toUpperCase().split(' ');
  const split = words.length === 2 && panels % 2 === 0;
  return (
    <section className="noren-hero h-[clamp(17rem,46vh,24rem)] md:h-[clamp(20rem,56vh,34rem)] print:hidden" aria-labelledby="hero-title">
      <div className="noren-room" aria-hidden="true"><Room /></div>
      <h1 id="hero-title" className="sr-only">{izakaya.name} <span lang="ja">{izakaya.kindJa} {izakaya.nameJa}</span></h1>

      <div className="relative h-[84%]" aria-hidden="true">
        <div className="noren-rod relative z-10 mx-auto w-full max-w-[66rem]" />
        <div className="noren-panels -mt-1.5 h-[calc(100%-6px)] px-1.5 sm:px-0" style={{ '--panels': panels } as CSSProperties}>
          {chars.map((char, i) => (
            <div key={i} className="noren-panel cloth" style={{ '--i': i } as CSSProperties}>
              {/* A faint full moon dyed across the middle of the cloth: 月明かり means moonlight. */}
              <span className="noren-line top-[12%] flex h-[56%] justify-center" style={{ '--i': i } as CSSProperties}>
                <span className="aspect-square h-full rounded-full border-[3px] border-noren-dye/15 bg-noren-dye/[.045]" />
              </span>
              {i === 0 ? (
                <span lang="ja" className="vertical absolute top-[7%] left-[12%] font-mincho text-[clamp(.7rem,1.4vw,1rem)] font-bold tracking-[.3em] text-noren-dye/85">{izakaya.kindJa}</span>
              ) : null}
              <span lang="ja" className="noren-char absolute inset-x-0 top-[38%] -translate-y-1/2 text-center text-[clamp(3.6rem,13vw,9.5rem)]">{char}</span>
              <span className="noren-line top-[71%] font-mincho text-[clamp(.66rem,1.5vw,1.15rem)] font-bold tracking-[.38em] whitespace-nowrap text-noren-dye/90 max-sm:hidden" style={{ '--i': i } as CSSProperties}>
                {split ? (
                  <span className="grid grid-cols-2">
                    <span className="pr-[1.4em] text-right">{words[0]}</span>
                    <span className="pl-[1.6em] text-left">{words[1]}</span>
                  </span>
                ) : words.join(' ')}
              </span>
            </div>
          ))}
        </div>
      </div>

      <div className="absolute top-0 right-[max(.25rem,calc((100%_-_64rem)_/_2_-_8rem))] z-20 w-[clamp(3.4rem,7vw,6.5rem)]" aria-hidden="true">
        <span className="lantern-glow -inset-[160%]" />
        <Lantern className="relative block w-full" />
      </div>
    </section>
  );
}
