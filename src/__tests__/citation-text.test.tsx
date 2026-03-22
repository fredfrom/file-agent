// @vitest-environment jsdom
import { describe, it, expect, vi } from 'vitest';
import { render, fireEvent } from '@testing-library/react';
import { CitationText } from '@/components/citation-text';

describe('CitationText', () => {
  it('renders bare path as a button when onCitationClick is provided', () => {
    const onClick = vi.fn();
    const { container } = render(
      <CitationText
        text="Laut /01_vertraege/hauptvertrag.pdf ist der Preis festgelegt."
        onCitationClick={onClick}
      />,
    );

    const buttons = container.querySelectorAll('button');
    expect(buttons.length).toBe(1);
    expect(buttons[0].textContent).toContain('/01_vertraege/hauptvertrag.pdf');
  });

  it('renders new bracket format as a button showing path only', () => {
    const onClick = vi.fn();
    const { container } = render(
      <CitationText
        text='Laut [/01_vertraege/hauptvertrag.pdf | "Der Pauschalpreis betraegt 3.200.000 EUR"] ist der Preis festgelegt.'
        onCitationClick={onClick}
      />,
    );

    const buttons = container.querySelectorAll('button');
    expect(buttons.length).toBe(1);
    expect(buttons[0].textContent).toContain('/01_vertraege/hauptvertrag.pdf');
    // Should NOT show the passage text in the button
    expect(buttons[0].textContent).not.toContain('Pauschalpreis');
  });

  it('calls onCitationClick with path and passage for bracket format', () => {
    const onClick = vi.fn();
    const { container } = render(
      <CitationText
        text='Laut [/01_vertraege/hauptvertrag.pdf | "Der Pauschalpreis betraegt 3.200.000 EUR"] ist der Preis festgelegt.'
        onCitationClick={onClick}
      />,
    );

    const button = container.querySelector('button');
    expect(button).not.toBeNull();
    fireEvent.click(button!);

    expect(onClick).toHaveBeenCalledWith(
      '/01_vertraege/hauptvertrag.pdf',
      'Der Pauschalpreis betraegt 3.200.000 EUR',
    );
  });

  it('calls onCitationClick with path and undefined for bare path format', () => {
    const onClick = vi.fn();
    const { container } = render(
      <CitationText
        text="Laut /01_vertraege/hauptvertrag.pdf ist der Preis festgelegt."
        onCitationClick={onClick}
      />,
    );

    const button = container.querySelector('button');
    expect(button).not.toBeNull();
    fireEvent.click(button!);

    expect(onClick).toHaveBeenCalledWith('/01_vertraege/hauptvertrag.pdf', undefined);
  });

  it('renders non-citation text as regular text', () => {
    const { container } = render(
      <CitationText text="Dies ist normaler Text ohne Zitate." />,
    );

    const buttons = container.querySelectorAll('button');
    expect(buttons.length).toBe(0);
    expect(container.textContent).toContain('Dies ist normaler Text ohne Zitate.');
  });

  it('renders citation as span when onCitationClick is not provided', () => {
    const { container } = render(
      <CitationText text="Laut /01_vertraege/hauptvertrag.pdf ist der Preis festgelegt." />,
    );

    const buttons = container.querySelectorAll('button');
    expect(buttons.length).toBe(0);

    // Should be rendered as a styled span instead
    const spans = container.querySelectorAll('span.inline-flex');
    expect(spans.length).toBe(1);
    expect(spans[0].textContent).toContain('/01_vertraege/hauptvertrag.pdf');
  });

  it('handles multiple citations in one text', () => {
    const onClick = vi.fn();
    const { container } = render(
      <CitationText
        text='Siehe /01_vertraege/hauptvertrag.pdf und [/04_maengel/mangel_001.txt | "Riss in Wand"] fuer Details.'
        onCitationClick={onClick}
      />,
    );

    const buttons = container.querySelectorAll('button');
    expect(buttons.length).toBe(2);
  });
});
