import { describe, it, expect } from 'vitest';

describe('Project Setup', () => {
  it('test runner is working', () => {
    expect(true).toBe(true);
  });

  it('TypeScript is configured correctly', () => {
    const value: string = 'file-agent';
    expect(value).toBe('file-agent');
  });
});
