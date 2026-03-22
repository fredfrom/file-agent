/**
 * Agent configurations for A/B testing.
 * Each config defines a different approach to system prompting and step limits.
 */

import type { AgentConfig } from '@/eval/types';
import type { ProjectFilesystem } from '@/corpus/types';
import { buildSystemPrompt, generateDirectoryTree } from '@/lib/agent/system-prompt';

/**
 * Baseline config: uses the standard system prompt with full navigation instructions.
 */
export const baseline: AgentConfig = {
  name: 'baseline',
  description: 'Standard system prompt with full navigation instructions',
  buildSystemPrompt,
  maxSteps: 10,
};

/**
 * Build a concise system prompt that emphasizes direct answers and fewer navigation steps.
 * Keeps the filesystem tree and project context but shortens the rules section.
 */
function buildConciseSystemPrompt(corpus: ProjectFilesystem): string {
  const tree = generateDirectoryTree(corpus);

  return `Du bist ein KI-Assistent fuer Bauprojekte. Navigiere die Dateiablage mit Bash-Befehlen und antworte praezise auf Deutsch.

## Regeln
- Antworte IMMER auf Deutsch. Verwende absolute Pfade.
- Nutze grep -rl fuer die Suche, dann cat fuer Details.
- Zitiere Quelldateien in der Antwort.
- Bevorzuge direkte Antworten mit wenigen gezielten Befehlen.

## Dateiformate
Alle Dateien sind als Text gespeichert. Nutze grep, cat, head, tail auf jede Datei (.pdf, .xlsx, .svg, .txt).

## Dateistruktur
${tree}

## Projektkontext
Bauprojekt: Sanierung eines 12-geschossigen Hochhauses (Baujahr 1972) am Stadtpark, Berlin-Charlottenburg.
Bauherr: Stadtpark Immobilien AG
Generalunternehmer: Hochbau Schmidt GmbH
Hauptvertrag: V-2024-001, Pauschalpreis 3.200.000 EUR netto
Bauzeit: 01.01.2024 bis 30.09.2024`;
}

/**
 * Concise config: shorter prompt emphasizing direct answers and fewer steps.
 */
export const concise: AgentConfig = {
  name: 'concise',
  description: 'Shortened prompt emphasizing direct answers and fewer navigation steps',
  buildSystemPrompt: buildConciseSystemPrompt,
  maxSteps: 8,
};

/**
 * All available configs for iteration.
 */
export const configs: AgentConfig[] = [baseline, concise];
