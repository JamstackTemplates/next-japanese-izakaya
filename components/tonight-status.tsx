'use client';

import { currentNight, LAST_ORDER_WARNING_MINUTES, statusLine, tonightHours, weekSummary } from '../lib/hours';
import { useIzakayaNow } from './izakaya-clock';

/**
 * "Open · last order 11pm" / "Last order in 20 minutes" / "Closed today · open Tuesday from 5pm",
 * with a status dot. The static HTML shows the week's summary, which never claims open or closed.
 */
export function TonightStatus({ className = '' }: { className?: string }) {
  const now = useIzakayaNow();
  const lastOrder = now?.state.open && now.state.minutesToLastOrder <= LAST_ORDER_WARNING_MINUTES;
  return (
    <span className={`inline-flex items-baseline gap-2.5 ${className}`}
      data-open={now ? String(now.state.open) : undefined} data-last-order={lastOrder ? 'true' : undefined}>
      <span className="status-dot -translate-y-[.12em]" aria-hidden="true" />
      <span role="status">{now ? statusLine(now.state) : weekSummary()}</span>
    </span>
  );
}

/** "Tonight 5pm – 1am · last order 12:30am" in the browser; `fallback` in the static HTML. */
export function TonightHours({ fallback, className = '' }: { fallback: string; className?: string }) {
  const now = useIzakayaNow();
  return <span className={className}>{now ? tonightHours(currentNight(now.day, now.state)) : fallback}</span>;
}
