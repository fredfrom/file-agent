/**
 * Eval type system for the File Agent evaluation harness.
 * These types define the structure of test questions, individual results,
 * and aggregated evaluation run results.
 */

import type { ProjectFilesystem } from '@/corpus/types';

/**
 * Configuration for an agent variant used in A/B testing.
 * Each config defines a system prompt builder and step limit.
 */
export type AgentConfig = {
  /** Human-readable name for the config (e.g., 'baseline', 'concise') */
  name: string;
  /** Description of what this config tests */
  description: string;
  /** Function to build the system prompt from the project corpus */
  buildSystemPrompt: (corpus: ProjectFilesystem) => string;
  /** Maximum number of agent steps before timeout */
  maxSteps: number;
};

/**
 * Document categories in the construction project filesystem.
 * Maps to the top-level folder structure (01_vertraege through 09_genehmigungen).
 * 'cross-cutting' is used for questions spanning multiple categories.
 */
export type DocumentCategory =
  | 'vertraege'
  | 'nachtraege'
  | 'protokolle'
  | 'maengel'
  | 'plaene'
  | 'schriftverkehr'
  | 'bautagebuch'
  | 'rechnungen'
  | 'genehmigungen'
  | 'cross-cutting';

/**
 * A single evaluation question with ground-truth expectations.
 */
export type EvalQuestion = {
  /** Unique question identifier (e.g., 'q-vertraege-01') */
  id: string;
  /** The question text in German */
  text: string;
  /** Which document category this question targets */
  category: DocumentCategory;
  /** Keywords/facts that MUST appear in the answer */
  expectedKeywords: string[];
  /** Filesystem paths the agent should cite as sources */
  expectedSourcePaths: string[];
  /** Maximum allowed agent steps before timeout */
  maxSteps: number;
};

/**
 * Result of evaluating a single question.
 */
export type QuestionResult = {
  /** ID of the question that was evaluated */
  questionId: string;
  /** The agent's full answer text */
  answerText: string;
  /** Number of agent loop steps taken */
  stepCount: number;
  /** Number of tool calls made across all steps */
  toolCallCount: number;
  /** Filesystem paths cited in the answer */
  citedPaths: string[];
  /** Expected keywords found in the answer */
  keywordHits: string[];
  /** Expected keywords NOT found in the answer */
  keywordMisses: string[];
  /** Keyword hit rate (0-1) */
  accuracyScore: number;
  /** Fraction of cited paths that match expected sources (0-1) */
  citationPrecision: number;
  /** LLM-as-judge quality score (1-5) */
  qualityScore: number;
  /** Wall-clock duration in milliseconds */
  durationMs: number;
};

/**
 * Aggregated results from a full evaluation run.
 */
export type EvalRunResult = {
  /** ISO timestamp of the run */
  timestamp: string;
  /** Individual question results */
  questions: QuestionResult[];
  /** Aggregated KPI scores */
  aggregated: {
    /** Mean keyword accuracy across all questions */
    accuracy: number;
    /** Mean citation precision across all questions */
    citationPrecision: number;
    /** Mean step count across all questions */
    avgStepCount: number;
    /** Fraction of document categories with at least one passing result */
    docTypeCoverage: number;
    /** Mean LLM-as-judge quality score */
    avgQualityScore: number;
  };
  /** Whether the run meets all KPI targets */
  passed: boolean;
};
