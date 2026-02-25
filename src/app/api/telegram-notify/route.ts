import { NextRequest, NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import { isValidNvrSession } from '@/lib/nvr-auth';

export const dynamic = 'force-dynamic';

export async function POST(req: NextRequest) {
  const cookieStore = await cookies();
  if (!isValidNvrSession(cookieStore.get('nvr_session')?.value ?? '')) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const botToken = process.env.TELEGRAM_BOT_TOKEN;
  const chatId = process.env.TELEGRAM_CHAT_ID;
  if (!botToken || !chatId) {
    return NextResponse.json(
      { error: 'TELEGRAM_BOT_TOKEN and TELEGRAM_CHAT_ID must be set' },
      { status: 500 },
    );
  }

  const body = (await req.json().catch(() => ({}))) as { text?: string };
  const text = body.text?.trim();
  if (!text) {
    return NextResponse.json({ error: 'Missing text' }, { status: 400 });
  }

  const telegramUrl = `https://api.telegram.org/bot${botToken}/sendMessage`;
  const res = await fetch(telegramUrl, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      chat_id: chatId,
      text,
      parse_mode: 'HTML',
    }),
  });

  if (!res.ok) {
    const err = await res.text();
    return NextResponse.json({ error: `Telegram API error: ${err}` }, { status: 502 });
  }

  return NextResponse.json({ ok: true });
}
