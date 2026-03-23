'use client';

import { useQuery } from '@tanstack/react-query';
import Link from 'next/link';
import { ArrowLeft, FileText, Folder, Clock, BarChart3 } from 'lucide-react';
import { formatDate } from '@/lib/viewer/format';

interface Stats {
  totalDocuments: number;
  folders: { name: string; count: number }[];
  extensions: { type: string; count: number }[];
  latestDocument: {
    filename: string;
    folder: string;
    extension: string;
    createdAt: string;
  } | null;
}

export default function DashboardPage() {
  const { data, isLoading } = useQuery<Stats>({
    queryKey: ['stats'],
    queryFn: () => fetch('/api/stats').then((r) => r.json()),
  });

  return (
    <div className="min-h-screen max-w-4xl mx-auto w-full px-6 py-6">
      <div className="flex items-center gap-4 mb-8">
        <Link
          href="/"
          className="inline-flex items-center gap-1.5 text-sm text-[var(--muted)] hover:text-[var(--foreground)] transition-colors"
        >
          <ArrowLeft size={16} />
          Zurück zum Chat
        </Link>
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

          {/* Folder breakdown */}
          <div className="mb-8">
            <h2 className="text-sm font-medium mb-3">Ordnerstruktur</h2>
            <div className="rounded-xl border border-[var(--border)] bg-[var(--surface)] divide-y divide-[var(--border)]">
              {data.folders
                .sort((a, b) => a.name.localeCompare(b.name))
                .map((folder) => (
                  <div key={folder.name} className="flex items-center justify-between px-4 py-2.5">
                    <div className="flex items-center gap-2">
                      <Folder size={14} className="text-[var(--muted)]" />
                      <span className="text-sm font-mono">{folder.name}</span>
                    </div>
                    <span className="text-xs text-[var(--muted)]">
                      {folder.count} {folder.count === 1 ? 'Datei' : 'Dateien'}
                    </span>
                  </div>
                ))}
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
  );
}
