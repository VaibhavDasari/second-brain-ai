'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { motion, AnimatePresence } from 'framer-motion'
import { Brain, Link2, Lightbulb, Tag, Plus, X, Loader2, CheckCircle2, Sparkles } from 'lucide-react'

type KnowledgeType = 'note' | 'link' | 'insight'

const typeConfig = {
  note: {
    icon: Brain,
    label: 'Note',
    desc: 'Personal thoughts and observations',
    color: '#64a0ff',
    bg: 'rgba(100,160,255,0.08)',
    border: 'rgba(100,160,255,0.25)',
  },
  link: {
    icon: Link2,
    label: 'Link',
    desc: 'External resources and references',
    color: '#64dca0',
    bg: 'rgba(100,220,160,0.08)',
    border: 'rgba(100,220,160,0.25)',
  },
  insight: {
    icon: Lightbulb,
    label: 'Insight',
    desc: 'Key learnings and aha moments',
    color: '#f5a623',
    bg: 'rgba(245,166,35,0.08)',
    border: 'rgba(245,166,35,0.25)',
  },
}

export default function CapturePage() {
  const router = useRouter()
  const [type,      setType]      = useState<KnowledgeType>('note')
  const [title,     setTitle]     = useState('')
  const [content,   setContent]   = useState('')
  const [sourceUrl, setSourceUrl] = useState('')
  const [tagInput,  setTagInput]  = useState('')
  const [tags,      setTags]      = useState<string[]>([])
  const [loading,   setLoading]   = useState(false)
  const [success,   setSuccess]   = useState(false)
  const [error,     setError]     = useState('')

  const addTag = () => {
    const tag = tagInput.trim().toLowerCase().replace(/\s+/g, '-')
    if (tag && !tags.includes(tag) && tags.length < 8) {
      setTags([...tags, tag])
      setTagInput('')
    }
  }

  const removeTag = (t: string) => setTags(tags.filter((x) => x !== t))

  const handleTagKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' || e.key === ',') { e.preventDefault(); addTag() }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!title.trim() || !content.trim()) return
    setLoading(true)
    setError('')
    try {
      const res  = await fetch('/api/brain', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ title, content, type, source_url: sourceUrl || undefined, tags }),
      })
      const data = await res.json()
      if (!res.ok) throw new Error(data.error || 'Failed to save')
      setSuccess(true)
      setTimeout(() => router.push('/dashboard'), 1800)
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : 'Something went wrong')
      setLoading(false)
    }
  }

  if (success) {
    return (
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: 16, paddingTop: 60 }}
      >
        <motion.div
          initial={{ scale: 0.5, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ type: 'spring', stiffness: 200, damping: 15 }}
          style={{ width: 64, height: 64, borderRadius: '50%', background: 'rgba(100,220,160,0.1)', border: '2px solid rgba(100,220,160,0.4)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}
        >
          <CheckCircle2 size={28} color="#64dca0" />
        </motion.div>
        <h2 style={{ fontFamily: 'var(--font-display)', fontSize: 28, color: '#ccd6f6', letterSpacing: '-0.01em' }}>
          Captured &amp; processed!
        </h2>
        <p style={{ color: 'var(--slate)', fontSize: 14 }}>
          Saved! Claude is processing your entry in the background. Redirecting…
        </p>
      </motion.div>
    )
  }

  return (
    <div className="grid-bg" style={{ minHeight: '100vh', paddingTop: 80, paddingBottom: 80 }}>
      <div style={{ maxWidth: 680, margin: '0 auto', padding: '0 24px' }}>

        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}
          style={{ marginBottom: 48, paddingTop: 32 }}
        >
          <div style={{ display: 'inline-flex', alignItems: 'center', gap: 6, fontSize: 11, fontFamily: 'var(--font-mono)', color: 'var(--violet-soft)', letterSpacing: '0.08em', marginBottom: 16, padding: '4px 10px', background: 'rgba(124,58,237,0.08)', border: '1px solid rgba(124,58,237,0.2)', borderRadius: 999 }}>
            <Sparkles size={10} />
            NEW ENTRY
          </div>
          <h1 style={{ fontFamily: 'var(--font-display)', fontSize: 'clamp(30px, 5vw, 44px)', color: '#ccd6f6', letterSpacing: '-0.02em', marginBottom: 10 }}>
            Capture knowledge
          </h1>
          <p style={{ color: 'var(--slate)', fontSize: 15 }}>
            Claude will automatically summarize and tag your entry.
          </p>
        </motion.div>

        <motion.form
          initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5, delay: 0.1 }}
          onSubmit={handleSubmit}
        >
          {/* Type selector */}
          <div style={{ marginBottom: 28 }}>
            <label style={{ display: 'block', fontSize: 12, fontWeight: 600, color: 'var(--slate)', marginBottom: 12, letterSpacing: '0.06em', fontFamily: 'var(--font-mono)' }}>
              TYPE
            </label>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 10 }}>
              {(Object.entries(typeConfig) as [KnowledgeType, typeof typeConfig.note][]).map(([key, cfg]) => {
                const Icon       = cfg.icon
                const isSelected = type === key
                return (
                  <motion.button
                    key={key}
                    type="button"
                    onClick={() => setType(key)}
                    whileTap={{ scale: 0.97 }}
                    style={{
                      padding: '14px 16px', borderRadius: 10,
                      background: isSelected ? cfg.bg : 'rgba(255,255,255,0.025)',
                      border: `1px solid ${isSelected ? cfg.border : 'var(--border)'}`,
                      cursor: 'pointer', display: 'flex', flexDirection: 'column',
                      alignItems: 'center', gap: 8, transition: 'all 0.2s ease',
                    }}
                  >
                    <Icon size={18} color={isSelected ? cfg.color : '#495670'} />
                    <span style={{ fontSize: 13, fontWeight: 600, color: isSelected ? cfg.color : 'var(--slate)' }}>{cfg.label}</span>
                    <span style={{ fontSize: 11, color: 'var(--slate-dim)', textAlign: 'center', lineHeight: 1.4 }}>{cfg.desc}</span>
                  </motion.button>
                )
              })}
            </div>
          </div>

          {/* Title */}
          <div style={{ marginBottom: 20 }}>
            <label style={{ display: 'block', fontSize: 12, fontWeight: 600, color: 'var(--slate)', marginBottom: 8, letterSpacing: '0.06em', fontFamily: 'var(--font-mono)' }}>TITLE *</label>
            <input className="input-base" type="text" value={title} onChange={(e) => setTitle(e.target.value)} placeholder="Give this a clear, descriptive title…" required />
          </div>

          {/* Content */}
          <div style={{ marginBottom: 20 }}>
            <label style={{ display: 'block', fontSize: 12, fontWeight: 600, color: 'var(--slate)', marginBottom: 8, letterSpacing: '0.06em', fontFamily: 'var(--font-mono)' }}>CONTENT *</label>
            <textarea className="input-base" value={content} onChange={(e) => setContent(e.target.value)} placeholder="Paste an article, write your thoughts, or describe your insight…" required rows={8} style={{ resize: 'vertical', minHeight: 160 }} />
          </div>

          {/* Source URL — animated slide-in for link type */}
          <AnimatePresence>
            {type === 'link' && (
              <motion.div
                initial={{ opacity: 0, height: 0, marginBottom: 0 }}
                animate={{ opacity: 1, height: 'auto', marginBottom: 20 }}
                exit={{ opacity: 0, height: 0, marginBottom: 0 }}
                style={{ overflow: 'hidden' }}
              >
                <label style={{ display: 'block', fontSize: 12, fontWeight: 600, color: 'var(--slate)', marginBottom: 8, letterSpacing: '0.06em', fontFamily: 'var(--font-mono)' }}>SOURCE URL</label>
                <input className="input-base" type="url" value={sourceUrl} onChange={(e) => setSourceUrl(e.target.value)} placeholder="https://…" />
              </motion.div>
            )}
          </AnimatePresence>

          {/* Tags */}
          <div style={{ marginBottom: 32 }}>
            <label style={{ display: 'block', fontSize: 12, fontWeight: 600, color: 'var(--slate)', marginBottom: 8, letterSpacing: '0.06em', fontFamily: 'var(--font-mono)' }}>
              MANUAL TAGS <span style={{ color: 'var(--slate-dim)', fontWeight: 400 }}>(Claude will add more automatically)</span>
            </label>
            <div style={{ display: 'flex', gap: 8 }}>
              <input className="input-base" type="text" value={tagInput} onChange={(e) => setTagInput(e.target.value)} onKeyDown={handleTagKeyDown} placeholder="Type a tag and press Enter…" style={{ flex: 1 }} />
              <button type="button" onClick={addTag} className="btn-secondary" style={{ flexShrink: 0 }}>
                <Plus size={16} /> Add
              </button>
            </div>
            {tags.length > 0 && (
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6, marginTop: 12 }}>
                <AnimatePresence>
                  {tags.map((t) => (
                    <motion.span
                      key={t}
                      initial={{ opacity: 0, scale: 0.8 }}
                      animate={{ opacity: 1, scale: 1 }}
                      exit={{ opacity: 0, scale: 0.8 }}
                      className="tag-pill" style={{ display: 'inline-flex', alignItems: 'center', gap: 4, padding: '4px 10px' }}
                    >
                      <Tag size={10} />{t}
                      <button type="button" onClick={() => removeTag(t)} style={{ background: 'none', border: 'none', cursor: 'pointer', padding: 0, color: 'var(--violet-soft)', display: 'flex', alignItems: 'center', marginLeft: 2 }}>
                        <X size={10} />
                      </button>
                    </motion.span>
                  ))}
                </AnimatePresence>
              </div>
            )}
          </div>

          {/* AI notice */}
          <div style={{ padding: '14px 18px', borderRadius: 10, background: 'rgba(167,139,250,0.06)', border: '1px solid rgba(167,139,250,0.15)', marginBottom: 24, display: 'flex', alignItems: 'flex-start', gap: 12 }}>
            <Sparkles size={16} color="#a78bfa" style={{ flexShrink: 0, marginTop: 2 }} />
            <div>
              <p style={{ fontSize: 13, color: '#a78bfa', fontWeight: 600, marginBottom: 3 }}>Claude will process this entry</p>
              <p style={{ fontSize: 12, color: 'var(--slate-dim)', lineHeight: 1.5 }}>After saving, Claude will generate a concise summary and suggest relevant tags automatically.</p>
            </div>
          </div>

          {/* Error */}
          <AnimatePresence>
            {error && (
              <motion.div
                initial={{ opacity: 0, y: -8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}
                style={{ padding: '12px 16px', borderRadius: 8, background: 'rgba(255,100,100,0.08)', border: '1px solid rgba(255,100,100,0.2)', color: '#ff6464', fontSize: 14, marginBottom: 20 }}
              >
                {error}
              </motion.div>
            )}
          </AnimatePresence>

          <motion.button
            type="submit"
            disabled={loading || !title.trim() || !content.trim()}
            className="btn-primary"
            whileTap={{ scale: 0.98 }}
            style={{ width: '100%', justifyContent: 'center', fontSize: 15, padding: '14px' }}
          >
            {loading ? (
              <>
                <Loader2 size={16} style={{ animation: 'spin 1s linear infinite' }} />
                Processing with Claude…
              </>
            ) : (
              <>
                <Sparkles size={16} />
                Save &amp; Process with AI
              </>
            )}
          </motion.button>
        </motion.form>
      </div>
    </div>
  )
}
