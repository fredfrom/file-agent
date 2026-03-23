import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/db/client';

// Get a conversation with all its messages
export async function GET(
  _req: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  try {
    const { id } = await params;

    const conversation = await prisma.conversation.findUnique({
      where: { id },
      include: {
        messages: {
          orderBy: { createdAt: 'asc' },
          select: { id: true, role: true, parts: true, createdAt: true },
        },
      },
    });

    if (!conversation) {
      return NextResponse.json({ error: 'Nicht gefunden' }, { status: 404 });
    }

    return NextResponse.json(conversation);
  } catch (err) {
    console.error('[api/conversations/[id]] GET', err);
    return NextResponse.json({ error: 'Fehler beim Laden der Unterhaltung' }, { status: 500 });
  }
}

// Delete a conversation
export async function DELETE(
  _req: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  try {
    const { id } = await params;
    await prisma.conversation.delete({ where: { id } });
    return NextResponse.json({ ok: true });
  } catch (err) {
    console.error('[api/conversations/[id]] DELETE', err);
    // Prisma throws P2025 if record not found
    const prismaErr = err as { code?: string };
    if (prismaErr.code === 'P2025') {
      return NextResponse.json({ error: 'Unterhaltung nicht gefunden' }, { status: 404 });
    }
    return NextResponse.json({ error: 'Fehler beim Loeschen der Unterhaltung' }, { status: 500 });
  }
}
