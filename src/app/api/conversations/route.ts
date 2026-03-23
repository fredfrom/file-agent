import { NextResponse } from 'next/server';
import { prisma } from '@/lib/db/client';

const PROJECT_ID = '00000000-0000-0000-0000-000000000001';

// List all conversations (newest first)
export async function GET() {
  const conversations = await prisma.conversation.findMany({
    where: { projectId: PROJECT_ID },
    orderBy: { updatedAt: 'desc' },
    select: {
      id: true,
      title: true,
      updatedAt: true,
    },
  });

  return NextResponse.json(conversations);
}

// Create a new conversation
export async function POST(req: Request) {
  const { title } = await req.json();

  const conversation = await prisma.conversation.create({
    data: {
      projectId: PROJECT_ID,
      title: title || 'Neue Unterhaltung',
    },
    select: { id: true, title: true, updatedAt: true },
  });

  return NextResponse.json(conversation);
}
