'use client';

import { Terminal, ChevronRight } from 'lucide-react';

interface ToolTraceProps {
  command: string;
  output?: string;
  isRunning: boolean;
}

export function ToolTrace({ command, output, isRunning }: ToolTraceProps) {
  return (
    <div className="my-1.5 rounded-xl border border-[var(--border)] bg-[#0c0c14] text-sm font-mono overflow-hidden shadow-sm">
      {/* Command line */}
      <div className="px-3 py-2 bg-[#0f0f1a] border-b border-[var(--border)] flex items-center gap-2">
        <Terminal size={13} className="text-[var(--muted)] shrink-0" />
        <ChevronRight size={12} className="text-[var(--green)] shrink-0" />
        <span className="text-[var(--green)] font-medium">{command}</span>
      </div>
      {/* Running state */}
      {isRunning && !output && (
        <div className="px-3 py-2.5 flex items-center gap-2">
          <span className="flex gap-1">
            <span className="w-1 h-1 rounded-full bg-[var(--green)] animate-pulse" style={{ animationDelay: '0ms' }} />
            <span className="w-1 h-1 rounded-full bg-[var(--green)] animate-pulse" style={{ animationDelay: '150ms' }} />
            <span className="w-1 h-1 rounded-full bg-[var(--green)] animate-pulse" style={{ animationDelay: '300ms' }} />
          </span>
          <span className="text-[var(--muted)] text-xs">Ausfuehren...</span>
        </div>
      )}
      {/* Output */}
      {output && (
        <pre className="px-3 py-2.5 text-[13px] text-zinc-400 whitespace-pre-wrap overflow-x-auto max-h-52 overflow-y-auto leading-relaxed">
          {output}
        </pre>
      )}
    </div>
  );
}
