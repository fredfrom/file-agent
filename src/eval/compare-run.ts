/**
 * CLI entry point for A/B comparison eval.
 * Usage: npm run eval:compare [-- --quick]
 *
 * Runs baseline vs concise configs against the test suite,
 * prints comparison tables, and saves results to eval-results/.
 */

import { mkdirSync, writeFileSync } from 'node:fs';
import { compareConfigs } from '@/eval/compare';
import { baseline, concise } from '@/eval/configs';
import { generateProtocol, protocolFilename } from '@/eval/protocol';

const quick = process.argv.includes('--quick');

async function main() {
  console.log(
    `\n=== File Agent A/B Comparison${quick ? ' (QUICK MODE - 5 questions)' : ''} ===`
  );
  console.log(`Config A: ${baseline.name} — ${baseline.description}`);
  console.log(`Config B: ${concise.name} — ${concise.description}\n`);

  const result = await compareConfigs(baseline, concise, { quick });

  // Print KPI comparison table
  console.log('\n=== KPI Comparison ===\n');
  console.table(result.kpiComparison);

  // Print per-question breakdown
  console.log('\n=== Per-Question Breakdown ===\n');
  for (const q of result.perQuestion) {
    const winnerLabel = q.winner === 'tie' ? 'TIE' : `Winner: ${q.winner}`;
    console.log(
      `  ${q.questionId}: ${winnerLabel} | ` +
      `A(acc=${(q.configA.accuracy * 100).toFixed(0)}%, steps=${q.configA.steps}, qual=${q.configA.quality}) | ` +
      `B(acc=${(q.configB.accuracy * 100).toFixed(0)}%, steps=${q.configB.steps}, qual=${q.configB.quality})`
    );
  }

  // Print overall results
  console.log(`\nConfig A (${result.configA.name}): ${result.configA.result.passed ? 'PASSED' : 'FAILED'}`);
  console.log(`Config B (${result.configB.name}): ${result.configB.result.passed ? 'PASSED' : 'FAILED'}\n`);

  // Save comparison JSON
  const dir = 'eval-results';
  mkdirSync(dir, { recursive: true });

  const dateStr = new Date().toISOString().split('T')[0];
  const filename = `${dir}/compare-${result.configA.name}-vs-${result.configB.name}-${dateStr}.json`;
  writeFileSync(filename, JSON.stringify(result, null, 2));
  console.log(`Comparison saved to ${filename}\n`);

  // Generate protocol Markdown artifact
  const protocolDir = 'eval-results/protocols';
  mkdirSync(protocolDir, { recursive: true });

  const protocol = generateProtocol(baseline, concise, result);
  const protocolFile = `${protocolDir}/${protocolFilename(baseline, concise, dateStr)}`;
  writeFileSync(protocolFile, protocol);
  console.log(`Protocol saved to ${protocolFile}\n`);
}

main().catch((err) => {
  console.error('Comparison failed:', err);
  process.exit(1);
});
