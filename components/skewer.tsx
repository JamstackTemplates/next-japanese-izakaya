import type { Piece, Seasoning } from '../content/menu';
import { describeSkewer, layoutSkewer, type Shape } from '../lib/skewer';

function ShapeEl({ shape, x, className }: { shape: Shape; x: number; className: string }) {
  switch (shape.el) {
    case 'ellipse': return <ellipse className={className} cx={x + shape.cx} cy={shape.cy} rx={shape.rx} ry={shape.ry} />;
    case 'rect': return <rect className={className} x={x + shape.x} y={shape.y} width={shape.width} height={shape.height} rx={shape.rx} />;
    case 'path': return <path className={className} d={shape.d} transform={`translate(${x} 0)`} />;
  }
}

/**
 * A yakitori or kushiyaki skewer drawn piece by piece on a bamboo stick, glazed for tare or
 * sparkling with salt for shio. New skewers need no images: list their pieces in content/menu.ts.
 */
export function SkewerArt({ pieces, seasoning, className = '' }: { pieces: Piece[]; seasoning: Seasoning; className?: string }) {
  const layout = layoutSkewer(pieces, seasoning);
  const { stick } = layout;
  return (
    <svg className={`skewer ${className}`} viewBox={`0 0 ${layout.width} ${layout.height}`} role="img" aria-label={describeSkewer(pieces, seasoning)}>
      <line className="skewer__stick" x1={stick.x1 + 2} y1={stick.y} x2={layout.handleX} y2={stick.y} />
      <path className="skewer__handle" d={`M${layout.handleX} ${stick.y - 3.2}h${layout.width - layout.handleX - 3}q2.5 3.2 0 6.4H${layout.handleX}Z`} />
      <path className="skewer__stick" d={`M${stick.x1} ${stick.y}l3 -.6v1.2Z`} />
      {layout.pieces.map((item, index) => (
        <g key={index}>
          {item.art.shapes.map((shape, i) => <ShapeEl key={i} shape={shape} x={item.x} className={`sk-${shape.tone}`} />)}
          {/* A little char from the grill. */}
          <ellipse className="skewer__char" cx={item.x + (index % 2 ? 2 : -2)} cy={index % 2 ? 26 : 14} rx={item.art.width * .14} ry="1.3" />
        </g>
      ))}
      {layout.glazed ? (
        <g>
          {layout.pieces.map((item, index) => item.art.shapes.filter(shape => shape.el !== 'path' || !shape.tone.endsWith('dark')).slice(0, 1).map((shape, i) => (
            <ShapeEl key={`${index}-${i}`} shape={shape} x={item.x} className="skewer__glaze" />
          )))}
          {layout.pieces.map((item, index) => (
            <path key={`g${index}`} className="skewer__gloss" d={`M${item.x - item.art.width * .25} 13q${item.art.width * .2} -2.5 ${item.art.width * .4} -1`} />
          ))}
        </g>
      ) : null}
      {layout.sparkles.map((dot, index) => <circle key={index} className="skewer__salt" cx={dot.x} cy={dot.y} r={index % 3 === 0 ? 1.1 : .75} />)}
    </svg>
  );
}
