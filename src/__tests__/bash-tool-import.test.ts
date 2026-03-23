import { describe, it, expect } from 'vitest';
import { readFileSync } from 'fs';
import { resolve } from 'path';

describe('bash-tool import resolution', () => {
  it('resolves bash-tool via dynamic import without error', async () => {
    const mod = await import('bash-tool');
    expect(mod).toBeDefined();
  });

  it('exports createBashTool as a function', async () => {
    const mod = await import('bash-tool');
    expect(typeof mod.createBashTool).toBe('function');
  });

  it('has a "default" entry in exports["."] of bash-tool package.json', () => {
    // Use require.resolve to find bash-tool regardless of symlinks or worktrees
    const bashToolEntry = require.resolve('bash-tool');
    const bashToolDir = resolve(bashToolEntry, '..', '..');
    const pkgPath = resolve(bashToolDir, 'package.json');
    const pkg = JSON.parse(readFileSync(pkgPath, 'utf-8'));
    expect(pkg.exports['.']).toHaveProperty('default');
    expect(pkg.exports['.'].default).toBe(pkg.exports['.'].import);
  });
});
