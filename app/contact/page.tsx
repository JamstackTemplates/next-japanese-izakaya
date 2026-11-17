import type { Metadata } from 'next';
import { CopyEmail } from '../../components/copy-email';
import { Hanko } from '../../components/hanko';
import { JamstacksSupportForm } from '../../components/jamstacks-support-form';
import { PageHead } from '../../components/page-head';
import { izakaya, telHref } from '../../content/izakaya';
import { absoluteUrl } from '../../lib/paths';
import { jamstacks } from '../../lib/site';

export const metadata: Metadata = {
  title: 'Group tables, omakase evenings & private hire',
  description: `Enquiries for group tables, omakase evenings at the counter and private hire at ${izakaya.name}.`,
  alternates: { canonical: absoluteUrl('/contact/') },
};

const subhead = 'mb-1 font-mincho text-[1.2rem] font-bold';
const tips = [
  'The date and time you have in mind',
  'How many guests',
  'Counter or table',
  'Whether you’d like an omakase evening',
  'Any allergies or dietary needs',
];

export default function ContactPage() {
  const hosted = Boolean(jamstacks.site && jamstacks.embedUrl);
  return (
    <>
      <PageHead ja="お問い合わせ" eyebrow="Contact" title="Group tables, omakase evenings & private hire">
        <p>
          The counter is walk-in only: just come by. For six or more, a chef’s-choice omakase evening at the counter, or the
          whole room for a private night, send us an enquiry. It’s a request, not a booking: nothing is reserved until we
          reply to confirm, usually within a day.
        </p>
      </PageHead>

      <div className="wrap grid items-start gap-[clamp(1.5rem,5vw,4rem)] pt-[clamp(1rem,3vw,2rem)] pb-(--space-section) lg:grid-cols-[minmax(0,1.6fr)_minmax(0,1fr)]">
        <section className="print:hidden" aria-label="Enquiry form">
          {hosted ? (
            <JamstacksSupportForm siteId={jamstacks.site} embedUrl={jamstacks.embedUrl} email={izakaya.email} />
          ) : (
            <div className="washi grid justify-items-start gap-4">
              <Hanko text="宴会" size="3.2rem" />
              <h2 className="text-[clamp(1.6rem,3vw,2.1rem)]">Write to us directly</h2>
              <p className="max-w-[34rem] text-muted">
                Email is the best way to reach us. Tell us the date, how many of you there are and what you have in mind,
                and we’ll reply with what’s possible.
              </p>
              <p><a className="button" href={`mailto:${izakaya.email}?subject=${encodeURIComponent('Group table enquiry')}`}>Email {izakaya.name}</a></p>
            </div>
          )}
        </section>

        <aside className="washi washi-plain grid gap-1.5" aria-labelledby="direct-title">
          <h2 id="direct-title" className={subhead}>Email</h2>
          <p className="text-[1.15rem] wrap-anywhere"><a className="text-link" href={`mailto:${izakaya.email}`}>{izakaya.email}</a></p>
          <p className="flex min-h-px flex-wrap items-center gap-x-4 gap-y-2"><CopyEmail email={izakaya.email} /></p>

          {izakaya.phone ? (
            <>
              <h2 className={`mt-4 ${subhead}`}>Phone</h2>
              <p><a className="text-link" href={telHref()}>{izakaya.phone}</a></p>
            </>
          ) : null}

          <h2 className={`mt-4 ${subhead}`}>Useful to include</h2>
          <ul className="grid gap-2 text-muted">
            {tips.map(tip => (
              <li key={tip} className="relative pl-6 before:absolute before:top-[.55em] before:left-0.5 before:size-2 before:rounded-full before:bg-shu">{tip}</li>
            ))}
          </ul>
          <p className="mt-4 text-[.92rem] text-muted">
            Walk-ins: {izakaya.seating.counterSeats} counter seats and {izakaya.seating.tables} tables for up to {izakaya.seating.maxWalkInParty}. {izakaya.seating.walkIns}
          </p>
        </aside>
      </div>
    </>
  );
}
