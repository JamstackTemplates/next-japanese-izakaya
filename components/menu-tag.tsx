import type { CSSProperties } from 'react';
import { BADGES, DIETS, formatPrice, SEASONING, type MenuItem } from '../content/menu';
import { Hanko } from './hanko';
import { SkewerArt } from './skewer';

/** Font size for vertical Japanese so long names still fit the tag (wrapping into a second column if needed). */
export function verticalNameSize(text: string, base = 1.5): string {
  const length = [...text].length;
  const scale = length <= 4 ? 1.08 : length <= 6 ? .96 : length <= 7 ? .82 : length <= 9 ? .64 : .58;
  return `${(base * scale).toFixed(2)}rem`;
}

/**
 * One dish as a tall wooden tag hung from the rail: the Japanese name written top to bottom,
 * the price at the foot and a vermilion hanko for osusume. A sold-out tag is turned face-down
 * (売り切れ) but stays in its place. The tag itself is decorative; the caption below carries the
 * readable name (romaji and English), description, price and diet marks.
 */
export function MenuTag({ item, as: Heading = 'h3', dim = false }: { item: MenuItem; as?: 'h3' | 'h4'; dim?: boolean }) {
  const soldOut = Boolean(item.soldOut);
  const price = formatPrice(item.price);
  return (
    <li id={item.id} className="tag-slot" data-soldout={soldOut ? 'true' : undefined} data-dim={dim ? 'true' : undefined}>
      <div className="tag-hang">
        {soldOut ? (
          <div className="tag tag-back" aria-hidden="true">
            <span lang="ja" className="tag__name vertical">売り切れ</span>
            <span className="tag__price text-[.68rem] leading-tight">Sold out</span>
          </div>
        ) : (
          <div className="tag" aria-hidden="true">
            <span lang="ja" className="tag__name vertical" style={{ '--name-size': verticalNameSize(item.nameJa) } as CSSProperties}>{item.nameJa}</span>
            <span className="tag__price tabular">{price}</span>
            {item.badge === 'osusume' ? <Hanko text={BADGES.osusume.ja} className="tag-hanko" size="2.1rem" /> : null}
          </div>
        )}
      </div>

      <div className="tag-caption mt-3 grid w-full justify-items-center gap-1 px-0.5">
        <Heading className="grid gap-0.5 font-sans text-[1rem] leading-snug font-bold">
          <span className="font-mincho text-[1.05rem] italic">{item.romaji}</span>
          <span className="text-[.86rem] font-medium text-wall-muted">{item.name}</span>
        </Heading>
        {item.skewer ? (
          <div className="my-1 w-full max-w-[10rem]">
            <SkewerArt pieces={item.skewer.pieces} seasoning={item.skewer.seasoning} />
          </div>
        ) : null}
        <p className="text-[.82rem] leading-snug text-wall-muted">{item.description}</p>
        <p className="tabular text-[.84rem] font-bold">
          {soldOut ? <span className="text-shu-text">Sold out today · </span> : null}
          <span>{price}</span>
          {item.skewer ? <span className="font-medium text-wall-muted"> each · {item.skewer.perOrder} per order</span> : null}
        </p>
        <p className="flex flex-wrap items-center justify-center gap-1 text-[.78rem] text-wall-muted">
          {item.skewer ? <span className="mr-1 font-bold">{SEASONING[item.skewer.seasoning].label}</span> : null}
          {item.badge ? <span className={`mr-1 font-bold ${item.badge === 'osusume' ? 'text-shu-text' : ''}`}>{BADGES[item.badge].label}</span> : null}
          {item.raw ? <abbr className="mark text-shu-text" title="Raw or undercooked: see the advisory">Raw*</abbr> : null}
          {item.diet?.map(diet => <abbr key={diet} className="mark" title={DIETS[diet].label}>{DIETS[diet].short}</abbr>)}
        </p>
      </div>
    </li>
  );
}
