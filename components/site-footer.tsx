import { ageNotice } from '../content/drinks';
import { formatAddress, izakaya, publicLinks, telHref } from '../content/izakaya';
import { HoursList } from './hours-list';
import { SiteLink } from './site-link';
import { TimeZoneNote } from './time-zone-note';

const heading = 'mb-3 flex items-baseline gap-2 font-mincho text-[1.05rem] font-bold text-noren-dye';
const footerLink = 'font-bold underline decoration-on-indigo/40 underline-offset-[.22em] hover:decoration-on-indigo';

/** A short noren hung at the foot of the page, with the hours, address and links dyed on the cloth. */
export function SiteFooter() {
  const year = new Date().getFullYear();
  return (
    <footer className="site-footer relative bg-bg pt-3">
      <div className="noren-rod mx-auto w-[min(100%_-_1rem,var(--page))]" aria-hidden="true" />
      <div className="cloth relative mx-auto w-[min(100%_-_2rem,calc(var(--page)_-_1.5rem))] pb-6 text-on-indigo shadow-[0_18px_30px_-14px_rgba(0,0,0,.55)]">
        {/* Slits that split the cloth into panels at the top. */}
        <div className="footer-slits pointer-events-none absolute inset-x-0 top-0 h-16 max-md:hidden" aria-hidden="true" />
        <div className="grid gap-x-10 gap-y-8 px-[clamp(1.25rem,4vw,3rem)] pt-10 pb-4 md:grid-cols-3">
          <div>
            <p className="flex items-baseline gap-3">
              <span lang="ja" className="font-brush text-[2.1rem] leading-none text-noren-dye" aria-hidden="true">{izakaya.nameJa}</span>
              <span className="font-mincho text-[1.1rem] font-bold">{izakaya.name}</span>
            </p>
            <p className="mt-2 text-[.92rem] text-on-indigo-muted">{izakaya.tagline}</p>
            <address className="mt-4 leading-[1.85] not-italic">
              {formatAddress()}<br />
              <a className={footerLink} href={`mailto:${izakaya.email}`}>{izakaya.email}</a>
              {izakaya.phone ? <><br /><a className={footerLink} href={telHref()}>{izakaya.phone}</a></> : null}
            </address>
            <p className="mt-4 inline-flex items-center gap-2 rounded-ui border border-on-indigo/35 px-2.5 py-1 text-[.88rem] font-bold">
              {ageNotice(izakaya.drinkingAge)}
            </p>
          </div>
          <div>
            <h2 className={heading}><span lang="ja" aria-hidden="true">営業時間</span>Hours</h2>
            <HoursList tone="cloth" className="text-[.95rem]" />
            <TimeZoneNote className="text-on-indigo-muted" />
          </div>
          <div>
            <h2 className={heading}><span lang="ja" aria-hidden="true">ご案内</span>Around here</h2>
            <ul className="grid gap-2 font-bold [&_a]:no-underline [&_a:hover]:underline">
              <li><SiteLink href="/menu/">Menu</SiteLink></li>
              <li><SiteLink href="/sake/">Sake &amp; drinks</SiteLink></li>
              <li><SiteLink href="/#find-us">Find us</SiteLink></li>
              <li><SiteLink href="/#faq">FAQs</SiteLink></li>
              <li><SiteLink href="/contact/">Group tables &amp; private hire</SiteLink></li>
              {publicLinks.map(link => <li key={link.url}><a href={link.url} rel="me noopener">{link.label}</a></li>)}
            </ul>
          </div>
        </div>
        <p className="mx-[clamp(1.25rem,4vw,3rem)] flex flex-wrap justify-between gap-x-6 gap-y-2 border-t border-on-indigo/20 pt-4 text-[.88rem] text-on-indigo-muted">
          <span>© {year} {izakaya.name}</span>
          <span title="Made with love by jamstacks.net">with <span role="img" aria-label="love">❤️</span> <a className="no-underline hover:text-noren-dye hover:underline" href="https://jamstacks.net">jamstacks.net</a></span>
        </p>
      </div>
      <div className="flex justify-center py-6" aria-hidden="true">
        <span lang="ja" className="hanko hanko-solid hanko-square text-[1.5rem] [--hanko-size:2.9rem]">{izakaya.nameJa.slice(0, 1)}</span>
      </div>
    </footer>
  );
}
