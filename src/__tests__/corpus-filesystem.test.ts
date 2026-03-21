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
