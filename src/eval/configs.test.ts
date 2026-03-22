/**
 * Static analysis tests for AgentConfig type, configs, and runner refactor.
 * Validates type definitions, config exports, and backward-compatible runner signature.
 */

import { describe, it, expect } from 'vitest';
import { readFileSync } from 'node:fs';
import { resolve } from 'node:path';

function readSource(relativePath: string): string {
  return readFileSync(resolve(__dirname, relativePath), 'utf-8');
}

describe('AgentConfig type (src/eval/types.ts)', () => {
  const source = readSource('types.ts');

  it('exports AgentConfig type', () => {
    expect(source).toMatch(/export\s+type\s+AgentConfig/);
  });

  it('AgentConfig has name field', () => {
    expect(source).toMatch(/name:\s*string/);
  });

  it('AgentConfig has description field', () => {
    expect(source).toMatch(/description:\s*string/);
  });

  it('AgentConfig has buildSystemPrompt field', () => {
    expect(source).toMatch(/buildSystemPrompt:\s*\(corpus:\s*ProjectFilesystem\)\s*=>\s*string/);
  });

  it('AgentConfig has maxSteps field', () => {
    expect(source).toMatch(/maxSteps:\s*number/);
  });

  it('imports ProjectFilesystem for AgentConfig', () => {
    expect(source).toMatch(/import.*ProjectFilesystem.*from/);
  });
});

describe('Agent configs (src/eval/configs.ts)', () => {
  const source = readSource('configs.ts');

  it('exports baseline config', () => {
    expect(source).toMatch(/export\s+const\s+baseline/);
  });

  it('exports concise config', () => {
    expect(source).toMatch(/export\s+const\s+concise/);
  });

  it('exports configs array', () => {
    expect(source).toMatch(/export\s+const\s+configs/);
  });

  it('baseline uses buildSystemPrompt from system-prompt', () => {
    expect(source).toMatch(/import.*buildSystemPrompt.*from/);
  });

  it('baseline has maxSteps of 10', () => {
    expect(source).toMatch(/maxSteps:\s*10/);
  });

  it('concise has a different maxSteps value', () => {
    expect(source).toMatch(/maxSteps:\s*8/);
  });

  it('imports AgentConfig type', () => {
    expect(source).toMatch(/import.*AgentConfig.*from/);
  });
});

describe('RunEvalOptions refactor (src/eval/runner.ts)', () => {
  const source = readSource('runner.ts');

  it('RunEvalOptions includes optional config field', () => {
    expect(source).toMatch(/config\?:\s*AgentConfig/);
  });

  it('imports AgentConfig type', () => {
    expect(source).toMatch(/import.*AgentConfig.*from/);
  });

  it('uses config.buildSystemPrompt when config is provided', () => {
    expect(source).toMatch(/config\.buildSystemPrompt/);
  });

  it('uses config.maxSteps when config is provided', () => {
    expect(source).toMatch(/config\.maxSteps/);
  });

  it('still imports default buildSystemPrompt for backward compatibility', () => {
    expect(source).toMatch(/import.*buildSystemPrompt.*from.*system-prompt/);
  });
});
