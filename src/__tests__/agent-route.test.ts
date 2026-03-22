import { describe, it, expect } from 'vitest';
import { readFileSync } from 'fs';
import { resolve } from 'path';

const routeSource = readFileSync(
  resolve(process.cwd(), 'src/app/api/chat/route.ts'),
  'utf-8',
);

describe('route handler structure (AGNT-03, AGNT-04)', () => {
  it('exports POST handler', () => {
    expect(routeSource).toContain('export async function POST');
  });

  it('uses streamText with anthropic claude-sonnet-4 (AGNT-03)', () => {
    expect(routeSource).toContain("anthropic('claude-sonnet-4-20250514')");
  });

  it('sets step limit to 10 (AGNT-04)', () => {
    expect(routeSource).toContain('stepCountIs(10)');
  });

  it('uses destination / for absolute paths', () => {
    expect(routeSource).toContain("destination: '/'");
  });

  it('only exposes bash tool', () => {
    expect(routeSource).toContain('bash: tools.bash');
    expect(routeSource).not.toMatch(/tools:\s*\{[^}]*readFile/);
    expect(routeSource).not.toMatch(/tools:\s*\{[^}]*writeFile/);
  });

  it('streams via toUIMessageStreamResponse', () => {
    expect(routeSource).toContain('toUIMessageStreamResponse()');
  });

  it('does not use edge runtime', () => {
    expect(routeSource).not.toContain("runtime = 'edge'");
  });

  it('imports buildSystemPrompt', () => {
    expect(routeSource).toContain('import { buildSystemPrompt }');
  });
});
