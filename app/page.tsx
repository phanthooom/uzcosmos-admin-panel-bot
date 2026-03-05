'use client'

import { useEffect, useState } from 'react'

declare global {
  interface Window {
    Telegram?: {
      WebApp: {
        ready: () => void
        expand: () => void
        close: () => void
        initDataUnsafe: {
          user?: {
            first_name: string
            last_name?: string
            username?: string
            photo_url?: string
          }
        }
        themeParams: {
          bg_color?: string
          text_color?: string
          hint_color?: string
          button_color?: string
          button_text_color?: string
        }
        MainButton: {
          text: string
          show: () => void
          hide: () => void
          onClick: (fn: () => void) => void
        }
        sendData: (data: string) => void
        colorScheme: 'light' | 'dark'
      }
    }
  }
}

export default function MiniApp() {
  const [user, setUser] = useState<{ first_name: string; username?: string; photo_url?: string } | null>(null)
  const [count, setCount] = useState(0)
  const [isDark, setIsDark] = useState(false)
  const [sent, setSent] = useState(false)

  useEffect(() => {
    const tg = window.Telegram?.WebApp
    if (tg) {
      tg.ready()
      tg.expand()
      setIsDark(tg.colorScheme === 'dark')
      const u = tg.initDataUnsafe?.user
      if (u) setUser(u)

      tg.MainButton.text = 'Отправить результат'
      tg.MainButton.show()
      tg.MainButton.onClick(() => {
        tg.sendData(JSON.stringify({ count }))
        setSent(true)
        setTimeout(() => tg.close(), 800)
      })
    }
  }, [])

  // sync MainButton text with count
  useEffect(() => {
    const tg = window.Telegram?.WebApp
    if (tg) {
      tg.MainButton.text = count > 0 ? `Отправить: ${count} кликов` : 'Отправить результат'
    }
  }, [count])

  const bg = isDark ? '#1c1c1e' : '#f2f2f7'
  const card = isDark ? '#2c2c2e' : '#ffffff'
  const text = isDark ? '#ffffff' : '#000000'
  const hint = isDark ? '#8e8e93' : '#6e6e73'
  const accent = '#007aff'

  return (
    <div style={{ minHeight: '100vh', background: bg, color: text, display: 'flex', flexDirection: 'column', alignItems: 'center', padding: '24px 16px', gap: 20 }}>

      {/* Header card */}
      <div style={{ background: card, borderRadius: 16, padding: '20px 24px', width: '100%', maxWidth: 360, boxShadow: '0 1px 4px rgba(0,0,0,0.1)', display: 'flex', alignItems: 'center', gap: 14 }}>
        {user?.photo_url ? (
          <img src={user.photo_url} alt="avatar" style={{ width: 52, height: 52, borderRadius: '50%', objectFit: 'cover' }} />
        ) : (
          <div style={{ width: 52, height: 52, borderRadius: '50%', background: accent, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 22, color: '#fff', fontWeight: 700 }}>
            {user ? user.first_name[0] : '?'}
          </div>
        )}
        <div>
          <div style={{ fontWeight: 600, fontSize: 17 }}>{user ? `${user.first_name}` : 'Гость'}</div>
          {user?.username && <div style={{ color: hint, fontSize: 14 }}>@{user.username}</div>}
        </div>
      </div>

      {/* Counter card */}
      <div style={{ background: card, borderRadius: 16, padding: '28px 24px', width: '100%', maxWidth: 360, boxShadow: '0 1px 4px rgba(0,0,0,0.1)', textAlign: 'center' }}>
        <div style={{ color: hint, fontSize: 14, marginBottom: 8 }}>Счётчик кликов</div>
        <div style={{ fontSize: 72, fontWeight: 700, lineHeight: 1, color: accent }}>{count}</div>

        <div style={{ display: 'flex', gap: 12, marginTop: 24, justifyContent: 'center' }}>
          <button
            onClick={() => setCount(c => Math.max(0, c - 1))}
            style={{ flex: 1, padding: '14px 0', borderRadius: 12, border: 'none', background: isDark ? '#3a3a3c' : '#e5e5ea', color: text, fontSize: 22, fontWeight: 700, cursor: 'pointer' }}
          >
            −
          </button>
          <button
            onClick={() => setCount(c => c + 1)}
            style={{ flex: 1, padding: '14px 0', borderRadius: 12, border: 'none', background: accent, color: '#fff', fontSize: 22, fontWeight: 700, cursor: 'pointer' }}
          >
            +
          </button>
        </div>

        <button
          onClick={() => setCount(0)}
          style={{ marginTop: 12, background: 'none', border: 'none', color: hint, fontSize: 14, cursor: 'pointer', padding: '4px 8px' }}
        >
          Сбросить
        </button>
      </div>

      {sent && (
        <div style={{ background: '#34c759', color: '#fff', borderRadius: 12, padding: '12px 20px', fontSize: 15, fontWeight: 500 }}>
          Результат отправлен!
        </div>
      )}

      {/* Info card */}
      <div style={{ background: card, borderRadius: 16, padding: '16px 20px', width: '100%', maxWidth: 360, boxShadow: '0 1px 4px rgba(0,0,0,0.1)' }}>
        <div style={{ color: hint, fontSize: 13, lineHeight: 1.6 }}>
          Это простой Telegram Mini App на Next.js + Vercel.<br />
          Нажми кнопку внизу, чтобы отправить результат боту.
        </div>
      </div>
    </div>
  )
}
