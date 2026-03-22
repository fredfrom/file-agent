import { describe, it, expect, beforeAll } from 'vitest';
import { createBashTool } from 'bash-tool';
import { loadCorpus } from '@/corpus/loader';
import type { ProjectFilesystem } from '@/corpus/types';

let corpus: ProjectFilesystem;
let sandbox: Awaited<ReturnType<typeof createBashTool>>['sandbox'];

beforeAll(async () => {
  corpus = await loadCorpus();
  const result = await createBashTool({ files: corpus, destination: '/' });
  sandbox = result.sandbox;
}, 30_000);

describe('cross-format search (AGNT-07)', () => {
  it('grep finds content inside PDF files', async () => {
    const result = await sandbox.executeCommand(
      'grep -l "Pauschalpreis" /01_vertraege/auftraggeber/hauptvertrag_stadtpark_ag.pdf',
    );
    expect(result.exitCode).toBe(0);
    expect(result.stdout).toContain('hauptvertrag_stadtpark_ag.pdf');
  });

  it('grep finds content inside Excel files', async () => {
    const result = await sandbox.executeCommand(
      'grep "Abbrucharbeiten" /08_rechnungen/geprueft/re_mueller_bau_abschlag_01.xlsx',
    );
    expect(result.exitCode).toBe(0);
    expect(result.stdout).toContain('Abbrucharbeiten');
  });

  it('grep -rl finds matches across .txt, .pdf, and .xlsx files', async () => {
    const result = await sandbox.executeCommand('grep -rl "Mueller" /');
    const lines = result.stdout.trim().split('\n').filter(Boolean);
    const extensions = new Set(
      lines.map((line) => {
        const dot = line.lastIndexOf('.');
        return dot >= 0 ? line.slice(dot) : '';
      }),
    );
    expect(extensions.size).toBeGreaterThanOrEqual(2);
  });

  it('cat reads Excel content with TSV format', async () => {
    const result = await sandbox.executeCommand(
      'cat /08_rechnungen/geprueft/re_mueller_bau_abschlag_01.xlsx',
    );
    expect(result.stdout).toContain('===');
  });
});

describe('cross-reference navigation (AGNT-08)', () => {
  it('M-001 appears in multiple folders', async () => {
    const result = await sandbox.executeCommand('grep -rl "M-001" /');
    const lines = result.stdout.trim().split('\n').filter(Boolean);
    const folders = new Set(
      lines.map((line) => {
        const parts = line.split('/').filter(Boolean);
        return parts[0];
      }),
    );
    expect(folders.size).toBeGreaterThanOrEqual(2);
  });

  it('V-2024-001 appears in multiple folders', async () => {
    const result = await sandbox.executeCommand('grep -rl "V-2024-001" /');
    const lines = result.stdout.trim().split('\n').filter(Boolean);
    const folders = new Set(
      lines.map((line) => {
        const parts = line.split('/').filter(Boolean);
        return parts[0];
      }),
    );
    expect(folders.size).toBeGreaterThanOrEqual(3);
  });

  it('NT-001 appears in multiple folders', async () => {
    const result = await sandbox.executeCommand('grep -rl "NT-001" /');
    const lines = result.stdout.trim().split('\n').filter(Boolean);
    const folders = new Set(
      lines.map((line) => {
        const parts = line.split('/').filter(Boolean);
        return parts[0];
      }),
    );
    expect(folders.size).toBeGreaterThanOrEqual(2);
  });
});
