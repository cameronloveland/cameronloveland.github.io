export function formatMonthYear(date: Date): string {
  // Use UTC-based formatting to avoid timezone offset issues
  // when dates are parsed from ISO strings (e.g., "2025-06-01")
  const month = date.toLocaleString('en-US', { month: 'short', timeZone: 'UTC' });
  const year = date.toLocaleString('en-US', { year: 'numeric', timeZone: 'UTC' });
  return `${month} ${year}`;
}
