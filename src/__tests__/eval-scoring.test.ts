import { describe, it, expect } from 'vitest';
import {
  scoreKeywordAccuracy,
  scoreCitationPrecision,
  scoreDocTypeCoverage,
  extractCitations,
} from '@/eval/scoring';
import type { QuestionResult, EvalQuestion } from '@/eval/types';

describe('scoreKeywordAccuracy', () => {
  it('returns correct hit rate for known inputs', () => {
    const result = scoreKeywordAccuracy(
      'Die Auftragssumme betraegt 3.200.000 EUR',
      ['Auftragssumme', '3.200.000', 'missing']
    );
    expect(result.hits).toEqual(['Auftragssumme', '3.200.000']);
    expect(result.misses).toEqual(['missing']);
    expect(result.score).toBeCloseTo(2 / 3);
  });

  it('returns score 0 for empty answer text', () => {
    const result = scoreKeywordAccuracy('', ['any']);
    expect(result.hits).toEqual([]);
    expect(result.misses).toEqual(['any']);
    expect(result.score).toBe(0);
  });

  it('returns score 1 when no keywords expected', () => {
    const result = scoreKeywordAccuracy('text', []);
    expect(result.hits).toEqual([]);
    expect(result.misses).toEqual([]);
    expect(result.score).toBe(1);
  });

  it('is case-insensitive', () => {
    const result = scoreKeywordAccuracy('BAUVERTRAG abgeschlossen', ['bauvertrag']);
    expect(result.hits).toEqual(['bauvertrag']);
    expect(result.misses).toEqual([]);
    expect(result.score).toBe(1);
  });
});

describe('scoreCitationPrecision', () => {
  it('returns 1.0 for exact match', () => {
    const score = scoreCitationPrecision(
      ['/01_vertraege/auftraggeber/hauptvertrag_stadtpark_ag.pdf'],
      ['/01_vertraege/auftraggeber/hauptvertrag_stadtpark_ag.pdf']
    );
    expect(score).toBe(1.0);
  });

  it('returns 0.0 for wrong citation', () => {
    const score = scoreCitationPrecision(
      ['/01_vertraege/wrong.pdf'],
      ['/01_vertraege/auftraggeber/hauptvertrag_stadtpark_ag.pdf']
    );
    expect(score).toBe(0.0);
  });

  it('returns 0 when no citations provided', () => {
    const score = scoreCitationPrecision([], ['/any/path']);
    expect(score).toBe(0);
  });

  it('uses partial path matching via includes', () => {
    const score = scoreCitationPrecision(
      ['/01_vertraege/hauptvertrag_stadtpark_ag.pdf'],
      ['/01_vertraege/auftraggeber/hauptvertrag_stadtpark_ag.pdf']
    );
    expect(score).toBe(1.0);
  });
});

describe('scoreDocTypeCoverage', () => {
  it('calculates coverage from passing categories', () => {
    const questions: EvalQuestion[] = [
      { id: 'q1', text: 'Q1', category: 'vertraege', expectedKeywords: [], expectedSourcePaths: [], maxSteps: 5 },
      { id: 'q2', text: 'Q2', category: 'nachtraege', expectedKeywords: [], expectedSourcePaths: [], maxSteps: 5 },
      { id: 'q3', text: 'Q3', category: 'protokolle', expectedKeywords: [], expectedSourcePaths: [], maxSteps: 5 },
      { id: 'q4', text: 'Q4', category: 'maengel', expectedKeywords: [], expectedSourcePaths: [], maxSteps: 5 },
      { id: 'q5', text: 'Q5', category: 'plaene', expectedKeywords: [], expectedSourcePaths: [], maxSteps: 5 },
      { id: 'q6', text: 'Q6', category: 'cross-cutting', expectedKeywords: [], expectedSourcePaths: [], maxSteps: 5 },
    ];

    const results: QuestionResult[] = [
      { questionId: 'q1', answerText: '', stepCount: 3, toolCallCount: 3, citedPaths: [], keywordHits: ['a'], keywordMisses: [], accuracyScore: 0.8, citationPrecision: 1, qualityScore: 4, durationMs: 100 },
      { questionId: 'q2', answerText: '', stepCount: 3, toolCallCount: 3, citedPaths: [], keywordHits: ['a'], keywordMisses: [], accuracyScore: 0.6, citationPrecision: 1, qualityScore: 4, durationMs: 100 },
      { questionId: 'q3', answerText: '', stepCount: 3, toolCallCount: 3, citedPaths: [], keywordHits: ['a'], keywordMisses: [], accuracyScore: 0.7, citationPrecision: 1, qualityScore: 4, durationMs: 100 },
      // q4 fails accuracy threshold
      { questionId: 'q4', answerText: '', stepCount: 3, toolCallCount: 3, citedPaths: [], keywordHits: [], keywordMisses: ['a'], accuracyScore: 0.3, citationPrecision: 0, qualityScore: 2, durationMs: 100 },
      // q5 fails accuracy threshold
      { questionId: 'q5', answerText: '', stepCount: 3, toolCallCount: 3, citedPaths: [], keywordHits: [], keywordMisses: ['a'], accuracyScore: 0.2, citationPrecision: 0, qualityScore: 2, durationMs: 100 },
      // q6 is cross-cutting, excluded from coverage
      { questionId: 'q6', answerText: '', stepCount: 3, toolCallCount: 3, citedPaths: [], keywordHits: ['a'], keywordMisses: [], accuracyScore: 0.9, citationPrecision: 1, qualityScore: 5, durationMs: 100 },
    ];

    const coverage = scoreDocTypeCoverage(results, questions);
    // 3 passing (vertraege, nachtraege, protokolle) out of 5 non-cross-cutting = 0.6
    expect(coverage).toBeCloseTo(0.6);
  });
});

describe('extractCitations', () => {
  it('extracts filesystem paths from text', () => {
    const paths = extractCitations(
      'Laut /01_vertraege/auftraggeber/hauptvertrag_stadtpark_ag.pdf betraegt...'
    );
    expect(paths).toEqual(['/01_vertraege/auftraggeber/hauptvertrag_stadtpark_ag.pdf']);
  });

  it('returns empty array when no paths found', () => {
    const paths = extractCitations('Keine Quellen hier');
    expect(paths).toEqual([]);
  });

  it('deduplicates paths cited multiple times', () => {
    const paths = extractCitations(
      'Siehe /01_vertraege/auftraggeber/vertrag.pdf und nochmal /01_vertraege/auftraggeber/vertrag.pdf'
    );
    expect(paths).toEqual(['/01_vertraege/auftraggeber/vertrag.pdf']);
  });

  it('handles multiple different paths in one text', () => {
    const paths = extractCitations(
      'Aus /01_vertraege/auftraggeber/vertrag.pdf und /02_nachtraege/nachtrag_001.pdf geht hervor'
    );
    expect(paths).toHaveLength(2);
    expect(paths).toContain('/01_vertraege/auftraggeber/vertrag.pdf');
    expect(paths).toContain('/02_nachtraege/nachtrag_001.pdf');
  });
});
