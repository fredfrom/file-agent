// @vitest-environment jsdom
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen } from '@testing-library/react';
import { DocumentViewer } from '@/components/document-viewer';

const mockData = {
  path: '/01_Vertraege/hauptvertrag.pdf',
  folder: '01_Vertraege',
  filename: 'hauptvertrag.pdf',
  extension: '.pdf',
  content: 'Contract content here',
  createdAt: '2026-01-15T10:00:00Z',
};

// Mock useQuery from TanStack
vi.mock('@tanstack/react-query', () => ({
  useQuery: vi.fn(),
}));

// We need to import after mocking
import { useQuery } from '@tanstack/react-query';
const mockUseQuery = vi.mocked(useQuery);

describe('DocumentViewer', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('shows loading skeletons when isLoading is true', () => {
    mockUseQuery.mockReturnValue({
      data: undefined,
      isLoading: true,
      error: null,
    } as ReturnType<typeof useQuery>);

    const { container } = render(<DocumentViewer path="/test.pdf" />);
    const pulseElements = container.querySelectorAll('.animate-pulse');
    expect(pulseElements.length).toBe(3);
  });

  it('shows error message when error occurs', () => {
    mockUseQuery.mockReturnValue({
      data: undefined,
      isLoading: false,
      error: new Error('Dokument nicht gefunden. Der Pfad ist moeglicherweise nicht mehr gueltig.'),
    } as ReturnType<typeof useQuery>);

    render(<DocumentViewer path="/test.pdf" />);
    expect(
      screen.getByText('Dokument nicht gefunden. Der Pfad ist moeglicherweise nicht mehr gueltig.'),
    ).toBeDefined();
  });

  it('displays metadata labels when data is loaded', () => {
    mockUseQuery.mockReturnValue({
      data: mockData,
      isLoading: false,
      error: null,
    } as ReturnType<typeof useQuery>);

    render(<DocumentViewer path="/test.pdf" />);
    expect(screen.getByText('Pfad')).toBeDefined();
    expect(screen.getByText('Ordner')).toBeDefined();
    expect(screen.getByText('Typ')).toBeDefined();
    expect(screen.getByText('Erstellt')).toBeDefined();
  });

  it('download button has correct aria-label', () => {
    mockUseQuery.mockReturnValue({
      data: mockData,
      isLoading: false,
      error: null,
    } as ReturnType<typeof useQuery>);

    render(<DocumentViewer path="/test.pdf" />);
    expect(screen.getByLabelText('Dokument herunterladen')).toBeDefined();
  });

  it('print button has correct aria-label', () => {
    mockUseQuery.mockReturnValue({
      data: mockData,
      isLoading: false,
      error: null,
    } as ReturnType<typeof useQuery>);

    render(<DocumentViewer path="/test.pdf" />);
    expect(screen.getByLabelText('Dokument drucken')).toBeDefined();
  });
});
