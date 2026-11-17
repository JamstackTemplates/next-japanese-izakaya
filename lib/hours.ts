// Opening hours, last order and tonight's status line.
// Everything here is pure (no clocks), so it's unit tested; the browser supplies the current local
// day and time in the izakaya's time zone (see components/izakaya-clock.tsx).
import { DAYS, izakaya, type Day, type OpeningHours } from '../content/izakaya.ts';

const MINUTES_PER_DAY = 24 * 60;

/** Minutes before last order when the status starts counting down. */
export const LAST_ORDER_WARNING_MINUTES = 30;

/** Minutes after midnight for "HH:MM". */
export function toMinutes(value: string): number {
  const [h, m] = value.split(':').map(Number);
  return h * 60 + m;
}

/** "HH:MM" for minutes after midnight, wrapping past 24 hours. */
export function fromMinutes(minutes: number): string {
  const wrapped = ((minutes % MINUTES_PER_DAY) + MINUTES_PER_DAY) % MINUTES_PER_DAY;
  return `${String(Math.floor(wrapped / 60)).padStart(2, '0')}:${String(wrapped % 60).padStart(2, '0')}`;
}

/** True when the day's closing time is after midnight (opens 17:00, closes 01:00). */
export function closesAfterMidnight(entry: OpeningHours): boolean {
  return Boolean(entry.opens && entry.closes && toMinutes(entry.closes) <= toMinutes(entry.opens));
}

/** "17:00" → "5pm", "23:30" → "11:30pm", "00:00" → "midnight", "00:30" → "12:30am". */
export function formatTime(value: string): string {
  const [h, m] = value.split(':').map(Number);
  if (h === 0 && m === 0) return 'midnight';
  if (h === 12 && m === 0) return 'noon';
  const suffix = h >= 12 ? 'pm' : 'am';
  const hour = h % 12 === 0 ? 12 : h % 12;
  return m ? `${hour}:${String(m).padStart(2, '0')}${suffix}` : `${hour}${suffix}`;
}

/** Last order, "HH:MM": `lastOrderMinutes` before closing (Friday 01:00 → "00:30"). */
export function lastOrderTime(entry: OpeningHours, lastOrderMinutes = izakaya.lastOrderMinutes): string | undefined {
  if (!entry.opens || !entry.closes) return undefined;
  return fromMinutes(toMinutes(entry.closes) - lastOrderMinutes);
}

/** "5pm – 11:30pm" or "Closed". */
export function formatHours(entry: OpeningHours): string {
  return entry.opens && entry.closes ? `${formatTime(entry.opens)} – ${formatTime(entry.closes)}` : 'Closed';
}

export interface HoursGroup {
  /** "Tue – Thu", "Sunday". */
  label: string;
  /** "5pm – 11:30pm" or "Closed". */
  hours: string;
  /** "11pm", or '' when closed. */
  lastOrder: string;
  /** Closes after midnight. */
  late: boolean;
  closed: boolean;
}

/** Consecutive days with the same hours, Monday first. */
export function groupedHours(hours: OpeningHours[] = izakaya.hours, lastOrderMinutes = izakaya.lastOrderMinutes): HoursGroup[] {
  const groups: { days: Day[]; entry: OpeningHours }[] = [];
  for (const entry of hours) {
    const last = groups.at(-1);
    if (last && formatHours(last.entry) === formatHours(entry)) last.days.push(entry.day);
    else groups.push({ days: [entry.day], entry });
  }
  const short = (day: Day) => day.slice(0, 3);
  return groups.map(group => {
    const lastOrder = lastOrderTime(group.entry, lastOrderMinutes);
    return {
      label: group.days.length === 1 ? group.days[0] : `${short(group.days[0])} – ${short(group.days.at(-1)!)}`,
      hours: formatHours(group.entry),
      lastOrder: lastOrder ? formatTime(lastOrder) : '',
      late: closesAfterMidnight(group.entry),
      closed: !group.entry.opens,
    };
  });
}

export type OpenState =
  | {
      open: true;
      /** Closing time, "HH:MM". */
      closes: string;
      /** Last order, "HH:MM". */
      lastOrder: string;
      /** The day whose hours we're in: 12:30am Saturday is still Friday night. */
      night: Day;
      /** Closing time falls after midnight. */
      late: boolean;
      /** Minutes until closing. */
      minutesLeft: number;
      /** Minutes until last order; zero or less once last order has passed. */
      minutesToLastOrder: number;
    }
  | {
      open: false;
      /** Today has no hours at all (e.g. closed Mondays). */
      closedToday: boolean;
      /** Next opening, or undefined when no day has hours. `inDays` is 0 for later today. */
      next?: { day: Day; opens: string; inDays: number };
    };

function entryFor(day: Day, hours: OpeningHours[]): OpeningHours | undefined {
  return hours.find(entry => entry.day === day);
}

function previousDay(day: Day): Day {
  return DAYS[(DAYS.indexOf(day) + 6) % 7];
}

/**
 * Whether the izakaya is open at a local day and time (minutes after midnight).
 * Handles late nights: when Friday closes at 01:00, 12:30am Saturday is still Friday night.
 */
export function openState(day: Day, minutes: number, hours: OpeningHours[] = izakaya.hours, lastOrderMinutes = izakaya.lastOrderMinutes): OpenState {
  const openOn = (entry: OpeningHours, minutesLeft: number) => ({
    open: true as const,
    closes: entry.closes!,
    lastOrder: lastOrderTime(entry, lastOrderMinutes)!,
    night: entry.day,
    late: closesAfterMidnight(entry),
    minutesLeft,
    minutesToLastOrder: minutesLeft - lastOrderMinutes,
  });

  // Still open from last night?
  const yesterday = entryFor(previousDay(day), hours);
  if (yesterday && closesAfterMidnight(yesterday) && minutes < toMinutes(yesterday.closes!)) {
    return openOn(yesterday, toMinutes(yesterday.closes!) - minutes);
  }
  const today = entryFor(day, hours);
  if (today?.opens && today.closes && minutes >= toMinutes(today.opens)) {
    const close = toMinutes(today.closes) + (closesAfterMidnight(today) ? MINUTES_PER_DAY : 0);
    if (minutes < close) return openOn(today, close - minutes);
  }
  const closedToday = !today?.opens;
  const start = DAYS.indexOf(day);
  for (let inDays = 0; inDays < 8; inDays++) {
    const candidate = DAYS[(start + inDays) % 7];
    const entry = entryFor(candidate, hours);
    if (!entry?.opens || !entry.closes) continue;
    if (inDays === 0 && minutes >= toMinutes(entry.opens)) continue;
    return { open: false, closedToday, next: { day: candidate, opens: entry.opens, inDays } };
  }
  return { open: false, closedToday };
}

function minutesText(minutes: number): string {
  return minutes <= 1 ? 'a minute' : `${minutes} minutes`;
}

/**
 * Tonight's status:
 * - "Open · last order 11pm"
 * - "Open until 1am tonight" (a late night)
 * - "Last order in 20 minutes"
 * - "Last order has passed · open until 11:30pm"
 * - "Closed now · open today from 5pm", "Closed · open tomorrow from 5pm"
 * - "Closed today · open Tuesday from 5pm"
 */
export function statusLine(state: OpenState): string {
  if (state.open) {
    if (state.minutesToLastOrder <= 0) return `Last order has passed · open until ${formatTime(state.closes)}`;
    if (state.minutesToLastOrder <= LAST_ORDER_WARNING_MINUTES) return `Last order in ${minutesText(state.minutesToLastOrder)}`;
    if (state.late) return `Open until ${formatTime(state.closes)} tonight`;
    return `Open · last order ${formatTime(state.lastOrder)}`;
  }
  if (!state.next) return 'Closed';
  const from = `from ${formatTime(state.next.opens)}`;
  if (state.closedToday) return `Closed today · open ${state.next.day} ${from}`;
  if (state.next.inDays === 0) return `Closed now · open today ${from}`;
  if (state.next.inDays === 1) return `Closed · open tomorrow ${from}`;
  return `Closed · open ${state.next.day} ${from}`;
}

/** "Tonight 5pm – 1am · last order 12:30am", or "Closed tonight" for a day with no hours. */
export function tonightHours(day: Day, hours: OpeningHours[] = izakaya.hours, lastOrderMinutes = izakaya.lastOrderMinutes): string {
  const entry = entryFor(day, hours);
  if (!entry?.opens || !entry.closes) return 'Closed tonight';
  return `Tonight ${formatHours(entry)} · last order ${formatTime(lastOrderTime(entry, lastOrderMinutes)!)}`;
}

/** The night whose hours apply now: after midnight on a late night it's still yesterday. */
export function currentNight(day: Day, state: OpenState): Day {
  return state.open ? state.night : day;
}

/** "Open Tuesday to Sunday from 5pm": a neutral summary for the static HTML, with no claim about now. */
export function weekSummary(hours: OpeningHours[] = izakaya.hours): string {
  const open = hours.filter(entry => entry.opens && entry.closes);
  if (!open.length) return 'See opening hours';
  const opens = new Set(open.map(entry => entry.opens));
  const from = opens.size === 1 ? ` from ${formatTime(open[0].opens!)}` : '';
  if (open.length === 7) return `Open every day${from}`;
  // Find the run of open days, starting after a closed day, so Tue–Sun reads naturally.
  const closedIndex = DAYS.findIndex(day => !open.some(entry => entry.day === day));
  const ordered = [...DAYS.slice(closedIndex + 1), ...DAYS.slice(0, closedIndex + 1)].filter(day => open.some(entry => entry.day === day));
  const contiguous = ordered.every((day, i) => i === 0 || (DAYS.indexOf(ordered[i - 1]) + 1) % 7 === DAYS.indexOf(day));
  if (contiguous) return `Open ${ordered[0]} to ${ordered.at(-1)}${from}`;
  return `Open ${ordered.map(day => day.slice(0, 3)).join(', ')}${from}`;
}

/** Current weekday and minutes after midnight in an IANA time zone. */
export function localNow(timeZone: string, now = new Date()): { day: Day; minutes: number } {
  const parts = new Intl.DateTimeFormat('en-US', {
    timeZone, weekday: 'long', hour: 'numeric', minute: 'numeric', hourCycle: 'h23',
  }).formatToParts(now);
  const part = (type: string) => parts.find(item => item.type === type)?.value ?? '';
  const day = part('weekday') as Day;
  return { day: DAYS.includes(day) ? day : 'Monday', minutes: Number(part('hour')) * 60 + Number(part('minute')) };
}
