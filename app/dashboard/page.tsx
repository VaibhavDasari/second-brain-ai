'use client'

import { useEffect, useState, useCallback, useRef } from 'react'
import Link from 'next/link'
import { motion, AnimatePresence } from 'framer-motion'
import {
  Search, Plus, Brain, Link2, Lightbulb, Tag, Calendar,
  ExternalLink, Filter, SortAsc, Sparkles, Trash2, Loader2,
} from 'lucide-react'
import type { KnowledgeItem } from '@/lib/types'
import { staggerContainer, staggerItem } from '@/lib/motion'

const typeIcons = { note: Brain, link: Link2, insight: Lightbulb }
const typeColors = { note: '#64a0ff', link: '#64dca0', insight: '#f5a623' }

function SkeletonCard() {
  return (
    <div style={{ padding: 24, borderRadius: 14, border: '1px solid var(--border)', background: 'rgba(255,255,255,0.02)' }}>
      <div className="skeleton" style={{ height: 20, borderRadius: 4, marginBottom: 12, width: '70%' }} />
      <div className="skeleton" style={{ height: 14, borderRadius: 4, marginBottom: 8, width: '100%' }} />
      <div className="skeleton" style={{ height: 14, borderRadius: 4, marginBottom: 8, width: '85%' }} />
      <div className="skeleton" style={{ height: 14, borderRadius: 4, marginBottom: 20, width: '60%' }} />
    </div>
  )
}

function KnowledgeCard({ item, onDelete }: { item: KnowledgeItem; onDelete: (id: string) => void }) {
  const Icon = typeIcons[item.type]
  const color = typeColors[item.type]
  const [deleting, setDeleting] = useState(false)

  const date = new Date(item.createdAt).toLocaleDateString('en-US', {
    month: 'short', day: 'numeric', year: 'numeric',
  })

  const handleDelete = async (e: any) => {
    e.preventDefault()
    e.stopPropagation()

    if (!confirm('Remove this item from your brain?')) return

    setDeleting(true)
    try {
      await fetch(`/api/brain/${item.id}`, { method: 'DELETE' })
      onDelete(item.id)
    } catch {
      setDeleting(false)
    }
  }

  return (
    <Link href={`/brain/${item.id}`} style={{ textDecoration: 'none' }}>
      <div
        className="card-hover"
        style={{
          padding: 24,
          borderRadius: 14,
          border: '1px solid var(--border)',
          background: 'rgba(255,255,255,0.02)',
          display: 'flex',
          flexDirection: 'column',
          gap: 12,
          height: '100%',
          cursor: 'pointer',
          opacity: deleting ? 0.4 : 1,
          transition: 'all 0.25s ease',
        }}
      >
        <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: 8 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
            <div style={{
              width: 30, height: 30, borderRadius: 8,
              background: `${color}15`, border: `1px solid ${color}30`,
              display: 'flex', alignItems: 'center', justifyContent: 'center',
            }}>
              <Icon size={14} color={color} />
            </div>
            <span style={{
              fontSize: 11,
              fontFamily: 'var(--font-mono)',
              color,
              fontWeight: 500,
              letterSpacing: '0.04em'
            }}>
              {item.type.toUpperCase()}
            </span>
          </div>

          <div style={{ display: 'flex', gap: 8 }}>
            {item.sourceUrl && (
              <a
                href={item.sourceUrl}
                target="_blank"
                rel="noopener noreferrer"
                onClick={(e) => e.stopPropagation()}
                style={{ color: 'var(--slate-dim)' }}
              >
                <ExternalLink size={14} />
              </a>
            )}

            <button
              onClick={handleDelete}
              disabled={deleting}
              style={{
                background: 'none',
                border: 'none',
                cursor: 'pointer',
                padding: 4,
                color: 'var(--slate-dim)',
              }}
            >
              <Trash2 size={13} />
            </button>
          </div>
        </div>

        <h3 style={{
          fontFamily: 'var(--font-display)',
          fontSize: 18,
          fontWeight: 600,
          color: 'var(--slate-light)',
          lineHeight: 1.3,
        }}>
          {item.title}
        </h3>

        <p style={{ color: 'var(--slate)', fontSize: 13, lineHeight: 1.6, flex: 1 }}>
          {item.summary || item.content.slice(0, 180) + (item.content.length > 180 ? '…' : '')}
        </p>

        {item.summary && (
          <div style={{ display: 'flex', gap: 4, fontSize: 11, color: 'var(--violet-soft)' }}>
            <Sparkles size={10} /> AI Summary
          </div>
        )}

        {item.tags.length > 0 && (
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: 5 }}>
            {item.tags.slice(0, 4).map((tag) => (
              <span key={tag} className="tag-pill">
                <Tag size={9} style={{ marginRight: 3 }} />{tag}
              </span>
            ))}
          </div>
        )}

        <div style={{
          display: 'flex',
          gap: 5,
          fontSize: 11,
          color: 'var(--slate-dim)',
          borderTop: '1px solid var(--border)',
          paddingTop: 10,
          marginTop: 'auto',
        }}>
          <Calendar size={10} /> {date}
        </div>
      </div>
    </Link>
  )
}

export default function DashboardPage() {
  const [items, setItems] = useState<KnowledgeItem[]>([])
  const [loading, setLoading] = useState(true)
  const [loadingMore, setLoadingMore] = useState(false)
  const [search, setSearch] = useState('')
  const [nextCursor, setNextCursor] = useState<string | null>(null)
  const [hasMore, setHasMore] = useState(false)

  const fetchItems = useCallback(async (cursor?: string | null) => {
    if (!cursor) setLoading(true)
    else setLoadingMore(true)

    try {
      const params = new URLSearchParams()
      if (search) params.set('search', search)
      if (cursor) params.set('cursor', cursor)

      const res = await fetch(`/api/brain?${params}`)
      const data = await res.json()

      const page: KnowledgeItem[] = data.data || []
      setItems((prev) => cursor ? [...prev, ...page] : page)

      setNextCursor(data.nextCursor)
      setHasMore(data.hasMore)
    } finally {
      setLoading(false)
      setLoadingMore(false)
    }
  }, [search])

  useEffect(() => {
    const t = setTimeout(() => fetchItems(null), 300)
    return () => clearTimeout(t)
  }, [fetchItems])

  const handleDelete = (id: string) => {
    setItems((prev) => prev.filter((item) => item.id !== id))
  }

  return (
    <div className="grid-bg" style={{ minHeight: '100vh', paddingTop: 80 }}>
      <div style={{ maxWidth: 1200, margin: '0 auto', padding: '32px 24px 80px' }}>

        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 36 }}
        >
          <h1 style={{ fontFamily: 'var(--font-display)', fontSize: 40 }}>
            Knowledge Dashboard
          </h1>
          <Link href="/capture" className="btn-primary">
            <Plus size={16} /> Capture New
          </Link>
        </motion.div>

        {loading ? (
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px,1fr))', gap: 20 }}>
            {Array.from({ length: 6 }).map((_, i) => <SkeletonCard key={i} />)}
          </div>
        ) : (
          <>
            <motion.div
              variants={staggerContainer}
              initial="hidden"
              animate="show"
              style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px,1fr))', gap: 20 }}
            >
              <AnimatePresence>
                {items.map((item) => (
                  <motion.div key={item.id} variants={staggerItem}>
                    <KnowledgeCard item={item} onDelete={handleDelete} />
                  </motion.div>
                ))}
              </AnimatePresence>
            </motion.div>

            {hasMore && (
              <div style={{ textAlign: 'center', marginTop: 40 }}>
                <button onClick={() => fetchItems(nextCursor)} className="btn-secondary">
                  {loadingMore ? <Loader2 size={14} /> : 'Load more'}
                </button>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  )
}