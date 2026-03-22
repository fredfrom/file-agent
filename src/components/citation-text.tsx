'use client';

import ReactMarkdown from 'react-markdown';
import { FileText } from 'lucide-react';

// Matches: [/path/to/file.pdf | "passage text"] or bare /path/to/file.pdf
const CITATION_REGEX = /\[(\/\d{2}_[\w-]+(?:\/[\w.-]+)*)\s*\|\s*"([^"]*)"\]|(\/\d{2}_[\w-]+(?:\/[\w.-]+)*)/g;

interface CitationTextProps {
  text: string;
  onCitationClick?: (path: string, passage?: string) => void;
}

function renderWithCitations(
  text: string,
  onCitationClick?: (path: string, passage?: string) => void,
) {
  const segments: React.ReactNode[] = [];
  const regex = new RegExp(CITATION_REGEX.source, 'g');
  let lastIndex = 0;
  let match: RegExpExecArray | null;
  let key = 0;

  while ((match = regex.exec(text)) !== null) {
    // Text before this match
    if (match.index > lastIndex) {
      segments.push(<span key={key++}>{text.slice(lastIndex, match.index)}</span>);
    }

    const path = match[1] || match[3];
    const passage = match[2] || undefined;

    if (onCitationClick) {
      segments.push(
        <button
          key={key++}
          type="button"
          onClick={() => onCitationClick(path, passage)}
          className="inline-flex items-center gap-1 bg-[var(--citation-bg)] text-[var(--citation-text)] px-2 py-1 rounded-md text-xs font-mono border border-blue-500/10 hover:bg-blue-500/25 hover:border-blue-500/30 cursor-pointer transition-colors"
        >
          <FileText size={10} className="shrink-0 opacity-60" />
          {path}
        </button>,
      );
    } else {
      segments.push(
        <span
          key={key++}
          className="inline-flex items-center gap-1 bg-[var(--citation-bg)] text-[var(--citation-text)] px-1.5 py-0.5 rounded-md text-xs font-mono border border-blue-500/10"
        >
          <FileText size={10} className="shrink-0 opacity-60" />
          {path}
        </span>,
      );
    }

    lastIndex = match.index + match[0].length;
  }

  // Remaining text after last match
  if (lastIndex < text.length) {
    segments.push(<span key={key++}>{text.slice(lastIndex)}</span>);
  }

  // If no matches, return original text
  if (segments.length === 0) {
    return <span>{text}</span>;
  }

  return segments;
}

export function CitationText({ text, onCitationClick }: CitationTextProps) {
  return (
    <div className="prose prose-invert prose-sm max-w-none leading-relaxed [&>*:first-child]:mt-0 [&>*:last-child]:mb-0">
      <ReactMarkdown
        components={{
          p: ({ children }) => (
            <p className="mb-2 last:mb-0 text-[var(--foreground)]">
              {typeof children === 'string'
                ? renderWithCitations(children, onCitationClick)
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
                ? renderWithCitations(children, onCitationClick)
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
