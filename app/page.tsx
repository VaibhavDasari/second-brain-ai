'use client'

import { useRef } from 'react'
import Link from 'next/link'
import { motion, useScroll, useTransform } from 'framer-motion'
import { Brain, Zap, Search, Globe, ArrowRight, Sparkles } from 'lucide-react'
import { staggerContainer, staggerItem, fadeUp } from '@/lib/motion'

const features = [
  {
    icon: Brain, title: 'Capture & Store',
    desc: 'Rich form for notes, links, and insights with flexible tagging and metadata.',
    color: '#f5a623', href: '/capture',
  },
  {
    icon: Search, title: 'Smart Dashboard',
    desc: 'Search, filter, and sort knowledge items with a beautiful, responsive UI.',
    color: '#64a0ff', href: '/dashboard',
  },
  {
    icon: Zap, title: 'AI Intelligence',
    desc: 'Claude auto-summarizes and tags content, then answers questions from your notes.',
    color: '#a78bfa', href: '/query',
  },
  {
    icon: Globe, title: 'Public API',
    desc: 'Query your brain programmatically via REST API or embeddable iframe widget.',
    color: '#64dca0', href: '/docs',
  },
]

export default function HomePage() {
  const heroRef = useRef<HTMLDivElement>(null)
  const { scrollYProgress } = useScroll({ target: heroRef, offset: ['start start', 'end start'] })

  const orb1Y       = useTransform(scrollYProgress, [0, 1], ['0%',  '42%'])
  const orb2Y       = useTransform(scrollYProgress, [0, 1], ['0%', '-28%'])
  const orb3Y       = useTransform(scrollYProgress, [0, 1], ['0%',  '18%'])
  const contentY    = useTransform(scrollYProgress, [0, 1], ['0%',  '16%'])
  const heroOpacity = useTransform(scrollYProgress, [0, 0.7], [1, 0])

  return (
    <div style={{ minHeight: '100vh', background: 'var(--ink)' }}>

      {/* ── Hero ─────────────────────────────────────── */}
      <section
        ref={heroRef}
        className="parallax-hero grid-bg"
        style={{
          minHeight: '100vh',
          display: 'flex', flexDirection: 'column',
          alignItems: 'center', justifyContent: 'center',
          padding: '80px 24px 60px',
          position: 'relative', overflow: 'hidden',
        }}
      >
        {/* Parallax orbs — violet palette */}
        <motion.div style={{
          position: 'absolute', top: '18%', left: '8%',
          width: 480, height: 480, borderRadius: '50%', y: orb1Y,
          background: 'radial-gradient(circle, rgba(124,58,237,0.12) 0%, transparent 70%)',
          pointerEvents: 'none',
        }} />
        <motion.div style={{
          position: 'absolute', bottom: '18%', right: '8%',
          width: 340, height: 340, borderRadius: '50%', y: orb2Y,
          background: 'radial-gradient(circle, rgba(167,139,250,0.08) 0%, transparent 70%)',
          pointerEvents: 'none',
        }} />
        <motion.div style={{
          position: 'absolute', top: '50%', left: '50%',
          translateX: '-50%', translateY: '-50%', y: orb3Y,
          width: 700, height: 700, borderRadius: '50%',
          background: 'radial-gradient(circle, rgba(245,166,35,0.04) 0%, transparent 60%)',
          pointerEvents: 'none',
        }} />

        {/* Hero content */}
        <motion.div
          style={{
            maxWidth: 780, textAlign: 'center',
            position: 'relative', zIndex: 1,
            y: contentY, opacity: heroOpacity,
          }}
        >
          {/* Badge */}
          <motion.div
            variants={fadeUp} initial="hidden" animate="show" custom={0}
            style={{
              display: 'inline-flex', alignItems: 'center', gap: 6,
              padding: '6px 16px', borderRadius: 999,
              background: 'rgba(124,58,237,0.1)',
              border: '1px solid rgba(124,58,237,0.3)',
              marginBottom: 36, fontSize: 12, fontWeight: 500,
              color: 'var(--violet-soft)', fontFamily: 'var(--font-mono)',
              letterSpacing: '0.06em',
            }}
          >
            <Sparkles size={12} />
            AI-POWERED KNOWLEDGE SYSTEM
          </motion.div>

          {/* Headline — Clash Display dominant */}
          <motion.h1
            variants={fadeUp} initial="hidden" animate="show" custom={1}
            style={{
              fontFamily: 'var(--font-display)',
              fontSize: 'clamp(46px, 7.5vw, 88px)',
              lineHeight: 1.02, color: 'var(--slate-light)',
              marginBottom: 28, letterSpacing: '-0.03em',
              fontWeight: 600,
            }}
          >
            Your thoughts,{' '}
            <span style={{ color: 'var(--violet-soft)' }} className="violet-glow-text">
              amplified
            </span>
            <br />by AI
          </motion.h1>

          {/* Subheading */}
          <motion.p
            variants={fadeUp} initial="hidden" animate="show" custom={2}
            style={{
              fontSize: 18, color: 'var(--slate)', lineHeight: 1.75,
              maxWidth: 560, margin: '0 auto 52px', fontWeight: 300,
            }}
          >
            Capture notes, links, and insights in one place. Let Claude summarize,
            tag, and answer questions from your personal knowledge base.
          </motion.p>

          {/* CTAs */}
          <motion.div
            variants={fadeUp} initial="hidden" animate="show" custom={3}
            style={{ display: 'flex', gap: 14, justifyContent: 'center', flexWrap: 'wrap' }}
          >
            <Link href="/capture" className="btn-primary" style={{ fontSize: 15, padding: '14px 32px' }}>
              Start Capturing <ArrowRight size={16} />
            </Link>
            <Link href="/dashboard" className="btn-secondary" style={{ fontSize: 15, padding: '14px 32px' }}>
              View Dashboard
            </Link>
          </motion.div>
        </motion.div>
      </section>

      {/* ── Features ─────────────────────────────────── */}
      <section style={{ maxWidth: 1100, margin: '0 auto', padding: '80px 24px 100px' }}>
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          style={{ textAlign: 'center', marginBottom: 64 }}
        >
          <h2 style={{
            fontFamily: 'var(--font-display)',
            fontSize: 'clamp(30px, 4vw, 48px)',
            color: 'var(--slate-light)', marginBottom: 16,
            letterSpacing: '-0.025em', fontWeight: 600,
          }}>
            Everything your mind needs
          </h2>
          <p style={{ color: 'var(--slate)', fontSize: 16, maxWidth: 480, margin: '0 auto' }}>
            Four integrated systems that work together to make you smarter.
          </p>
        </motion.div>

        <motion.div
          variants={staggerContainer}
          initial="hidden"
          whileInView="show"
          viewport={{ once: true }}
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))',
            gap: 20,
          }}
        >
          {features.map(({ icon: Icon, title, desc, color, href }) => (
            <motion.div key={title} variants={staggerItem} whileHover={{ y: -5, transition: { duration: 0.2 } }}>
              <Link
                href={href}
                className="card-hover"
                style={{
                  display: 'block', padding: 28, borderRadius: 14,
                  background: 'rgba(255,255,255,0.025)',
                  border: '1px solid var(--border)',
                  textDecoration: 'none', height: '100%',
                }}
              >
                <div style={{
                  width: 44, height: 44, borderRadius: 10,
                  background: `${color}18`, border: `1px solid ${color}30`,
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  marginBottom: 18,
                }}>
                  <Icon size={20} color={color} />
                </div>
                <h3 style={{
                  fontFamily: 'var(--font-display)', fontSize: 20, fontWeight: 600,
                  color: 'var(--slate-light)', marginBottom: 10, letterSpacing: '-0.01em',
                }}>
                  {title}
                </h3>
                <p style={{ color: 'var(--slate)', fontSize: 14, lineHeight: 1.65 }}>{desc}</p>
              </Link>
            </motion.div>
          ))}
        </motion.div>
      </section>

      {/* ── Footer ───────────────────────────────────── */}
      <footer style={{
        borderTop: '1px solid var(--border)',
        padding: '32px 24px', textAlign: 'center',
        color: 'var(--slate-dim)', fontSize: 13,
        fontFamily: 'var(--font-mono)',
      }}>
        Built with Claude API · Second Brain · Altibbe Internship Assignment
      </footer>
    </div>
  )
}
