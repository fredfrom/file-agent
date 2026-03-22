/**
 * CLI entry point for the eval harness.
 * Usage: npm run eval [-- --quick]
 *
 * Runs all eval questions against the real Anthropic API,
 * prints a summary table, and saves results to eval-results/.
 */

import { mkdirSync, writeFileSync } from 'node:fs';
import { runEval } from '@/eval/runner';

const quick = process.argv.includes('--quick');

async function main() {
  console.log(
    `\n=== File Agent Eval${quick ? ' (QUICK MODE - 5 questions)' : ''} ===\n`
  );

  const result = await runEval({ quick });

  // Print summary table
  console.log('\n=== KPI Summary ===\n');
  console.table([
    {
      KPI: 'Accuracy',
      Score: `${(result.aggregated.accuracy * 100).toFixed(1)}%`,
      Target: '>=80%',
      Status: result.aggregated.accuracy >= 0.8 ? 'PASS' : 'FAIL',
    },
    {
      KPI: 'Citation Precision',
      Score: `${(result.aggregated.citationPrecision * 100).toFixed(1)}%`,
      Target: '>=90%',
      Status: result.aggregated.citationPrecision >= 0.9 ? 'PASS' : 'FAIL',
    },
    {
      KPI: 'Avg Step Count',
      Score: result.aggregated.avgStepCount.toFixed(1),
      Target: '<=6',
      Status: result.aggregated.avgStepCount <= 6 ? 'PASS' : 'FAIL',
    },
    {
      KPI: 'Doc Type Coverage',
      Score: `${(result.aggregated.docTypeCoverage * 100).toFixed(1)}%`,
      Target: '100%',
      Status: result.aggregated.docTypeCoverage >= 1.0 ? 'PASS' : 'FAIL',
    },
    {
      KPI: 'Avg Quality Score',
      Score: `${result.aggregated.avgQualityScore.toFixed(1)}/5`,
      Target: '>=4.0',
      Status: result.aggregated.avgQualityScore >= 4.0 ? 'PASS' : 'FAIL',
    },
  ]);

  console.log(
    `\nOverall: ${result.passed ? 'PASSED' : 'FAILED'}\n`
  );

  // Save results to timestamped JSON file
  const dir = 'eval-results';
  mkdirSync(dir, { recursive: true });

  const dateStr = new Date().toISOString().split('T')[0];
  const filename = `${dir}/run-${dateStr}.json`;
  writeFileSync(filename, JSON.stringify(result, null, 2));
  console.log(`Results saved to ${filename}\n`);

  process.exit(result.passed ? 0 : 1);
}

main().catch((err) => {
  console.error('Eval failed:', err);
  process.exit(1);
});
