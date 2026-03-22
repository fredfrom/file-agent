import { describe, it, expect } from 'vitest';
import { parseTabularContent } from '@/lib/viewer/parse';
import { formatDate } from '@/lib/viewer/format';

describe('parseTabularContent', () => {
  it('parses content with sheet markers', () => {
    const result = parseTabularContent('=== Tabelle 1 ===\nA\tB\n1\t2');
    expect(result).toEqual({
      sheets: [{ name: 'Tabelle 1', rows: [['A', 'B'], ['1', '2']] }],
    });
  });

  it('falls back to single sheet when no markers', () => {
    const result = parseTabularContent('A\tB\n1\t2');
    expect(result).toEqual({
      sheets: [{ name: 'Tabelle', rows: [['A', 'B'], ['1', '2']] }],
    });
  });

  it('parses multiple sheets', () => {
    const result = parseTabularContent('=== Sheet1 ===\nA\n=== Sheet2 ===\nB');
    expect(result.sheets).toHaveLength(2);
    expect(result.sheets[0].name).toBe('Sheet1');
    expect(result.sheets[1].name).toBe('Sheet2');
  });
});

describe('formatDate', () => {
  it('formats ISO date string to German format', () => {
    const result = formatDate('2024-06-15T10:30:00.000Z');
    expect(result).toContain('15');
    expect(result).toContain('2024');
  });
});
