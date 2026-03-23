'use client';

import { useState } from 'react';
import { Search, FileText, FolderOpen, ChevronDown, ChevronRight } from 'lucide-react';

interface ToolTraceProps {
  command: string;
  output?: string;
  isRunning: boolean;
}

function describeCommand(command: string): { icon: typeof Search; label: string } {
  const cmd = command.trim();

  if (cmd.startsWith('cat ')) {
    const file = cmd.replace('cat ', '').split('/').pop()?.replace(/\\/g, '') || 'Dokument';
    return { icon: FileText, label: `Lese ${file}` };
  }
  if (cmd.startsWith('ls ')) {
    const folder = cmd.replace('ls ', '').replace(/\//g, ' / ').trim();
    return { icon: FolderOpen, label: `Durchsuche ${folder || 'Ordner'}` };
  }
  if (cmd.startsWith('find ')) {
    return { icon: Search, label: 'Suche Dateien...' };
  }
  if (cmd.startsWith('grep ')) {
    const match = cmd.match(/grep\s+(?:-[a-zA-Z]+\s+)*["']?([^"'\s]+)/);
    const term = match?.[1] || '';
    return { icon: Search, label: term ? `Suche nach "${term}"` : 'Durchsuche Dokumente...' };
  }
  if (cmd.startsWith('head ') || cmd.startsWith('tail ')) {
    return { icon: FileText, label: 'Lese Dokumentabschnitt...' };
  }
  return { icon: Search, label: 'Analysiere...' };
}

function countResults(output: string): string | null {
  const lines = output.trim().split('\n').filter(Boolean);
  if (lines.length === 0) return 'Keine Ergebnisse';
  if (lines.length === 1) return '1 Ergebnis';
  return `${lines.length} Ergebnisse`;
}

export function ToolTrace({ command, output, isRunning }: ToolTraceProps) {
  const [expanded, setExpanded] = useState(false);
  const { icon: Icon, label } = describeCommand(command);

  return (
    <div className="my-1">
      <button
        onClick={() => setExpanded(!expanded)}
        className="flex items-center gap-2 text-xs text-[var(--muted)] hover:text-[var(--foreground)] transition-colors cursor-pointer group w-full text-left py-1"
      >
        {isRunning && !output ? (
          <>
            <span className="flex gap-0.5">
              <span className="w-1 h-1 rounded-full bg-[var(--accent)] animate-pulse" style={{ animationDelay: '0ms' }} />
              <span className="w-1 h-1 rounded-full bg-[var(--accent)] animate-pulse" style={{ animationDelay: '150ms' }} />
              <span className="w-1 h-1 rounded-full bg-[var(--accent)] animate-pulse" style={{ animationDelay: '300ms' }} />
            </span>
            <span>{label}</span>
          </>
        ) : (
          <>
            <Icon size={12} className="shrink-0 opacity-60" />
            <span>{label}</span>
            {output && (
              <span className="text-[var(--muted)] opacity-60">
                — {countResults(output)}
              </span>
            )}
            {output && (
              expanded
                ? <ChevronDown size={12} className="ml-auto opacity-40" />
                : <ChevronRight size={12} className="ml-auto opacity-40" />
            )}
          </>
        )}
      </button>

      {expanded && output && (
        <pre className="mt-1 px-3 py-2 text-[11px] font-mono text-zinc-500 bg-[var(--surface)] border border-[var(--border)] rounded-lg whitespace-pre-wrap overflow-x-auto max-h-40 overflow-y-auto leading-relaxed">
          {output}
        </pre>
      )}
    </div>
  );
}
