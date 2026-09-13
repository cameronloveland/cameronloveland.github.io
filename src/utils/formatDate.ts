export function formatMonthYear(date: Date): string {
  // Use UTC-based formatting to avoid timezone offset issues
  // when dates are parsed from ISO strings (e.g., "2025-06-01")
  const month = date.toLocaleString('en-US', { month: 'short', timeZone: 'UTC' });
  const year = date.toLocaleString('en-US', { year: 'numeric', timeZone: 'UTC' });
  return `${month} ${year}`;
}

// The timeline works at month resolution. A month index counts months from
// year zero so two dates can be compared and subtracted without date math.
export function monthIndex(date: Date): number {
  return date.getUTCFullYear() * 12 + date.getUTCMonth();
}

export function monthFromIndex(index: number): { year: number; month: number } {
  return { year: Math.floor(index / 12), month: index % 12 };
}

export function formatMonthShort(index: number): string {
  const { year, month } = monthFromIndex(index);
  return new Date(Date.UTC(year, month, 1)).toLocaleString('en-US', { month: 'short', timeZone: 'UTC' });
}

export function formatMonthIndex(index: number): string {
  const { year, month } = monthFromIndex(index);
  return formatMonthYear(new Date(Date.UTC(year, month, 1)));
}

// Month precision for <time datetime>, e.g. "2025-06".
export function isoMonth(index: number): string {
  const { year, month } = monthFromIndex(index);
  return `${year}-${String(month + 1).padStart(2, '0')}`;
}

// Inclusive count, so Jun to Sep is four months.
export function monthsInclusive(from: number, to: number): number {
  return to - from + 1;
}
