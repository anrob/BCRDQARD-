import { NextResponse } from 'next/server';
import { auth } from '@/lib/firebase/firebase';
import { saveBusinessCard, updateBusinessCard } from '@/lib/firebase/businessCardUtils';

export async function POST(request: Request) {
  try {
    const session = await auth.currentUser;
    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const data = await request.json();
    const cardId = await saveBusinessCard({
      ...data,
      userId: session.uid,
    });

    return NextResponse.json({ success: true, cardId });
  } catch (error) {
    return NextResponse.json({ success: false, error: 'Failed to save card' }, { status: 500 });
  }
}

export async function PUT(request: Request) {
  try {
    const session = await auth.currentUser;
    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { id, ...data } = await request.json();
    await updateBusinessCard(id, {
      ...data,
      userId: session.uid,
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    return NextResponse.json({ success: false, error: 'Failed to update card' }, { status: 500 });
  }
} 