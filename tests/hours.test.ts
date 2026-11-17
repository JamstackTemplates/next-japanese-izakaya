// Opening hours, last order and tonight's status line.
// The sample hours: closed Monday, 17:00–23:30 Tuesday to Thursday, 17:00–01:00 Friday and Saturday,
// 17:00–22:00 Sunday, last order 30 minutes before closing.
import assert from 'node:assert/strict';
import { test } from 'node:test';
import { DAYS, izakaya } from '../content/izakaya.ts';
import {
  closesAfterMidnight, currentNight, formatHours, formatTime, groupedHours, lastOrderTime, localNow, openState,
  statusLine, toMinutes, tonightHours, weekSummary,
} from '../lib/hours.ts';

const at = (time: string) => toMinutes(time);
const status = (day: (typeof DAYS)[number], time: string) => statusLine(openState(day, at(time)));

test('opening hours list each day once with valid times', () => {
  assert.deepEqual(izakaya.hours.map(entry => entry.day), [...DAYS], 'List Monday to Sunday once each, in order');
  for (const entry of izakaya.hours) {
    assert.equal(Boolean(entry.opens), Boolean(entry.closes), `${entry.day}: set both opens and closes, or neither`);
    if (entry.opens && entry.closes) {
      assert.match(entry.opens, /^([01]\d|2[0-3]):[0-5]\d$/, `${entry.day}.opens must be "HH:MM"`);
      assert.match(entry.closes, /^([01]\d|2[0-3]):[0-5]\d$/, `${entry.day}.closes must be "HH:MM"`);
      assert.notEqual(entry.opens, entry.closes, `${entry.day}: opens and closes can't be the same time`);
      if (closesAfterMidnight(entry)) {
        assert.ok(toMinutes(entry.closes) <= 6 * 60, `${entry.day} closes at ${entry.closes}, before it opens: that's read as after midnight, so keep it before 06:00`);
        const next = izakaya.hours[(DAYS.indexOf(entry.day) + 1) % 7];
        assert.ok(!next.opens || toMinutes(next.opens) >= toMinutes(entry.closes), `${entry.day}'s late night runs into ${next.day}'s opening`);
      }
      const open = toMinutes(entry.closes) + (closesAfterMidnight(entry) ? 1440 : 0) - toMinutes(entry.opens);
      assert.ok(open > izakaya.lastOrderMinutes, `${entry.day}: last order would come before opening`);
    }
  }
});

test('times, hours and last order read naturally', () => {
  assert.equal(formatTime('17:00'), '5pm');
  assert.equal(formatTime('23:30'), '11:30pm');
  assert.equal(formatTime('00:00'), 'midnight');
  assert.equal(formatTime('00:30'), '12:30am');
  assert.equal(formatTime('01:00'), '1am');
  assert.equal(formatHours({ day: 'Friday', opens: '17:00', closes: '01:00' }), '5pm – 1am');
  assert.equal(formatHours({ day: 'Monday' }), 'Closed');
  assert.equal(lastOrderTime({ day: 'Tuesday', opens: '17:00', closes: '23:30' }), '23:00');
  assert.equal(lastOrderTime({ day: 'Friday', opens: '17:00', closes: '01:00' }), '00:30');
  assert.equal(lastOrderTime({ day: 'Monday' }), undefined);
  assert.ok(closesAfterMidnight({ day: 'Friday', opens: '17:00', closes: '01:00' }));
  assert.ok(!closesAfterMidnight({ day: 'Sunday', opens: '17:00', closes: '22:00' }));
});

test('the week groups with last order, and the static summary claims nothing about now', () => {
  assert.deepEqual(groupedHours(), [
    { label: 'Monday', hours: 'Closed', lastOrder: '', late: false, closed: true },
    { label: 'Tue – Thu', hours: '5pm – 11:30pm', lastOrder: '11pm', late: false, closed: false },
    { label: 'Fri – Sat', hours: '5pm – 1am', lastOrder: '12:30am', late: true, closed: false },
    { label: 'Sunday', hours: '5pm – 10pm', lastOrder: '9:30pm', late: false, closed: false },
  ]);
  assert.equal(weekSummary(), 'Open Tuesday to Sunday from 5pm');
  assert.doesNotMatch(weekSummary(), /now|closed/i);
});

test('before opening it is closed and opens later today', () => {
  const state = openState('Tuesday', at('15:00'));
  assert.deepEqual(state, { open: false, closedToday: false, next: { day: 'Tuesday', opens: '17:00', inDays: 0 } });
  assert.equal(statusLine(state), 'Closed now · open today from 5pm');
});

test('during service it shows last order', () => {
  const state = openState('Wednesday', at('19:00'));
  assert.ok(state.open);
  assert.equal(state.lastOrder, '23:00');
  assert.equal(statusLine(state), 'Open · last order 11pm');
  assert.equal(tonightHours('Wednesday'), 'Tonight 5pm – 11:30pm · last order 11pm');
});

test('the last-order window counts down, then last order passes before close', () => {
  assert.equal(status('Wednesday', '22:29'), 'Open · last order 11pm');
  assert.equal(status('Wednesday', '22:30'), 'Last order in 30 minutes');
  assert.equal(status('Wednesday', '22:31'), 'Last order in 29 minutes');
  assert.equal(status('Wednesday', '22:40'), 'Last order in 20 minutes');
  assert.equal(status('Wednesday', '22:59'), 'Last order in a minute');
  assert.equal(status('Wednesday', '23:00'), 'Last order has passed · open until 11:30pm');
  assert.equal(status('Wednesday', '23:29'), 'Last order has passed · open until 11:30pm');
  assert.equal(status('Wednesday', '23:30'), 'Closed · open tomorrow from 5pm');
});

test('a late night runs past midnight: 12:15am Saturday is still Friday night', () => {
  assert.equal(status('Friday', '21:00'), 'Open until 1am tonight');
  const state = openState('Saturday', at('00:15'));
  assert.ok(state.open && state.night === 'Friday' && state.late);
  assert.equal(statusLine(state), 'Last order in 15 minutes');
  assert.equal(currentNight('Saturday', state), 'Friday');
  assert.equal(tonightHours(currentNight('Saturday', state)), 'Tonight 5pm – 1am · last order 12:30am');
  assert.equal(status('Saturday', '00:45'), 'Last order has passed · open until 1am');
  assert.equal(status('Saturday', '01:00'), 'Closed now · open today from 5pm');
  // Saturday's late night carries into Sunday morning too.
  assert.ok(openState('Sunday', at('00:30')).open);
});

test('Sunday closes earlier', () => {
  assert.equal(status('Sunday', '20:00'), 'Open · last order 9:30pm');
  assert.equal(status('Sunday', '21:45'), 'Last order has passed · open until 10pm');
  assert.equal(tonightHours('Sunday'), 'Tonight 5pm – 10pm · last order 9:30pm');
});

test('the closed Monday, and the next opening across it', () => {
  // After Sunday's close, Monday is skipped.
  assert.deepEqual(openState('Sunday', at('22:00')), { open: false, closedToday: false, next: { day: 'Tuesday', opens: '17:00', inDays: 2 } });
  assert.equal(status('Sunday', '22:30'), 'Closed · open Tuesday from 5pm');
  // All of Monday, including just after midnight (Sunday wasn't a late night).
  for (const time of ['00:30', '12:00', '19:00', '23:59']) assert.equal(status('Monday', time), 'Closed today · open Tuesday from 5pm', time);
  assert.equal(tonightHours('Monday'), 'Closed tonight');
});

test('the next opening wraps around the week, and no hours means no claim', () => {
  const onlyTuesday = [{ day: 'Tuesday' as const, opens: '17:00', closes: '23:00' }];
  assert.deepEqual(openState('Tuesday', at('23:30'), onlyTuesday), { open: false, closedToday: false, next: { day: 'Tuesday', opens: '17:00', inDays: 7 } });
  assert.deepEqual(openState('Monday', 600, []), { open: false, closedToday: true });
  assert.equal(statusLine({ open: false, closedToday: true }), 'Closed');
});

test('the local clock reads the izakaya’s time zone, not the visitor’s', () => {
  // 08:15 UTC on Saturday 2026-01-17 is 00:15 Saturday in Seattle (UTC−8 in winter).
  assert.deepEqual(localNow('America/Los_Angeles', new Date('2026-01-17T08:15:00Z')), { day: 'Saturday', minutes: 15 });
  // In summer (UTC−7), 06:59 UTC Saturday is still 23:59 Friday.
  assert.deepEqual(localNow('America/Los_Angeles', new Date('2026-07-18T06:59:00Z')), { day: 'Friday', minutes: 23 * 60 + 59 });
});
