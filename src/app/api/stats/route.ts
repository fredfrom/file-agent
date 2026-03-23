import { NextResponse } from 'next/server';
import { prisma } from '@/lib/db/client';

const PROJECT_ID = '00000000-0000-0000-0000-000000000001';

export async function GET() {
  const [totalDocs, allDocs, latestDoc, extensionStats] = await Promise.all([
    prisma.document.count({ where: { projectId: PROJECT_ID } }),
    prisma.document.findMany({
      where: { projectId: PROJECT_ID },
      select: {
        virtualPath: true,
        folder: true,
        filename: true,
        extension: true,
        createdAt: true,
      },
      orderBy: { virtualPath: 'asc' },
    }),
    prisma.document.findFirst({
      where: { projectId: PROJECT_ID },
      orderBy: { createdAt: 'desc' },
      select: { filename: true, folder: true, extension: true, createdAt: true },
    }),
    prisma.document.groupBy({
      by: ['extension'],
      where: { projectId: PROJECT_ID },
      _count: true,
    }),
  ]);

  // Group documents by folder
  const folderMap = new Map<string, typeof allDocs>();
  for (const doc of allDocs) {
    const list = folderMap.get(doc.folder) ?? [];
    list.push(doc);
    folderMap.set(doc.folder, list);
  }

  const folders = [...folderMap.entries()]
    .sort(([a], [b]) => a.localeCompare(b))
    .map(([name, docs]) => ({
      name,
      count: docs.length,
      documents: docs.map((d) => ({
        virtualPath: d.virtualPath,
        filename: d.filename,
        extension: d.extension,
        createdAt: d.createdAt.toISOString(),
      })),
    }));

  return NextResponse.json({
    totalDocuments: totalDocs,
    folders,
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
