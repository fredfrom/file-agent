import { describe, it, expect } from 'vitest';
import { findPassageIndex } from '@/lib/viewer/highlight';

describe('findPassageIndex', () => {
  it('finds exact substring match', () => {
    const result = findPassageIndex('Der Preis betraegt 100 EUR', 'Preis betraegt 100');
    expect(result).toBeGreaterThanOrEqual(0);
  });

  it('returns -1 when passage not found', () => {
    const result = findPassageIndex('Der Preis betraegt 100 EUR', 'nicht vorhanden');
    expect(result).toBe(-1);
  });

  it('normalizes whitespace for matching', () => {
    const result = findPassageIndex('Der  Preis\n betraegt  100', 'Der Preis betraegt 100');
    expect(result).toBeGreaterThanOrEqual(0);
  });

  it('falls back to partial match using first 50 chars', () => {
    const result = findPassageIndex('Long content here', 'Long');
    expect(result).toBeGreaterThanOrEqual(0);
  });

  it('returns -1 for empty passage', () => {
    const result = findPassageIndex('content', '');
    expect(result).toBe(-1);
  });
});
