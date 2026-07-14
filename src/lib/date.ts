import { CalendarDate, getLocalTimeZone, Time, toCalendarDateTime } from "@internationalized/date";

/** Date and time conversion/formatting helpers built on `@internationalized/date`. */

/** Converts a JS `Date` to an `@internationalized/date` `CalendarDate` in local time. */
export function toCalendarDate(date: Date): CalendarDate {
  return new CalendarDate(date.getFullYear(), date.getMonth() + 1, date.getDate());
}

/** Extracts the time-of-day from a JS `Date` as an `@internationalized/date` `Time`. */
export function toTimeValue(date: Date): Time {
  return new Time(date.getHours(), date.getMinutes());
}

/** Combines a calendar date and time into a single local-timezone `Date`. */
export function combineDateTime(date: CalendarDate, time: Time): Date {
  return toCalendarDateTime(date, time).toDate(getLocalTimeZone());
}

/** Formats a `Date` or ISO string as e.g. "Jul 14, 2026". */
export function formatDate(date: Date | string): string {
  const d = typeof date === "string" ? new Date(date) : date;
  return new Intl.DateTimeFormat("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  }).format(d);
}

/** Formats a `Date` or ISO string as e.g. "Jul 14, 2026 at 3:30 PM". */
export function formatDateTime(date: Date | string): string {
  const d = typeof date === "string" ? new Date(date) : date;
  const dateStr = formatDate(d);
  const timeStr = new Intl.DateTimeFormat("en-US", {
    hour: "numeric",
    minute: "2-digit",
  }).format(d);
  return `${dateStr} at ${timeStr}`;
}
