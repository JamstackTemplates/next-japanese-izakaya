import type { Metadata } from 'next';
import { PageHead } from '../components/page-head';
import { SiteLink } from '../components/site-link';

export const metadata: Metadata = {
  title: 'Page not found',
  robots: { index: false },
};

/** An empty nail on the rail where a tag used to hang. */
function EmptyHook() {
  return (
    <div className="relative mx-auto w-40 pt-2" aria-hidden="true">
      <div className="h-[13px] bg-[linear-gradient(180deg,var(--rail-top),var(--rail)_75%)] shadow-[0_4px_6px_-2px_rgba(0,0,0,.35)]" />
      <div className="mx-auto mt-3 h-[13rem] w-[4.4rem] rounded-[3px] border-2 border-dashed border-wall-muted/40" />
    </div>
  );
}

export default function NotFound() {
  return (
    <section className="pb-(--space-section)" aria-labelledby="not-found-title">
      <PageHead id="not-found-title" ja="迷子" eyebrow="404" title="This tag has been taken down…" before={<EmptyHook />}>
        <p>The page may have moved, or the link may be out of date. Try one of these instead:</p>
      </PageHead>
      <ul className="wrap flex flex-wrap gap-x-6 gap-y-3 text-[1.1rem]">
        <li><SiteLink href="/" className="text-link">Home</SiteLink></li>
        <li><SiteLink href="/menu/" className="text-link">The menu</SiteLink></li>
        <li><SiteLink href="/sake/" className="text-link">Sake</SiteLink></li>
        <li><SiteLink href="/#find-us" className="text-link">Hours &amp; directions</SiteLink></li>
      </ul>
    </section>
  );
}
