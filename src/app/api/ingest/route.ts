import { PROJECT_ID, ACCEPTED_EXTENSIONS, MAX_FILE_SIZE_BYTES } from '@/lib/ingest/constants';
import { parseByExtension, buildVirtualPath, parseVirtualPath } from '@/lib/ingest/parse';
import { getDocumentsWithCharCount, insertDocument, deleteDocument } from '@/lib/db/queries';
import type { UploadFileResult } from '@/lib/ingest/types';
import path from 'node:path';

export const maxDuration = 60;

/**
 * GET /api/ingest -- List all documents with character counts.
 */
export async function GET() {
  const documents = await getDocumentsWithCharCount(PROJECT_ID);
  return Response.json({ documents });
}

/**
 * POST /api/ingest -- Upload, parse, and store files.
 * Accepts FormData with 'files' (File[]) and 'folder' (string).
 * Returns per-file success/error results.
 */
export async function POST(req: Request) {
  const formData = await req.formData();
  const files = formData.getAll('files') as File[];
  const folder = formData.get('folder') as string;

  if (!folder) {
    return Response.json({ error: 'Zielordner ist erforderlich' }, { status: 400 });
  }

  if (!files || files.length === 0) {
    return Response.json({ error: 'Keine Dateien ausgewaehlt' }, { status: 400 });
  }

  const results: UploadFileResult[] = [];

  for (const file of files) {
    try {
      const buffer = Buffer.from(await file.arrayBuffer());

      // Validate file size
      if (buffer.byteLength > MAX_FILE_SIZE_BYTES) {
        results.push({
          filename: file.name,
          success: false,
          error: 'Datei zu gross -- maximal 4,5 MB',
        });
        continue;
      }

      // Validate extension
      const ext = path.extname(file.name).slice(1).toLowerCase();
      if (!ACCEPTED_EXTENSIONS.includes(ext as typeof ACCEPTED_EXTENSIONS[number])) {
        results.push({
          filename: file.name,
          success: false,
          error: `Nicht unterstuetztes Format: ${ext}`,
        });
        continue;
      }

      // Parse file content
      const content = await parseByExtension(file.name, buffer);

      // Build virtual path and parse components
      const virtualPath = buildVirtualPath(folder, file.name);
      const { folder: parsedFolder, filename, extension } = parseVirtualPath(virtualPath);

      // Upsert into database
      await insertDocument({
        projectId: PROJECT_ID,
        virtualPath,
        folder: parsedFolder,
        filename,
        extension,
        content,
      });

      results.push({
        filename: file.name,
        success: true,
        virtualPath,
      });
    } catch (error) {
      results.push({
        filename: file.name,
        success: false,
        error: String(error),
      });
    }
  }

  return Response.json({ results });
}

/**
 * DELETE /api/ingest?id=uuid -- Remove a document by ID.
 */
export async function DELETE(req: Request) {
  const id = new URL(req.url).searchParams.get('id');

  if (!id) {
    return Response.json({ error: 'Dokument-ID ist erforderlich' }, { status: 400 });
  }

  try {
    await deleteDocument(id);
    return Response.json({ success: true });
  } catch {
    return Response.json(
      { error: 'Dokument konnte nicht geloescht werden' },
      { status: 500 }
    );
  }
}
