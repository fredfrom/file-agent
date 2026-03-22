import { describe, it, expect, beforeAll } from 'vitest';
import { loadCorpus } from '@/corpus/loader';
import type { ProjectFilesystem } from '@/corpus/types';

let corpus: ProjectFilesystem;

beforeAll(async () => {
  corpus = await loadCorpus();
}, 30_000);

describe('loadCorpus return value structure', () => {
  it('all keys start with "/" (absolute paths)', () => {
    for (const key of Object.keys(corpus)) {
      expect(key.startsWith('/')).toBe(true);
    }
  });

  it('all values are non-empty strings', () => {
    for (const [key, value] of Object.entries(corpus)) {
      expect(typeof value).toBe('string');
      expect(value.length, `empty content for ${key}`).toBeGreaterThan(0);
    }
  });

  it('corpus does not contain .txt keys for files replaced by PDF/Excel', () => {
    expect(
      corpus['/01_vertraege/auftraggeber/hauptvertrag_stadtpark_ag.txt'],
    ).toBeUndefined();
    expect(
      corpus['/01_vertraege/nachunternehmer/vertrag_rohbau_mueller_bau.txt'],
    ).toBeUndefined();
    expect(
      corpus['/08_rechnungen/geprueft/re_mueller_bau_abschlag_01.txt'],
    ).toBeUndefined();
  });
});

describe('corpus content integrity', () => {
  it('PDF content does not contain raw binary artifacts', () => {
    const pdfKeys = Object.keys(corpus).filter((k) => k.endsWith('.pdf'));
    for (const key of pdfKeys) {
      const content = corpus[key];
      // PDF binary headers should not appear in parsed text
      expect(content).not.toContain('%PDF-');
      expect(content).not.toContain('endobj');
      expect(content).not.toContain('endstream');
    }
  });

  it('Excel content contains tab characters (TSV format)', () => {
    const xlsxKeys = Object.keys(corpus).filter((k) => k.endsWith('.xlsx'));
    for (const key of xlsxKeys) {
      expect(corpus[key]).toContain('\t');
    }
  });

  it('Excel content contains sheet separator "==="', () => {
    const xlsxKeys = Object.keys(corpus).filter((k) => k.endsWith('.xlsx'));
    for (const key of xlsxKeys) {
      expect(corpus[key]).toContain('===');
    }
  });

  it('SVG files contain valid XML opening tag', () => {
    const svgKeys = Object.keys(corpus).filter((k) => k.endsWith('.svg'));
    expect(svgKeys.length).toBeGreaterThan(0);
    for (const key of svgKeys) {
      expect(corpus[key]).toContain('<svg');
    }
  });
});

describe('corpus size consistency', () => {
  it('corpus has same number of keys on repeated calls (deterministic)', async () => {
    const corpus2 = await loadCorpus();
    expect(Object.keys(corpus2).length).toBe(Object.keys(corpus).length);
  }, 30_000);

  it('loadCorpus called twice returns equivalent content (idempotent)', async () => {
    const corpus2 = await loadCorpus();
    const keys1 = Object.keys(corpus).sort();
    const keys2 = Object.keys(corpus2).sort();
    expect(keys2).toEqual(keys1);

    // Spot-check a few values
    for (const key of keys1.slice(0, 5)) {
      expect(corpus2[key]).toBe(corpus[key]);
    }
  }, 30_000);
});
