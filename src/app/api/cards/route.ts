import { NextResponse } from 'next/server';
import connectToDatabase from '@/lib/mongodb';
import Card from '@/models/Card';

export async function GET() {
  try {
    await connectToDatabase();
    const cards = await Card.find({}).sort({ createdAt: 1 });
    return NextResponse.json(cards);
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

// Handle card mutations (freeze, unlock online, generate new)
export async function POST(req: Request) {
  try {
    await connectToDatabase();
    const body = await req.json();
    const { action, cardId, userId } = body;

    if (action === 'generate') {
      const newCard = await Card.create({
        userId,
        cardType: 'virtual',
        cardNetwork: 'visa',
        lastFour: String(Math.floor(1000 + Math.random() * 9000)),
        expiryMonth: 12,
        expiryYear: 2028,
        status: 'active',
        currentCvv: String(Math.floor(100 + Math.random() * 900)),
        designTheme: 'quantum-pulse',
      });
      return NextResponse.json(newCard);
    }

    if (!cardId) {
      return NextResponse.json({ error: 'cardId required' }, { status: 400 });
    }

    const card = await Card.findById(cardId);
    if (!card) return NextResponse.json({ error: 'Card not found' }, { status: 404 });

    switch (action) {
      case 'toggleStatus':
        card.status = card.status === 'active' ? 'frozen' : 'active';
        break;
      case 'toggleOnline':
        card.onlineEnabled = !card.onlineEnabled;
        break;
      case 'toggleInternational':
        card.internationalEnabled = !card.internationalEnabled;
        break;
      case 'toggleNightLock':
        card.nightLockEnabled = !card.nightLockEnabled;
        break;
      default:
        return NextResponse.json({ error: 'Invalid action' }, { status: 400 });
    }

    await card.save();
    return NextResponse.json(card);

  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
