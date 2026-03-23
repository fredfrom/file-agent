'use client';

import Link from 'next/link';
import { ArrowLeft, Building2 } from 'lucide-react';
import { UploadZone } from '@/components/upload-zone';
import { DocumentTable } from '@/components/document-table';

export default function IngestPage() {
  return (
    <div className="min-h-screen max-w-6xl mx-auto w-full px-6 py-6">
      {/* Header */}
      <div className="flex items-center gap-4 mb-8">
        <Link
          href="/"
          className="inline-flex items-center gap-1.5 text-sm text-[var(--muted)] hover:text-[var(--foreground)] transition-colors"
        >
          <ArrowLeft size={16} />
          Zurück zum Chat
        </Link>
      </div>

      <div className="flex items-center gap-3 mb-8">
        <div className="flex items-center justify-center w-9 h-9 rounded-lg bg-[var(--accent-glow)] border border-[var(--accent)]/20">
          <Building2 size={18} className="text-[var(--accent)]" />
        </div>
        <h1 className="text-xl font-semibold tracking-tight">Dokumente verwalten</h1>
      </div>

      {/* Upload Zone */}
      <UploadZone />

      {/* Spacer */}
      <div className="my-8" />

      {/* Document Table */}
      <DocumentTable />
    </div>
  );
}
