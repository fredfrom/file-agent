/**
 * Static analysis tests for comparison logic and CLI entry point.
 * Validates compareConfigs exports, ComparisonResult type, and CLI wiring.
 */

import { describe, it, expect } from 'vitest';
import { readFileSync } from 'node:fs';
import { resolve } from 'node:path';

function readSource(relativePath: string): string {
  return readFileSync(resolve(__dirname, relativePath), 'utf-8');
}

function readPackageJson(): string {
  return readFileSync(
    resolve(__dirname, '../../package.json'),
    'utf-8'
  );
}

describe('Comparison logic (src/eval/compare.ts)', () => {
  const source = readSource('compare.ts');

  it('exports compareConfigs function', () => {
    expect(source).toMatch(/export\s+async\s+function\s+compareConfigs/);
  });

  it('imports runEval from runner', () => {
    expect(source).toMatch(/import.*runEval.*from/);
  });

  it('imports AgentConfig from types', () => {
    expect(source).toMatch(/import.*AgentConfig.*from/);
  });

  it('exports ComparisonResult type', () => {
    expect(source).toMatch(/export\s+type\s+ComparisonResult/);
  });

  it('ComparisonResult has configA and configB', () => {
    expect(source).toMatch(/configA:/);
    expect(source).toMatch(/configB:/);
  });

  it('ComparisonResult has perQuestion breakdown', () => {
    expect(source).toMatch(/perQuestion:/);
  });

  it('ComparisonResult has kpiComparison', () => {
    expect(source).toMatch(/kpiComparison:/);
  });

  it('has winner indicator in perQuestion', () => {
    expect(source).toMatch(/winner:/);
  });
});

describe('CLI entry point (src/eval/compare-run.ts)', () => {
  const source = readSource('compare-run.ts');

  it('imports compareConfigs', () => {
    expect(source).toMatch(/import.*compareConfigs.*from/);
  });

  it('imports baseline and concise configs', () => {
    expect(source).toMatch(/import.*baseline.*from/);
    expect(source).toMatch(/import.*concise.*from/);
  });

  it('handles --quick flag', () => {
    expect(source).toMatch(/--quick/);
  });

  it('saves comparison JSON with correct filename pattern', () => {
    expect(source).toMatch(/compare-.*-vs-.*\.json/);
  });
});

describe('package.json eval:compare script', () => {
  const pkg = readPackageJson();

  it('has eval:compare script', () => {
    expect(pkg).toMatch(/"eval:compare"/);
  });

  it('eval:compare runs compare-run.ts', () => {
    expect(pkg).toMatch(/compare-run\.ts/);
  });
});
