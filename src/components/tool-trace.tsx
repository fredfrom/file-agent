'use client';

import { Terminal } from 'lucide-react';

interface ToolTraceProps {
  command: string;
  output?: string;
  isRunning: boolean;
}

export function ToolTrace({ command, output, isRunning }: ToolTraceProps) {
  return (
    <div className="my-2 rounded-lg border border-gray-700 bg-gray-900 text-sm font-mono overflow-hidden">
      {/* Command line */}
      <div className="px-3 py-2 bg-gray-800 border-b border-gray-700 flex items-center gap-2">
        <Terminal size={14} className="text-gray-400 shrink-0" />
        <span className="text-green-400 select-none">$</span>
        <span className="text-gray-100">{command}</span>
      </div>
      {/* Running state */}
      {isRunning && !output && (
        <div className="px-3 py-2 text-gray-400 animate-pulse">
          Ausfuehren...
        </div>
      )}
      {/* Output */}
      {output && (
        <pre className="px-3 py-2 text-gray-300 whitespace-pre-wrap overflow-x-auto max-h-48 overflow-y-auto">
          {output}
        </pre>
      )}
    </div>
  );
}
