const MONTHS_PT = [
  'jan', 'fev', 'mar', 'abr', 'mai', 'jun',
  'jul', 'ago', 'set', 'out', 'nov', 'dez',
];

const WEEKDAYS_PT = ['dom', 'seg', 'ter', 'qua', 'qui', 'sex', 'sáb'];

export interface EventDateParts {
  year: string;
  day: string;
  dayNum: number;
  month: string;
  monthIdx: number;
  weekday: string;
  time: string;
}

/**
 * Parses a stored event_date ISO string into wall-clock parts WITHOUT timezone
 * conversion. The stored value is treated as the band's local show time, so it
 * must display verbatim regardless of the visitor's browser timezone.
 */
export function parseEventDate(iso: string): EventDateParts | null {
  const match = iso.match(/(\d{4})-(\d{2})-(\d{2})T(\d{2}):(\d{2})/);
  if (!match) return null;

  const [, year, month, day, hour, minute] = match;
  const monthIdx = parseInt(month, 10) - 1;
  const dayNum = parseInt(day, 10);
  // Compute the weekday in UTC so it isn't shifted by the local timezone.
  const weekday = new Date(Date.UTC(Number(year), monthIdx, dayNum)).getUTCDay();

  return {
    year,
    day,
    dayNum,
    month: MONTHS_PT[monthIdx] ?? '',
    monthIdx,
    weekday: WEEKDAYS_PT[weekday] ?? '',
    time: `${hour}:${minute}`,
  };
}

/** Compact label for admin lists, e.g. "15 ago 2026 · 20:00" (time omitted at midnight). */
export function formatEventDateShort(iso: string): string {
  const parts = parseEventDate(iso);
  if (!parts) return iso;
  const base = `${parts.dayNum} ${parts.month} ${parts.year}`;
  return parts.time === '00:00' ? base : `${base} · ${parts.time}`;
}
