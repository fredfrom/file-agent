import { NextRequest, NextResponse } from 'next/server';
import { getDocumentByPath } from '@/lib/db/queries';
import { PROJECT_ID } from '@/lib/ingest/constants';

export async function GET(req: NextRequest) {
  const path = req.nextUrl.searchParams.get('path');
  if (!path) {
    return NextResponse.json(
      { error: 'Missing path parameter' },
      { status: 400 }
    );
  }

  const doc = await getDocumentByPath(PROJECT_ID, path);
  if (!doc) {
    return NextResponse.json(
      { error: 'Document not found' },
      { status: 404 }
    );
  }

  return NextResponse.json({
    path: doc.virtualPath,
    folder: doc.folder,
    filename: doc.filename,
    extension: doc.extension,
    content: doc.content,
    createdAt: doc.createdAt.toISOString(),
  });
}
