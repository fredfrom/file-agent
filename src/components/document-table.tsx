'use client';

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useState, useMemo } from 'react';
import { Trash2, ArrowUpDown, FileText } from 'lucide-react';
import type { DocumentListItem } from '@/lib/ingest/types';

type SortField = 'virtualPath' | 'folder' | 'extension' | 'charCount' | 'createdAt';
type SortDirection = 'asc' | 'desc';

export function DocumentTable() {
  const queryClient = useQueryClient();
  const [sortField, setSortField] = useState<SortField>('virtualPath');
  const [sortDirection, setSortDirection] = useState<SortDirection>('asc');

  const { data, isLoading, error } = useQuery({
    queryKey: ['documents'],
    queryFn: async () => {
      const r = await fetch('/api/ingest');
      if (!r.ok) throw new Error('Fehler beim Laden der Dokumente');
      const d = await r.json();
      return (d.documents ?? []) as DocumentListItem[];
    },
  });

  const deleteMutation = useMutation({
    mutationFn: (id: string) =>
      fetch(`/api/ingest?id=${id}`, { method: 'DELETE' }).then((r) => r.json()),
    onSuccess: () =>
      queryClient.invalidateQueries({ queryKey: ['documents'] }),
  });

  function handleSort(field: SortField) {
    if (field === sortField) {
      setSortDirection((prev) => (prev === 'asc' ? 'desc' : 'asc'));
    } else {
      setSortField(field);
      setSortDirection('asc');
    }
  }

  const sortedData = useMemo(() => {
    if (!data) return [];
    return [...data].sort((a, b) => {
      const dir = sortDirection === 'asc' ? 1 : -1;
      if (sortField === 'charCount') {
        return (a.charCount - b.charCount) * dir;
      }
      if (sortField === 'createdAt') {
        return (new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime()) * dir;
      }
      return a[sortField].localeCompare(b[sortField], 'de') * dir;
    });
  }, [data, sortField, sortDirection]);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-12 text-sm text-[var(--muted)]">
        Dokumente werden geladen...
      </div>
    );
  }

  if (error) {
    return (
      <div className="rounded-lg border border-red-500/20 bg-red-500/10 px-4 py-3 text-sm text-[var(--error)]">
        Fehler beim Laden der Dokumente
      </div>
    );
  }

  if (!data || data.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center gap-3 rounded-xl border border-[var(--border)] bg-[var(--surface)] py-16 text-center">
        <FileText size={32} className="text-[var(--muted)]" />
        <p className="text-sm text-[var(--muted)]">
          Noch keine Dokumente vorhanden. Laden Sie Dokumente hoch, um zu beginnen.
        </p>
      </div>
    );
  }

  const columns: { field: SortField; label: string }[] = [
    { field: 'virtualPath', label: 'Pfad' },
    { field: 'folder', label: 'Ordner' },
    { field: 'extension', label: 'Typ' },
    { field: 'charCount', label: 'Zeichen' },
    { field: 'createdAt', label: 'Erstellt' },
  ];

  return (
    <div className="overflow-x-auto rounded-xl border border-[var(--border)]">
      <table className="w-full text-sm">
        <thead>
          <tr className="border-b border-[var(--border)] bg-[var(--surface)]">
            {columns.map((col) => (
              <th
                key={col.field}
                className="px-4 py-3 text-left font-medium text-[var(--muted)] cursor-pointer select-none hover:text-[var(--foreground)] transition-colors"
                onClick={() => handleSort(col.field)}
              >
                <span className="inline-flex items-center gap-1.5">
                  {col.label}
                  <ArrowUpDown
                    size={13}
                    className={
                      sortField === col.field
                        ? 'text-[var(--accent)]'
                        : 'text-[var(--muted)]/50'
                    }
                  />
                </span>
              </th>
            ))}
            <th className="w-12 px-4 py-3" />
          </tr>
        </thead>
        <tbody>
          {sortedData.map((doc) => (
            <tr
              key={doc.id}
              className="border-b border-[var(--border)] last:border-b-0 hover:bg-[var(--surface)] transition-colors"
            >
              <td className="px-4 py-2.5 font-mono text-xs">{doc.virtualPath}</td>
              <td className="px-4 py-2.5">{doc.folder}</td>
              <td className="px-4 py-2.5 uppercase">{doc.extension}</td>
              <td className="px-4 py-2.5 tabular-nums">{doc.charCount.toLocaleString('de-DE')}</td>
              <td className="px-4 py-2.5">
                {new Date(doc.createdAt).toLocaleDateString('de-DE')}
              </td>
              <td className="px-4 py-2.5">
                <button
                  type="button"
                  onClick={() => {
                    if (window.confirm('Dokument wirklich loeschen?')) {
                      deleteMutation.mutate(doc.id);
                    }
                  }}
                  disabled={deleteMutation.isPending}
                  className="rounded-md p-1.5 text-[var(--muted)] hover:text-[var(--error)] hover:bg-[var(--error)]/10 transition-colors disabled:opacity-50"
                  aria-label="Dokument loeschen"
                >
                  <Trash2 size={14} />
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
