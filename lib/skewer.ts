// Skewers drawn from their pieces. Pure geometry, so it's unit tested; components/skewer.tsx turns
// the shapes into SVG. Colours come from CSS tokens (the `tone` names map to `.sk-<tone>` classes in
// app/tailwind.input.css), so the drawings change with light and dark mode.
//
// To add a new piece: add it to the `Piece` type in content/menu.ts and give it an entry in PIECES
// below. The tests fail until every piece has a drawing.
import type { Piece, Seasoning } from '../content/menu.ts';

export type Tone =
  | 'meat' | 'meat-dark' | 'negi' | 'negi-core' | 'tsukune' | 'skin' | 'skin-fold' | 'heart' | 'heart-fat'
  | 'shiitake' | 'shiitake-cut' | 'shishito' | 'shishito-stem' | 'fat' | 'asparagus' | 'egg';

export type Shape =
  | { el: 'ellipse'; cx: number; cy: number; rx: number; ry: number; tone: Tone }
  | { el: 'rect'; x: number; y: number; width: number; height: number; rx: number; tone: Tone }
  | { el: 'path'; d: string; tone: Tone };

/** Height of the drawing; the stick runs along the middle. */
export const SKEWER_HEIGHT = 40;
const MID = SKEWER_HEIGHT / 2;

export interface PieceArt {
  /** Plain English for the drawing's accessible label. */
  label: string;
  /** Width the piece takes on the stick. */
  width: number;
  /** Shapes centred on x = 0, in the 0–40 vertical space. */
  shapes: Shape[];
}

const r = (x: number, y: number, width: number, height: number, rx: number, tone: Tone): Shape => ({ el: 'rect', x, y, width, height, rx, tone });
const e = (cx: number, cy: number, rx: number, ry: number, tone: Tone): Shape => ({ el: 'ellipse', cx, cy, rx, ry, tone });
const p = (d: string, tone: Tone): Shape => ({ el: 'path', d, tone });

export const PIECES: Record<Piece, PieceArt> = {
  thigh: {
    label: 'chicken thigh',
    width: 16,
    shapes: [
      p('M-7.5 14C-8 8-3 4.5 1 5c5 .5 7.5 4 7 9 .6 5 1 9-1 12.5C5 32-2 35.5-6 33-9 30-8.5 21-7.5 14Z', 'meat'),
      p('M-3 10c2-1 4-1 6 0M-4.5 27c2 1 5 1.5 7.5.5', 'meat-dark'),
    ],
  },
  negi: {
    label: 'negi (scallion)',
    width: 9,
    shapes: [r(-4.5, 8, 9, 24, 3, 'negi'), r(-1.6, 9, 3.2, 22, 1.5, 'negi-core')],
  },
  tsukune: {
    label: 'tsukune (chicken meatball)',
    width: 17,
    shapes: [e(0, MID, 8.5, 9.5, 'tsukune'), p('M-5 14c1.5-2 4-3 7-2.5', 'meat-dark')],
  },
  skin: {
    label: 'chicken skin',
    width: 12,
    shapes: [
      p('M-5.5 9c3-2 8-2 11 0 1 4-1 6 0 10s1.5 7-.5 11c-3 2-7.5 2-10.5 0-1.5-4 .5-7-.5-11S-6.5 12-5.5 9Z', 'skin'),
      p('M-4 15c2.5 1 5.5 1 8 0M-4 23c2.5 1 5.5 1 8 0', 'skin-fold'),
    ],
  },
  heart: {
    label: 'chicken heart',
    width: 11,
    shapes: [p('M-5 13c0-3 2.5-4.5 5-4.5S5 10 5 13c0 6-2 12-5 16-3-4-5-10-5-16Z', 'heart'), r(-4.5, 10, 9, 3, 1.5, 'heart-fat')],
  },
  shiitake: {
    label: 'shiitake mushroom',
    width: 18,
    shapes: [e(0, MID, 8.5, 10, 'shiitake'), p('M-4.5 14q4.5-3.5 9 0M-5 21q5 3 10 0', 'shiitake-cut')],
  },
  shishito: {
    label: 'shishito pepper',
    width: 10,
    shapes: [p('M-3.8 9c1.5-1.5 6-1.5 7.4 0 1 6 0 15-1.5 21.5C1 33-1 33-2 30.5-3.8 24-4.8 15-3.8 9Z', 'shishito'), r(-2, 4.5, 4, 5, 1.5, 'shishito-stem')],
  },
  'pork-belly': {
    label: 'pork belly',
    width: 14,
    shapes: [r(-6.5, 8, 13, 24, 2.5, 'meat'), r(-6.5, 13, 13, 3, 1, 'fat'), r(-6.5, 20, 13, 2.5, 1, 'fat'), r(-6.5, 27, 13, 2.5, 1, 'fat')],
  },
  'asparagus-pork': {
    label: 'asparagus wrapped in pork',
    width: 14,
    shapes: [r(-3, 3, 6, 34, 3, 'asparagus'), r(-6.5, 11, 13, 18, 3, 'meat'), r(-6.5, 16, 13, 2.5, 1, 'fat'), r(-6.5, 23, 13, 2, 1, 'fat')],
  },
  'quail-egg': {
    label: 'quail egg',
    width: 12,
    shapes: [e(0, MID, 5.5, 7, 'egg')],
  },
};

/** Gap between pieces on the stick. */
const GAP = 1.5;
/** Pointed tip before the first piece, and bamboo handle after the last. */
const TIP = 7;
const HANDLE = 20;

export interface SkewerLayout {
  width: number;
  height: number;
  /** The bamboo stick, left (tip) to right (handle end). */
  stick: { x1: number; x2: number; y: number };
  /** Where the handle starts (the flat, wider grip). */
  handleX: number;
  pieces: { piece: Piece; x: number; art: PieceArt }[];
  /** Salt sparkles for shio, as small dots. Empty for tare. */
  sparkles: { x: number; y: number }[];
  /** Tare glaze is painted over the pieces. */
  glazed: boolean;
}

/** Lays the pieces out from the tip of the stick to the handle. */
export function layoutSkewer(pieces: Piece[], seasoning: Seasoning): SkewerLayout {
  let x = TIP;
  const placed = pieces.map((piece, index) => {
    const art = PIECES[piece];
    const centre = x + art.width / 2;
    x += art.width + (index < pieces.length - 1 ? GAP : 0);
    return { piece, x: centre, art };
  });
  const handleX = x + 4;
  const width = handleX + HANDLE;
  // Deterministic sparkle positions, a few per piece, so builds are stable.
  const sparkles = seasoning === 'tare' ? [] : placed.flatMap((item, i) => [
    { x: item.x - item.art.width * .22, y: 12 + (i % 3) * 2 },
    { x: item.x + item.art.width * .18, y: 23 + (i % 2) * 3 },
    { x: item.x + (i % 2 ? -1 : 1.5), y: 17 + (i % 4) },
  ]);
  return { width, height: SKEWER_HEIGHT, stick: { x1: 1, x2: width - 1, y: MID }, handleX, pieces: placed, sparkles, glazed: seasoning === 'tare' };
}

/** "chicken thigh, negi (scallion) and chicken thigh, with salt" for the drawing's accessible label. */
export function describeSkewer(pieces: Piece[], seasoning: Seasoning): string {
  const names = pieces.map(piece => PIECES[piece].label);
  const list = names.length > 1 ? `${names.slice(0, -1).join(', ')} and ${names.at(-1)}` : names[0] ?? '';
  const how = seasoning === 'shio' ? 'with salt' : seasoning === 'tare' ? 'glazed with tare' : 'with salt or tare';
  return `A skewer of ${list}, ${how}`;
}
