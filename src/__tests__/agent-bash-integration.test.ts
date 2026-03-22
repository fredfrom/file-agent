import { describe, it, expect, beforeAll } from 'vitest';
import { createBashTool } from 'bash-tool';
import { loadCorpus } from '@/corpus/loader';
import type { ProjectFilesystem } from '@/corpus/types';

let corpus: ProjectFilesystem;
let sandbox: Awaited<ReturnType<typeof createBashTool>>['sandbox'];
let tools: Awaited<ReturnType<typeof createBashTool>>['tools'];

beforeAll(async () => {
  corpus = await loadCorpus();
  const result = await createBashTool({ files: corpus, destination: '/' });
  sandbox = result.sandbox;
  tools = result.tools;
}, 30_000);

describe('createBashTool integration', () => {
  it('sandbox is created successfully', () => {
    expect(sandbox).toBeDefined();
  });

  it('tools.bash exists', () => {
    expect(tools.bash).toBeDefined();
  });

  it('tools has bash key', () => {
    expect(Object.keys(tools)).toContain('bash');
  });
});

describe('bash navigation', () => {
  it('ls / shows top-level folders', async () => {
    const result = await sandbox.executeCommand('ls /');
    expect(result.stdout).toContain('01_vertraege');
    expect(result.stdout).toContain('03_protokolle');
    expect(result.stdout).toContain('08_rechnungen');
  });

  it('cat reads PDF content from hauptvertrag', async () => {
    const result = await sandbox.executeCommand(
      'cat /01_vertraege/auftraggeber/hauptvertrag_stadtpark_ag.pdf',
    );
    expect(result.stdout).toContain('BAUVERTRAG');
  });

  it('grep finds cross-references to V-2024-001', async () => {
    const result = await sandbox.executeCommand('grep -rl "V-2024-001" /');
    const lines = result.stdout.trim().split('\n').filter(Boolean);
    expect(lines.length).toBeGreaterThanOrEqual(2);
  });

  it('find locates files in /04_maengel', async () => {
    const result = await sandbox.executeCommand('find /04_maengel');
    expect(result.stdout.trim().length).toBeGreaterThan(0);
  });

  it('absolute paths work with destination /', async () => {
    const result = await sandbox.executeCommand(
      'ls /01_vertraege/auftraggeber/',
    );
    expect(result.exitCode).toBe(0);
  });
});
