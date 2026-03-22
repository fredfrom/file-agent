export const PROJECT_ID = '00000000-0000-0000-0000-000000000001';

export const ACCEPTED_EXTENSIONS = ['pdf', 'xlsx', 'svg', 'txt'] as const;
export type AcceptedExtension = (typeof ACCEPTED_EXTENSIONS)[number];

export const MAX_FILE_SIZE_BYTES = 4_500_000; // 4.5MB Vercel limit

export const PROJECT_FOLDERS = [
  { value: '/01_vertraege', label: '01 Vertraege' },
  { value: '/02_nachtraege', label: '02 Nachtraege' },
  { value: '/03_protokolle', label: '03 Protokolle' },
  { value: '/04_maengel', label: '04 Maengel' },
  { value: '/05_plaene', label: '05 Plaene' },
  { value: '/06_gutachten', label: '06 Gutachten' },
  { value: '/07_schriftverkehr', label: '07 Schriftverkehr' },
  { value: '/08_rechnungen', label: '08 Rechnungen' },
  { value: '/09_fotos', label: '09 Fotos' },
  { value: '/10_sonstiges', label: '10 Sonstiges' },
] as const;
