import { NextResponse } from 'next/server';
import { prisma } from '@/lib/db/client';
import { PROJECT_ID } from '@/lib/ingest/constants';

// List all conversations (newest first)
export async function GET() {
  try {
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
  } catch (err) {
    console.error('[api/conversations] GET', err);
    return NextResponse.json({ error: 'Fehler beim Laden der Unterhaltungen' }, { status: 500 });
  }
}

// Create a new conversation
export async function POST(req: Request) {
  try {
    const { title } = await req.json();

    const conversation = await prisma.conversation.create({
      data: {
        projectId: PROJECT_ID,
        title: title || 'Neue Unterhaltung',
      },
      select: { id: true, title: true, updatedAt: true },
    });

    return NextResponse.json(conversation);
  } catch (err) {
    console.error('[api/conversations] POST', err);
    return NextResponse.json({ error: 'Unterhaltung konnte nicht erstellt werden' }, { status: 500 });
  }
}
