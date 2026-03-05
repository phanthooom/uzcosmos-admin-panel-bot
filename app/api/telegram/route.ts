import { NextRequest, NextResponse } from 'next/server'

const TOKEN = process.env.BOT_TOKEN!
const API = `https://api.telegram.org/bot${TOKEN}`
const APP_URL = process.env.APP_URL!   // https://your-app.vercel.app

async function call(method: string, body: object) {
  const res = await fetch(`${API}/${method}`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(body),
  })
  return res.json()
}

export async function POST(req: NextRequest) {
  try {
    const update = await req.json()
    const msg = update.message

    if (!msg) return NextResponse.json({ ok: true })

    const chat_id = msg.chat.id
    const text: string = msg.text ?? ''
    const name = msg.from?.first_name ?? 'друг'

    if (text === '/start') {
      await call('sendMessage', {
        chat_id,
        text: `Привет, ${name}! Нажми кнопку ниже, чтобы открыть Mini App.`,
        reply_markup: {
          inline_keyboard: [[
            { text: 'Открыть Mini App', web_app: { url: APP_URL } }
          ]]
        }
      })
    } else if (msg.web_app_data) {
      // Telegram sends this when user clicks MainButton in Mini App
      const data = JSON.parse(msg.web_app_data.data)
      await call('sendMessage', {
        chat_id,
        text: `Получил результат!\n\nКоличество кликов: *${data.count}*`,
        parse_mode: 'Markdown',
      })
    } else {
      await call('sendMessage', {
        chat_id,
        text: 'Используй /start для начала.',
      })
    }
  } catch (e) {
    console.error(e)
  }

  return NextResponse.json({ ok: true })
}
