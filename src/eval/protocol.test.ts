/**
 * Tests for protocol generator — A/B test protocol Markdown artifacts.
 * Covers static analysis (exports, integration) and unit tests (output format).
 */

import { describe, it, expect } from 'vitest';
import { readFileSync } from 'node:fs';
import { resolve } from 'node:path';

// ── Static analysis helpers ──────────────────────────────────────────

function readSource(relativePath: string): string {
  return readFileSync(resolve(__dirname, relativePath), 'utf-8');
}

// ── Static analysis tests ────────────────────────────────────────────

describe('protocol.ts static analysis', () => {
  const src = readSource('./protocol.ts');

  it('exports generateProtocol function', () => {
    expect(src).toMatch(/export function generateProtocol/);
  });

  it('exports protocolFilename function', () => {
    expect(src).toMatch(/export function protocolFilename/);
  });

  it('contains verdict: pending default', () => {
    expect(src).toMatch(/verdict: pending/);
  });

  it('contains protocol filename pattern with -vs-', () => {
    expect(src).toMatch(/protocol-.*-vs-/);
  });
});

describe('compare-run.ts integration static analysis', () => {
  const src = readSource('./compare-run.ts');

  it('imports generateProtocol from protocol', () => {
    expect(src).toMatch(/generateProtocol/);
  });

  it('writes to eval-results/protocols/', () => {
    expect(src).toMatch(/eval-results\/protocols/);
  });
});

// ── Unit tests ───────────────────────────────────────────────────────

describe('generateProtocol', () => {
  // Dynamic import to avoid failing static analysis if file doesn't exist yet
  let generateProtocol: typeof import('./protocol').generateProtocol;
  let protocolFilename: typeof import('./protocol').protocolFilename;

  const mockConfigA = {
    name: 'baseline',
    description: 'Standard system prompt',
    buildSystemPrompt: () => '',
    maxSteps: 15,
  };

  const mockConfigB = {
    name: 'concise',
    description: 'Compressed system prompt',
    buildSystemPrompt: () => '',
    maxSteps: 10,
  };

  const mockComparison = {
    timestamp: '2026-03-22T10:00:00.000Z',
    configA: {
      name: 'baseline',
      description: 'Standard system prompt',
      result: {
        timestamp: '2026-03-22T10:00:00.000Z',
        questions: [],
        aggregated: {
          accuracy: 0.85,
          citationPrecision: 0.9,
          avgStepCount: 5.2,
          docTypeCoverage: 0.75,
          avgQualityScore: 3.8,
        },
        passed: true,
      },
    },
    configB: {
      name: 'concise',
      description: 'Compressed system prompt',
      result: {
        timestamp: '2026-03-22T10:01:00.000Z',
        questions: [],
        aggregated: {
          accuracy: 0.88,
          citationPrecision: 0.85,
          avgStepCount: 4.1,
          docTypeCoverage: 0.8,
          avgQualityScore: 4.0,
        },
        passed: true,
      },
    },
    perQuestion: [
      {
        questionId: 'q-vertraege-01',
        winner: 'concise',
        configA: { accuracy: 0.8, steps: 5, quality: 3.5 },
        configB: { accuracy: 0.9, steps: 4, quality: 4.0 },
      },
    ],
    kpiComparison: [
      {
        kpi: 'Accuracy',
        configA: '85.0%',
        configB: '88.0%',
        delta: '-3.0%',
        winner: 'concise',
      },
      {
        kpi: 'Avg Step Count',
        configA: '5.2',
        configB: '4.1',
        delta: '1.1',
        winner: 'concise',
      },
    ],
  };

  // Load module before tests
  beforeAll(async () => {
    const mod = await import('./protocol');
    generateProtocol = mod.generateProtocol;
    protocolFilename = mod.protocolFilename;
  });

  it('produces string with YAML frontmatter delimiters', () => {
    const output = generateProtocol(mockConfigA, mockConfigB, mockComparison);
    expect(output).toMatch(/^---\n/);
    expect(output.indexOf('---\n')).toBe(0);
    // Second delimiter
    const secondDelimiter = output.indexOf('---', 4);
    expect(secondDelimiter).toBeGreaterThan(0);
  });

  it('contains config_a and config_b in frontmatter', () => {
    const output = generateProtocol(mockConfigA, mockConfigB, mockComparison);
    expect(output).toMatch(/config_a: baseline/);
    expect(output).toMatch(/config_b: concise/);
  });

  it('contains verdict: pending in frontmatter', () => {
    const output = generateProtocol(mockConfigA, mockConfigB, mockComparison);
    expect(output).toMatch(/verdict: pending/);
  });

  it('contains "## What Was Tested" section', () => {
    const output = generateProtocol(mockConfigA, mockConfigB, mockComparison);
    expect(output).toContain('## What Was Tested');
  });

  it('contains "## Methodology" section', () => {
    const output = generateProtocol(mockConfigA, mockConfigB, mockComparison);
    expect(output).toContain('## Methodology');
  });

  it('contains "## Results" section', () => {
    const output = generateProtocol(mockConfigA, mockConfigB, mockComparison);
    expect(output).toContain('## Results');
  });

  it('contains "### KPI Comparison" section with table header', () => {
    const output = generateProtocol(mockConfigA, mockConfigB, mockComparison);
    expect(output).toContain('### KPI Comparison');
    expect(output).toContain('| KPI |');
  });

  it('contains KPI data rows', () => {
    const output = generateProtocol(mockConfigA, mockConfigB, mockComparison);
    expect(output).toContain('| Accuracy |');
    expect(output).toContain('| Avg Step Count |');
  });

  it('contains per-question breakdown', () => {
    const output = generateProtocol(mockConfigA, mockConfigB, mockComparison);
    expect(output).toContain('### Per-Question Breakdown');
    expect(output).toContain('q-vertraege-01');
  });

  it('contains "## Verdict" section', () => {
    const output = generateProtocol(mockConfigA, mockConfigB, mockComparison);
    expect(output).toContain('## Verdict');
  });

  it('contains config descriptions', () => {
    const output = generateProtocol(mockConfigA, mockConfigB, mockComparison);
    expect(output).toContain('Standard system prompt');
    expect(output).toContain('Compressed system prompt');
  });

  it('contains maxSteps for both configs', () => {
    const output = generateProtocol(mockConfigA, mockConfigB, mockComparison);
    expect(output).toContain('15');
    expect(output).toContain('10');
  });
});

describe('protocolFilename', () => {
  let protocolFilename: typeof import('./protocol').protocolFilename;

  beforeAll(async () => {
    const mod = await import('./protocol');
    protocolFilename = mod.protocolFilename;
  });

  it('returns filename matching pattern protocol-{date}-{configA}-vs-{configB}.md', () => {
    const mockA = { name: 'baseline', description: '', buildSystemPrompt: () => '', maxSteps: 15 };
    const mockB = { name: 'concise', description: '', buildSystemPrompt: () => '', maxSteps: 10 };
    const result = protocolFilename(mockA, mockB, '2026-03-22');
    expect(result).toBe('protocol-2026-03-22-baseline-vs-concise.md');
  });
});
