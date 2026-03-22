/**
 * A/B comparison logic for running two agent configs against the same test suite.
 * Produces side-by-side KPI deltas and per-question breakdown with winner indicators.
 */

import type { AgentConfig, EvalRunResult } from '@/eval/types';
import { runEval } from '@/eval/runner';

/**
 * Result of comparing two agent configs side-by-side.
 */
export type ComparisonResult = {
  /** ISO timestamp of the comparison run */
  timestamp: string;
  /** Config A name, description, and full eval result */
  configA: { name: string; description: string; result: EvalRunResult };
  /** Config B name, description, and full eval result */
  configB: { name: string; description: string; result: EvalRunResult };
  /** Per-question breakdown with winner indicators */
  perQuestion: Array<{
    questionId: string;
    winner: string | 'tie';
    configA: { accuracy: number; steps: number; quality: number };
    configB: { accuracy: number; steps: number; quality: number };
  }>;
  /** KPI-level comparison with deltas and winner per metric */
  kpiComparison: Array<{
    kpi: string;
    configA: string;
    configB: string;
    delta: string;
    winner: string;
  }>;
};

/**
 * Compute a combined score for a question result.
 * Higher accuracy and quality are better; more steps are worse.
 */
function combinedScore(accuracy: number, quality: number, steps: number): number {
  return accuracy + quality / 5 - steps * 0.1;
}

/**
 * Run two agent configs against the same test suite and produce a comparison.
 * Configs are run sequentially to avoid API rate limit issues.
 */
export async function compareConfigs(
  configA: AgentConfig,
  configB: AgentConfig,
  options?: { quick?: boolean }
): Promise<ComparisonResult> {
  console.log(`\nRunning config: ${configA.name}...\n`);
  const resultA = await runEval({ quick: options?.quick, config: configA });

  console.log(`\nRunning config: ${configB.name}...\n`);
  const resultB = await runEval({ quick: options?.quick, config: configB });

  // Build per-question breakdown
  const perQuestion = resultA.questions.map((qA, i) => {
    const qB = resultB.questions[i];
    const scoreA = combinedScore(qA.accuracyScore, qA.qualityScore, qA.toolCallCount);
    const scoreB = combinedScore(qB.accuracyScore, qB.qualityScore, qB.toolCallCount);

    let winner: string | 'tie';
    if (Math.abs(scoreA - scoreB) < 0.01) {
      winner = 'tie';
    } else if (scoreA > scoreB) {
      winner = configA.name;
    } else {
      winner = configB.name;
    }

    return {
      questionId: qA.questionId,
      winner,
      configA: {
        accuracy: qA.accuracyScore,
        steps: qA.toolCallCount,
        quality: qA.qualityScore,
      },
      configB: {
        accuracy: qB.accuracyScore,
        steps: qB.toolCallCount,
        quality: qB.qualityScore,
      },
    };
  });

  // Build KPI comparison
  const a = resultA.aggregated;
  const b = resultB.aggregated;

  const kpiComparison = [
    {
      kpi: 'Accuracy',
      configA: `${(a.accuracy * 100).toFixed(1)}%`,
      configB: `${(b.accuracy * 100).toFixed(1)}%`,
      delta: `${((a.accuracy - b.accuracy) * 100).toFixed(1)}%`,
      winner: a.accuracy >= b.accuracy ? configA.name : configB.name,
    },
    {
      kpi: 'Citation Precision',
      configA: `${(a.citationPrecision * 100).toFixed(1)}%`,
      configB: `${(b.citationPrecision * 100).toFixed(1)}%`,
      delta: `${((a.citationPrecision - b.citationPrecision) * 100).toFixed(1)}%`,
      winner: a.citationPrecision >= b.citationPrecision ? configA.name : configB.name,
    },
    {
      kpi: 'Avg Step Count',
      configA: a.avgStepCount.toFixed(1),
      configB: b.avgStepCount.toFixed(1),
      delta: (a.avgStepCount - b.avgStepCount).toFixed(1),
      winner: a.avgStepCount <= b.avgStepCount ? configA.name : configB.name,
    },
    {
      kpi: 'Doc Type Coverage',
      configA: `${(a.docTypeCoverage * 100).toFixed(1)}%`,
      configB: `${(b.docTypeCoverage * 100).toFixed(1)}%`,
      delta: `${((a.docTypeCoverage - b.docTypeCoverage) * 100).toFixed(1)}%`,
      winner: a.docTypeCoverage >= b.docTypeCoverage ? configA.name : configB.name,
    },
    {
      kpi: 'Avg Quality Score',
      configA: `${a.avgQualityScore.toFixed(1)}/5`,
      configB: `${b.avgQualityScore.toFixed(1)}/5`,
      delta: (a.avgQualityScore - b.avgQualityScore).toFixed(1),
      winner: a.avgQualityScore >= b.avgQualityScore ? configA.name : configB.name,
    },
  ];

  return {
    timestamp: new Date().toISOString(),
    configA: { name: configA.name, description: configA.description, result: resultA },
    configB: { name: configB.name, description: configB.description, result: resultB },
    perQuestion,
    kpiComparison,
  };
}
