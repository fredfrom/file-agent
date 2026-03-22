import { describe, it, expect } from 'vitest';
import {
  buildSystemPrompt,
  generateDirectoryTree,
} from '@/lib/agent/system-prompt';
import type { ProjectFilesystem } from '@/corpus/types';

describe('generateDirectoryTree', () => {
  const testCorpus: ProjectFilesystem = {
    '/a/b.txt': 'content',
    '/a/c.txt': 'content',
    '/z/d.txt': 'content',
  };

  it('includes all file paths in output', () => {
    const result = generateDirectoryTree(testCorpus);
    expect(result).toContain('/a/b.txt');
    expect(result).toContain('/a/c.txt');
    expect(result).toContain('/z/d.txt');
  });

  it('output lines are sorted alphabetically', () => {
    const result = generateDirectoryTree(testCorpus);
    const lines = result.split('\n').filter(Boolean);
    const sorted = [...lines].sort();
    expect(lines).toEqual(sorted);
  });
});

describe('buildSystemPrompt', () => {
  const testCorpus: ProjectFilesystem = {
    '/01_vertraege/hauptvertrag.txt': 'test',
    '/04_maengel/mangel_001.txt': 'test',
    '/09_genehmigungen/baugenehmigung.txt': 'test',
  };

  const result = buildSystemPrompt(testCorpus);

  it('contains German instruction to always respond in German', () => {
    expect(result).toContain('Antworte IMMER auf Deutsch');
  });

  it('instructs use of absolute paths and forbids cd', () => {
    expect(result).toContain('absolute Pfade');
    expect(result).toContain('Kein');
    expect(result).toContain('cd');
  });

  it('includes filesystem tree with corpus key paths', () => {
    expect(result).toContain('01_vertraege/hauptvertrag.txt');
    expect(result).toContain('04_maengel/mangel_001.txt');
    expect(result).toContain('09_genehmigungen/baugenehmigung.txt');
  });

  it('contains project context with V-2024-001 reference', () => {
    expect(result).toContain('V-2024-001');
    expect(result).toContain('Stadtpark Immobilien AG');
  });

  it('contains folder overview with key folder names', () => {
    expect(result).toContain('01_vertraege');
    expect(result).toContain('09_genehmigungen');
  });

  it('mentions bash commands ls, cat, and grep', () => {
    expect(result).toContain('ls');
    expect(result).toContain('cat');
    expect(result).toContain('grep');
  });

  it('contains format awareness section with Dateiformate heading', () => {
    expect(result).toContain('Dateiformate');
  });

  it('mentions that .pdf files are searchable as text', () => {
    expect(result).toContain('.pdf');
  });

  it('mentions that .xlsx files contain TSV format', () => {
    expect(result).toContain('.xlsx');
    expect(result).toContain('TSV');
  });

  it('contains synthesis strategy section', () => {
    expect(result).toContain('uebergreifende Fragen');
  });

  it('synthesis strategy mentions grep -rl', () => {
    expect(result).toContain('grep -rl');
  });
});
