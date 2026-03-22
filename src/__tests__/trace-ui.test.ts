import { describe, it, expect } from 'vitest';
import { readFileSync } from 'node:fs';
import { join } from 'node:path';

// Load source files at module level (established pattern from chat-page.test.ts)
const chatSource = readFileSync(
  join(process.cwd(), 'src/components/chat.tsx'),
  'utf-8',
);
const toolTraceSource = readFileSync(
  join(process.cwd(), 'src/components/tool-trace.tsx'),
  'utf-8',
);
const citationTextSource = readFileSync(
  join(process.cwd(), 'src/components/citation-text.tsx'),
  'utf-8',
);
const exampleQuestionsSource = readFileSync(
  join(process.cwd(), 'src/components/example-questions.tsx'),
  'utf-8',
);

// --- UI-03: Visible agent trace ---

describe('UI-03: visible agent trace', () => {
  it('chat.tsx renders tool-bash parts', () => {
    expect(chatSource).toContain('tool-bash');
  });

  it('chat.tsx does not filter out non-text parts', () => {
    expect(chatSource).not.toContain(
      ".filter((part) => part.type === 'text')",
    );
  });

  it('chat.tsx imports ToolTrace component', () => {
    expect(chatSource).toContain('ToolTrace');
    expect(chatSource).toContain('./tool-trace');
  });

  it('tool-trace.tsx exports a component', () => {
    expect(toolTraceSource).toMatch(/export (function|const) /);
  });

  it('tool-trace.tsx accepts command and output props', () => {
    expect(toolTraceSource).toContain('command');
    expect(toolTraceSource).toContain('output');
  });
});

// --- UI-04: Syntax highlighting ---

describe('UI-04: syntax highlighting', () => {
  it('describes commands in German for non-technical users', () => {
    expect(toolTraceSource).toContain('Lese');
    expect(toolTraceSource).toContain('Suche');
    expect(toolTraceSource).toContain('Durchsuche');
  });

  it('has expandable output section', () => {
    expect(toolTraceSource).toContain('expanded');
    expect(toolTraceSource).toContain('<pre');
  });

  it('uses monospace font for raw output', () => {
    expect(toolTraceSource).toContain('font-mono');
  });

  it('shows animated loading state', () => {
    expect(toolTraceSource).toContain('animate-pulse');
  });

  it('shows result count summary', () => {
    expect(toolTraceSource).toContain('Ergebnis');
  });
});

// --- UI-05: Inline citations ---

describe('UI-05: inline citations', () => {
  it('citation-text.tsx contains CITATION_REGEX', () => {
    expect(citationTextSource).toContain('CITATION_REGEX');
  });

  it('citation-text.tsx uses regex with path pattern', () => {
    expect(citationTextSource).toMatch(/\/\\d/);
  });

  it('citation-text.tsx has citation styling with font-mono', () => {
    expect(citationTextSource).toContain('font-mono');
  });

  it('citation-text.tsx highlights citations with distinct color', () => {
    expect(citationTextSource).toContain('citation');
  });

  it('chat.tsx uses CitationText for text parts', () => {
    expect(chatSource).toContain('CitationText');
    expect(chatSource).toContain('./citation-text');
  });
});

// --- UI-06: Example questions ---

describe('UI-06: example questions', () => {
  it('has German heading "Beispielfragen"', () => {
    expect(exampleQuestionsSource).toContain('Beispielfragen');
  });

  it('contains German question about Nachtraege', () => {
    expect(exampleQuestionsSource).toContain('Nachtraege');
  });

  it('contains German question about Baubesprechung', () => {
    expect(exampleQuestionsSource).toContain('Baubesprechung');
  });

  it('contains German question about Maengel', () => {
    expect(exampleQuestionsSource).toContain('Maengel');
  });

  it('has onSelect click handler prop', () => {
    expect(exampleQuestionsSource).toContain('onSelect');
  });

  it('chat.tsx imports and uses ExampleQuestions', () => {
    expect(chatSource).toContain('ExampleQuestions');
    expect(chatSource).toContain('./example-questions');
  });

  it('chat.tsx conditionally renders when no messages', () => {
    expect(chatSource).toContain('messages.length === 0');
  });
});
