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

  it('uses streamText with anthropic model (AGNT-03)', () => {
    expect(routeSource).toContain('anthropic(');
    expect(routeSource).toContain('streamText');
  });

  it('defines MAX_STEPS constant', () => {
    expect(routeSource).toContain('const MAX_STEPS = ');
  });

  it('sets step limit via stepCountIs(MAX_STEPS) (AGNT-04)', () => {
    expect(routeSource).toContain('stepCountIs(MAX_STEPS)');
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
