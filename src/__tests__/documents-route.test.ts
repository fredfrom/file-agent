import { describe, it, expect, vi, beforeEach } from 'vitest';
import { GET } from '@/app/api/documents/route';
import { NextRequest } from 'next/server';

vi.mock('@/lib/db/queries', () => ({
  getDocumentByPath: vi.fn(),
}));

vi.mock('@/lib/ingest/constants', () => ({
  PROJECT_ID: 'test-project-id',
}));

import { getDocumentByPath } from '@/lib/db/queries';
const mockGetDocumentByPath = vi.mocked(getDocumentByPath);

describe('GET /api/documents', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('returns 400 when path parameter is missing', async () => {
    const req = new NextRequest('http://localhost/api/documents');
    const res = await GET(req);
    expect(res.status).toBe(400);
    const body = await res.json();
    expect(body).toEqual({ error: 'Missing path parameter' });
  });

  it('returns 404 when document is not found', async () => {
    mockGetDocumentByPath.mockResolvedValue(null);
    const req = new NextRequest('http://localhost/api/documents?path=/test/missing.pdf');
    const res = await GET(req);
    expect(res.status).toBe(404);
    const body = await res.json();
    expect(body).toEqual({ error: 'Document not found' });
  });

  it('returns 200 with document data for valid path', async () => {
    const mockDoc = {
      id: 'doc-1',
      projectId: 'test-project-id',
      virtualPath: '/test/file.pdf',
      folder: '/test',
      filename: 'file.pdf',
      extension: 'pdf',
      content: 'Some document content',
      metadata: {},
      createdAt: new Date('2024-06-15T10:30:00.000Z'),
    };
    mockGetDocumentByPath.mockResolvedValue(mockDoc);

    const req = new NextRequest('http://localhost/api/documents?path=/test/file.pdf');
    const res = await GET(req);
    expect(res.status).toBe(200);

    const body = await res.json();
    expect(body).toEqual({
      path: '/test/file.pdf',
      folder: '/test',
      filename: 'file.pdf',
      extension: 'pdf',
      content: 'Some document content',
      createdAt: '2024-06-15T10:30:00.000Z',
    });
  });
});
