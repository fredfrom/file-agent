// @vitest-environment jsdom
import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import { DocumentContent } from '@/components/document-content';

describe('DocumentContent', () => {
  it('renders <pre> for .pdf extension', () => {
    const { container } = render(
      <DocumentContent content="PDF document text" extension=".pdf" />,
    );
    const pre = container.querySelector('pre');
    expect(pre).not.toBeNull();
    expect(pre?.textContent).toBe('PDF document text');
  });

  it('renders <pre> for .txt extension', () => {
    const { container } = render(
      <DocumentContent content="Plain text content" extension=".txt" />,
    );
    const pre = container.querySelector('pre');
    expect(pre).not.toBeNull();
    expect(pre?.textContent).toBe('Plain text content');
  });

  it('renders tablecn-pattern table for .xlsx extension', () => {
    const content = "Name\tAlter\tStadt\nMax\t30\tBerlin\nAnna\t25\tMuenchen";
    const { container } = render(
      <DocumentContent content={content} extension=".xlsx" />,
    );
    const table = container.querySelector('table');
    expect(table).not.toBeNull();
    expect(table?.className).toContain('w-full text-sm');

    const ths = container.querySelectorAll('th');
    expect(ths.length).toBe(3);
    expect(ths[0].className).toContain('px-4 py-3 text-left font-medium text-[var(--muted)]');

    const tds = container.querySelectorAll('td');
    expect(tds.length).toBe(6);
    expect(tds[0].className).toContain('px-4 py-2.5');
  });

  it('renders using dangerouslySetInnerHTML for .svg extension', () => {
    const svgContent = '<svg xmlns="http://www.w3.org/2000/svg"><circle r="10"/></svg>';
    const { container } = render(
      <DocumentContent content={svgContent} extension=".svg" />,
    );
    const svg = container.querySelector('svg');
    expect(svg).not.toBeNull();
  });

  it('strips <script> tags from SVG content', () => {
    const svgContent = '<svg><script>alert("xss")</script><circle r="10"/></svg>';
    const { container } = render(
      <DocumentContent content={svgContent} extension=".svg" />,
    );
    const script = container.querySelector('script');
    expect(script).toBeNull();
    const circle = container.querySelector('circle');
    expect(circle).not.toBeNull();
  });

  it('shows "Vorschau als Text" notice for unknown extension', () => {
    render(
      <DocumentContent content="some data" extension=".xyz" />,
    );
    expect(screen.getByText('Vorschau als Text')).toBeDefined();
  });

  it('shows empty state message for empty content', () => {
    render(
      <DocumentContent content="" extension=".pdf" />,
    );
    expect(screen.getByText('Dieses Dokument hat keinen Inhalt')).toBeDefined();
  });

  it('highlights passage when found in content', () => {
    const content = 'This is the start. The passage to find. And the end.';
    const { container } = render(
      <DocumentContent content={content} extension=".pdf" passage="The passage to find" />,
    );
    const mark = container.querySelector('mark');
    expect(mark).not.toBeNull();
    expect(mark?.textContent).toBe('The passage to find');
  });
});
