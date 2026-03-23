'use client';

import { useChat, type UIMessage } from '@ai-sdk/react';
import { useState, useRef, useEffect, useCallback } from 'react';
import { useQueryClient } from '@tanstack/react-query';
import Link from 'next/link';
import { Send, Loader2, Upload, X, BarChart3, Building2, Copy, Check, RefreshCw } from 'lucide-react';
import { formatTime } from '@/lib/viewer/format';
import { ToolTrace } from './tool-trace';
import { CitationText } from './citation-text';
import { ExampleQuestions } from './example-questions';
import { DocumentViewer } from './document-viewer';
import { ThemeToggle } from './theme-toggle';
import { ConversationSidebar } from './conversation-sidebar';
import type { CitationInfo } from '@/lib/viewer/types';

function CopyButton({ text, light }: { text: string; light?: boolean }) {
  const [copied, setCopied] = useState(false);
  return (
    <button
      type="button"
      onClick={() => {
        navigator.clipboard.writeText(text);
        setCopied(true);
        setTimeout(() => setCopied(false), 1500);
      }}
      aria-label="Kopieren"
      className={`opacity-0 group-hover:opacity-100 transition-opacity p-0.5 rounded ${light ? 'text-white/50 hover:text-white/80' : 'text-[var(--muted)] hover:text-[var(--foreground)]'}`}
    >
      {copied ? <Check size={12} /> : <Copy size={12} />}
    </button>
  );
}

// Normalize DB-stored parts back to UIMessage parts format.
// User messages are stored as UIMessage parts directly.
// Assistant messages are stored as AI SDK internal content format from onFinish.
function normalizePartsForUI(role: string, parts: unknown[]): unknown[] {
  if (role === 'user') return parts;

  // Assistant content from onFinish is an array of { type: 'text', text } | { type: 'tool-call', ... }
  // Convert to UIMessage parts format
  return parts.map((p: unknown) => {
    const part = p as Record<string, unknown>;
    if (part.type === 'text') {
      return { type: 'text', text: part.text as string };
    }
    if (part.type === 'tool-call') {
      return {
        type: `tool-${part.toolName as string}`,
        toolInvocationId: part.toolCallId,
        toolName: part.toolName,
        state: 'output-available',
        input: part.args,
        output: part.result ?? null,
      };
    }
    return part;
  });
}

export function Chat() {
  const [input, setInput] = useState('');
  const [conversationId, setConversationId] = useState<string | null>(null);
  const conversationIdRef = useRef<string | null>(null);
  const queryClient = useQueryClient();

  conversationIdRef.current = conversationId;

  const { messages, sendMessage, status, error, setMessages } = useChat({
    id: conversationId ?? 'new',
  });

  const messagesEndRef = useRef<HTMLDivElement>(null);
  const [viewer, setViewer] = useState<CitationInfo | null>(null);

  const handleCitationClick = (path: string, passage?: string) => {
    setViewer({ path, passage });
  };

  const isDisabled = status !== 'ready';
  const isStreaming = status === 'streaming' || status === 'submitted';

  // Refresh sidebar after streaming completes (new title might have been set)
  useEffect(() => {
    if (status === 'ready' && messages.length > 0) {
      queryClient.invalidateQueries({ queryKey: ['conversations'] });
    }
  }, [status, messages.length, queryClient]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const handleNewConversation = useCallback(() => {
    conversationIdRef.current = null;
    setConversationId(null);
    setMessages([]);
    setViewer(null);
  }, [setMessages]);

  const handleSelectConversation = useCallback(async (id: string) => {
    conversationIdRef.current = id;
    setConversationId(id);
    setViewer(null);
    // Load messages from DB
    const res = await fetch(`/api/conversations/${id}`);
    if (res.ok) {
      const data = await res.json();
      // DB stores assistant content as AI SDK internal format (content array),
      // but user messages are stored as UIMessage parts. Normalize both.
      const loaded: UIMessage[] = data.messages.map((m: { id: string; role: string; parts: unknown[] }) => ({
        id: m.id,
        role: m.role as 'user' | 'assistant',
        parts: normalizePartsForUI(m.role, m.parts),
      }));
      setMessages(loaded);
    }
  }, [setMessages]);

  const handleSend = useCallback(async (text: string) => {
    // If no active conversation, create one first
    let activeId = conversationIdRef.current;
    if (!activeId) {
      const res = await fetch('/api/conversations', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ title: text.slice(0, 100) }),
      });
      const conv = await res.json();
      activeId = conv.id;
      conversationIdRef.current = activeId;
      setConversationId(activeId);
      queryClient.invalidateQueries({ queryKey: ['conversations'] });
    }
    sendMessage({ text }, { body: { conversationId: activeId } });
  }, [sendMessage, queryClient]);

  return (
    <div className="flex h-screen w-full">
      {/* Conversation sidebar */}
      <ConversationSidebar
        activeId={conversationId}
        onSelect={handleSelectConversation}
        onNew={handleNewConversation}
      />

      {/* Chat panel — shrinks when viewer is open */}
      <div className={`flex flex-col h-full transition-all duration-300 ease-in-out ${viewer ? 'w-[40%] min-w-[360px]' : 'flex-1'}`}>
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
              <ExampleQuestions onSelect={(q) => handleSend(q)} />
            </div>
          )}

          {messages.map((message) => {
            // Collect all text from this message for copy
            const fullText = message.parts
              .filter((p): p is { type: 'text'; text: string } => p.type === 'text')
              .map((p) => p.text)
              .join('\n');
            const timestamp = (message as unknown as { createdAt?: string }).createdAt;

            return (
              <div
                key={message.id}
                className={`group flex ${message.role === 'user' ? 'justify-end' : 'justify-start'}`}
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

                  {/* Timestamp + copy + regenerate */}
                  <div className={`flex items-center gap-2 mt-1 ${message.role === 'user' ? 'justify-end' : ''}`}>
                    {timestamp && (
                      <span className={`text-[10px] ${message.role === 'user' ? 'text-white/50' : 'text-[var(--muted)]'}`}>
                        {formatTime(timestamp)}
                      </span>
                    )}
                    {fullText && (
                      <CopyButton text={fullText} light={message.role === 'user'} />
                    )}
                    {message.role === 'user' && !isStreaming && fullText && (
                      <button
                        type="button"
                        onClick={() => handleSend(fullText)}
                        aria-label="Erneut senden"
                        className="opacity-0 group-hover:opacity-100 transition-opacity p-0.5 rounded text-white/50 hover:text-white/80"
                      >
                        <RefreshCw size={12} />
                      </button>
                    )}
                  </div>
                </div>
              </div>
            );
          })}

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
                handleSend(input);
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
