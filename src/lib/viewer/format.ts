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

/**
 * Format an ISO date string to German locale with time (dd.mm.yyyy, HH:mm).
 */
export function formatDateTime(isoString: string): string {
  return new Intl.DateTimeFormat('de-DE', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  }).format(new Date(isoString));
}

/**
 * Format an ISO date string to time only (HH:mm).
 */
export function formatTime(isoString: string): string {
  return new Intl.DateTimeFormat('de-DE', {
    hour: '2-digit',
    minute: '2-digit',
  }).format(new Date(isoString));
}
