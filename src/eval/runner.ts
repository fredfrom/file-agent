/**
 * Eval runner: orchestrates question execution against the real agent.
 * Uses generateText (not streamText) for synchronous step/result access.
 */

import { generateText, stepCountIs } from 'ai';
import { anthropic } from '@ai-sdk/anthropic';
import { createBashTool } from 'bash-tool';
import { loadCorpus } from '@/corpus/loader';
import { buildSystemPrompt } from '@/lib/agent/system-prompt';
import { questions } from '@/eval/questions';
import {
  scoreKeywordAccuracy,
  scoreCitationPrecision,
  scoreDocTypeCoverage,
  extractCitations,
} from '@/eval/scoring';
import { judgeQuality } from '@/eval/judge';
import type { QuestionResult, EvalRunResult, AgentConfig } from '@/eval/types';

export interface RunEvalOptions {
  /** Run only the first 5 questions for rapid iteration */
  quick?: boolean;
  /** Optional agent config for A/B testing — when omitted, uses default behavior */
  config?: AgentConfig;
}

/**
 * Run the full evaluation suite against the real Anthropic API.
 * Each question gets a fresh bash sandbox and agent loop.
 */
export async function runEval(
  options?: RunEvalOptions
): Promise<EvalRunResult> {
  const corpus = await loadCorpus();
  const config = options?.config;
  const systemPrompt = config
    ? config.buildSystemPrompt(corpus)
    : buildSystemPrompt(corpus);

  const activeQuestions = options?.quick
    ? questions.slice(0, 5)
    : questions;

  const results: QuestionResult[] = [];

  for (let i = 0; i < activeQuestions.length; i++) {
    const q = activeQuestions[i];

    // Fresh bash sandbox per question
    const { tools } = await createBashTool({
      files: corpus,
      destination: '/',
    });

    const start = Date.now();
    const result = await generateText({
      model: anthropic('claude-sonnet-4-20250514'),
      system: systemPrompt,
      messages: [{ role: 'user', content: q.text }],
      tools: { bash: tools.bash },
      stopWhen: stepCountIs(config ? config.maxSteps : q.maxSteps),
    });
    const durationMs = Date.now() - start;

    const answerText = result.text;
    const stepCount = result.steps.length;
    const toolCallCount = result.steps.flatMap((s) => s.toolCalls).length;
    const citedPaths = extractCitations(answerText);

    const {
      hits: keywordHits,
      misses: keywordMisses,
      score: accuracyScore,
    } = scoreKeywordAccuracy(answerText, q.expectedKeywords);
    const citationPrecision = scoreCitationPrecision(
      citedPaths,
      q.expectedSourcePaths
    );
    const qualityScore = await judgeQuality(q.text, answerText);

    const qResult: QuestionResult = {
      questionId: q.id,
      answerText,
      stepCount,
      toolCallCount,
      citedPaths,
      keywordHits,
      keywordMisses,
      accuracyScore,
      citationPrecision,
      qualityScore,
      durationMs,
    };
    results.push(qResult);

    const status = accuracyScore >= 0.8 ? 'PASS' : 'FAIL';
    console.log(
      `[${i + 1}/${activeQuestions.length}] ${q.id}: ${status} | accuracy: ${(accuracyScore * 100).toFixed(0)}% | steps: ${toolCallCount} | quality: ${qualityScore}/5 | ${durationMs}ms`
    );
  }

  // Compute aggregated scores
  const accuracy =
    results.reduce((sum, r) => sum + r.accuracyScore, 0) / results.length;
  const citationPrecision =
    results.reduce((sum, r) => sum + r.citationPrecision, 0) / results.length;
  const avgStepCount =
    results.reduce((sum, r) => sum + r.toolCallCount, 0) / results.length;
  const docTypeCoverage = scoreDocTypeCoverage(results, activeQuestions);
  const avgQualityScore =
    results.reduce((sum, r) => sum + r.qualityScore, 0) / results.length;

  // KPI targets per D-14
  const passed =
    accuracy >= 0.8 &&
    citationPrecision >= 0.9 &&
    avgStepCount <= 6 &&
    docTypeCoverage >= 1.0 &&
    avgQualityScore >= 4.0;

  return {
    timestamp: new Date().toISOString(),
    questions: results,
    aggregated: {
      accuracy,
      citationPrecision,
      avgStepCount,
      docTypeCoverage,
      avgQualityScore,
    },
    passed,
  };
}
