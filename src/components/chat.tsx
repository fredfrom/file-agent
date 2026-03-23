'use client';

import { useChat, type UIMessage } from '@ai-sdk/react';
import { useState, useRef, useEffect, useCallback } from 'react';
import { useQueryClient } from '@tanstack/react-query';
import Link from 'next/link';
import { Send, Loader2, Upload, X, BarChart3, Building2, Copy, Check, RefreshCw, Menu } from 'lucide-react';
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
  if (!Array.isArray(parts)) return [{ type: 'text', text: '' }];
  if (role === 'user') return parts;

  // Assistant content from onFinish is an array of { type: 'text', text } | { type: 'tool-call', ... }
  // Tool role content is an array of { type: 'tool-result', toolCallId, toolName, result }
  // Convert both to UIMessage parts format
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
        state: 'partial-call',
        args: part.args,
      };
    }
    if (part.type === 'tool-result') {
      return {
        type: `tool-${part.toolName as string}`,
        toolInvocationId: part.toolCallId,
        toolName: part.toolName,
        state: 'result',
        args: {},
        result: part.result ?? null,
      };
    }
    return part;
  });
}

let chatKeyCounter = 0;

export function Chat() {
  const [input, setInput] = useState('');
  const [conversationId, setConversationId] = useState<string | null>(null);
  const conversationIdRef = useRef<string | null>(null);
  const [chatKey, setChatKey] = useState(() => `chat-${++chatKeyCounter}`);
  const queryClient = useQueryClient();
  const [sendError, setSendError] = useState<string | null>(null);
  const [sidebarOpen, setSidebarOpen] = useState(false);

  conversationIdRef.current = conversationId;

  const { messages, sendMessage, status, error, setMessages } = useChat({
    id: chatKey,
  });

  const messagesEndRef = useRef<HTMLDivElement>(null);
  const [viewer, setViewer] = useState<CitationInfo | null>(null);

  const handleCitationClick = (path: string, passage?: string) => {
    setViewer({ path, passage });
  };

  const isStreaming = status === 'streaming' || status === 'submitted';

  // Escape key closes document viewer
  useEffect(() => {
    if (!viewer) return;
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setViewer(null);
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [viewer]);

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
    setChatKey(`chat-${++chatKeyCounter}`);
    setViewer(null);
    setSidebarOpen(false);
  }, []);

  const handleSelectConversation = useCallback(async (id: string) => {
    conversationIdRef.current = id;
    setConversationId(id);
    // New chatKey so useChat creates a fresh instance for this conversation
    setChatKey(`chat-${++chatKeyCounter}`);
    setViewer(null);
    setSidebarOpen(false);
    // Load messages from DB after a tick (need the new useChat instance)
    setTimeout(async () => {
      try {
        const res = await fetch(`/api/conversations/${id}`);
        if (res.ok) {
          const data = await res.json();
          const msgs = Array.isArray(data?.messages) ? data.messages : [];
          // Merge tool-role messages into preceding assistant message
          const loaded: UIMessage[] = [];
          for (const m of msgs as { id: string; role: string; parts: unknown[] }[]) {
            if (m.role === 'tool') {
              // Append tool-result parts to the last assistant message
              const last = loaded[loaded.length - 1];
              if (last && last.role === 'assistant') {
                const toolParts = normalizePartsForUI('tool', m.parts);
                // Merge tool results into matching tool-call parts
                for (const tp of toolParts) {
                  const tpart = tp as Record<string, unknown>;
                  const existing = last.parts.find(
                    (p) => (p as Record<string, unknown>).toolInvocationId === tpart.toolInvocationId
                  );
                  if (existing) {
                    // Update the partial-call to result state
                    Object.assign(existing, { state: 'result', result: tpart.result });
                  } else {
                    last.parts.push(tp as UIMessage['parts'][number]);
                  }
                }
              }
            } else {
              loaded.push({
                id: m.id,
                role: m.role as 'user' | 'assistant',
                parts: normalizePartsForUI(m.role, m.parts) as UIMessage['parts'],
              });
            }
          }
          setMessages(loaded);
        }
      } catch (err) {
        console.error('[chat] Failed to load conversation', err);
      }
    }, 0);
  }, [setMessages]);

  const handleSend = useCallback(async (text: string) => {
    setSendError(null);
    try {
      // If no active conversation, create one first
      let activeId = conversationIdRef.current;
      if (!activeId) {
        const res = await fetch('/api/conversations', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ title: text.slice(0, 100) }),
        });
        if (!res.ok) throw new Error('Unterhaltung konnte nicht erstellt werden');
        const conv = await res.json();
        activeId = conv.id;
        conversationIdRef.current = activeId;
        setConversationId(activeId);
        queryClient.invalidateQueries({ queryKey: ['conversations'] });
      }
      sendMessage({ text }, { body: { conversationId: activeId } });
    } catch (err) {
      console.error('[chat] Failed to send', err);
      setSendError(err instanceof Error ? err.message : 'Nachricht konnte nicht gesendet werden');
    }
  }, [sendMessage, queryClient]);

  // Get the last user message text for retry
  const lastUserText = [...messages].reverse().find(m => m.role === 'user')?.parts
    .filter((p): p is { type: 'text'; text: string } => p.type === 'text')
    .map(p => p.text)
    .join('\n') ?? null;

  const displayError = error || (sendError ? { message: sendError } : null);

  return (
    <div className="flex h-screen w-full">
      {/* Mobile sidebar overlay */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 z-20 bg-black/50 md:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Conversation sidebar */}
      <div className={`
        fixed inset-y-0 left-0 z-30 w-64
        transform transition-transform duration-200 ease-in-out
        md:relative md:translate-x-0 md:z-auto
        ${sidebarOpen ? 'translate-x-0' : '-translate-x-full'}
      `}>
        <ConversationSidebar
          activeId={conversationId}
          onSelect={handleSelectConversation}
          onNew={handleNewConversation}
          onClose={() => setSidebarOpen(false)}
        />
      </div>

      {/* Chat panel -- shrinks when viewer is open */}
      <div className={`flex flex-col h-full transition-all duration-300 ease-in-out ${viewer ? 'hidden md:flex md:w-[40%] md:min-w-[360px]' : 'flex-1'}`}>
        {/* Header */}
        <header className="px-4 md:px-6 py-4 border-b border-[var(--border)] flex items-center gap-3">
          {/* Mobile menu button */}
          <button
            type="button"
            onClick={() => setSidebarOpen(true)}
            className="md:hidden flex items-center justify-center w-9 h-9 rounded-lg text-[var(--muted)] hover:text-[var(--foreground)] hover:bg-[var(--surface-2)] transition-colors"
            aria-label="Seitenleiste oeffnen"
          >
            <Menu size={18} />
          </button>
          <div className="flex items-center justify-center w-9 h-9 rounded-lg bg-[var(--accent-glow)] border border-[var(--accent)]/20">
            <Building2 size={18} className="text-[var(--accent)]" />
          </div>
          <div className="hidden sm:block">
            <h1 className="text-base font-semibold tracking-tight">Bauakte Agent</h1>
            <p className="text-xs text-[var(--muted)]">
              Ihr KI-Assistent fuer Projektdokumente
            </p>
          </div>
          <div className="ml-auto flex items-center gap-4">
            <Link
              href="/dashboard"
              className="inline-flex items-center gap-1.5 text-sm text-[var(--muted)] hover:text-[var(--foreground)] transition-colors"
            >
              <BarChart3 size={14} />
              <span className="hidden sm:inline">Uebersicht</span>
            </Link>
            <Link
              href="/ingest"
              className="inline-flex items-center gap-1.5 text-sm text-[var(--muted)] hover:text-[var(--foreground)] transition-colors"
            >
              <Upload size={14} />
              <span className="hidden sm:inline">Dokumente</span>
            </Link>
            <div className="hidden sm:flex items-center gap-2">
              <span className={`inline-block w-2 h-2 rounded-full ${isStreaming ? 'bg-amber-400 animate-pulse' : 'bg-[var(--green)]'}`} />
              <span className="text-xs text-[var(--muted)]">
                {isStreaming ? 'Verarbeite...' : 'Bereit'}
              </span>
            </div>
            <ThemeToggle />
          </div>
        </header>

        {/* Message area */}
        <div className="flex-1 overflow-y-auto px-4 md:px-6 py-6 space-y-6">
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
                      ? 'max-w-[85%] md:max-w-[75%] bg-[var(--accent)] text-white rounded-2xl rounded-br-md px-4 py-2.5'
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
                {status === 'submitted' ? 'Agent denkt nach...' : 'Agent arbeitet...'}
              </span>
            </div>
          )}

          <div ref={messagesEndRef} />
        </div>

        {/* Error display -- dismissible with retry */}
        {displayError && (
          <div className="mx-4 md:mx-6 mb-2 px-4 py-2.5 rounded-lg bg-red-500/10 border border-red-500/20 text-[var(--error)] text-sm flex items-center gap-3">
            <span className="flex-1">{displayError.message}</span>
            {lastUserText && (
              <button
                type="button"
                onClick={() => {
                  setSendError(null);
                  handleSend(lastUserText);
                }}
                className="shrink-0 text-xs px-2 py-1 rounded bg-red-500/20 hover:bg-red-500/30 transition-colors"
              >
                Erneut versuchen
              </button>
            )}
            <button
              type="button"
              onClick={() => setSendError(null)}
              className="shrink-0 text-[var(--error)] hover:text-[var(--foreground)] transition-colors"
              aria-label="Fehler schliessen"
            >
              <X size={14} />
            </button>
          </div>
        )}

        {/* Input form */}
        <div className="px-4 md:px-6 py-4 border-t border-[var(--border)]">
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
                placeholder="z.B. Welche Nachtraege sind noch offen?"
                className="flex-1 bg-transparent py-2.5 text-sm placeholder:text-[var(--muted)] focus:outline-none disabled:opacity-50"
              />
              <button
                type="submit"
                disabled={isStreaming || !input.trim()}
                aria-label="Senden"
                className="flex items-center justify-center w-8 h-8 rounded-lg bg-[var(--accent)] text-white disabled:opacity-30 hover:bg-[var(--accent-hover)] transition-colors duration-150 cursor-pointer disabled:cursor-not-allowed shrink-0"
              >
                <Send size={15} />
              </button>
            </div>
            <p className="text-[10px] text-[var(--muted)] mt-2 text-center">
              Vertraege, Protokolle, Maengel, Rechnungen und mehr
            </p>
          </form>
        </div>
      </div>

      {/* Document viewer panel -- slides in from right */}
      {viewer && (
        <div className="fixed inset-0 z-20 md:relative md:z-auto flex flex-col h-full w-full md:w-[60%] border-l border-[var(--border)] bg-[var(--background)] animate-in slide-in-from-right duration-300">
          <div className="flex items-center justify-between px-4 py-3 border-b border-[var(--border)]">
            <h2 className="text-sm font-semibold text-[var(--foreground)]">Dokumentansicht</h2>
            <button
              type="button"
              onClick={() => setViewer(null)}
              aria-label="Dokumentansicht schliessen"
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
