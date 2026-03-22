import { streamText, stepCountIs, convertToModelMessages, type UIMessage } from 'ai';
import { anthropic } from '@ai-sdk/anthropic';
import { createBashTool } from 'bash-tool';
import { loadCorpus } from '@/corpus/loader';
import { buildSystemPrompt } from '@/lib/agent/system-prompt';

export const maxDuration = 60;

const MAX_MESSAGE_LENGTH = 2000;
const MAX_MESSAGES = 20;

export async function POST(req: Request) {
  const { messages }: { messages: UIMessage[] } = await req.json();

  // Input validation
  if (!Array.isArray(messages) || messages.length === 0) {
    return new Response('Invalid request', { status: 400 });
  }
  if (messages.length > MAX_MESSAGES) {
    return new Response('Too many messages', { status: 400 });
  }
  const lastMessage = messages[messages.length - 1];
  const lastText = lastMessage?.parts?.find((p: { type: string }) => p.type === 'text') as { text?: string } | undefined;
  if (lastText?.text && lastText.text.length > MAX_MESSAGE_LENGTH) {
    return new Response('Message too long', { status: 400 });
  }

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
