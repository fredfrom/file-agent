'use client';

import { FileText } from 'lucide-react';

const CITATION_REGEX = /(\/\d{2}_[\w-]+(?:\/[\w.-]+)*)/g;

interface CitationTextProps {
  text: string;
}

export function CitationText({ text }: CitationTextProps) {
  const parts = text.split(CITATION_REGEX);

  return (
    <p className="whitespace-pre-wrap text-sm leading-relaxed text-[var(--foreground)]">
      {parts.map((segment, i) => {
        if (CITATION_REGEX.test(segment)) {
          CITATION_REGEX.lastIndex = 0;
          return (
            <span
              key={i}
              className="inline-flex items-center gap-1 bg-[var(--citation-bg)] text-[var(--citation-text)] px-1.5 py-0.5 rounded-md text-xs font-mono border border-blue-500/10"
            >
              <FileText size={10} className="shrink-0 opacity-60" />
              {segment}
            </span>
          );
        }
        return <span key={i}>{segment}</span>;
      })}
    </p>
  );
}
