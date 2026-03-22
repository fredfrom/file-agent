/**
 * Deterministic KPI scoring functions for the eval harness.
 * All functions are pure — no API calls, no side effects.
 */

import type { QuestionResult, EvalQuestion } from '@/eval/types';

/**
 * Score keyword accuracy by checking which expected keywords appear in the answer.
 * Case-insensitive matching via includes.
 *
 * Returns score of 1 when no keywords are expected (vacuously true).
 * Returns score of 0 when answer is empty but keywords are expected.
 */
export function scoreKeywordAccuracy(
  answerText: string,
  expectedKeywords: string[]
): { hits: string[]; misses: string[]; score: number } {
  if (expectedKeywords.length === 0) {
    return { hits: [], misses: [], score: 1 };
  }

  const lowerAnswer = answerText.toLowerCase();
  const hits: string[] = [];
  const misses: string[] = [];

  for (const keyword of expectedKeywords) {
    if (lowerAnswer.includes(keyword.toLowerCase())) {
      hits.push(keyword);
    } else {
      misses.push(keyword);
    }
  }

  return {
    hits,
    misses,
    score: hits.length / expectedKeywords.length,
  };
}

/**
 * Score citation precision: fraction of cited paths that match expected source paths.
 * Uses partial path matching — a cited path matches if any expected path includes it
 * or if the cited path includes any expected path.
 *
 * Returns 0 when no citations are provided (cannot have precision without citations).
 */
export function scoreCitationPrecision(
  citedPaths: string[],
  expectedSourcePaths: string[]
): number {
  if (citedPaths.length === 0) {
    return 0;
  }

  let validCount = 0;

  for (const cited of citedPaths) {
    const citedFilename = cited.split('/').pop() ?? '';
    const isValid = expectedSourcePaths.some((expected) => {
      // Exact match
      if (expected === cited) return true;
      // Full substring match (either direction)
      if (expected.includes(cited) || cited.includes(expected)) return true;
      // Filename match — handles partial paths missing intermediate directories
      const expectedFilename = expected.split('/').pop() ?? '';
      return citedFilename !== '' && citedFilename === expectedFilename;
    });
    if (isValid) {
      validCount++;
    }
  }

  return validCount / citedPaths.length;
}

/**
 * Score document type coverage: fraction of non-cross-cutting categories
 * that have at least one question result with accuracy >= 0.5.
 */
export function scoreDocTypeCoverage(
  results: QuestionResult[],
  questions: EvalQuestion[]
): number {
  // Build a map from questionId to category
  const categoryMap = new Map<string, string>();
  for (const q of questions) {
    categoryMap.set(q.id, q.category);
  }

  // Collect unique non-cross-cutting categories
  const allCategories = new Set<string>();
  for (const q of questions) {
    if (q.category !== 'cross-cutting') {
      allCategories.add(q.category);
    }
  }

  if (allCategories.size === 0) {
    return 1;
  }

  // Find categories with at least one passing result
  const passingCategories = new Set<string>();
  for (const result of results) {
    const category = categoryMap.get(result.questionId);
    if (category && category !== 'cross-cutting' && result.accuracyScore >= 0.5) {
      passingCategories.add(category);
    }
  }

  return passingCategories.size / allCategories.size;
}

/**
 * Extract filesystem paths from answer text using regex.
 * Matches paths like /01_vertraege/auftraggeber/hauptvertrag_stadtpark_ag.pdf
 * Deduplicates via Set.
 */
export function extractCitations(text: string): string[] {
  const regex = /\/\d{2}_[a-z_]+(?:\/[^\s,;)]+)+/g;
  const rawMatches = text.match(regex);

  if (!rawMatches) {
    return [];
  }

  // Strip trailing dots that are sentence punctuation, not part of the path
  const cleaned = rawMatches.map((m) => m.replace(/\.+$/, ''));

  return [...new Set(cleaned)];
}
