import type { Metadata } from 'next';
import { GoogleMap } from '../components/google-map';
import { Hanko } from '../components/hanko';
import { HoursList } from '../components/hours-list';
import { MenuTag } from '../components/menu-tag';
import { NorenHero } from '../components/noren-hero';
import { OsusumeStrips } from '../components/osusume-strips';
import { Robata } from '../components/robata';
import { MiniScale } from '../components/sake-art';
import { SectionHead } from '../components/section-head';
import { SiteLink } from '../components/site-link';
import { TemperatureScale } from '../components/temperature-scale';
import { TimeZoneNote } from '../components/time-zone-note';
import { TonightHours, TonightStatus } from '../components/tonight-status';
import { DRYNESS, featuredSake, PREFECTURES, SAKE_TYPES } from '../content/drinks';
import { formatAddress, izakaya, mapQuery, seatingLine, telHref } from '../content/izakaya';
import { featuredSkewers, formatPrice, resolveOsusume, skewerItems } from '../content/menu';
import { groupedHours } from '../lib/hours';
import { mapDirectionsUrl, mapSearchUrl } from '../lib/maps';
import { absoluteUrl, sakeAnchor } from '../lib/paths';
import { izakayaStructuredData, jsonLd } from '../lib/structured-data';

export const metadata: Metadata = {
  alternates: { canonical: absoluteUrl('/') },
};

const section = 'wrap section-y';

export default function HomePage() {
  const weekly = groupedHours().filter(group => !group.closed).map(group => `${group.label} ${group.hours}`).join(' · ');
  const tonight = resolveOsusume();
  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: jsonLd(izakayaStructuredData()) }} />

      <NorenHero />

      {/* On the wall, below the noren: are we open, is there a seat, what's good today. */}
      <section className="wrap grid gap-x-12 gap-y-8 pt-[clamp(1.5rem,3.5vw,2.75rem)] pb-[clamp(2rem,4vw,3rem)] lg:grid-cols-[minmax(0,1.15fr)_minmax(0,1fr)]" aria-label="Tonight">
        <div>
          <p className="print:hidden">
            <span className="mb-1 block font-mincho text-[1.05rem] text-wall-muted">{izakaya.name} <span lang="ja">· {izakaya.kindJa} {izakaya.nameJa}</span></span>
            <TonightStatus className="font-mincho text-[clamp(1.45rem,3vw,2.05rem)] leading-tight font-bold" />
          </p>
          <ul className="mt-3 grid gap-1 text-[1.02rem]">
            <li><strong>{seatingLine()}</strong> · {izakaya.seating.walkIns}</li>
            <li><TonightHours fallback={weekly} className="tabular" /></li>
            <li><a href="#find-us" className="underline decoration-wall-muted/50 underline-offset-[.22em] hover:decoration-current">{formatAddress()}</a> <span className="text-wall-muted">· {izakaya.address.place}</span></li>
          </ul>
          <p className="mt-6 flex flex-wrap gap-3">
            <SiteLink href="/menu/" className="button">See the menu</SiteLink>
            <a href="#find-us" className="button button-ghost">Find us</a>
          </p>
        </div>
        <div className="grid content-start gap-4">
          <p className="text-[1.08rem]">{izakaya.introduction}</p>
          <div className="flex items-start gap-3">
            <Hanko text="おすすめ" size="2.6rem" className="mt-0.5" />
            <p className="text-[.98rem]">
              <a href="#osusume" className="font-bold underline decoration-wall-muted/50 underline-offset-[.22em] hover:decoration-current">Tonight’s osusume:</a>{' '}
              {tonight.map((entry, index) => (
                <span key={entry.id}>{entry.name} <span className="tabular text-wall-muted">{formatPrice(entry.price)}</span>{index < tonight.length - 1 ? ' · ' : ''}</span>
              ))}
            </p>
          </div>
        </div>
      </section>

      <section id="find-us" className={section} aria-labelledby="find-us-title">
        <SectionHead id="find-us-title" ja="アクセス" title="Find us">
          <p>{izakaya.address.note}.</p>
        </SectionHead>
        <div className="grid items-start gap-[clamp(1.5rem,4vw,3rem)] lg:grid-cols-[minmax(0,1fr)_minmax(0,1.1fr)]">
          <div className="washi">
            <h3 className="text-[1.5rem]">{izakaya.address.place}</h3>
            <p className="mt-1 text-[1.08rem]">{formatAddress()}</p>
            <p className="mt-5 flex flex-wrap gap-3">
              <a className="button" href={mapDirectionsUrl(mapQuery())} rel="noopener">Get directions</a>
              <a className="button button-quiet min-h-12!" href={mapSearchUrl(mapQuery())} rel="noopener">Open in Google Maps</a>
            </p>
            {izakaya.notice ? <p className="mt-5 border-l-4 border-shu bg-paper-2 px-4 py-3 font-bold">{izakaya.notice}</p> : null}
            <h4 className="mt-7 font-sans text-[.95rem] font-bold tracking-[.12em] uppercase">Getting here</h4>
            <ul className="mt-2 grid list-disc gap-1.5 pl-5 text-[.96rem] text-muted marker:text-shu">
              {izakaya.directions.map(line => <li key={line}>{line}</li>)}
            </ul>
            <h4 className="mt-6 font-sans text-[.95rem] font-bold tracking-[.12em] uppercase">Parking &amp; access</h4>
            <ul className="mt-2 grid list-disc gap-1.5 pl-5 text-[.96rem] text-muted marker:text-shu">
              {izakaya.parking.map(line => <li key={line}>{line}</li>)}
            </ul>
            <h4 className="mt-7 flex items-baseline gap-2 font-sans text-[.95rem] font-bold tracking-[.12em] uppercase">
              Opening hours <span lang="ja" className="font-normal tracking-normal text-muted normal-case">営業時間</span>
            </h4>
            <HoursList className="mt-1" />
            <p className="mt-2.5 text-[.88rem] text-muted">Last order is {izakaya.lastOrderMinutes} minutes before closing.</p>
            <TimeZoneNote />
          </div>
          <figure className="print-frame">
            <GoogleMap className="min-h-[24rem] lg:min-h-[34rem]" />
            <figcaption className="mt-2.5 text-center font-mincho text-[.95rem] text-muted">{izakaya.address.note}</figcaption>
          </figure>
        </div>
      </section>

      <section id="osusume" className={section} aria-labelledby="osusume-title">
        <SectionHead id="osusume-title" ja="本日のおすすめ" title="Today’s recommendations">
          <p>Written up each afternoon from what came in at the market. When they’re gone, they’re gone.</p>
        </SectionHead>
        <OsusumeStrips />
      </section>

      <section className={`${section} relative`} aria-labelledby="grill-title">
        <Robata className="absolute top-[calc(var(--space-section)+1rem)] right-0 w-[clamp(9rem,15vw,13rem)] max-md:hidden" />
        <SectionHead id="grill-title" ja="炭火焼き" title="From the grill">
          <p>Yakitori and kushiyaki over binchōtan charcoal, priced by the skewer and served two to an order.</p>
        </SectionHead>
        <ul className="tag-row">
          {featuredSkewers.slice(0, 6).map(item => <MenuTag key={item.id} item={item} />)}
        </ul>
        <p className="mt-8 text-center">
          <SiteLink href="/menu/#yakitori" className="button button-ghost">All {skewerItems.length} skewers on the menu</SiteLink>
        </p>
      </section>

      <section className={section} aria-labelledby="counter-title">
        <SectionHead id="counter-title" ja="カウンター" title="The counter" />
        <div className="washi mx-auto max-w-[44rem]">
          {izakaya.story.map(paragraph => <p key={paragraph} className="mb-4 text-[1.06rem]">{paragraph}</p>)}
          <ul className="my-6 grid gap-3 border-y border-dashed border-line py-5 sm:grid-cols-2">
            {izakaya.amenities.map(amenity => (
              <li key={amenity.title}>
                <strong className="block font-mincho text-[1.08rem]">{amenity.title}</strong>
                <span className="text-[.94rem] text-muted">{amenity.detail}</span>
              </li>
            ))}
          </ul>
          <h3 className="text-[1.3rem]">How ordering works</h3>
          <ol className="mt-3 grid gap-2.5">
            {izakaya.howToOrder.map((step, index) => (
              <li key={step} className="grid grid-cols-[2rem_1fr] items-baseline gap-2">
                <span lang="ja" className="font-mincho text-[1.15rem] font-bold text-shu" aria-hidden="true">{['一', '二', '三', '四', '五', '六'][index] ?? index + 1}</span>
                <span>{step}</span>
              </li>
            ))}
          </ol>
          {izakaya.otoshi ? (
            <div className="mt-6 flex items-start gap-4 rounded-ui bg-paper-2 p-4">
              <Hanko text="お通し" size="2.8rem" className="mt-0.5" />
              <p className="text-[.96rem]">
                <strong className="font-mincho text-[1.05rem]">Otōshi · {formatPrice(izakaya.otoshi.price)} per guest. </strong>
                {izakaya.otoshi.explanation}
              </p>
            </div>
          ) : null}
        </div>
      </section>

      <section className={section} aria-labelledby="sake-title">
        <SectionHead id="sake-title" ja="今夜の酒" title="Sake tonight">
          <p>Three from the list, and how warm to drink them. Every sake is poured by the glass.</p>
        </SectionHead>
        <div className="grid items-start gap-[clamp(2rem,5vw,4rem)] lg:grid-cols-[21rem_minmax(0,1fr)]">
          <TemperatureScale compact className="mx-auto w-full max-w-[21rem]" />
          <div className="washi">
            <ul className="grid">
              {featuredSake.map(item => (
                <li key={item.id} className="border-b border-dashed border-line py-4 first:pt-0 last:border-0 last:pb-0">
                  <h3 className="text-[1.25rem]">
                    <SiteLink href={sakeAnchor(item.id)} className="no-underline hover:underline">{item.name}</SiteLink>
                    {item.nameJa ? <span lang="ja" className="ml-2 text-[.8em] font-medium text-muted">{item.nameJa}</span> : null}
                  </h3>
                  <p className="text-[.9rem] font-bold text-muted">{SAKE_TYPES[item.type].label} · {PREFECTURES[item.prefecture]} · {DRYNESS[item.dryness].label}</p>
                  <p className="mt-1 text-[.97rem]">{item.notes}</p>
                  <p className="mt-2 flex flex-wrap items-center gap-x-4 gap-y-1 text-[.9rem]">
                    <MiniScale temperatures={item.temperatures} />
                    <span className="tabular font-bold">Glass {formatPrice(item.glass)}{item.tokkuri !== undefined ? ` · Tokkuri ${formatPrice(item.tokkuri)}` : ''}</span>
                  </p>
                </li>
              ))}
            </ul>
            <p className="mt-6 flex flex-wrap items-center justify-between gap-3 border-t border-line pt-5">
              <span className="text-[.92rem] font-bold">{izakaya.drinkingAge}+ with ID for alcohol · non-alcoholic drinks on the list too</span>
              <SiteLink href="/sake/" className="button">The full sake list</SiteLink>
            </p>
          </div>
        </div>
      </section>

      <section className="wrap py-[clamp(1.5rem,4vw,3rem)]" aria-labelledby="groups-title">
        <div className="noren-rod mx-auto w-full" aria-hidden="true" />
        <div className="cloth relative mx-3 grid items-center gap-x-10 gap-y-5 rounded-b-[4px] px-[clamp(1.25rem,4vw,3rem)] pt-10 pb-12 shadow-lift md:grid-cols-[auto_minmax(0,1fr)_auto]">
          <span lang="ja" className="vertical font-mincho text-[1.6rem] font-bold tracking-[.2em] max-md:hidden" aria-hidden="true">宴会・おまかせ</span>
          <div>
            <h2 id="groups-title" className="text-[clamp(1.6rem,3vw,2.2rem)] text-noren-dye">Group tables &amp; omakase evenings</h2>
            <p className="mt-2 max-w-(--measure) text-on-indigo-muted">
              Six or more, a chef’s-choice omakase at the counter, or the whole room for the night: send us an enquiry and we’ll
              reply to arrange it. Nothing is booked until we confirm.
            </p>
          </div>
          <p><SiteLink href="/contact/" className="button bg-noren-dye! text-indigo! hover:bg-paper!">Send an enquiry</SiteLink></p>
        </div>
      </section>

      {izakaya.faqs.length ? (
        <section id="faq" className={section} aria-labelledby="faq-title">
          <SectionHead id="faq-title" ja="よくある質問" title="Good to know" />
          <div className="washi mx-auto max-w-[46rem]">
            {izakaya.faqs.map(faq => (
              <details key={faq.question} className="faq border-b border-dashed border-line last:border-0">
                <summary className="flex cursor-pointer items-center justify-between gap-4 py-4 font-mincho text-[1.12rem] font-bold">{faq.question}</summary>
                <p className="pb-5 text-muted">{faq.answer}</p>
              </details>
            ))}
            <p className="mt-5 text-[.96rem] text-muted">
              Something else? <SiteLink href="/contact/" className="text-link">Send us a note</SiteLink>
              {izakaya.phone ? <> or call <a className="text-link" href={telHref()}>{izakaya.phone}</a></> : null}.
            </p>
          </div>
        </section>
      ) : null}
    </>
  );
}
