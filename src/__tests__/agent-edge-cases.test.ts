import { describe, it, expect, beforeAll } from 'vitest';
import {
  buildSystemPrompt,
  generateDirectoryTree,
} from '@/lib/agent/system-prompt';
import { loadCorpus } from '@/corpus/loader';
import type { ProjectFilesystem } from '@/corpus/types';
import { Bash } from 'just-bash';

describe('buildSystemPrompt edge cases', () => {
  it('with empty corpus returns string containing "Dateistruktur" section', () => {
    const result = buildSystemPrompt({});
    expect(result).toContain('Dateistruktur');
  });

  it('with single file includes the file path in output', () => {
    const result = buildSystemPrompt({ '/test.txt': 'content' });
    expect(result).toContain('/test.txt');
  });

  it('output always contains "Regeln" section', () => {
    const result = buildSystemPrompt({});
    expect(result).toContain('Regeln');
  });

  it('output always contains "Dateiformate" section', () => {
    const result = buildSystemPrompt({});
    expect(result).toContain('Dateiformate');
  });

  it('output always contains "Projektkontext" section', () => {
    const result = buildSystemPrompt({});
    expect(result).toContain('Projektkontext');
  });
});

describe('generateDirectoryTree edge cases', () => {
  it('with empty object returns empty string', () => {
    const result = generateDirectoryTree({});
    expect(result).toBe('');
  });

  it('with single file creates parent directory entries', () => {
    const result = generateDirectoryTree({ '/a/b.txt': 'content' });
    const lines = result.split('\n');
    expect(lines).toContain('/a');
    expect(lines).toContain('/a/b.txt');
  });

  it('with deeply nested path creates all intermediate directories', () => {
    const result = generateDirectoryTree({ '/a/b/c/d.txt': 'content' });
    const lines = result.split('\n');
    expect(lines).toContain('/a');
    expect(lines).toContain('/a/b');
    expect(lines).toContain('/a/b/c');
    expect(lines).toContain('/a/b/c/d.txt');
  });

  it('output is sorted alphabetically', () => {
    const corpus: ProjectFilesystem = {
      '/z/file.txt': 'content',
      '/a/file.txt': 'content',
      '/m/file.txt': 'content',
    };
    const result = generateDirectoryTree(corpus);
    const lines = result.split('\n').filter(Boolean);
    const sorted = [...lines].sort();
    expect(lines).toEqual(sorted);
  });
});

describe('bash tool with edge case inputs', () => {
  let corpus: ProjectFilesystem;
  let shell: Bash;

  beforeAll(async () => {
    corpus = await loadCorpus();
    shell = new Bash({ files: corpus });
  }, 30_000);

  it('ls /nonexistent_folder returns non-zero exit code or empty stdout', async () => {
    const result = await shell.exec('ls /nonexistent_folder');
    // Either non-zero exit code or empty stdout indicates missing path
    const isErrorOrEmpty =
      result.exitCode !== 0 || result.stdout.trim() === '';
    expect(isErrorOrEmpty).toBe(true);
  });

  it('cat /nonexistent_file.txt returns non-zero exit code', async () => {
    const result = await shell.exec('cat /nonexistent_file.txt');
    expect(result.exitCode).not.toBe(0);
  });

  it('grep with no-match pattern returns empty or non-zero exit code', async () => {
    const result = await shell.exec(
      'grep -r "no_match_pattern_xyz_123" /01_vertraege/',
    );
    const isErrorOrEmpty =
      result.exitCode !== 0 || result.stdout.trim() === '';
    expect(isErrorOrEmpty).toBe(true);
  });

  it('ls / with loaded corpus returns exit code 0', async () => {
    const result = await shell.exec('ls /');
    expect(result.exitCode).toBe(0);
    expect(result.stdout.trim().length).toBeGreaterThan(0);
  });
});
