'use client'

import { useState } from 'react'
import { Brain, Send, Sparkles, Loader2 } from 'lucide-react'

export default function WidgetPage() {
  const [question, setQuestion] = useState('')
  const [answer, setAnswer] = useState('')
  const [sources, setSources] = useState<string[]>([])
  const [loading, setLoading] = useState(false)
  const [asked, setAsked] = useState(false)

  const ask = async () => {
    if (!question.trim() || loading) return
    setLoading(true)
    setAsked(true)
    try {
      const res = await fetch(`/api/public/brain/query?q=${encodeURIComponent(question)}`)
      const data = await res.json()
      setAnswer(data.answer || 'No answer found.')
      setSources(data.sources || [])
    } catch {
      setAnswer('Something went wrong. Please try again.')
      setSources([])
    } finally {
      setLoading(false)
    }
  }

  return (
    <div
      style={{
        minHeight: '100vh',
        background: '#0d0d18',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: 16,
        fontFamily: 'var(--font-body)',
      }}
    >
      <div
        style={{
          width: '100%',
          maxWidth: 420,
          background: 'rgba(255,255,255,0.02)',
          border: '1px solid rgba(136,146,176,0.15)',
          borderRadius: 16,
          overflow: 'hidden',
        }}
      >
        {/* Header */}
        <div
          style={{
            padding: '18px 20px',
            borderBottom: '1px solid rgba(136,146,176,0.1)',
            display: 'flex',
            alignItems: 'center',
            gap: 10,
            background: 'rgba(124,58,237,0.04)',
          }}
        >
          <div
            style={{
              width: 30, height: 30, borderRadius: 8,
              background: 'rgba(124,58,237,0.12)', border: '1px solid rgba(124,58,237,0.25)',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
            }}
          >
            <Brain size={14} color="#a78bfa" />
          </div>
          <div>
            <div style={{ fontSize: 13, fontWeight: 600, color: '#ccd6f6' }}>Second Brain</div>
            <div style={{ fontSize: 11, color: 'var(--slate-dim)', fontFamily: 'var(--font-mono)' }}>
              Powered by Claude
            </div>
          </div>
        </div>

        {/* Body */}
        <div style={{ padding: 20 }}>
          {asked && (
            <div
              style={{
                marginBottom: 16, padding: '14px 16px', borderRadius: 10,
                background: loading ? 'rgba(167,139,250,0.04)' : 'rgba(255,255,255,0.02)',
                border: '1px solid rgba(136,146,176,0.1)',
              }}
            >
              {loading ? (
                <div style={{ display: 'flex', alignItems: 'center', gap: 8, color: 'var(--slate)', fontSize: 13 }}>
                  <Loader2 size={14} color="#a78bfa" style={{ animation: 'spin 1s linear infinite' }} />
                  Searching knowledge base…
                </div>
              ) : (
                <>
                  <p style={{ fontSize: 13, color: '#ccd6f6', lineHeight: 1.6, marginBottom: sources.length ? 10 : 0, whiteSpace: 'pre-wrap' }}>
                    {answer}
                  </p>
                  {sources.length > 0 && (
                    <div style={{ display: 'flex', flexWrap: 'wrap', gap: 4 }}>
                      {sources.map((s) => (
                        <span
                          key={s}
                          style={{
                            fontSize: 10, padding: '2px 7px', borderRadius: 999,
                            background: 'rgba(167,139,250,0.08)', border: '1px solid rgba(167,139,250,0.15)',
                            color: '#a78bfa', fontFamily: 'var(--font-mono)',
                          }}
                        >
                          {s}
                        </span>
                      ))}
                    </div>
                  )}
                </>
              )}
            </div>
          )}

          <div style={{ display: 'flex', gap: 8 }}>
            <input
              value={question}
              onChange={(e) => setQuestion(e.target.value)}
              onKeyDown={(e) => { if (e.key === 'Enter') ask() }}
              placeholder="Ask anything…"
              style={{
                flex: 1, background: 'rgba(255,255,255,0.04)',
                border: '1px solid rgba(136,146,176,0.12)',
                borderRadius: 8, padding: '10px 14px',
                color: '#ccd6f6', fontSize: 13, outline: 'none',
                fontFamily: 'var(--font-body)',
              }}
            />
            <button
              onClick={ask}
              disabled={!question.trim() || loading}
              style={{
                padding: '10px 14px', borderRadius: 8,
                background: question.trim() && !loading ? '#7c3aed' : 'rgba(124,58,237,0.2)',
                border: 'none', cursor: question.trim() && !loading ? 'pointer' : 'not-allowed',
                display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0,
                transition: 'all 0.2s ease',
              }}
            >
              <Send size={14} color={question.trim() && !loading ? '#ffffff' : '#a78bfa'} />
            </button>
          </div>

          <div style={{ marginTop: 12, display: 'flex', alignItems: 'center', gap: 4, justifyContent: 'center' }}>
            <Sparkles size={10} color="var(--slate-dim)" />
            <span style={{ fontSize: 10, color: 'var(--slate-dim)', fontFamily: 'var(--font-mono)' }}>
              Powered by Claude · Second Brain
            </span>
          </div>
        </div>
      </div>
    </div>
  )
}
