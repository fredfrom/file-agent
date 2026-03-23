'use client';

import { useChat } from '@ai-sdk/react';
import { useState, useRef, useEffect } from 'react';
import Link from 'next/link';
import { Send, Loader2, Upload, X, BarChart3, Building2, Trash2 } from 'lucide-react';
import { ToolTrace } from './tool-trace';
import { CitationText } from './citation-text';
import { ExampleQuestions } from './example-questions';
import { DocumentViewer } from './document-viewer';
import { ThemeToggle } from './theme-toggle';
import type { CitationInfo } from '@/lib/viewer/types';

export function Chat() {
  const [input, setInput] = useState('');
  const { messages, sendMessage, status, error, setMessages } = useChat({ id: 'bauakte' });
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const [viewer, setViewer] = useState<CitationInfo | null>(null);

  const handleCitationClick = (path: string, passage?: string) => {
    setViewer({ path, passage });
  };

  const isDisabled = status !== 'ready';
  const isStreaming = status === 'streaming' || status === 'submitted';

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  return (
    <div className="flex h-screen w-full">
      {/* Chat panel — shrinks when viewer is open */}
      <div className={`flex flex-col h-full transition-all duration-300 ease-in-out ${viewer ? 'w-[40%] min-w-[360px]' : 'w-full max-w-4xl mx-auto'}`}>
        {/* Header */}
        <header className="px-6 py-4 border-b border-[var(--border)] flex items-center gap-3">
          <div className="flex items-center justify-center w-9 h-9 rounded-lg bg-[var(--accent-glow)] border border-[var(--accent)]/20">
            <Building2 size={18} className="text-[var(--accent)]" />
          </div>
          <div>
            <h1 className="text-base font-semibold tracking-tight">Bauakte Agent</h1>
            <p className="text-xs text-[var(--muted)]">
              Ihr KI-Assistent für Projektdokumente
            </p>
          </div>
          <div className="ml-auto flex items-center gap-4">
            <Link
              href="/dashboard"
              className="inline-flex items-center gap-1.5 text-sm text-[var(--muted)] hover:text-[var(--foreground)] transition-colors"
            >
              <BarChart3 size={14} />
              Übersicht
            </Link>
            <Link
              href="/ingest"
              className="inline-flex items-center gap-1.5 text-sm text-[var(--muted)] hover:text-[var(--foreground)] transition-colors"
            >
              <Upload size={14} />
              Dokumente
            </Link>
            <div className="flex items-center gap-2">
              <span className={`inline-block w-2 h-2 rounded-full ${isStreaming ? 'bg-amber-400 animate-pulse' : 'bg-[var(--green)]'}`} />
              <span className="text-xs text-[var(--muted)]">
                {isStreaming ? 'Verarbeite…' : 'Bereit'}
              </span>
            </div>
            {messages.length > 0 && (
              <button
                type="button"
                onClick={() => setMessages([])}
                aria-label="Chat leeren"
                className="flex items-center justify-center w-8 h-8 rounded-lg text-[var(--muted)] hover:text-[var(--foreground)] hover:bg-[var(--surface-2)] transition-colors"
              >
                <Trash2 size={15} />
              </button>
            )}
            <ThemeToggle />
          </div>
        </header>

        {/* Message area */}
        <div className="flex-1 overflow-y-auto px-6 py-6 space-y-6">
          {messages.length === 0 && (
            <div className="flex flex-col items-center justify-center h-full gap-8 -mt-8">
              <div className="text-center space-y-3">
                <div className="flex items-center justify-center w-14 h-14 rounded-2xl bg-[var(--surface-2)] border border-[var(--border)] mx-auto">
                  <Building2 size={28} className="text-[var(--accent)]" />
                </div>
                <h2 className="text-lg font-medium">Fragen Sie zur Bauakte</h2>
                <p className="text-sm text-[var(--muted)] max-w-md">
                  Stellen Sie eine Frage zu Ihrem Bauprojekt. Der Assistent
                  durchsucht alle Projektdokumente und liefert Ihnen die Antwort.
                </p>
              </div>
              <ExampleQuestions onSelect={(q) => sendMessage({ text: q })} />
            </div>
          )}

          {messages.map((message) => (
            <div
              key={message.id}
              className={`flex ${message.role === 'user' ? 'justify-end' : 'justify-start'}`}
            >
              <div
                className={`${
                  message.role === 'user'
                    ? 'max-w-[75%] bg-[var(--accent)] text-white rounded-2xl rounded-br-md px-4 py-2.5'
                    : 'w-full space-y-2'
                }`}
              >
                {message.parts.map((part, i) => {
                  try {
                    if (part.type === 'text') {
                      return (
                        <div key={i} className={message.role === 'user' ? '' : 'bg-[var(--surface)] border border-[var(--border)] rounded-xl px-4 py-3'}>
                          <CitationText text={part.text} onCitationClick={message.role === 'user' ? undefined : handleCitationClick} />
                        </div>
                      );
                    }
                    if (part.type === 'tool-bash') {
                      const toolInput = part.input as { command?: string } | undefined;
                      const command = toolInput?.command ?? '';
                      if (!command) return null;
                      let output: string | undefined;
                      if (part.state === 'output-available' && part.output) {
                        const out = part.output as { stdout?: string } | string;
                        output = typeof out === 'string' ? out : out?.stdout ?? '';
                      }
                      return (
                        <ToolTrace
                          key={i}
                          command={command}
                          output={output}
                          isRunning={part.state === 'input-available' || part.state === 'input-streaming'}
                        />
                      );
                    }
                    return null;
                  } catch {
                    return null;
                  }
                })}
              </div>
            </div>
          ))}

          {/* Status indicator */}
          {isStreaming && (
            <div className="flex items-center gap-2 text-[var(--muted)] py-1">
              <Loader2 size={14} className="animate-spin text-[var(--accent)]" />
              <span className="text-sm">
                {status === 'submitted' ? 'Agent denkt nach…' : 'Agent arbeitet…'}
              </span>
            </div>
          )}

          <div ref={messagesEndRef} />
        </div>

        {/* Error display */}
        {error && (
          <div className="mx-6 mb-2 px-4 py-2.5 rounded-lg bg-red-500/10 border border-red-500/20 text-[var(--error)] text-sm">
            {error.message}
          </div>
        )}

        {/* Input form */}
        <div className="px-6 py-4 border-t border-[var(--border)]">
          <form
            onSubmit={(e) => {
              e.preventDefault();
              if (input.trim()) {
                sendMessage({ text: input });
                setInput('');
              }
            }}
          >
            <div className="flex gap-3 items-center bg-[var(--surface)] border border-[var(--border)] rounded-xl px-4 py-1 focus-within:border-[var(--accent)]/50 focus-within:shadow-[0_0_0_3px_var(--accent-glow)] transition-all duration-200">
              <input
                value={input}
                onChange={(e) => setInput(e.target.value)}
                disabled={isDisabled}
                placeholder="z.B. Welche Nachträge sind noch offen?"
                className="flex-1 bg-transparent py-2.5 text-sm placeholder:text-[var(--muted)] focus:outline-none disabled:opacity-50"
              />
              <button
                type="submit"
                disabled={isDisabled || !input.trim()}
                aria-label="Senden"
                className="flex items-center justify-center w-8 h-8 rounded-lg bg-[var(--accent)] text-white disabled:opacity-30 hover:bg-[var(--accent-hover)] transition-colors duration-150 cursor-pointer disabled:cursor-not-allowed shrink-0"
              >
                <Send size={15} />
              </button>
            </div>
            <p className="text-[10px] text-[var(--muted)] mt-2 text-center">
              Verträge, Protokolle, Mängel, Rechnungen und mehr
            </p>
          </form>
        </div>
      </div>

      {/* Document viewer panel — slides in from right, no overlay */}
      {viewer && (
        <div className="flex flex-col h-full w-[60%] border-l border-[var(--border)] bg-[var(--background)] animate-in slide-in-from-right duration-300">
          <div className="flex items-center justify-between px-4 py-3 border-b border-[var(--border)]">
            <h2 className="text-sm font-semibold text-[var(--foreground)]">Dokumentansicht</h2>
            <button
              type="button"
              onClick={() => setViewer(null)}
              aria-label="Dokumentansicht schließen"
              className="flex items-center justify-center w-7 h-7 rounded-md text-[var(--muted)] hover:text-[var(--foreground)] hover:bg-[var(--surface-2)] transition-colors"
            >
              <X size={16} />
            </button>
          </div>
          <div className="flex-1 overflow-y-auto">
            <DocumentViewer path={viewer.path} passage={viewer.passage} />
          </div>
        </div>
      )}
    </div>
  );
}
