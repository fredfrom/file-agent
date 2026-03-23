'use client';

import { MessageSquare } from 'lucide-react';

const EXAMPLE_QUESTIONS = [
  'Welche Nachträge gibt es und was ist deren aktueller Status?',
  'Was wurde in der letzten Baubesprechung besprochen?',
  'Welche Mängel sind noch nicht behoben?',
  'Wie hoch ist der aktuelle Rechnungsstand?',
  'Wer sind die beteiligten Nachunternehmer und welche Gewerke führen sie aus?',
];

interface ExampleQuestionsProps {
  onSelect: (question: string) => void;
}

export function ExampleQuestions({ onSelect }: ExampleQuestionsProps) {
  return (
    <div className="w-full max-w-lg space-y-2">
      <p className="text-xs font-medium uppercase tracking-wider text-[var(--muted)] mb-3">
        Beispielfragen
      </p>
      {EXAMPLE_QUESTIONS.map((question, i) => (
        <button
          key={i}
          onClick={() => onSelect(question)}
          className="group flex items-start gap-3 w-full text-left px-4 py-3 rounded-xl border border-[var(--border)] bg-[var(--surface)] hover:bg-[var(--surface-2)] hover:border-[var(--border-hover)] transition-all duration-150 cursor-pointer"
        >
          <MessageSquare
            size={14}
            className="text-[var(--muted)] group-hover:text-[var(--accent)] transition-colors mt-0.5 shrink-0"
          />
          <span className="text-sm text-[var(--foreground)] leading-snug">
            {question}
          </span>
        </button>
      ))}
    </div>
  );
}
