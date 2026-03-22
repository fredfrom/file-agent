'use client';

const EXAMPLE_QUESTIONS = [
  'Welche Nachtraege gibt es und was ist deren aktueller Status?',
  'Was wurde in der letzten Baubesprechung besprochen?',
  'Welche Maengel sind noch nicht behoben?',
  'Wie hoch ist der aktuelle Rechnungsstand?',
  'Wer sind die beteiligten Nachunternehmer und welche Gewerke fuehren sie aus?',
];

interface ExampleQuestionsProps {
  onSelect: (question: string) => void;
}

export function ExampleQuestions({ onSelect }: ExampleQuestionsProps) {
  return (
    <div className="space-y-2">
      <p className="text-sm text-gray-500 dark:text-gray-400 mb-3">
        Beispielfragen:
      </p>
      {EXAMPLE_QUESTIONS.map((question, i) => (
        <button
          key={i}
          onClick={() => onSelect(question)}
          className="block w-full text-left px-4 py-3 rounded-lg border border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors text-sm"
        >
          {question}
        </button>
      ))}
    </div>
  );
}
