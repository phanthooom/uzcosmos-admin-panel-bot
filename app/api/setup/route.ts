import { NextRequest, NextResponse } from 'next/server'

// GET /api/setup?secret=YOUR_SECRET
// Registers the webhook with Telegram.
// Call this once after deploy.

export async function GET(req: NextRequest) {
  const secret = req.nextUrl.searchParams.get('secret')
  if (secret !== process.env.SETUP_SECRET) {
    return NextResponse.json({ error: 'Forbidden' }, { status: 403 })
  }

  const TOKEN = process.env.BOT_TOKEN!
  const webhookUrl = `${process.env.APP_URL}/api/telegram`

  const res = await fetch(`https://api.telegram.org/bot${TOKEN}/setWebhook`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ url: webhookUrl }),
  })
  const data = await res.json()

  return NextResponse.json(data)
}
