import type { ReactNode } from 'react';
import { NorenDivider } from './section-head';

/** Heading block for inner pages: a split noren with the Japanese title, an eyebrow, the title and a lede. */
export function PageHead({ ja, eyebrow, title, children, id, before }: {
  /** Japanese title dyed on the small noren, e.g. "お品書き". */
  ja: string;
  eyebrow: string;
  title: ReactNode;
  children?: ReactNode;
  id?: string;
  /** Optional illustration beside the title. */
  before?: ReactNode;
}) {
  return (
    <header className="wrap grid items-end gap-x-10 gap-y-6 pt-[clamp(1.5rem,4vw,3rem)] pb-[clamp(1.5rem,3vw,2.5rem)] md:grid-cols-[minmax(0,1fr)_auto]">
      <div>
        <NorenDivider ja={ja} className="mb-6" />
        <p className="eyebrow text-wall-muted">{eyebrow}</p>
        <h1 id={id} className="mt-2 mb-4 max-w-[20ch] text-[clamp(2.3rem,5.6vw,3.9rem)]">{title}</h1>
        {children ? <div className="max-w-(--measure) text-[clamp(1.04rem,1.5vw,1.18rem)] text-wall-muted">{children}</div> : null}
      </div>
      {before ? <div className="max-md:hidden">{before}</div> : null}
    </header>
  );
}
