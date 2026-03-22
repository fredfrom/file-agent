'use client';

import ReactMarkdown from 'react-markdown';
import { FileText } from 'lucide-react';

const CITATION_REGEX = /(\/\d{2}_[\w-]+(?:\/[\w.-]+)*)/g;

interface CitationTextProps {
  text: string;
}

function renderWithCitations(text: string) {
  const parts = text.split(CITATION_REGEX);

  return parts.map((segment, i) => {
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
  });
}

export function CitationText({ text }: CitationTextProps) {
  return (
    <div className="prose prose-invert prose-sm max-w-none leading-relaxed [&>*:first-child]:mt-0 [&>*:last-child]:mb-0">
      <ReactMarkdown
        components={{
          p: ({ children }) => (
            <p className="mb-2 last:mb-0 text-[var(--foreground)]">
              {typeof children === 'string'
                ? renderWithCitations(children)
                : children}
            </p>
          ),
          strong: ({ children }) => (
            <strong className="font-semibold text-[var(--foreground)]">
              {children}
            </strong>
          ),
          ul: ({ children }) => (
            <ul className="list-disc list-inside space-y-1 mb-2 text-[var(--foreground)]">
              {children}
            </ul>
          ),
          ol: ({ children }) => (
            <ol className="list-decimal list-inside space-y-1 mb-2 text-[var(--foreground)]">
              {children}
            </ol>
          ),
          li: ({ children }) => (
            <li className="text-sm text-[var(--foreground)]">
              {typeof children === 'string'
                ? renderWithCitations(children)
                : children}
            </li>
          ),
          h1: ({ children }) => (
            <h3 className="text-base font-semibold mt-3 mb-1 text-[var(--foreground)]">{children}</h3>
          ),
          h2: ({ children }) => (
            <h3 className="text-base font-semibold mt-3 mb-1 text-[var(--foreground)]">{children}</h3>
          ),
          h3: ({ children }) => (
            <h4 className="text-sm font-semibold mt-2 mb-1 text-[var(--foreground)]">{children}</h4>
          ),
          code: ({ children }) => (
            <code className="px-1.5 py-0.5 bg-[var(--surface-2)] rounded text-xs font-mono text-[var(--citation-text)]">
              {children}
            </code>
          ),
          hr: () => <hr className="border-[var(--border)] my-3" />,
        }}
      >
        {text}
      </ReactMarkdown>
    </div>
  );
}
