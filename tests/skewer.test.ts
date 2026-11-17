// Skewers are drawn from their pieces: every piece needs a drawing, and every skewer lays out cleanly.
import assert from 'node:assert/strict';
import { test } from 'node:test';
import { allItems, type Piece } from '../content/menu.ts';
import { describeSkewer, layoutSkewer, PIECES, SKEWER_HEIGHT } from '../lib/skewer.ts';

const numbers = (shape: object) => Object.entries(shape).filter(([key]) => !['el', 'tone', 'd'].includes(key)).map(([, value]) => value as number);

test('every piece kind renders as at least one well-formed shape', () => {
  for (const [piece, art] of Object.entries(PIECES)) {
    assert.ok(art.label.trim(), `${piece} needs a label`);
    assert.ok(art.width > 0, `${piece} needs a width`);
    assert.ok(art.shapes.length >= 1, `${piece} has no shapes to draw`);
    for (const shape of art.shapes) {
      for (const value of numbers(shape)) assert.ok(Number.isFinite(value), `${piece} has a non-numeric ${shape.el} attribute`);
      if (shape.el === 'path') assert.match(shape.d, /^M[-\d.]/, `${piece} path must start with a move`);
      if (shape.el === 'ellipse') assert.ok(Math.abs(shape.cx) + shape.rx <= art.width / 2 + 1, `${piece} ellipse is wider than the piece`);
      if (shape.el === 'rect') {
        assert.ok(shape.y >= 0 && shape.y + shape.height <= SKEWER_HEIGHT, `${piece} rect leaves the drawing`);
        assert.ok(shape.x >= -art.width / 2 - 1 && shape.x + shape.width <= art.width / 2 + 1, `${piece} rect is wider than the piece`);
      }
    }
  }
});

test('every piece used on the menu has a drawing, and every skewer has 2–6 pieces', () => {
  for (const item of allItems.filter(candidate => candidate.skewer)) {
    const { pieces, seasoning } = item.skewer!;
    assert.ok(pieces.length >= 2 && pieces.length <= 6, `${item.id} needs 2–6 pieces (it has ${pieces.length})`);
    for (const piece of pieces) assert.ok(piece in PIECES, `${item.id} uses "${piece}", which has no drawing in lib/skewer.ts`);
    const layout = layoutSkewer(pieces, seasoning);
    assert.equal(layout.pieces.length, pieces.length, `${item.id}: every piece is drawn`);
    for (let i = 1; i < layout.pieces.length; i++) {
      const before = layout.pieces[i - 1], after = layout.pieces[i];
      assert.ok(after.x - after.art.width / 2 >= before.x + before.art.width / 2, `${item.id}: pieces ${i} and ${i + 1} overlap`);
    }
    assert.ok(layout.handleX < layout.width && layout.stick.x2 <= layout.width, `${item.id}: the handle fits`);
  }
});

test('tare is glazed, shio sparkles with salt', () => {
  const pieces: Piece[] = ['thigh', 'negi', 'thigh'];
  const tare = layoutSkewer(pieces, 'tare');
  const shio = layoutSkewer(pieces, 'shio');
  assert.ok(tare.glazed && tare.sparkles.length === 0);
  assert.ok(!shio.glazed && shio.sparkles.length >= pieces.length);
  assert.equal(describeSkewer(pieces, 'shio'), 'A skewer of chicken thigh, negi (scallion) and chicken thigh, with salt');
  assert.match(describeSkewer(['tsukune', 'tsukune'], 'tare'), /glazed with tare$/);
});
