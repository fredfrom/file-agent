'use client';

const CITATION_REGEX = /(\/\d{2}_[\w-]+(?:\/[\w.-]+)*)/g;

interface CitationTextProps {
  text: string;
}

export function CitationText({ text }: CitationTextProps) {
  const parts = text.split(CITATION_REGEX);

  return (
    <p className="whitespace-pre-wrap">
      {parts.map((segment, i) => {
        if (CITATION_REGEX.test(segment)) {
          // Reset lastIndex since we use the global flag
          CITATION_REGEX.lastIndex = 0;
          return (
            <span
              key={i}
              className="bg-blue-50 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300 px-1 rounded text-sm font-mono"
            >
              {segment}
            </span>
          );
        }
        return <span key={i}>{segment}</span>;
      })}
    </p>
  );
}
