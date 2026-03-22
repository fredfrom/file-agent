import { describe, it, expect } from 'vitest';
import { parseVirtualPath, buildVirtualPath } from '@/lib/ingest/parse';
import { ACCEPTED_EXTENSIONS, MAX_FILE_SIZE_BYTES, PROJECT_FOLDERS } from '@/lib/ingest/constants';

describe('buildVirtualPath', () => {
  it('builds virtual path from folder and filename', () => {
    const result = buildVirtualPath('/01_vertraege', 'vertrag.pdf');
    expect(result).toBe('/01_vertraege/vertrag.pdf');
  });
});

describe('parseVirtualPath', () => {
  it('extracts folder, filename, and extension from a simple path', () => {
    const result = parseVirtualPath('/01_vertraege/vertrag.pdf');
    expect(result).toEqual({
      folder: '/01_vertraege',
      filename: 'vertrag',
      extension: 'pdf',
    });
  });

  it('handles nested folder paths', () => {
    const result = parseVirtualPath('/05_plaene/grundriss/eg.svg');
    expect(result).toEqual({
      folder: '/05_plaene/grundriss',
      filename: 'eg',
      extension: 'svg',
    });
  });
});

describe('constants', () => {
  it('ACCEPTED_EXTENSIONS contains exactly pdf, xlsx, svg, txt', () => {
    expect([...ACCEPTED_EXTENSIONS]).toEqual(['pdf', 'xlsx', 'svg', 'txt']);
  });

  it('MAX_FILE_SIZE_BYTES equals 4_500_000', () => {
    expect(MAX_FILE_SIZE_BYTES).toBe(4_500_000);
  });

  it('PROJECT_FOLDERS has 10 entries with first value /01_vertraege', () => {
    expect(PROJECT_FOLDERS).toHaveLength(10);
    expect(PROJECT_FOLDERS[0].value).toBe('/01_vertraege');
  });
});
