/** A small charcoal grill with skewers resting across it and smoke rising. Decorative. */
export function Robata({ className = '' }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 220 190" aria-hidden="true" focusable="false">
      <g className="robata__smoke">
        <path d="M70 92c-10-14 10-22 0-38s8-24 2-36" />
        <path d="M110 90c-8-14 12-24 2-40s6-22 0-34" />
        <path d="M150 92c-10-12 8-22-2-36s8-24 2-36" />
      </g>
      <ellipse className="robata__glow" cx="110" cy="112" rx="88" ry="16" />
      <rect className="robata__edge" x="18" y="104" width="184" height="10" rx="3" />
      {[0, 1, 2, 3, 4, 5, 6, 7, 8].map(i => <rect key={i} className="robata__ember" x={32 + i * 18} y="107" width="12" height="5" rx="2.5" opacity={.6 + (i % 3) * .15} />)}
      {[56, 92, 128, 164].map(x => (
        <g key={x}>
          <line x1={x - 44} y1="102" x2={x + 34} y2="102" stroke="var(--stick)" strokeWidth="2.5" strokeLinecap="round" />
          {[0, 1, 2, 3].map(i => <ellipse key={i} className={i % 2 ? 'sk-negi' : 'sk-meat'} cx={x - 30 + i * 13} cy="102" rx={i % 2 ? 4.5 : 6} ry="7" />)}
        </g>
      ))}
      <path className="robata__body" d="M14 114h192l-14 50H28Z" />
      <rect className="robata__edge" x="40" y="128" width="140" height="18" rx="2" />
      {[0, 1, 2, 3, 4].map(i => <rect key={i} className="robata__body" x={52 + i * 26} y="132" width="14" height="10" rx="1.5" />)}
      <rect className="robata__edge" x="34" y="164" width="12" height="18" />
      <rect className="robata__edge" x="174" y="164" width="12" height="18" />
    </svg>
  );
}
