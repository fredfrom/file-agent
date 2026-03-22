import { streamText, stepCountIs, convertToModelMessages, type UIMessage } from 'ai';
import { anthropic } from '@ai-sdk/anthropic';
import { createBashTool } from 'bash-tool';
import { createDbFilesystem } from '@/lib/filesystem/db-filesystem';
import { buildSystemPrompt } from '@/lib/agent/system-prompt';

export const maxDuration = 60;

const MAX_MESSAGE_LENGTH = 2000;
const MAX_MESSAGES = 20;
const PROJECT_ID = '00000000-0000-0000-0000-000000000001';

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

  // DB-backed lazy filesystem (replaces loadCorpus -- D-07 hard cutover)
  const { bash, paths, accessLogger } = await createDbFilesystem(PROJECT_ID);
  const { tools } = await createBashTool({
    sandbox: bash,
    destination: '/',
  });

  const modelMessages = await convertToModelMessages(messages);

  const result = streamText({
    model: anthropic(process.env.AGENT_MODEL || 'claude-haiku-4-5-20251001'),
    system: buildSystemPrompt(paths),
    messages: modelMessages,
    tools: { bash: tools.bash },
    stopWhen: stepCountIs(5),
  });

  // Flush access logs after streaming completes (fire-and-forget)
  result.then(() => accessLogger.flush().catch(console.error));

  return result.toUIMessageStreamResponse();
}
