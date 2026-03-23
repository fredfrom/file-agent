import { streamText, stepCountIs, convertToModelMessages, type UIMessage } from 'ai';
import { anthropic } from '@ai-sdk/anthropic';
import { createBashTool } from 'bash-tool';
import { createDbFilesystem } from '@/lib/filesystem/db-filesystem';
import { buildSystemPrompt } from '@/lib/agent/system-prompt';
import { prisma } from '@/lib/db/client';

export const maxDuration = 60;

const MAX_MESSAGE_LENGTH = 2000;
const MAX_MESSAGES = 20;
const PROJECT_ID = '00000000-0000-0000-0000-000000000001';

export async function POST(req: Request) {
  const { messages, conversationId }: { messages: UIMessage[]; conversationId?: string } = await req.json();

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

  // Save the user message to DB if we have a conversation
  if (conversationId && lastMessage.role === 'user') {
    await prisma.message.create({
      data: {
        conversationId,
        role: 'user',
        parts: lastMessage.parts as unknown as Record<string, unknown>[],
      },
    });
    // Update conversation title from first user message
    const msgCount = await prisma.message.count({ where: { conversationId } });
    if (msgCount === 1 && lastText?.text) {
      await prisma.conversation.update({
        where: { id: conversationId },
        data: { title: lastText.text.slice(0, 100) },
      });
    }
    await prisma.conversation.update({
      where: { id: conversationId },
      data: { updatedAt: new Date() },
    });
  }

  const result = streamText({
    model: anthropic(process.env.AGENT_MODEL || 'claude-haiku-4-5-20251001'),
    system: buildSystemPrompt(paths),
    messages: modelMessages,
    tools: { bash: tools.bash },
    stopWhen: stepCountIs(15),
    async onFinish({ response }) {
      // Save assistant messages to DB
      if (conversationId) {
        for (const msg of response.messages) {
          if (msg.role === 'assistant') {
            await prisma.message.create({
              data: {
                conversationId,
                role: 'assistant',
                parts: msg.content as unknown as Record<string, unknown>[],
              },
            });
          }
        }
      }
    },
  });

  return result.toUIMessageStreamResponse();
}
