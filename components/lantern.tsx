/**
 * A red chōchin lantern. Drawn in both modes; after dark its light is on (--lantern-glow-opacity)
 * and a soft pool of red light spreads over the wall. `text` is written down the lantern, one character per line.
 */
export function Lantern({ text = 'やきとり', className = '' }: { text?: string; className?: string }) {
  const chars = [...text].slice(0, 5);
  const step = 74 / Math.max(chars.length, 1);
  return (
    <svg className={`lantern ${className}`} viewBox="0 0 100 180" aria-hidden="true" focusable="false">
      <path d="M50 0v22" stroke="var(--lantern-cap)" strokeWidth="2" />
      <g className="lantern-sway">
        <rect className="lantern__cap" x="30" y="20" width="40" height="12" rx="2" />
        <path className="lantern__body" d="M32 32h36c22 14 26 44 26 62s-4 48-26 62H32C10 142 6 112 6 94s4-48 26-62Z" />
        <ellipse className="lantern__light" cx="50" cy="94" rx="30" ry="48" />
        {[46, 60, 74, 88, 102, 116, 130, 144].map(y => (
          <path key={y} className="lantern__rib" strokeWidth="1.4" d={`M${y < 94 ? 14 - (94 - y) * .07 : 14 - (y - 94) * .07} ${y}Q50 ${y + 5} ${y < 94 ? 86 + (94 - y) * .07 : 86 + (y - 94) * .07} ${y}`} />
        ))}
        {chars.map((char, index) => (
          <text key={index} className="lantern__ink" x="50" y={58 + step * index + step / 2} fontSize={Math.min(20, step * .95)} textAnchor="middle" dominantBaseline="middle">{char}</text>
        ))}
        <rect className="lantern__cap" x="30" y="156" width="40" height="12" rx="2" />
        <path d="M44 168h12l-2 10h-8Z" className="lantern__cap" />
      </g>
    </svg>
  );
}
