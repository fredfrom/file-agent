import { describe, it, expect } from 'vitest';
import { readFileSync } from 'node:fs';
import { join } from 'node:path';

// --- Chat component (UI-01, UI-02, UI-07) ---

const chatSource = readFileSync(
  join(process.cwd(), 'src/components/chat.tsx'),
  'utf-8',
);

describe('Chat component (src/components/chat.tsx)', () => {
  // UI-01: Basic chat interface
  describe('UI-01: chat interface elements', () => {
    it('has use client directive', () => {
      expect(chatSource).toContain("'use client'");
    });

    it('imports useChat from @ai-sdk/react', () => {
      expect(chatSource).toContain('useChat');
      expect(chatSource).toContain('@ai-sdk/react');
    });

    it('renders an input element with German placeholder', () => {
      expect(chatSource).toContain('Stellen Sie eine Frage');
    });

    it('renders a submit button', () => {
      expect(chatSource).toContain('type="submit"');
    });
  });

  // UI-02: AI SDK 6 streaming patterns
  describe('UI-02: SDK 6 patterns', () => {
    it('uses sendMessage not handleSubmit (SDK 6)', () => {
      expect(chatSource).toContain('sendMessage');
      expect(chatSource).not.toContain('handleSubmit');
    });

    it('uses status not isLoading (SDK 6)', () => {
      expect(chatSource).toContain('status');
      expect(chatSource).not.toContain('isLoading');
    });

    it('renders message parts not content (SDK 6)', () => {
      expect(chatSource).toContain('.parts');
      expect(chatSource).not.toContain('message.content');
    });

    it('shows streaming status indicator', () => {
      expect(chatSource).toContain('Denke nach');
    });
  });

  // UI-07: German localization
  describe('UI-07: German text', () => {
    it('has German error text', () => {
      expect(chatSource).toContain('Fehler');
    });

    it('does not contain English UI text', () => {
      expect(chatSource).not.toContain('Loading...');
      expect(chatSource).not.toContain('Send message');
      expect(chatSource).not.toContain('Type a message');
      expect(chatSource).not.toContain('Error:');
    });
  });
});

// --- Layout ---

const layoutSource = readFileSync(
  join(process.cwd(), 'src/app/layout.tsx'),
  'utf-8',
);

describe('Layout (src/app/layout.tsx)', () => {
  it('sets lang to de', () => {
    expect(layoutSource).toContain('lang="de"');
  });

  it('has German metadata title', () => {
    expect(layoutSource).toContain('Bauakte Agent');
  });

  it('has German metadata description', () => {
    expect(layoutSource).toContain('Dokumentennavigation');
  });
});

// --- Page ---

const pageSource = readFileSync(
  join(process.cwd(), 'src/app/page.tsx'),
  'utf-8',
);

describe('Page (src/app/page.tsx)', () => {
  it('imports and renders Chat component', () => {
    expect(pageSource).toContain('Chat');
    expect(pageSource).toContain('components/chat');
  });
});
