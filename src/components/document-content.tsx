'use client';

import { useRef, useEffect, useState } from 'react';
import { FileText } from 'lucide-react';
import { findPassageIndex } from '@/lib/viewer/highlight';
import { parseTabularContent } from '@/lib/viewer/parse';

interface DocumentContentProps {
  content: string;
  extension: string;
  passage?: string;
}

function TextRenderer({ content, passage }: { content: string; passage?: string }) {
  const highlightRef = useRef<HTMLElement>(null);

  useEffect(() => {
    if (highlightRef.current && typeof highlightRef.current.scrollIntoView === 'function') {
      highlightRef.current.scrollIntoView({ behavior: 'smooth', block: 'center' });
    }
  }, []);

  if (passage) {
    const index = findPassageIndex(content, passage);
    if (index >= 0) {
      const before = content.slice(0, index);
      const highlighted = content.slice(index, index + passage.length);
      const after = content.slice(index + passage.length);

      return (
        <pre className="whitespace-pre-wrap break-words font-mono text-xs leading-relaxed p-6 text-[var(--foreground)]">
          {before}
          <mark ref={highlightRef} className="bg-yellow-500/20 border-l-2 border-yellow-400 px-1.5 py-0.5 rounded-sm text-[var(--foreground)]">
            {highlighted}
          </mark>
          {after}
        </pre>
      );
    }
  }

  return (
    <pre className="whitespace-pre-wrap break-words font-mono text-xs leading-relaxed p-6 text-[var(--foreground)]">
      {content}
    </pre>
  );
}

function TableRenderer({ content }: { content: string }) {
  const [activeSheet, setActiveSheet] = useState(0);
  const { sheets } = parseTabularContent(content);

  if (sheets.length === 0) {
    return null;
  }

  const sheet = sheets[activeSheet];
  const headerRow = sheet.rows[0] || [];
  const bodyRows = sheet.rows.slice(1);

  return (
    <div className="p-6">
      {sheets.length > 1 && (
        <div className="flex gap-2 mb-4 border-b border-[var(--border)]">
          {sheets.map((s, i) => (
            <button
              key={s.name}
              type="button"
              onClick={() => setActiveSheet(i)}
              className={`text-xs px-3 py-1.5 transition-colors ${
                i === activeSheet
                  ? 'border-b-2 border-[var(--accent)] text-[var(--foreground)]'
                  : 'text-[var(--muted)]'
              }`}
            >
              {s.name}
            </button>
          ))}
        </div>
      )}
      <div className="overflow-x-auto rounded-xl border border-[var(--border)]">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-[var(--border)] bg-[var(--surface)]">
              {headerRow.map((cell, i) => (
                <th key={i} className="px-4 py-3 text-left font-medium text-[var(--muted)]">
                  {cell}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {bodyRows.map((row, ri) => (
              <tr key={ri} className="border-b border-[var(--border)] last:border-b-0 hover:bg-[var(--surface)] transition-colors">
                {row.map((cell, ci) => (
                  <td key={ci} className="px-4 py-2.5">
                    {cell}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

function SvgRenderer({ content }: { content: string }) {
  // Render SVG as a sandboxed image to prevent XSS — no script execution possible
  const dataUrl = `data:image/svg+xml;base64,${btoa(unescape(encodeURIComponent(content)))}`;

  return (
    <div
      className="bg-white rounded-lg p-4 overflow-auto"
      style={{ maxHeight: 'calc(100vh - 160px)' }}
    >
      <img src={dataUrl} alt="SVG Dokument" className="w-full h-auto" />
    </div>
  );
}

export function DocumentContent({ content, extension, passage }: DocumentContentProps) {
  if (!content) {
    return (
      <div className="flex flex-col items-center justify-center py-16 gap-3">
        <FileText size={32} className="text-[var(--muted)]" />
        <p className="text-sm text-[var(--muted)]">Dieses Dokument hat keinen Inhalt</p>
      </div>
    );
  }

  const ext = extension.toLowerCase();

  if (ext === '.xlsx') {
    return <TableRenderer content={content} />;
  }

  if (ext === '.svg') {
    return <SvgRenderer content={content} />;
  }

  if (ext === '.pdf' || ext === '.txt') {
    return <TextRenderer content={content} passage={passage} />;
  }

  // Unknown type fallback
  return (
    <div>
      <p className="text-xs text-[var(--muted)] mb-2 px-6 pt-4">Vorschau als Text</p>
      <TextRenderer content={content} passage={passage} />
    </div>
  );
}
