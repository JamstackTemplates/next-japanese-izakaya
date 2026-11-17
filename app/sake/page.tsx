import type { Metadata } from 'next';
import { PageHead } from '../../components/page-head';
import { Komodaru } from '../../components/sake-art';
import { SakeExplorer } from '../../components/sake-explorer';
import { SectionHead } from '../../components/section-head';
import { TonightStatus } from '../../components/tonight-status';
import { ageNotice, nonAlcoholic, others, type Drink } from '../../content/drinks';
import { izakaya } from '../../content/izakaya';
import { formatPrice } from '../../content/menu';
import { absoluteUrl } from '../../lib/paths';

export const metadata: Metadata = {
  title: 'Sake & drinks',
  description: `The sake list at ${izakaya.name}, with serving temperatures from snow-chilled to hot, plus beer, highballs, shochu and non-alcoholic drinks.`,
  alternates: { canonical: absoluteUrl('/sake/') },
};

function DrinkList({ drinks }: { drinks: Drink[] }) {
  return (
    <ul className="grid gap-x-10 sm:grid-cols-2">
      {drinks.map(drink => (
        <li key={drink.id} id={drink.id} className="border-b border-dashed border-line py-3.5" data-dim={drink.soldOut ? 'true' : undefined}>
          <p className="flex items-baseline gap-2">
            <strong className="font-mincho text-[1.1rem]">{drink.name}</strong>
            <span lang="ja" className="text-[.9rem] text-muted">{drink.nameJa}</span>
            <span className="min-w-4 flex-1 border-b border-dotted border-muted/40" aria-hidden="true" />
            <span className="tabular font-bold">{formatPrice(drink.price)}</span>
          </p>
          <p className="text-[.9rem] text-muted"><em>{drink.romaji}</em> · {drink.description}{drink.soldOut ? ' Sold out today.' : ''}</p>
        </li>
      ))}
    </ul>
  );
}

const primer = [
  { ja: '升', title: 'The glass in a masu', text: 'Glasses are poured standing in a wooden box, the masu, and we pour until it overflows a little. That’s a welcome, not a mistake: drink from the glass, then tip the masu into it.' },
  { ja: '燗', title: 'Warm or chilled', text: 'Fragrant ginjo and daiginjo are best cool. Full junmai and honjozo open up warm. Not sure? Ask for the same sake two ways and taste the difference.' },
  { ja: '酌', title: 'Pour for each other', text: 'With a tokkuri, fill your friends’ cups and let them fill yours. Hold the cup up a little when someone pours. Sip slowly, with food, and drink water between rounds.' },
];

export default function SakePage() {
  return (
    <>
      <PageHead ja="日本酒" eyebrow="Sake & drinks" title="Sake, warm or cold"
        before={<Komodaru className="w-44 rotate-[-6deg] drop-shadow-[0_14px_18px_rgba(0,0,0,.35)]" />}>
        <p>
          Twelve sakes from across Japan, each poured by the glass or the tokkuri, at the temperature it likes best.
          {' '}<strong className="text-wall-ink">{ageNotice(izakaya.drinkingAge)}</strong>, and a real list of non-alcoholic drinks below.
        </p>
        <p className="mt-4 text-[1rem] text-wall-ink print:hidden"><TonightStatus className="font-bold" /></p>
      </PageHead>

      <div className="wrap pb-(--space-section)">
        <SakeExplorer />
      </div>

      <section className="wrap pb-(--space-section)" aria-labelledby="non-alcoholic-title">
        <SectionHead id="non-alcoholic-title" ja="ノンアルコール" title="Non-alcoholic">
          <p>Made with the same care as everything else, and every one of them good with yakitori.</p>
        </SectionHead>
        <div className="washi mx-auto max-w-[56rem]">
          <DrinkList drinks={nonAlcoholic} />
        </div>
      </section>

      <section className="wrap pb-(--space-section)" aria-labelledby="other-drinks-title">
        <SectionHead id="other-drinks-title" ja="その他のお酒" title="Beer, highballs & shochu">
          <p>{ageNotice(izakaya.drinkingAge)}.</p>
        </SectionHead>
        <div className="washi mx-auto max-w-[56rem]">
          <DrinkList drinks={others} />
        </div>
      </section>

      <section className="wrap pb-(--space-section)" aria-labelledby="primer-title">
        <SectionHead id="primer-title" ja="飲み方" title="How to drink sake here" />
        <ol className="mx-auto grid max-w-[60rem] gap-6 md:grid-cols-3">
          {primer.map(item => (
            <li key={item.title} className="washi washi-plain">
              <span lang="ja" className="hanko mb-3 text-[1.25rem] [--hanko-size:2.6rem]" aria-hidden="true">{item.ja}</span>
              <h3 className="text-[1.2rem]">{item.title}</h3>
              <p className="mt-2 text-[.96rem] text-muted">{item.text}</p>
            </li>
          ))}
        </ol>
        <p className="mx-auto mt-8 max-w-(--measure) text-center text-[.95rem] text-wall-muted">
          We serve alcohol only to guests {izakaya.drinkingAge} and over with valid ID, and we’ll happily stop pouring when it’s time to call it a night.
        </p>
      </section>
    </>
  );
}
