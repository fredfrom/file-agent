'use client';

import { useQuery } from '@tanstack/react-query';
import { Download, Printer } from 'lucide-react';
import { DocumentContent } from './document-content';
import { formatDate } from '@/lib/viewer/format';
import type { DocumentViewerData } from '@/lib/viewer/types';

interface DocumentViewerProps {
  path: string;
  passage?: string;
}

function getMimeType(extension: string): string {
  switch (extension.toLowerCase()) {
    case '.svg':
      return 'image/svg+xml';
    case '.xlsx':
      return 'text/tab-separated-values';
    default:
      return 'text/plain';
  }
}

export function DocumentViewer({ path, passage }: DocumentViewerProps) {
  const { data, isLoading, error } = useQuery<DocumentViewerData>({
    queryKey: ['document', path],
    queryFn: async () => {
      const res = await fetch(`/api/documents?path=${encodeURIComponent(path)}`);
      if (!res.ok) {
        throw new Error(
          res.status === 404
            ? 'Dokument nicht gefunden. Der Pfad ist möglicherweise nicht mehr gültig.'
            : 'Fehler beim Laden des Dokuments. Bitte versuchen Sie es erneut.',
        );
      }
      return res.json();
    },
    enabled: !!path,
  });

  if (isLoading) {
    return (
      <div className="p-4 space-y-4">
        <div className="h-4 w-3/4 rounded bg-[var(--surface-2)] animate-pulse" />
        <div className="h-16 w-full rounded bg-[var(--surface-2)] animate-pulse" />
        <div className="h-8 w-1/2 rounded bg-[var(--surface-2)] animate-pulse" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-4">
        <div className="bg-red-500/10 border border-red-500/20 rounded-lg p-4 text-[var(--error)] text-sm">
          {(error as Error).message}
        </div>
      </div>
    );
  }

  if (!data) {
    return null;
  }

  const handleDownload = () => {
    const mimeType = getMimeType(data.extension);
    const blob = new Blob([data.content], { type: mimeType });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = data.filename;
    a.click();
    URL.revokeObjectURL(url);
  };

  const handlePrint = () => {
    window.print();
  };

  const metadata = [
    { label: 'Pfad', value: data.path, mono: true },
    { label: 'Ordner', value: data.folder, mono: false },
    { label: 'Typ', value: data.extension.toUpperCase(), mono: false },
    { label: 'Erstellt', value: formatDate(data.createdAt), mono: false },
  ];

  return (
    <div>
      <div className="flex items-center justify-between px-4 py-4 border-b border-[var(--border)]">
        <div className="flex flex-wrap items-center gap-6">
          {metadata.map((m) => (
            <div key={m.label} className="flex flex-col gap-0.5">
              <span className="text-xs text-[var(--muted)]">{m.label}</span>
              <span className={`text-xs text-[var(--foreground)] ${m.mono ? 'font-mono' : ''}`}>
                {m.value}
              </span>
            </div>
          ))}
        </div>
        <div className="flex items-center gap-1">
          <button
            type="button"
            onClick={handleDownload}
            aria-label="Dokument herunterladen"
            className="flex items-center justify-center w-8 h-8 rounded-lg text-[var(--muted)] hover:text-[var(--foreground)] hover:bg-[var(--surface-2)] transition-colors"
          >
            <Download size={16} />
          </button>
          <button
            type="button"
            onClick={handlePrint}
            aria-label="Dokument drucken"
            className="flex items-center justify-center w-8 h-8 rounded-lg text-[var(--muted)] hover:text-[var(--foreground)] hover:bg-[var(--surface-2)] transition-colors"
          >
            <Printer size={16} />
          </button>
        </div>
      </div>
      <div className="viewer-print-area p-4">
        <DocumentContent content={data.content} extension={data.extension} passage={passage} />
      </div>
    </div>
  );
}
