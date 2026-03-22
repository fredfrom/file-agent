/**
 * LLM-as-judge quality scoring for eval answers.
 * Uses a second Claude call to rate German fluency and completeness on a 1-5 scale.
 */

import { generateText } from 'ai';
import { anthropic } from '@ai-sdk/anthropic';

/**
 * Rate the quality of an agent answer using Claude as judge.
 * Returns a score from 1-5 (clamped). Falls back to 3 on parse failure.
 */
export async function judgeQuality(
  question: string,
  answer: string
): Promise<number> {
  const result = await generateText({
    model: anthropic('claude-sonnet-4-20250514'),
    messages: [
      {
        role: 'user',
        content: `Bewerte die folgende Antwort auf einer Skala von 1-5.

Kriterien:
1 = Unverstaendlich oder falsche Sprache
2 = Verstaendlich aber unvollstaendig
3 = Akzeptabel, einige Luecken
4 = Gut, professionelles Deutsch, fast vollstaendig
5 = Ausgezeichnet, praezise, vollstaendig, professionelle Bauterminologie

Frage: ${question}
Antwort: ${answer}

Antworte NUR mit einer Zahl von 1 bis 5.`,
      },
    ],
  });

  const parsed = parseInt(result.text.trim(), 10);

  if (isNaN(parsed)) {
    return 3;
  }

  return Math.max(1, Math.min(5, parsed));
}
