import { groupedHours } from '../lib/hours';

/** The week's hours with last order. `tone` picks colours for paper or the indigo footer. */
export function HoursList({ tone = 'paper', className = '' }: { tone?: 'paper' | 'cloth'; className?: string }) {
  const rule = tone === 'cloth' ? 'border-on-indigo/20' : 'border-line';
  const soft = tone === 'cloth' ? 'text-on-indigo-muted' : 'text-muted';
  return (
    <dl className={`grid ${className}`}>
      {groupedHours().map(group => (
        <div key={group.label} className={`grid grid-cols-[minmax(6.5rem,auto)_1fr] gap-x-4 border-b border-dashed py-2 ${rule}`}>
          <dt className="font-bold">{group.label}</dt>
          <dd className="tabular text-right">
            {group.hours}
            {group.lastOrder ? <span className={`block text-[.85rem] ${soft}`}>last order {group.lastOrder}{group.late ? ' · late night' : ''}</span> : null}
          </dd>
        </div>
      ))}
    </dl>
  );
}
