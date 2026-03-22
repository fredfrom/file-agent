import { describe, it, expect, vi, beforeEach } from 'vitest';

// Mock the DB queries module before importing the route
vi.mock('@/lib/db/queries', () => ({
  getDocumentsWithCharCount: vi.fn(),
  insertDocument: vi.fn(),
  deleteDocument: vi.fn(),
  // Keep other exports as stubs so the module loads
  searchDocuments: vi.fn(),
  getDocumentsByProject: vi.fn(),
  getDocumentByPath: vi.fn(),
  getDocumentContent: vi.fn(),
  getAllVirtualPaths: vi.fn(),
}));

import { GET, POST, DELETE } from '@/app/api/ingest/route';
import { getDocumentsWithCharCount, insertDocument, deleteDocument } from '@/lib/db/queries';

const mockGetDocs = vi.mocked(getDocumentsWithCharCount);
const mockInsert = vi.mocked(insertDocument);
const mockDelete = vi.mocked(deleteDocument);

beforeEach(() => {
  vi.clearAllMocks();
});

describe('GET /api/ingest', () => {
  it('returns document list from DB', async () => {
    mockGetDocs.mockResolvedValue([
      {
        id: '1',
        virtualPath: '/01_vertraege/vertrag.pdf',
        folder: '/01_vertraege',
        filename: 'vertrag',
        extension: 'pdf',
        charCount: 1234,
        createdAt: '2026-01-01T00:00:00.000Z',
      },
    ]);

    const res = await GET();
    const body = await res.json();

    expect(res.status).toBe(200);
    expect(body.documents).toHaveLength(1);
    expect(body.documents[0].virtualPath).toBe('/01_vertraege/vertrag.pdf');
    expect(mockGetDocs).toHaveBeenCalledOnce();
  });

  it('returns empty array when no documents', async () => {
    mockGetDocs.mockResolvedValue([]);

    const res = await GET();
    const body = await res.json();

    expect(body.documents).toEqual([]);
  });
});

describe('POST /api/ingest', () => {
  function makeRequest(files: File[], folder?: string): Request {
    const formData = new FormData();
    if (folder) formData.append('folder', folder);
    for (const file of files) {
      formData.append('files', file);
    }
    return new Request('http://localhost/api/ingest', {
      method: 'POST',
      body: formData,
    });
  }

  it('returns 400 when folder is missing', async () => {
    const file = new File(['hello'], 'test.txt', { type: 'text/plain' });
    const req = makeRequest([file]);
    const res = await POST(req);
    const body = await res.json();

    expect(res.status).toBe(400);
    expect(body.error).toBe('Zielordner ist erforderlich');
  });

  it('returns 400 when no files provided', async () => {
    const req = makeRequest([], '/01_vertraege');
    const res = await POST(req);
    const body = await res.json();

    expect(res.status).toBe(400);
    expect(body.error).toBe('Keine Dateien ausgewaehlt');
  });

  it('uploads a .txt file successfully', async () => {
    mockInsert.mockResolvedValue({
      id: 'new-id',
      projectId: '00000000-0000-0000-0000-000000000001',
      virtualPath: '/01_vertraege/test.txt',
      folder: '/01_vertraege',
      filename: 'test',
      extension: 'txt',
      content: 'Hallo Welt',
      metadata: {},
      createdAt: new Date(),
    });

    const file = new File(['Hallo Welt'], 'test.txt', { type: 'text/plain' });
    const req = makeRequest([file], '/01_vertraege');
    const res = await POST(req);
    const body = await res.json();

    expect(res.status).toBe(200);
    expect(body.results).toHaveLength(1);
    expect(body.results[0]).toMatchObject({
      filename: 'test.txt',
      success: true,
      virtualPath: '/01_vertraege/test.txt',
    });
    expect(mockInsert).toHaveBeenCalledWith(
      expect.objectContaining({
        virtualPath: '/01_vertraege/test.txt',
        folder: '/01_vertraege',
        filename: 'test',
        extension: 'txt',
        content: 'Hallo Welt',
      })
    );
  });

  it('uploads an .svg file successfully', async () => {
    mockInsert.mockResolvedValue({
      id: 'svg-id',
      projectId: '00000000-0000-0000-0000-000000000001',
      virtualPath: '/05_plaene/grundriss.svg',
      folder: '/05_plaene',
      filename: 'grundriss',
      extension: 'svg',
      content: '<svg>plan</svg>',
      metadata: {},
      createdAt: new Date(),
    });

    const file = new File(['<svg>plan</svg>'], 'grundriss.svg', { type: 'image/svg+xml' });
    const req = makeRequest([file], '/05_plaene');
    const res = await POST(req);
    const body = await res.json();

    expect(body.results[0].success).toBe(true);
    expect(body.results[0].virtualPath).toBe('/05_plaene/grundriss.svg');
  });

  it('rejects unsupported file extension', async () => {
    const file = new File(['data'], 'report.doc', { type: 'application/msword' });
    const req = makeRequest([file], '/01_vertraege');
    const res = await POST(req);
    const body = await res.json();

    expect(body.results[0]).toMatchObject({
      filename: 'report.doc',
      success: false,
      error: 'Nicht unterstuetztes Format: doc',
    });
    expect(mockInsert).not.toHaveBeenCalled();
  });

  it('rejects file exceeding size limit', async () => {
    // Create a file > 4.5MB
    const bigContent = 'x'.repeat(4_500_001);
    const file = new File([bigContent], 'huge.txt', { type: 'text/plain' });
    const req = makeRequest([file], '/01_vertraege');
    const res = await POST(req);
    const body = await res.json();

    expect(body.results[0]).toMatchObject({
      filename: 'huge.txt',
      success: false,
      error: 'Datei zu gross -- maximal 4,5 MB',
    });
    expect(mockInsert).not.toHaveBeenCalled();
  });

  it('handles multiple files with mixed success', async () => {
    mockInsert.mockResolvedValue({
      id: 'ok-id',
      projectId: '00000000-0000-0000-0000-000000000001',
      virtualPath: '/01_vertraege/ok.txt',
      folder: '/01_vertraege',
      filename: 'ok',
      extension: 'txt',
      content: 'ok',
      metadata: {},
      createdAt: new Date(),
    });

    const goodFile = new File(['ok'], 'ok.txt', { type: 'text/plain' });
    const badFile = new File(['nope'], 'bad.exe', { type: 'application/octet-stream' });
    const req = makeRequest([goodFile, badFile], '/01_vertraege');
    const res = await POST(req);
    const body = await res.json();

    expect(body.results).toHaveLength(2);
    expect(body.results[0].success).toBe(true);
    expect(body.results[1].success).toBe(false);
  });
});

describe('DELETE /api/ingest', () => {
  it('deletes a document by id', async () => {
    mockDelete.mockResolvedValue(undefined);

    const req = new Request('http://localhost/api/ingest?id=some-uuid', {
      method: 'DELETE',
    });
    const res = await DELETE(req);
    const body = await res.json();

    expect(res.status).toBe(200);
    expect(body.success).toBe(true);
    expect(mockDelete).toHaveBeenCalledWith('some-uuid');
  });

  it('returns 400 when id is missing', async () => {
    const req = new Request('http://localhost/api/ingest', {
      method: 'DELETE',
    });
    const res = await DELETE(req);
    const body = await res.json();

    expect(res.status).toBe(400);
  });

  it('returns 500 when delete fails', async () => {
    mockDelete.mockRejectedValue(new Error('DB error'));

    const req = new Request('http://localhost/api/ingest?id=bad-id', {
      method: 'DELETE',
    });
    const res = await DELETE(req);
    const body = await res.json();

    expect(res.status).toBe(500);
    expect(body.error).toBe('Dokument konnte nicht geloescht werden');
  });
});
