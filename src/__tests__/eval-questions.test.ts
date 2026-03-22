import { describe, it, expect } from 'vitest';
import { questions } from '@/eval/questions';
import type { DocumentCategory } from '@/eval/types';

describe('eval questions', () => {
  it('has exactly 18 questions', () => {
    expect(questions).toHaveLength(18);
  });

  it('all question IDs are unique', () => {
    const ids = questions.map((q) => q.id);
    expect(new Set(ids).size).toBe(ids.length);
  });

  it('all questions have non-empty text', () => {
    for (const q of questions) {
      expect(q.text.length).toBeGreaterThan(0);
    }
  });

  it('all questions have non-empty expectedKeywords', () => {
    for (const q of questions) {
      expect(q.expectedKeywords.length).toBeGreaterThan(0);
    }
  });

  it('all questions have non-empty expectedSourcePaths', () => {
    for (const q of questions) {
      expect(q.expectedSourcePaths.length).toBeGreaterThan(0);
    }
  });

  it('all expectedSourcePaths start with "/" (absolute paths)', () => {
    for (const q of questions) {
      for (const p of q.expectedSourcePaths) {
        expect(p).toMatch(/^\//);
      }
    }
  });

  it('covers all 9 non-cross-cutting document categories', () => {
    const expectedCategories: DocumentCategory[] = [
      'vertraege',
      'nachtraege',
      'protokolle',
      'maengel',
      'plaene',
      'schriftverkehr',
      'bautagebuch',
      'rechnungen',
      'genehmigungen',
    ];
    const coveredCategories = new Set(
      questions.map((q) => q.category).filter((c) => c !== 'cross-cutting')
    );
    for (const cat of expectedCategories) {
      expect(coveredCategories.has(cat)).toBe(true);
    }
  });

  it('has at least 2 cross-cutting questions', () => {
    const crossCutting = questions.filter((q) => q.category === 'cross-cutting');
    expect(crossCutting.length).toBeGreaterThanOrEqual(2);
  });

  it('all questions have valid maxSteps (between 1 and 15)', () => {
    for (const q of questions) {
      expect(q.maxSteps).toBeGreaterThanOrEqual(1);
      expect(q.maxSteps).toBeLessThanOrEqual(15);
    }
  });

  it('all question IDs follow Q-XX format', () => {
    for (const q of questions) {
      expect(q.id).toMatch(/^Q-\d{2}$/);
    }
  });
});
