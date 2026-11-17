import type { CSSProperties } from 'react';
import { formatPrice, resolveOsusume } from '../content/menu';
import { menuAnchor } from '../lib/paths';
import { Hanko } from './hanko';
import { verticalNameSize } from './menu-tag';
import { SiteLink } from './site-link';

/**
 * Today's recommendations as hand-written paper strips pinned to the wall, with a hanko stamp.
 * Edit `osusume` at the top of content/menu.ts.
 */
export function OsusumeStrips({ headingLevel = 'h3', className = '' }: { headingLevel?: 'h3' | 'h4'; className?: string }) {
  const Heading = headingLevel;
  const entries = resolveOsusume();
  return (
    <div className={`relative mx-auto w-fit max-w-full ${className}`}>
      <Hanko text="本日" size="3.4rem" solid className="absolute -top-4 -right-2 z-10 rotate-[10deg] sm:-right-10" />
      <ul className="flex flex-wrap justify-center gap-x-[clamp(.9rem,3vw,2.5rem)] gap-y-8">
        {entries.map(entry => {
          const caption = (
            <>
              <Heading className="grid gap-0.5 text-[1rem] leading-snug">
                <span className="font-mincho italic">{entry.romaji}</span>
                <span className="font-sans text-[.86rem] font-medium text-wall-muted">{entry.name}</span>
              </Heading>
              <p className="text-[.82rem] leading-snug text-wall-muted">{entry.description}</p>
              <p className="tabular text-[.9rem] font-bold">{formatPrice(entry.price)}</p>
            </>
          );
          return (
            <li key={entry.id} className="strip-slot grid w-[clamp(8.5rem,24vw,11rem)] justify-items-center gap-1.5 text-center">
              <div className="strip" aria-hidden="true">
                <span lang="ja" className="strip__name vertical" style={{ '--name-size': verticalNameSize(entry.nameJa, 1.55) } as CSSProperties}>{entry.nameJa}</span>
                <span className="tabular text-[.82rem] font-bold">{formatPrice(entry.price)}</span>
              </div>
              <div className="mt-2 grid gap-1">
                {entry.itemId
                  ? <SiteLink href={menuAnchor(entry.itemId)} className="grid gap-1 no-underline hover:[&_h3]:underline">{caption}</SiteLink>
                  : caption}
              </div>
            </li>
          );
        })}
      </ul>
    </div>
  );
}
