/**
 * A/B test protocol generator.
 * Produces a self-contained Markdown file with YAML frontmatter documenting
 * the full context of an A/B comparison run: configs, methodology, results, verdict.
 */

import type { ComparisonResult } from '@/eval/compare';
import type { AgentConfig } from '@/eval/types';

/**
 * Generate a human-readable Markdown protocol for an A/B comparison run.
 * The protocol is self-contained — readable without looking at code.
 */
export function generateProtocol(
  configA: AgentConfig,
  configB: AgentConfig,
  comparison: ComparisonResult
): string {
  const date = comparison.timestamp.split('T')[0];
  const questionCount = comparison.perQuestion.length;

  // Collect unique categories from question IDs (e.g., q-vertraege-01 -> vertraege)
  const categories = new Set(
    comparison.perQuestion.map((q) => {
      const parts = q.questionId.split('-');
      return parts.length >= 2 ? parts[1] : 'unknown';
    })
  );

  const kpiRows = comparison.kpiComparison
    .map((k) => `| ${k.kpi} | ${k.configA} | ${k.configB} | ${k.delta} | ${k.winner} |`)
    .join('\n');

  const perQuestionRows = comparison.perQuestion
    .map((q) => {
      const winnerLabel = q.winner === 'tie' ? 'tie' : q.winner;
      return `| ${q.questionId} | ${(q.configA.accuracy * 100).toFixed(0)}% | ${(q.configB.accuracy * 100).toFixed(0)}% | ${winnerLabel} |`;
    })
    .join('\n');

  return `---
date: ${comparison.timestamp}
config_a: ${configA.name}
config_b: ${configB.name}
verdict: pending
---

# Test Protocol: ${configA.name} vs ${configB.name}

## What Was Tested
Two agent configurations were compared against the same evaluation test suite.

### Config A: ${configA.name}
${configA.description}
- Max Steps: ${configA.maxSteps}

### Config B: ${configB.name}
${configB.description}
- Max Steps: ${configB.maxSteps}

## Methodology
- Test suite: ${questionCount} questions across ${categories.size} document categories
- Each config ran sequentially against the same questions
- Fresh bash sandbox per question per config
- Scoring: keyword accuracy, citation precision, step count, doc type coverage, quality (LLM judge)

## Results

### KPI Comparison

| KPI | ${configA.name} | ${configB.name} | Delta | Winner |
|-----|------|------|-------|--------|
${kpiRows}

### Per-Question Breakdown

| Question | ${configA.name} Accuracy | ${configB.name} Accuracy | Winner |
|----------|------|------|--------|
${perQuestionRows}

### Overall
- Config A passed: ${comparison.configA.result.passed}
- Config B passed: ${comparison.configB.result.passed}

## Verdict
pending -- update this field after reviewing the results above.
`;
}

/**
 * Generate the protocol filename following pattern: protocol-{date}-{configA}-vs-{configB}.md
 */
export function protocolFilename(
  configA: AgentConfig,
  configB: AgentConfig,
  date: string
): string {
  return `protocol-${date}-${configA.name}-vs-${configB.name}.md`;
}
