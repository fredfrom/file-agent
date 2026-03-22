'use client';

import { useMutation, useQueryClient } from '@tanstack/react-query';
import { useState, useRef, useCallback } from 'react';
import { Upload, CheckCircle2, XCircle, Loader2 } from 'lucide-react';
import { ACCEPTED_EXTENSIONS, MAX_FILE_SIZE_BYTES } from '@/lib/ingest/constants';
import { FolderSelect } from './folder-select';
import type { UploadFileResult, IngestResponse } from '@/lib/ingest/types';

interface FileStatus {
  filename: string;
  status: 'uploading' | 'success' | 'error';
  error?: string;
}

function validateFiles(files: File[]): {
  valid: File[];
  rejected: Array<{ filename: string; error: string }>;
} {
  const valid: File[] = [];
  const rejected: Array<{ filename: string; error: string }> = [];

  for (const file of files) {
    const ext = file.name.split('.').pop()?.toLowerCase() ?? '';
    if (!(ACCEPTED_EXTENSIONS as readonly string[]).includes(ext)) {
      rejected.push({ filename: file.name, error: 'Nicht unterstuetztes Format' });
      continue;
    }
    if (file.size > MAX_FILE_SIZE_BYTES) {
      rejected.push({ filename: file.name, error: 'Datei zu gross -- maximal 4,5 MB' });
      continue;
    }
    valid.push(file);
  }

  return { valid, rejected };
}

export function UploadZone() {
  const queryClient = useQueryClient();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [isDragging, setIsDragging] = useState(false);
  const [selectedFolder, setSelectedFolder] = useState('');
  const [fileStatuses, setFileStatuses] = useState<FileStatus[]>([]);
  const [stagedFiles, setStagedFiles] = useState<File[]>([]);

  const uploadMutation = useMutation({
    mutationFn: async (files: File[]) => {
      const formData = new FormData();
      for (const file of files) {
        formData.append('files', file);
      }
      formData.append('folder', selectedFolder);
      const res = await fetch('/api/ingest', { method: 'POST', body: formData });
      if (!res.ok) {
        throw new Error(`Upload fehlgeschlagen: ${res.status}`);
      }
      return (await res.json()) as IngestResponse;
    },
    onSuccess: (data) => {
      setFileStatuses((prev) =>
        prev.map((fs) => {
          const result = data.results.find(
            (r: UploadFileResult) => r.filename === fs.filename
          );
          if (!result) return fs;
          return {
            filename: fs.filename,
            status: result.success ? 'success' : 'error',
            error: result.error,
          };
        })
      );
      setStagedFiles([]);
      queryClient.invalidateQueries({ queryKey: ['documents'] });
    },
    onError: () => {
      setFileStatuses((prev) =>
        prev.map((fs) =>
          fs.status === 'uploading'
            ? { ...fs, status: 'error', error: 'Upload fehlgeschlagen' }
            : fs
        )
      );
      setStagedFiles([]);
    },
  });

  const processFiles = useCallback(
    (rawFiles: FileList | File[]) => {
      const files = Array.from(rawFiles);
      const { valid, rejected } = validateFiles(files);

      const rejectedStatuses: FileStatus[] = rejected.map((r) => ({
        filename: r.filename,
        status: 'error' as const,
        error: r.error,
      }));

      const validStatuses: FileStatus[] = valid.map((f) => ({
        filename: f.name,
        status: 'uploading' as const,
      }));

      setFileStatuses([...rejectedStatuses, ...validStatuses]);
      setStagedFiles(valid);
    },
    []
  );

  const handleUpload = useCallback(() => {
    if (stagedFiles.length === 0 || !selectedFolder) return;
    setFileStatuses((prev) =>
      prev.map((fs) =>
        fs.status !== 'error' ? { ...fs, status: 'uploading' } : fs
      )
    );
    uploadMutation.mutate(stagedFiles);
  }, [stagedFiles, selectedFolder, uploadMutation]);

  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(true);
  }, []);

  const handleDragLeave = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
  }, []);

  const handleDrop = useCallback(
    (e: React.DragEvent) => {
      e.preventDefault();
      e.stopPropagation();
      setIsDragging(false);
      processFiles(e.dataTransfer.files);
    },
    [processFiles]
  );

  const handleFileInputChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      if (e.target.files) {
        processFiles(e.target.files);
      }
    },
    [processFiles]
  );

  return (
    <div className="space-y-4">
      <FolderSelect
        value={selectedFolder}
        onChange={setSelectedFolder}
        disabled={uploadMutation.isPending}
      />

      <div
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
        className={`relative flex flex-col items-center gap-3 rounded-xl border-2 border-dashed p-8 transition-colors duration-200 ${
          isDragging
            ? 'border-[var(--accent)] bg-[var(--accent)]/5'
            : 'border-[var(--border)] hover:border-[var(--accent)]/50'
        } ${uploadMutation.isPending ? 'pointer-events-none opacity-50' : ''}`}
      >
        <Upload size={32} className="text-[var(--muted)]" />
        <p className="text-sm font-medium text-[var(--foreground)]">
          Dateien hierher ziehen
        </p>
        <p className="text-xs text-[var(--muted)]">
          PDF, XLSX, SVG, TXT -- max. 4,5 MB
        </p>

        <input
          type="file"
          ref={fileInputRef}
          className="hidden"
          multiple
          accept=".pdf,.xlsx,.svg,.txt"
          onChange={handleFileInputChange}
        />
        <button
          type="button"
          onClick={() => fileInputRef.current?.click()}
          disabled={uploadMutation.isPending}
          className="mt-2 rounded-lg border border-[var(--border)] bg-[var(--surface)] px-4 py-2 text-sm text-[var(--foreground)] hover:bg-[var(--surface-2)] transition-colors disabled:opacity-50"
        >
          Dateien auswaehlen
        </button>
      </div>

      {stagedFiles.length > 0 && (
        <button
          type="button"
          onClick={handleUpload}
          disabled={!selectedFolder || uploadMutation.isPending}
          className="w-full rounded-lg bg-[var(--accent)] px-4 py-2.5 text-sm font-medium text-white hover:bg-[var(--accent-hover)] transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {uploadMutation.isPending ? 'Wird hochgeladen...' : 'Hochladen'}
        </button>
      )}

      {fileStatuses.length > 0 && (
        <ul className="space-y-1.5">
          {fileStatuses.map((fs, i) => (
            <li
              key={`${fs.filename}-${i}`}
              className="flex items-center gap-2 rounded-lg border border-[var(--border)] bg-[var(--surface)] px-3 py-2 text-sm"
            >
              {fs.status === 'uploading' && (
                <Loader2 size={14} className="animate-spin text-[var(--accent)]" />
              )}
              {fs.status === 'success' && (
                <CheckCircle2 size={14} className="text-[var(--green)]" />
              )}
              {fs.status === 'error' && (
                <XCircle size={14} className="text-[var(--error)]" />
              )}
              <span className="flex-1 truncate">{fs.filename}</span>
              {fs.status === 'uploading' && (
                <span className="text-xs text-[var(--muted)]">Wird hochgeladen...</span>
              )}
              {fs.status === 'success' && (
                <span className="text-xs text-[var(--green)]">Erfolgreich</span>
              )}
              {fs.status === 'error' && fs.error && (
                <span className="text-xs text-[var(--error)]">{fs.error}</span>
              )}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
