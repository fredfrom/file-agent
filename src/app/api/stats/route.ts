import { NextResponse } from 'next/server';
import { prisma } from '@/lib/db/client';

const PROJECT_ID = '00000000-0000-0000-0000-000000000001';

export async function GET() {
  const [totalDocs, folderStats, latestDoc] = await Promise.all([
    prisma.document.count({ where: { projectId: PROJECT_ID } }),
    prisma.document.groupBy({
      by: ['folder'],
      where: { projectId: PROJECT_ID },
      _count: true,
    }),
    prisma.document.findFirst({
      where: { projectId: PROJECT_ID },
      orderBy: { createdAt: 'desc' },
      select: { filename: true, folder: true, extension: true, createdAt: true },
    }),
  ]);

  const extensionStats = await prisma.document.groupBy({
    by: ['extension'],
    where: { projectId: PROJECT_ID },
    _count: true,
  });

  return NextResponse.json({
    totalDocuments: totalDocs,
    folders: folderStats.map((f) => ({ name: f.folder, count: f._count })),
    extensions: extensionStats.map((e) => ({ type: e.extension, count: e._count })),
    latestDocument: latestDoc
      ? {
          filename: latestDoc.filename,
          folder: latestDoc.folder,
          extension: latestDoc.extension,
          createdAt: latestDoc.createdAt.toISOString(),
        }
      : null,
  });
}
