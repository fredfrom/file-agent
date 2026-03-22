'use client';

import { useChat } from '@ai-sdk/react';
import { useState } from 'react';
import { Send } from 'lucide-react';
import { ToolTrace } from './tool-trace';
import { CitationText } from './citation-text';
import { ExampleQuestions } from './example-questions';

export function Chat() {
  const [input, setInput] = useState('');
  const { messages, sendMessage, status, error } = useChat();

  const isDisabled = status !== 'ready';

  return (
    <div className="flex flex-col h-screen max-w-3xl mx-auto">
      {/* Header */}
      <header className="p-4 border-b border-gray-200 dark:border-gray-700">
        <h1 className="text-xl font-bold">Bauakte Agent</h1>
        <p className="text-sm text-gray-500 dark:text-gray-400">
          KI-gestuetzte Dokumentennavigation fuer Bauprojekte
        </p>
      </header>

      {/* Message area */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {messages.length === 0 && (
          <ExampleQuestions onSelect={(q) => sendMessage({ text: q })} />
        )}

        {messages.map((message) => (
          <div
            key={message.id}
            className={message.role === 'user' ? 'text-right' : 'text-left'}
          >
            <span className="text-xs text-gray-500 dark:text-gray-400">
              {message.role === 'user' ? 'Sie' : 'Bauakte Agent'}
            </span>
            <div
              className={`rounded-lg px-4 py-2 ${
                message.role === 'user'
                  ? 'inline-block max-w-[80%] bg-blue-600 text-white'
                  : 'w-full bg-gray-100 dark:bg-gray-800'
              }`}
            >
              {message.parts.map((part, i) => {
                if (part.type === 'text') {
                  return <CitationText key={i} text={part.text} />;
                }
                if (part.type === 'tool-bash') {
                  const toolInput = part.input as { command: string };
                  const toolOutput = part.output as string | undefined;
                  return (
                    <ToolTrace
                      key={i}
                      command={toolInput.command}
                      output={part.state === 'output-available' ? toolOutput : undefined}
                      isRunning={part.state === 'input-available'}
                    />
                  );
                }
                return null;
              })}
            </div>
          </div>
        ))}

        {/* Status indicator */}
        {status === 'submitted' && (
          <p className="text-sm text-gray-500 dark:text-gray-400">
            Denke nach...
          </p>
        )}
      </div>

      {/* Error display */}
      {error && (
        <div className="px-4 py-2 text-red-600 dark:text-red-400">
          Fehler: {error.message}
        </div>
      )}

      {/* Input form */}
      <form
        onSubmit={(e) => {
          e.preventDefault();
          if (input.trim()) {
            sendMessage({ text: input });
            setInput('');
          }
        }}
        className="p-4 border-t border-gray-200 dark:border-gray-700"
      >
        <div className="flex gap-2">
          <input
            value={input}
            onChange={(e) => setInput(e.target.value)}
            disabled={isDisabled}
            placeholder="Stellen Sie eine Frage zum Bauprojekt..."
            className="flex-1 rounded-lg border border-gray-300 dark:border-gray-600 px-4 py-2 bg-transparent focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          <button
            type="submit"
            disabled={isDisabled || !input.trim()}
            aria-label="Senden"
            className="rounded-lg bg-blue-600 text-white px-3 py-2 disabled:opacity-50 hover:bg-blue-700 transition-colors"
          >
            <Send size={18} />
          </button>
        </div>
      </form>
    </div>
  );
}
