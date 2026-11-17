import type { Metadata } from 'next';
import { MenuWall } from '../../components/menu-wall';
import { OsusumeStrips } from '../../components/osusume-strips';
import { PageHead } from '../../components/page-head';
import { SiteLink } from '../../components/site-link';
import { TonightStatus } from '../../components/tonight-status';
import { izakaya, seatingLine } from '../../content/izakaya';
import { formatPrice, hasRawItems, menu } from '../../content/menu';
import { absoluteUrl } from '../../lib/paths';

export const metadata: Metadata = {
  title: 'Menu',
  description: `Yakitori and kushiyaki, small plates, fried dishes, sashimi, rice, noodles and sweets at ${izakaya.name}, with today’s recommendations.`,
  alternates: { canonical: absoluteUrl('/menu/') },
};

export default function MenuPage() {
  return (
    <>
      <PageHead ja="お品書き" eyebrow="O-shinagaki · the menu" title="The menu wall">
        <p>
          Every dish hangs on its own wooden tag. Order a few at a time and share; the kitchen sends plates as they’re ready.
          A face-down tag means it’s sold out today.
        </p>
        <p className="mt-4 flex flex-wrap items-center gap-x-5 gap-y-2 text-[1rem] text-wall-ink print:hidden">
          <TonightStatus className="font-bold" />
          <span>{seatingLine()}</span>
        </p>
      </PageHead>

      <section className="wrap pb-[clamp(2rem,5vw,3.5rem)]" aria-labelledby="osusume-title">
        <h2 id="osusume-title" className="mb-8 text-center text-[clamp(1.5rem,3vw,2rem)]">
          Today’s recommendations <span lang="ja" className="ml-1 text-[.7em] text-wall-muted">本日のおすすめ</span>
        </h2>
        <OsusumeStrips />
      </section>

      <div className="wrap">
        <MenuWall />
      </div>

      <section className="wrap pb-(--space-section)" aria-labelledby="notes-title">
        <div className="washi mx-auto max-w-[44rem]">
          <h2 id="notes-title" className="text-[1.45rem]">Before you order</h2>
          <ul className="mt-3 grid list-disc gap-2 pl-5 text-[.96rem] marker:text-shu">
            {izakaya.otoshi ? <li><strong>Otōshi, {formatPrice(izakaya.otoshi.price)} per guest.</strong> {izakaya.otoshi.explanation}</li> : null}
            {menu.notes.map(note => <li key={note}>{note}</li>)}
          </ul>
          {hasRawItems ? (
            <p className="mt-5 border-l-4 border-shu bg-paper-2 px-4 py-3 text-[.94rem]"><strong>* Raw or undercooked. </strong>{menu.rawAdvisory}</p>
          ) : null}
          <p className="mt-5 text-[.96rem] text-muted">
            Six or more, or an omakase evening? <SiteLink href="/contact/" className="text-link">Send us an enquiry</SiteLink>.
          </p>
        </div>
      </section>
    </>
  );
}
