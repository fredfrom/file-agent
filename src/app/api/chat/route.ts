import { streamText, stepCountIs, convertToModelMessages, type UIMessage } from 'ai';
import { anthropic } from '@ai-sdk/anthropic';
import { createBashTool } from 'bash-tool';
import { loadCorpus } from '@/corpus/loader';
import { buildSystemPrompt } from '@/lib/agent/system-prompt';

export const maxDuration = 60;

export async function POST(req: Request) {
  const { messages }: { messages: UIMessage[] } = await req.json();

  const corpus = await loadCorpus();
  const { tools } = await createBashTool({
    files: corpus,
    destination: '/',
  });

  const modelMessages = await convertToModelMessages(messages);

  const result = streamText({
    model: anthropic(process.env.AGENT_MODEL || 'claude-haiku-4-5-20251001'),
    system: buildSystemPrompt(corpus),
    messages: modelMessages,
    tools: { bash: tools.bash },
    stopWhen: stepCountIs(5),
  });

  return result.toUIMessageStreamResponse();
}
