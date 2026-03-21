import { describe, it, expect, beforeAll } from 'vitest';
import { loadCorpus } from '@/corpus/loader';
import type { ProjectFilesystem } from '@/corpus/types';
import { Bash } from 'just-bash';

let corpus: ProjectFilesystem;

beforeAll(async () => {
  corpus = await loadCorpus();
}, 30_000);

describe('corpus loader', () => {
  it('returns a Record with at least 47 entries', () => {
    expect(Object.keys(corpus).length).toBeGreaterThanOrEqual(47);
  });

  it('contains at least 2 keys ending in .pdf', () => {
    const pdfKeys = Object.keys(corpus).filter((k) => k.endsWith('.pdf'));
    expect(pdfKeys.length).toBeGreaterThanOrEqual(2);
  });

  it('contains at least 1 key ending in .xlsx', () => {
    const xlsxKeys = Object.keys(corpus).filter((k) => k.endsWith('.xlsx'));
    expect(xlsxKeys.length).toBeGreaterThanOrEqual(1);
  });

  it('contains at least 3 keys ending in .svg', () => {
    const svgKeys = Object.keys(corpus).filter((k) => k.endsWith('.svg'));
    expect(svgKeys.length).toBeGreaterThanOrEqual(3);
  });
});

describe('pdf parsing', () => {
  it('hauptvertrag PDF contains expected contract terms', () => {
    const content =
      corpus['/01_vertraege/auftraggeber/hauptvertrag_stadtpark_ag.pdf'];
    expect(content).toBeDefined();
    expect(content).toContain('BAUVERTRAG');
    expect(content).toContain('V-2024-001');
    expect(content).toContain('Stadtpark Immobilien AG');
  });

  it('vertrag_rohbau PDF contains subcontractor terms', () => {
    const content =
      corpus['/01_vertraege/nachunternehmer/vertrag_rohbau_mueller_bau.pdf'];
    expect(content).toBeDefined();
    expect(content).toContain('NACHUNTERNEHMERVERTRAG');
    expect(content).toContain('Mueller Bau');
  });
});

describe('excel parsing', () => {
  it('invoice Excel contains line items with tab-separated values', () => {
    const content =
      corpus['/08_rechnungen/geprueft/re_mueller_bau_abschlag_01.xlsx'];
    expect(content).toBeDefined();
    expect(content).toContain('Abbrucharbeiten');
    expect(content).toContain('\t');
  });
});

describe('svg drawings', () => {
  it('grundriss_eg SVG contains valid SVG markup and plan number', () => {
    const content = corpus['/05_plaene/grundrisse/grundriss_eg_v3.svg'];
    expect(content).toBeDefined();
    expect(content).toContain('<svg');
    expect(content).toContain('A-EG-001-v3');
  });

  it('drawing .txt metadata files still exist alongside .svg files', () => {
    expect(
      corpus['/05_plaene/grundrisse/grundriss_eg_v3.txt'],
    ).toBeDefined();
    expect(
      corpus['/05_plaene/grundrisse/grundriss_og1_v2.txt'],
    ).toBeDefined();
  });
});

describe('backward compatibility', () => {
  it('old .txt keys for PDF-converted docs are removed', () => {
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

  it('non-converted .txt documents still exist', () => {
    // Protocols, defects, etc. that were NOT converted should still be .txt
    const txtKeys = Object.keys(corpus).filter(
      (k) => k.endsWith('.txt') && k.includes('/03_protokolle/'),
    );
    expect(txtKeys.length).toBeGreaterThanOrEqual(1);
  });
});

describe('just-bash integration with loaded corpus', () => {
  it('Bash accepts the loaded corpus without errors', () => {
    expect(() => new Bash({ files: corpus })).not.toThrow();
  });

  it('cat on hauptvertrag PDF path returns BAUVERTRAG content', async () => {
    const shell = new Bash({ files: corpus });
    const result = await shell.exec(
      'cat /01_vertraege/auftraggeber/hauptvertrag_stadtpark_ag.pdf',
    );
    expect(result.exitCode).toBe(0);
    expect(result.stdout).toContain('BAUVERTRAG');
  });

  it('ls /01_vertraege/auftraggeber/ lists the PDF file', async () => {
    const shell = new Bash({ files: corpus });
    const result = await shell.exec('ls /01_vertraege/auftraggeber/');
    expect(result.exitCode).toBe(0);
    expect(result.stdout).toContain('hauptvertrag_stadtpark_ag.pdf');
  });

  it('grep -r V-2024-001 finds matches in contracts', async () => {
    const shell = new Bash({ files: corpus });
    const result = await shell.exec('grep -r "V-2024-001" /01_vertraege/');
    expect(result.exitCode).toBe(0);
    expect(result.stdout.length).toBeGreaterThan(0);
  });
});
