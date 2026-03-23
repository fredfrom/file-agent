'use client';

import { useQuery } from '@tanstack/react-query';
import { useState } from 'react';
import Link from 'next/link';
import { ArrowLeft, FileText, Folder, FolderOpen, Clock, BarChart3, ChevronRight, ChevronDown, X } from 'lucide-react';
import { formatDate } from '@/lib/viewer/format';
import { DocumentViewer } from '@/components/document-viewer';
import { ThemeToggle } from '@/components/theme-toggle';

interface DocEntry {
  virtualPath: string;
  filename: string;
  extension: string;
  createdAt: string;
}

interface FolderEntry {
  name: string;
  count: number;
  documents: DocEntry[];
}

interface Stats {
  totalDocuments: number;
  folders: FolderEntry[];
  extensions: { type: string; count: number }[];
  latestDocument: {
    filename: string;
    folder: string;
    extension: string;
    createdAt: string;
  } | null;
}

function extensionIcon(ext: string) {
  switch (ext.toLowerCase()) {
    case 'pdf': return 'text-red-400';
    case 'xlsx': return 'text-green-400';
    case 'svg': return 'text-purple-400';
    default: return 'text-[var(--muted)]';
  }
}

export default function DashboardPage() {
  const { data, isLoading } = useQuery<Stats>({
    queryKey: ['stats'],
    queryFn: () => fetch('/api/stats').then((r) => r.json()),
  });

  const [expandedFolders, setExpandedFolders] = useState<Set<string>>(new Set());
  const [viewerPath, setViewerPath] = useState<string | null>(null);

  const toggleFolder = (name: string) => {
    setExpandedFolders((prev) => {
      const next = new Set(prev);
      if (next.has(name)) next.delete(name);
      else next.add(name);
      return next;
    });
  };

  return (
    <div className="flex h-screen w-full">
      <div className={`flex flex-col h-full transition-all duration-300 ${viewerPath ? 'w-[40%] min-w-[360px]' : 'w-full max-w-4xl mx-auto'} overflow-y-auto`}>
        <div className="px-6 py-6">
          <div className="flex items-center justify-between mb-8">
            <Link
              href="/"
              className="inline-flex items-center gap-1.5 text-sm text-[var(--muted)] hover:text-[var(--foreground)] transition-colors"
            >
              <ArrowLeft size={16} />
              Zurück zum Chat
            </Link>
            <ThemeToggle />
          </div>

          <h1 className="text-xl font-semibold mb-6">Projektübersicht</h1>

          {isLoading ? (
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
              {[...Array(4)].map((_, i) => (
                <div key={i} className="h-24 rounded-xl bg-[var(--surface)] animate-pulse" />
              ))}
            </div>
          ) : data ? (
            <>
              {/* Key metrics */}
              <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
                <div className="rounded-xl border border-[var(--border)] bg-[var(--surface)] p-4">
                  <div className="flex items-center gap-2 text-[var(--muted)] mb-2">
                    <FileText size={14} />
                    <span className="text-xs">Dokumente</span>
                  </div>
                  <p className="text-2xl font-semibold">{data.totalDocuments}</p>
                </div>

                <div className="rounded-xl border border-[var(--border)] bg-[var(--surface)] p-4">
                  <div className="flex items-center gap-2 text-[var(--muted)] mb-2">
                    <Folder size={14} />
                    <span className="text-xs">Ordner</span>
                  </div>
                  <p className="text-2xl font-semibold">{data.folders.length}</p>
                </div>

                <div className="rounded-xl border border-[var(--border)] bg-[var(--surface)] p-4">
                  <div className="flex items-center gap-2 text-[var(--muted)] mb-2">
                    <BarChart3 size={14} />
                    <span className="text-xs">Dateitypen</span>
                  </div>
                  <p className="text-2xl font-semibold">{data.extensions.length}</p>
                </div>

                <div className="rounded-xl border border-[var(--border)] bg-[var(--surface)] p-4">
                  <div className="flex items-center gap-2 text-[var(--muted)] mb-2">
                    <Clock size={14} />
                    <span className="text-xs">Zuletzt hinzugefügt</span>
                  </div>
                  {data.latestDocument ? (
                    <p className="text-sm font-medium truncate" title={data.latestDocument.filename}>
                      {data.latestDocument.filename}
                    </p>
                  ) : (
                    <p className="text-sm text-[var(--muted)]">–</p>
                  )}
                  {data.latestDocument && (
                    <p className="text-xs text-[var(--muted)] mt-0.5">
                      {formatDate(data.latestDocument.createdAt)}
                    </p>
                  )}
                </div>
              </div>

              {/* Navigable folder tree */}
              <div className="mb-8">
                <h2 className="text-sm font-medium mb-3">Ordnerstruktur</h2>
                <div className="rounded-xl border border-[var(--border)] bg-[var(--surface)] divide-y divide-[var(--border)]">
                  {data.folders.map((folder) => {
                    const isOpen = expandedFolders.has(folder.name);
                    return (
                      <div key={folder.name}>
                        <button
                          type="button"
                          onClick={() => toggleFolder(folder.name)}
                          className="flex items-center justify-between w-full px-4 py-2.5 hover:bg-[var(--surface-2)] transition-colors cursor-pointer text-left"
                        >
                          <div className="flex items-center gap-2">
                            {isOpen ? (
                              <ChevronDown size={14} className="text-[var(--muted)]" />
                            ) : (
                              <ChevronRight size={14} className="text-[var(--muted)]" />
                            )}
                            {isOpen ? (
                              <FolderOpen size={14} className="text-[var(--accent)]" />
                            ) : (
                              <Folder size={14} className="text-[var(--muted)]" />
                            )}
                            <span className="text-sm font-mono">{folder.name}</span>
                          </div>
                          <span className="text-xs text-[var(--muted)]">
                            {folder.count} {folder.count === 1 ? 'Datei' : 'Dateien'}
                          </span>
                        </button>

                        {isOpen && (
                          <div className="bg-[var(--background)]">
                            {folder.documents.map((doc) => (
                              <button
                                key={doc.virtualPath}
                                type="button"
                                onClick={() => setViewerPath(doc.virtualPath)}
                                className={`flex items-center justify-between w-full pl-12 pr-4 py-2 hover:bg-[var(--surface-2)] transition-colors cursor-pointer text-left text-sm ${
                                  viewerPath === doc.virtualPath ? 'bg-[var(--accent-glow)] border-l-2 border-[var(--accent)]' : ''
                                }`}
                              >
                                <div className="flex items-center gap-2 min-w-0">
                                  <FileText size={13} className={`shrink-0 ${extensionIcon(doc.extension)}`} />
                                  <span className="truncate">{doc.filename}</span>
                                  <span className="text-[10px] text-[var(--muted)] font-mono shrink-0">{doc.extension.toUpperCase()}</span>
                                </div>
                                <span className="text-xs text-[var(--muted)] shrink-0 ml-2">
                                  {formatDate(doc.createdAt)}
                                </span>
                              </button>
                            ))}
                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Extension breakdown */}
              <div>
                <h2 className="text-sm font-medium mb-3">Dateitypen</h2>
                <div className="flex flex-wrap gap-2">
                  {data.extensions
                    .sort((a, b) => b.count - a.count)
                    .map((ext) => (
                      <div
                        key={ext.type}
                        className="inline-flex items-center gap-1.5 rounded-lg border border-[var(--border)] bg-[var(--surface)] px-3 py-1.5"
                      >
                        <span className="text-xs font-mono font-medium">{ext.type.toUpperCase()}</span>
                        <span className="text-xs text-[var(--muted)]">{ext.count}</span>
                      </div>
                    ))}
                </div>
              </div>
            </>
          ) : null}
        </div>
      </div>

      {/* Document viewer panel */}
      {viewerPath && (
        <div className="flex flex-col h-full w-[60%] border-l border-[var(--border)] bg-[var(--background)]">
          <div className="flex items-center justify-between px-4 py-3 border-b border-[var(--border)]">
            <h2 className="text-sm font-semibold text-[var(--foreground)]">Dokumentansicht</h2>
            <button
              type="button"
              onClick={() => setViewerPath(null)}
              aria-label="Dokumentansicht schließen"
              className="flex items-center justify-center w-7 h-7 rounded-md text-[var(--muted)] hover:text-[var(--foreground)] hover:bg-[var(--surface-2)] transition-colors"
            >
              <X size={16} />
            </button>
          </div>
          <div className="flex-1 overflow-y-auto">
            <DocumentViewer path={viewerPath} />
          </div>
        </div>
      )}
    </div>
  );
}
