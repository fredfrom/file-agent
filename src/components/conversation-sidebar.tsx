'use client';

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { Plus, MessageSquare, Trash2, X } from 'lucide-react';
import { formatDateTime } from '@/lib/viewer/format';

interface ConversationEntry {
  id: string;
  title: string;
  updatedAt: string;
}

interface ConversationSidebarProps {
  activeId: string | null;
  onSelect: (id: string) => void;
  onNew: () => void;
  onClose?: () => void;
}

export function ConversationSidebar({ activeId, onSelect, onNew, onClose }: ConversationSidebarProps) {
  const queryClient = useQueryClient();

  const { data: conversations = [], isLoading } = useQuery<ConversationEntry[]>({
    queryKey: ['conversations'],
    queryFn: async () => {
      const r = await fetch('/api/conversations');
      if (!r.ok) throw new Error('Fehler beim Laden der Unterhaltungen');
      const data = await r.json();
      return Array.isArray(data) ? data : [];
    },
  });

  const deleteMutation = useMutation({
    mutationFn: (id: string) => fetch(`/api/conversations/${id}`, { method: 'DELETE' }),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['conversations'] }),
  });

  return (
    <div className="flex flex-col h-full w-64 border-r border-[var(--border)] bg-[var(--surface)] shrink-0">
      <div className="p-3 border-b border-[var(--border)] flex items-center gap-2">
        <button
          type="button"
          onClick={onNew}
          className="flex items-center gap-2 flex-1 px-3 py-2 rounded-lg text-sm text-[var(--foreground)] hover:bg-[var(--surface-2)] transition-colors cursor-pointer"
        >
          <Plus size={15} />
          Neue Unterhaltung
        </button>
        {onClose && (
          <button
            type="button"
            onClick={onClose}
            className="md:hidden flex items-center justify-center w-8 h-8 rounded-lg text-[var(--muted)] hover:text-[var(--foreground)] hover:bg-[var(--surface-2)] transition-colors"
            aria-label="Seitenleiste schliessen"
          >
            <X size={16} />
          </button>
        )}
      </div>

      <div className="flex-1 overflow-y-auto">
        {isLoading ? (
          <div className="p-3 space-y-2">
            {[...Array(3)].map((_, i) => (
              <div key={i} className="h-10 rounded-lg bg-[var(--surface-2)] animate-pulse" />
            ))}
          </div>
        ) : conversations.length === 0 ? (
          <div className="p-4 text-center">
            <p className="text-xs text-[var(--muted)]">Noch keine Unterhaltungen</p>
          </div>
        ) : (
          <div className="p-2 space-y-0.5">
            {conversations.map((conv) => (
              <div
                key={conv.id}
                className={`group flex items-center gap-2 rounded-lg transition-colors ${
                  activeId === conv.id
                    ? 'bg-[var(--accent-glow)] text-[var(--foreground)]'
                    : 'hover:bg-[var(--surface-2)] text-[var(--foreground)]'
                }`}
              >
                <button
                  type="button"
                  onClick={() => onSelect(conv.id)}
                  className="flex items-center gap-2 flex-1 min-w-0 px-3 py-2 text-left cursor-pointer"
                >
                  <MessageSquare size={13} className="shrink-0 text-[var(--muted)]" />
                  <div className="min-w-0 flex-1">
                    <p className="text-sm truncate">{conv.title}</p>
                    <p className="text-[10px] text-[var(--muted)]">{formatDateTime(conv.updatedAt)}</p>
                  </div>
                </button>
                <button
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation();
                    deleteMutation.mutate(conv.id);
                    if (activeId === conv.id) onNew();
                  }}
                  aria-label="Unterhaltung löschen"
                  className="opacity-0 group-hover:opacity-100 p-1.5 mr-1 rounded text-[var(--muted)] hover:text-[var(--error)] transition-all cursor-pointer"
                >
                  <Trash2 size={13} />
                </button>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
