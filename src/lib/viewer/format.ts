/**
 * Format an ISO date string to German locale format (dd.mm.yyyy).
 */
export function formatDate(isoString: string): string {
  return new Intl.DateTimeFormat('de-DE', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
  }).format(new Date(isoString));
}
