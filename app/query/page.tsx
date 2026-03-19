'use client'

import { useState, useRef, useEffect } from 'react'
import { MessageSquare, Send, Sparkles, Brain, Loader2, BookOpen } from 'lucide-react'

interface Message {
  role: 'user' | 'assistant'
  content: string
  sources?: string[]
}

const suggestions = [
  'What are the most important insights I have captured?',
  'Summarize everything I know about AI',
  'What links have I saved recently?',
  'What are common themes in my notes?',
]

export default function QueryPage() {
  const [messages, setMessages] = useState<Message[]>([])
  const [input, setInput] = useState('')
  const [loading, setLoading] = useState(false)
  const bottomRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages])

  const sendMessage = async (text?: string) => {
    const question = (text || input).trim()
    if (!question || loading) return

    const userMsg: Message = { role: 'user', content: question }
    setMessages((prev) => [...prev, userMsg])
    setInput('')
    setLoading(true)

    try {
      const res = await fetch('/api/brain/query', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ question }),
      })

      const data = await res.json().catch(() => null)
      const fallbackContent =
        data?.error?.message ||
        data?.answer ||
        'I found related notes, but I could not assemble a complete response just now. Please try rephrasing your question.'

      console.debug('[query-page] /api/brain/query response', {
        ok: res.ok,
        status: res.status,
        data,
      })

      const assistantMsg: Message = {
        role: 'assistant',
        content: res.ok ? (data?.answer || fallbackContent) : fallbackContent,
        sources: Array.isArray(data?.sources) ? data.sources : [],
      }
      setMessages((prev) => [...prev, assistantMsg])

      if (!res.ok) {
        console.error('[query-page] Query request returned a non-OK status.', data)
      }
    } catch (error) {
      console.error('[query-page] Query request failed:', error)
      setMessages((prev) => [
        ...prev,
        {
          role: 'assistant',
          content: 'I hit an unexpected issue while searching your notes, but your saved knowledge is still intact. Please try again in a moment.',
        },
      ])
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="grid-bg" style={{ minHeight: '100vh', paddingTop: 80, display: 'flex', flexDirection: 'column' }}>
      <div style={{ maxWidth: 760, margin: '0 auto', padding: '32px 24px', flex: 1, display: 'flex', flexDirection: 'column', width: '100%' }}>
        {/* Header */}
        <div style={{ marginBottom: 32 }}>
          <div
            style={{
              display: 'inline-flex', alignItems: 'center', gap: 6,
              fontSize: 11, fontFamily: 'var(--font-mono)', color: '#a78bfa',
              letterSpacing: '0.08em', marginBottom: 14, padding: '4px 10px',
              background: 'rgba(167,139,250,0.08)', border: '1px solid rgba(167,139,250,0.2)', borderRadius: 999,
            }}
          >
            <Sparkles size={10} />
            CONVERSATIONAL AI
          </div>
          <h1 style={{ fontFamily: 'var(--font-display)', fontSize: 'clamp(26px, 4vw, 38px)', color: '#ccd6f6', letterSpacing: '-0.02em', marginBottom: 8 }}>
            Query your brain
          </h1>
          <p style={{ color: 'var(--slate)', fontSize: 14 }}>
            Ask Claude anything — it will search your knowledge base for answers.
          </p>
        </div>

        {/* Chat area */}
        <div
          style={{
            flex: 1, display: 'flex', flexDirection: 'column', gap: 16,
            minHeight: 0, overflowY: messages.length ? 'auto' : 'visible',
            paddingBottom: 8,
          }}
        >
          {messages.length === 0 && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: 12, alignItems: 'center', paddingTop: 16 }}>
              <div
                style={{
                  width: 56, height: 56, borderRadius: '50%',
                  background: 'rgba(167,139,250,0.08)', border: '1px solid rgba(167,139,250,0.2)',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                }}
              >
                <Brain size={24} color="#a78bfa" />
              </div>
              <p style={{ color: 'var(--slate)', fontSize: 14, textAlign: 'center', maxWidth: 360, lineHeight: 1.6 }}>
                Ask a question and Claude will find answers from your saved notes, links, and insights.
              </p>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 8, width: '100%', maxWidth: 480, marginTop: 12 }}>
                <p style={{ fontSize: 11, color: 'var(--slate-dim)', fontFamily: 'var(--font-mono)', letterSpacing: '0.06em' }}>
                  SUGGESTED QUESTIONS
                </p>
                {suggestions.map((s) => (
                  <button
                    key={s}
                    onClick={() => sendMessage(s)}
                    style={{
                      padding: '12px 16px',
                      borderRadius: 10,
                      border: '1px solid var(--border)',
                      background: 'rgba(255,255,255,0.02)',
                      color: 'var(--slate)',
                      fontSize: 13,
                      textAlign: 'left',
                      cursor: 'pointer',
                      transition: 'all 0.2s ease',
                      fontFamily: 'var(--font-body)',
                    }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.borderColor = 'rgba(167,139,250,0.3)'
                      e.currentTarget.style.color = '#ccd6f6'
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.borderColor = 'var(--border)'
                      e.currentTarget.style.color = 'var(--slate)'
                    }}
                  >
                    {s}
                  </button>
                ))}
              </div>
            </div>
          )}

          {messages.map((msg, i) => (
            <div
              key={i}
              style={{
                display: 'flex',
                flexDirection: msg.role === 'user' ? 'row-reverse' : 'row',
                gap: 12,
                alignItems: 'flex-start',
              }}
            >
              {/* Avatar */}
              <div
                style={{
                  width: 32, height: 32, borderRadius: '50%', flexShrink: 0,
                  background: msg.role === 'user' ? 'rgba(124,58,237,0.1)' : 'rgba(167,139,250,0.1)',
                  border: `1px solid ${msg.role === 'user' ? 'rgba(124,58,237,0.2)' : 'rgba(167,139,250,0.2)'}`,
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                }}
              >
                {msg.role === 'user'
                  ? <MessageSquare size={14} color="var(--violet-soft)" />
                  : <Sparkles size={14} color="#a78bfa" />
                }
              </div>

              {/* Bubble */}
              <div style={{ maxWidth: '80%' }}>
                <div
                  style={{
                    padding: '12px 16px',
                    borderRadius: msg.role === 'user' ? '14px 14px 4px 14px' : '14px 14px 14px 4px',
                    background: msg.role === 'user' ? 'rgba(124,58,237,0.08)' : 'rgba(255,255,255,0.03)',
                    border: `1px solid ${msg.role === 'user' ? 'rgba(124,58,237,0.2)' : 'var(--border)'}`,
                    fontSize: 14,
                    color: '#ccd6f6',
                    lineHeight: 1.6,
                    whiteSpace: 'pre-wrap',
                  }}
                >
                  {msg.content}
                </div>
                {msg.sources && msg.sources.length > 0 && (
                  <div style={{ marginTop: 8, display: 'flex', flexWrap: 'wrap', gap: 5 }}>
                    <span style={{ fontSize: 11, color: 'var(--slate-dim)', fontFamily: 'var(--font-mono)', alignSelf: 'center' }}>
                      <BookOpen size={10} style={{ display: 'inline', marginRight: 4 }} />
                      Sources:
                    </span>
                    {msg.sources.map((s) => (
                      <span
                        key={s}
                        style={{
                          fontSize: 11, padding: '2px 8px', borderRadius: 999,
                          background: 'rgba(167,139,250,0.08)', border: '1px solid rgba(167,139,250,0.15)',
                          color: '#a78bfa', fontFamily: 'var(--font-mono)',
                        }}
                      >
                        {s}
                      </span>
                    ))}
                  </div>
                )}
              </div>
            </div>
          ))}

          {loading && (
            <div style={{ display: 'flex', gap: 12, alignItems: 'center' }}>
              <div
                style={{
                  width: 32, height: 32, borderRadius: '50%', flexShrink: 0,
                  background: 'rgba(167,139,250,0.1)', border: '1px solid rgba(167,139,250,0.2)',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                }}
              >
                <Sparkles size={14} color="#a78bfa" />
              </div>
              <div
                style={{
                  padding: '12px 16px', borderRadius: '14px 14px 14px 4px',
                  background: 'rgba(255,255,255,0.03)', border: '1px solid var(--border)',
                  display: 'flex', alignItems: 'center', gap: 8, color: 'var(--slate)', fontSize: 13,
                }}
              >
                <Loader2 size={14} style={{ animation: 'spin 1s linear infinite', color: '#a78bfa', flexShrink: 0 }} />
                Searching your knowledge base…
              </div>
            </div>
          )}

          <div ref={bottomRef} />
        </div>

        {/* Input */}
        <div
          style={{
            display: 'flex', gap: 10, marginTop: 24,
            padding: '16px', borderRadius: 14,
            background: 'rgba(255,255,255,0.02)',
            border: '1px solid var(--border)',
            position: 'sticky', bottom: 24,
          }}
        >
          <input
            className="input-base"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => { if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); sendMessage() } }}
            placeholder="Ask anything about your knowledge base…"
            style={{ border: 'none', background: 'transparent', padding: '0', boxShadow: 'none' }}
          />
          <button
            onClick={() => sendMessage()}
            disabled={!input.trim() || loading}
            className="btn-primary"
            style={{ flexShrink: 0 }}
          >
            <Send size={16} />
          </button>
        </div>
      </div>
    </div>
  )
}
