import { describe, it, expect } from 'vitest';
import { files } from '@/corpus/filesystem';
import { Bash } from 'just-bash';

const REQUIRED_FOLDERS = [
  '01_vertraege',
  '02_nachtraege',
  '03_protokolle',
  '04_maengel',
  '05_plaene',
  '06_schriftverkehr',
  '07_bautagebuch',
  '08_rechnungen',
  '09_genehmigungen',
];

describe('filesystem structure', () => {
  it('has at least 30 entries', () => {
    expect(Object.keys(files).length).toBeGreaterThanOrEqual(30);
  });

  it('all keys start with / (absolute paths)', () => {
    for (const key of Object.keys(files)) {
      expect(key).toMatch(/^\//);
    }
  });

  it('all values are strings', () => {
    for (const value of Object.values(files)) {
      expect(typeof value).toBe('string');
    }
  });

  it('has at least 9 unique top-level folders', () => {
    const topLevelFolders = new Set(
      Object.keys(files).map((key) => key.split('/')[1]),
    );
    expect(topLevelFolders.size).toBeGreaterThanOrEqual(9);
  });

  it('contains all 9 required top-level folders', () => {
    const topLevelFolders = new Set(
      Object.keys(files).map((key) => key.split('/')[1]),
    );
    for (const folder of REQUIRED_FOLDERS) {
      expect(topLevelFolders).toContain(folder);
    }
  });

  it('top-level folders use numeric prefix pattern', () => {
    const topLevelFolders = new Set(
      Object.keys(files).map((key) => key.split('/')[1]),
    );
    for (const folder of topLevelFolders) {
      expect(folder).toMatch(/^\d{2}_/);
    }
  });
});

describe('just-bash integration', () => {
  it('Bash accepts the files object without errors', () => {
    expect(() => new Bash({ files })).not.toThrow();
  });

  it('ls / output contains all 9 required folder names', async () => {
    const shell = new Bash({ files });
    const result = await shell.exec('ls /');

    expect(result.exitCode).toBe(0);

    for (const folder of REQUIRED_FOLDERS) {
      expect(result.stdout).toContain(folder);
    }
  });

  it('ls /01_vertraege/ output contains subfolder names', async () => {
    const shell = new Bash({ files });
    const result = await shell.exec('ls /01_vertraege/');

    expect(result.exitCode).toBe(0);
    expect(result.stdout).toContain('auftraggeber');
    expect(result.stdout).toContain('nachunternehmer');
  });

  it('cat on a file returns without error (exit code 0)', async () => {
    const shell = new Bash({ files });
    const firstFile = Object.keys(files)[0];
    const result = await shell.exec(`cat ${firstFile}`);

    expect(result.exitCode).toBe(0);
  });
});

describe('cross-references (CORP-05)', () => {
  it('at least 5 documents reference contract V-2024-001', () => {
    const matchCount = Object.values(files).filter((v) =>
      v.includes('V-2024-001'),
    ).length;
    expect(matchCount).toBeGreaterThanOrEqual(5);
  });

  it('at least 3 documents reference Mangel IDs (M-0xx)', () => {
    const matchCount = Object.values(files).filter((v) =>
      /M-00\d/.test(v),
    ).length;
    expect(matchCount).toBeGreaterThanOrEqual(3);
  });

  it('at least 2 documents reference Nachtrag IDs (NT-0xx)', () => {
    const matchCount = Object.values(files).filter((v) =>
      /NT-00\d/.test(v),
    ).length;
    expect(matchCount).toBeGreaterThanOrEqual(2);
  });

  it('meeting minutes reference contract numbers', () => {
    const protocolEntries = Object.entries(files).filter(([k]) =>
      k.includes('/03_protokolle/'),
    );
    const hasContractRef = protocolEntries.some(([, v]) =>
      v.includes('V-2024'),
    );
    expect(hasContractRef).toBe(true);
  });

  it('punch list items reference correspondence or protocols', () => {
    const maengelEntries = Object.entries(files).filter(([k]) =>
      k.includes('/04_maengel/'),
    );
    const hasRef = maengelEntries.some(
      ([, v]) =>
        v.includes('Protokoll') ||
        v.includes('Schreiben') ||
        v.includes('Maengelruege') ||
        v.includes('NT-00'),
    );
    expect(hasRef).toBe(true);
  });
});

describe('drawing metadata (CORP-04)', () => {
  it('drawing metadata files reference SVG via Zeichnungsdatei', () => {
    const drawingMetaKeys = [
      '/05_plaene/grundrisse/grundriss_eg_v3.txt',
      '/05_plaene/grundrisse/grundriss_og1_v2.txt',
      '/05_plaene/schnitte/laengsschnitt_a_a.txt',
    ];

    for (const key of drawingMetaKeys) {
      const content = files[key];
      expect(content).toBeDefined();
      expect(content).toMatch(/Zeichnungsdatei:.*\.svg/);
    }
  });

  it('all drawing metadata files have PLANMETADATEN header', () => {
    const planKeys = Object.entries(files).filter(
      ([k]) => k.startsWith('/05_plaene/') && k.endsWith('.txt'),
    );
    expect(planKeys.length).toBeGreaterThanOrEqual(1);

    for (const [, content] of planKeys) {
      expect(content).toContain('PLANMETADATEN');
    }
  });
});
