import { prisma } from "./client";
import type { Document } from "@/generated/prisma/client";
import type { DocumentListItem } from "@/lib/ingest/types";

export interface SearchResult {
  id: string;
  virtual_path: string;
  folder: string;
  filename: string;
  extension: string;
  rank: number;
}

/**
 * Full-text search across documents using German tsvector.
 * Returns ranked results matching the search term.
 */
export async function searchDocuments(
  projectId: string,
  searchTerm: string
): Promise<SearchResult[]> {
  const sanitized = searchTerm
    .replace(/[()|&:*!]/g, " ")
    .trim()
    .split(/\s+/)
    .filter(Boolean)
    .join(" & ");

  if (!sanitized) {
    return [];
  }

  return prisma.$queryRaw<SearchResult[]>`
    SELECT id, virtual_path, folder, filename, extension,
           ts_rank(content_tsv, to_tsquery('german', ${sanitized})) AS rank
    FROM documents
    WHERE project_id = ${projectId}::uuid
      AND content_tsv @@ to_tsquery('german', ${sanitized})
    ORDER BY rank DESC
    LIMIT 20
  `;
}

/**
 * List all documents for a project (without content for lightweight listing).
 */
export async function getDocumentsByProject(
  projectId: string
): Promise<
  Pick<
    Document,
    "id" | "virtualPath" | "folder" | "filename" | "extension" | "createdAt"
  >[]
> {
  return prisma.document.findMany({
    where: { projectId },
    select: {
      id: true,
      virtualPath: true,
      folder: true,
      filename: true,
      extension: true,
      createdAt: true,
    },
    orderBy: { virtualPath: "asc" },
  });
}

/**
 * Get a single document by its unique virtual path within a project.
 * Returns full document including content.
 */
export async function getDocumentByPath(
  projectId: string,
  virtualPath: string
): Promise<Document | null> {
  return prisma.document.findUnique({
    where: {
      projectId_virtualPath: {
        projectId,
        virtualPath,
      },
    },
  });
}

/**
 * Get just the content of a document by its virtual path.
 * Returns null if document not found.
 */
export async function getDocumentContent(
  projectId: string,
  virtualPath: string
): Promise<string | null> {
  const result = await prisma.document.findUnique({
    where: {
      projectId_virtualPath: {
        projectId,
        virtualPath,
      },
    },
    select: { content: true },
  });
  return result?.content ?? null;
}

/**
 * Get all virtual paths for a project (for filesystem facade in Phase 13).
 */
export async function getAllVirtualPaths(
  projectId: string
): Promise<string[]> {
  const results = await prisma.document.findMany({
    where: { projectId },
    select: { virtualPath: true },
    orderBy: { virtualPath: "asc" },
  });
  return results.map((r) => r.virtualPath);
}

/**
 * List all documents for a project with character count (for ingestion UI).
 * Computes charCount from content.length to avoid storing redundant data.
 */
export async function getDocumentsWithCharCount(
  projectId: string
): Promise<DocumentListItem[]> {
  const results = await prisma.document.findMany({
    where: { projectId },
    select: {
      id: true,
      virtualPath: true,
      folder: true,
      filename: true,
      extension: true,
      content: true,
      createdAt: true,
    },
    orderBy: { virtualPath: "asc" },
  });
  return results.map((r) => ({
    id: r.id,
    virtualPath: r.virtualPath,
    folder: r.folder,
    filename: r.filename,
    extension: r.extension,
    charCount: r.content.length,
    createdAt: r.createdAt.toISOString(),
  }));
}

/**
 * Insert or update a document (upsert by projectId + virtualPath).
 * Handles re-uploads gracefully by updating content on conflict.
 */
export async function insertDocument(params: {
  projectId: string;
  virtualPath: string;
  folder: string;
  filename: string;
  extension: string;
  content: string;
}): Promise<Document> {
  const { projectId, virtualPath, folder, filename, extension, content } = params;
  return prisma.document.upsert({
    where: {
      projectId_virtualPath: { projectId, virtualPath },
    },
    update: { content, folder, filename, extension },
    create: {
      projectId,
      virtualPath,
      folder,
      filename,
      extension,
      content,
      metadata: {},
    },
  });
}

/**
 * Delete a document by its ID.
 */
export async function deleteDocument(id: string): Promise<void> {
  await prisma.document.delete({ where: { id } });
}
