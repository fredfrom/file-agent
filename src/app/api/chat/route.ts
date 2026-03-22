import { streamText, stepCountIs, convertToModelMessages, type UIMessage } from 'ai';
import { anthropic } from '@ai-sdk/anthropic';
import { createBashTool } from 'bash-tool';
import { loadCorpus } from '@/corpus/loader';
import { buildSystemPrompt } from '@/lib/agent/system-prompt';

export async function POST(req: Request) {
  const { messages }: { messages: UIMessage[] } = await req.json();

  const corpus = await loadCorpus();
  const { tools } = await createBashTool({
    files: corpus,
    destination: '/',
  });

  const modelMessages = await convertToModelMessages(messages);

  const result = streamText({
    model: anthropic('claude-sonnet-4-20250514'),
    system: buildSystemPrompt(corpus),
    messages: modelMessages,
    tools: { bash: tools.bash },
    stopWhen: stepCountIs(10),
  });

  return result.toUIMessageStreamResponse();
}
