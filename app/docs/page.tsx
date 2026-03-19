'use client'

import { useState } from 'react'
import { BookOpen, Layers, Palette, Bot, Globe, Copy, Check, Cpu, GitBranch, Zap } from 'lucide-react'
import { motion } from 'framer-motion'
import { staggerContainer, staggerItem } from '@/lib/motion'

function CodeBlock({ code }: { code: string }) {
  const [copied, setCopied] = useState(false)
  const copy = () => {
    navigator.clipboard.writeText(code)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }
  return (
    <div style={{ position: 'relative', borderRadius: 10, overflow: 'hidden', marginTop: 12 }}>
      <button onClick={copy} style={{
        position: 'absolute', top: 10, right: 10,
        background: 'rgba(255,255,255,0.06)', border: '1px solid var(--border)',
        borderRadius: 6, padding: '4px 8px', cursor: 'pointer',
        color: 'var(--slate)', display: 'flex', alignItems: 'center', gap: 5,
        fontSize: 11, fontFamily: 'var(--font-mono)', zIndex: 1,
      }}>
        {copied ? <Check size={12} color="#64dca0" /> : <Copy size={12} />}
        {copied ? 'Copied!' : 'Copy'}
      </button>
      <pre style={{
        padding: '20px 24px', margin: 0, overflowX: 'auto',
        background: 'rgba(0,0,0,0.4)', border: '1px solid var(--border)',
        color: 'var(--slate-light)', fontSize: 13, lineHeight: 1.65,
        fontFamily: 'var(--font-mono)', borderRadius: 10,
      }}>
        <code>{code}</code>
      </pre>
    </div>
  )
}

function Section({ icon: Icon, title, color, children }: {
  icon: React.ElementType; title: string; color: string; children: React.ReactNode
}) {
  return (
    <motion.section variants={staggerItem} style={{ marginBottom: 60 }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 24 }}>
        <div style={{
          width: 40, height: 40, borderRadius: 10,
          background: `${color}15`, border: `1px solid ${color}30`,
          display: 'flex', alignItems: 'center', justifyContent: 'center',
        }}>
          <Icon size={18} color={color} />
        </div>
        <h2 style={{ fontFamily: 'var(--font-display)', fontWeight: 600, fontSize: 28, color: 'var(--slate-light)', letterSpacing: '-0.02em' }}>
          {title}
        </h2>
      </div>
      {children}
    </motion.section>
  )
}

function Principle({ number, title, desc }: { number: string; title: string; desc: string }) {
  return (
    <div style={{
      padding: '20px 24px', borderRadius: 12,
      background: 'rgba(255,255,255,0.02)', border: '1px solid var(--border)',
      display: 'flex', gap: 16, alignItems: 'flex-start',
    }}>
      <span style={{
        fontFamily: 'var(--font-mono)', fontSize: 11, color: 'var(--violet-soft)',
        background: 'rgba(124,58,237,0.1)', border: '1px solid rgba(124,58,237,0.25)',
        borderRadius: 6, padding: '4px 8px', flexShrink: 0, marginTop: 2,
      }}>
        {number}
      </span>
      <div>
        <h3 style={{ fontFamily: 'var(--font-display)', fontWeight: 600, fontSize: 18, color: 'var(--slate-light)', marginBottom: 6 }}>
          {title}
        </h3>
        <p style={{ color: 'var(--slate)', fontSize: 14, lineHeight: 1.65 }}>{desc}</p>
      </div>
    </div>
  )
}

export default function DocsPage() {
  const baseUrl = typeof window !== 'undefined' ? window.location.origin : 'https://your-app.vercel.app'

  return (
    <div className="grid-bg" style={{ minHeight: '100vh', paddingTop: 80 }}>
      <div style={{ maxWidth: 860, margin: '0 auto', padding: '40px 24px 80px' }}>

        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}
          style={{ marginBottom: 56, borderBottom: '1px solid var(--border)', paddingBottom: 40 }}
        >
          <div style={{
            display: 'inline-flex', alignItems: 'center', gap: 6, fontSize: 11,
            fontFamily: 'var(--font-mono)', color: 'var(--violet-soft)', letterSpacing: '0.08em',
            marginBottom: 16, padding: '4px 10px',
            background: 'rgba(124,58,237,0.08)', border: '1px solid rgba(124,58,237,0.2)', borderRadius: 999,
          }}>
            <BookOpen size={10} />
            DOCUMENTATION
          </div>
          <h1 style={{ fontFamily: 'var(--font-display)', fontWeight: 600, fontSize: 'clamp(32px, 5vw, 54px)', color: 'var(--slate-light)', letterSpacing: '-0.025em', marginBottom: 14 }}>
            Architecture &amp; Design
          </h1>
          <p style={{ color: 'var(--slate)', fontSize: 16, lineHeight: 1.7, maxWidth: 580 }}>
            Technical documentation covering system design, serverless patterns, AI token strategy,
            and scalability considerations for this Second Brain application.
          </p>
        </motion.div>

        <motion.div variants={staggerContainer} initial="hidden" animate="show">

          {/* 1. System Architecture */}
          <Section icon={Layers} title="Portable Architecture" color="#64a0ff">
            <p style={{ color: 'var(--slate)', fontSize: 15, lineHeight: 1.7, marginBottom: 20 }}>
              Every layer is independently swappable. The application is structured so you can
              replace the AI provider, database, or deployment target without touching other layers.
            </p>
            <div style={{ display: 'grid', gap: 10, marginBottom: 24 }}>
              {[
                { layer: 'Frontend',    tech: 'Next.js 14 + React + Tailwind',   swap: 'Remix, Astro, or SvelteKit' },
                { layer: 'Backend',     tech: 'Next.js API Routes (serverless)', swap: 'FastAPI, Express, or tRPC' },
                { layer: 'ORM',         tech: 'Prisma v5',                       swap: 'Drizzle ORM or Kysely' },
                { layer: 'Database',    tech: 'PostgreSQL on Neon',              swap: 'Supabase, PlanetScale, or SQLite' },
                { layer: 'AI Provider', tech: 'Anthropic Claude',                swap: 'OpenAI, Gemini, or local Ollama' },
                { layer: 'Deployment',  tech: 'Vercel (serverless)',             swap: 'Railway, Fly.io, or AWS Lambda' },
              ].map(({ layer, tech, swap }) => (
                <div key={layer} style={{
                  display: 'grid', gridTemplateColumns: '110px 1fr 1fr', gap: 16, alignItems: 'center',
                  padding: '14px 18px', borderRadius: 10,
                  background: 'rgba(100,160,255,0.04)', border: '1px solid rgba(100,160,255,0.1)',
                }}>
                  <span style={{ fontSize: 11, fontFamily: 'var(--font-mono)', color: '#64a0ff', fontWeight: 500 }}>{layer}</span>
                  <span style={{ fontSize: 13, color: 'var(--slate-light)' }}>{tech}</span>
                  <span style={{ fontSize: 12, color: 'var(--slate-dim)' }}>→ {swap}</span>
                </div>
              ))}
            </div>

            <h3 style={{ fontFamily: 'var(--font-display)', fontWeight: 600, fontSize: 18, color: 'var(--slate-light)', marginBottom: 10 }}>
              Request → AI → DB flow
            </h3>
            <CodeBlock code={`// POST /api/brain — optimistic write pattern
1. Validate input (title, content, type)
2. prisma.knowledgeItem.create({ data: { ...item, summary: null } })
3. Return 201 immediately — user sees item appear at once
4. processAI() fires in background (fire-and-forget)
   ├── summarizeContent()  ─┐
   └── autoTagContent()    ─┴─ Promise.all (parallel)
5. prisma.knowledgeItem.update({ summary, tags }) — silent patch
6. Dashboard polls / user refreshes → summary appears`} />
          </Section>

          {/* 2. Serverless Prisma */}
          <Section icon={Cpu} title="Serverless Prisma on Neon" color="#a78bfa">
            <p style={{ color: 'var(--slate)', fontSize: 15, lineHeight: 1.7, marginBottom: 20 }}>
              Running Prisma in a serverless environment requires specific care around connection
              pooling. Each Vercel function invocation is stateless — naive setups create a new
              database connection on every request, exhausting Postgres connection limits fast.
            </p>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 12, marginBottom: 24 }}>
              {[
                { issue: 'Connection exhaustion', fix: 'Singleton PrismaClient via globalThis prevents re-instantiation during hot reload and between warm invocations' },
                { issue: 'Cold start latency',    fix: 'Neon serverless driver wakes in ~100ms. Prisma connection lazy-initialises on first query, not on import' },
                { issue: 'Migration safety',      fix: 'Use prisma db push for development, prisma migrate deploy in CI/CD — never run migrations inside request handlers' },
                { issue: 'Edge runtime',          fix: 'Prisma Client is not edge-compatible. All DB access stays in Node.js runtime API routes (not middleware)' },
              ].map(({ issue, fix }) => (
                <div key={issue} style={{
                  padding: '16px 20px', borderRadius: 10,
                  background: 'rgba(167,139,250,0.04)', border: '1px solid rgba(167,139,250,0.12)',
                }}>
                  <p style={{ fontSize: 13, color: 'var(--violet-soft)', fontWeight: 600, marginBottom: 4, fontFamily: 'var(--font-mono)' }}>{issue}</p>
                  <p style={{ fontSize: 13, color: 'var(--slate)', lineHeight: 1.6 }}>{fix}</p>
                </div>
              ))}
            </div>
            <CodeBlock code={`// lib/prisma.ts — safe singleton pattern
const globalForPrisma = globalThis as unknown as { prisma?: PrismaClient }

export const prisma = globalForPrisma.prisma ?? new PrismaClient({
  log: process.env.NODE_ENV === 'development' ? ['error', 'warn'] : ['error'],
})

if (process.env.NODE_ENV !== 'production') globalForPrisma.prisma = prisma`} />
          </Section>

          {/* 3. UX Principles */}
          <Section icon={Palette} title="Principles-Based UX" color="#f5a623">
            <p style={{ color: 'var(--slate)', fontSize: 15, lineHeight: 1.7, marginBottom: 20 }}>
              Five guiding principles shape every AI interaction and UI decision in this system.
            </p>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
              <Principle number="P1" title="Zero-friction capture" desc="The capture form minimises cognitive load. Required fields are minimal — Claude fills the rest automatically. Users should feel no friction between thought and stored knowledge." />
              <Principle number="P2" title="Optimistic UI" desc="Items appear in the dashboard the moment they are saved, before AI processing completes. The summary badge appears silently once Claude finishes — no blocking, no spinners on save." />
              <Principle number="P3" title="Progressive disclosure" desc="Cards show summaries first, full content on demand. Complexity is hidden until needed. The dashboard stays scannable even with hundreds of items." />
              <Principle number="P4" title="Honest uncertainty" desc="When the AI cannot find relevant answers in the knowledge base, it says so clearly rather than fabricating a plausible-sounding response." />
              <Principle number="P5" title="Motion as meaning" desc="Animations communicate state — staggered card entry shows data loading progressively, AnimatePresence exit animations confirm deletion. Motion is never decorative." />
            </div>
          </Section>

          {/* 4. AI Token Strategy */}
          <Section icon={Zap} title="AI Token Optimisation" color="#64dca0">
            <p style={{ color: 'var(--slate)', fontSize: 15, lineHeight: 1.7, marginBottom: 20 }}>
              Claude API costs scale with token usage. Three strategies keep this application
              fast and cost-efficient even as the knowledge base grows.
            </p>
            <div style={{ display: 'grid', gap: 12, marginBottom: 24 }}>
              {[
                {
                  strategy: 'Summary-first context',
                  detail: 'The query route sends item summaries (~60 tokens) to Claude instead of full content (~800 tokens). This gives 10-15× context compression with minimal information loss.',
                  saving: '~90% token reduction per query',
                },
                {
                  strategy: 'Keyword pre-filter',
                  detail: 'Before calling Claude, the query route filters items by keyword match in title, content, and tags. Only relevant items reach the AI — not the entire knowledge base.',
                  saving: 'Scales to thousands of notes',
                },
                {
                  strategy: 'Relevance scoring',
                  detail: 'Items are scored by keyword frequency (title matches count double) and sorted before slicing to 15. Claude receives the most relevant context, not just the most recent.',
                  saving: 'Better answers, fewer tokens',
                },
              ].map(({ strategy, detail, saving }) => (
                <div key={strategy} style={{
                  padding: '18px 20px', borderRadius: 10,
                  background: 'rgba(100,220,160,0.04)', border: '1px solid rgba(100,220,160,0.1)',
                }}>
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 6, flexWrap: 'wrap', gap: 8 }}>
                    <span style={{ fontSize: 14, color: '#64dca0', fontWeight: 600 }}>{strategy}</span>
                    <span style={{ fontSize: 11, fontFamily: 'var(--font-mono)', color: 'var(--slate-dim)', background: 'rgba(100,220,160,0.08)', padding: '2px 8px', borderRadius: 999 }}>{saving}</span>
                  </div>
                  <p style={{ fontSize: 13, color: 'var(--slate)', lineHeight: 1.6 }}>{detail}</p>
                </div>
              ))}
            </div>

            <h3 style={{ fontFamily: 'var(--font-display)', fontWeight: 600, fontSize: 18, color: 'var(--slate-light)', marginBottom: 10 }}>
              Agent pipeline
            </h3>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 8, marginBottom: 16 }}>
              {[
                { step: '1', title: 'Capture',     desc: 'User submits title + content + optional manual tags' },
                { step: '2', title: 'Save',        desc: 'Item written to Postgres immediately (summary: null)' },
                { step: '3', title: 'Respond',     desc: 'HTTP 201 returned — UI shows item instantly' },
                { step: '4', title: 'Summarise',   desc: 'Claude generates 2–3 sentence summary (max_tokens: 300)' },
                { step: '5', title: 'Auto-tag',    desc: 'Claude returns JSON array of 3–5 semantic tags (max_tokens: 100)' },
                { step: '6', title: 'Patch',       desc: 'prisma.update patches summary + merged tags silently' },
              ].map(({ step, title, desc }) => (
                <div key={step} style={{ display: 'flex', gap: 14, alignItems: 'center' }}>
                  <div style={{
                    width: 28, height: 28, borderRadius: '50%', flexShrink: 0,
                    background: 'rgba(100,220,160,0.1)', border: '1px solid rgba(100,220,160,0.25)',
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    fontSize: 11, fontFamily: 'var(--font-mono)', color: '#64dca0',
                  }}>
                    {step}
                  </div>
                  <div>
                    <span style={{ fontSize: 14, color: 'var(--slate-light)', fontWeight: 600 }}>{title}</span>
                    <span style={{ fontSize: 13, color: 'var(--slate)', marginLeft: 8 }}>— {desc}</span>
                  </div>
                </div>
              ))}
            </div>
          </Section>

          {/* 5. Scalability */}
          <Section icon={GitBranch} title="Scalability Roadmap" color="#f5a623">
            <p style={{ color: 'var(--slate)', fontSize: 15, lineHeight: 1.7, marginBottom: 20 }}>
              The current architecture is production-ready for personal use. These are the natural
              next steps as data volume and user count grow.
            </p>
            <div style={{ display: 'grid', gap: 10 }}>
              {[
                { phase: 'Now',    item: 'Cursor-based pagination',    detail: 'GET /api/brain returns nextCursor + hasMore — dashboard loads 24 items, then loads more on demand' },
                { phase: 'Next',   item: 'pgvector semantic search',   detail: 'Store Claude text-embedding-3-small embeddings alongside each item. Cosine similarity replaces keyword matching for the query route' },
                { phase: 'Next',   item: 'Background job queue',       detail: 'Move AI processing to a proper queue (Inngest, Trigger.dev) so Vercel function timeouts cannot interrupt summarisation' },
                { phase: 'Later',  item: 'Multi-user auth',            detail: 'Add NextAuth.js with email magic link. Scope all Prisma queries to userId — schema migration is additive' },
                { phase: 'Later',  item: 'Document ingestion',         detail: 'Accept PDF/DOCX uploads, extract text server-side, run the same summarise + tag pipeline' },
              ].map(({ phase, item, detail }) => (
                <div key={item} style={{
                  display: 'grid', gridTemplateColumns: '56px 1fr', gap: 16, alignItems: 'flex-start',
                  padding: '14px 18px', borderRadius: 10,
                  background: 'rgba(255,255,255,0.02)', border: '1px solid var(--border)',
                }}>
                  <span style={{
                    fontSize: 10, fontFamily: 'var(--font-mono)', fontWeight: 600,
                    color: phase === 'Now' ? '#64dca0' : phase === 'Next' ? 'var(--violet-soft)' : 'var(--slate-dim)',
                    background: phase === 'Now' ? 'rgba(100,220,160,0.08)' : phase === 'Next' ? 'rgba(124,58,237,0.08)' : 'rgba(255,255,255,0.04)',
                    border: `1px solid ${phase === 'Now' ? 'rgba(100,220,160,0.2)' : phase === 'Next' ? 'rgba(124,58,237,0.2)' : 'rgba(255,255,255,0.08)'}`,
                    padding: '3px 8px', borderRadius: 6, alignSelf: 'flex-start', marginTop: 1,
                  }}>
                    {phase}
                  </span>
                  <div>
                    <p style={{ fontSize: 14, color: 'var(--slate-light)', fontWeight: 600, marginBottom: 4 }}>{item}</p>
                    <p style={{ fontSize: 13, color: 'var(--slate)', lineHeight: 1.6 }}>{detail}</p>
                  </div>
                </div>
              ))}
            </div>
          </Section>

          {/* 6. Public Infrastructure */}
          <Section icon={Globe} title="Infrastructure & Public API" color="#64dca0">
            <p style={{ color: 'var(--slate)', fontSize: 15, lineHeight: 1.7, marginBottom: 20 }}>
              The brain is exposed as a CORS-enabled public REST API and an embeddable iframe widget.
            </p>
            <h3 style={{ fontFamily: 'var(--font-display)', fontWeight: 600, fontSize: 18, color: 'var(--slate-light)', marginBottom: 8 }}>
              Query endpoint
            </h3>
            <CodeBlock code={`GET /api/public/brain/query?q=your+question

// Response
{
  "question": "what do I know about machine learning?",
  "answer": "Based on your notes, machine learning is…",
  "sources": ["Intro to ML Notes", "Andrew Ng Summary"],
  "timestamp": "2024-01-15T10:30:00Z",
  "powered_by": "Claude (Anthropic)"
}`} />

            <h3 style={{ fontFamily: 'var(--font-display)', fontWeight: 600, fontSize: 18, color: 'var(--slate-light)', marginBottom: 8, marginTop: 28 }}>
              Embeddable widget
            </h3>
            <CodeBlock code={`<iframe
  src="${baseUrl}/widget"
  width="400"
  height="500"
  style="border: none; border-radius: 12px;"
  title="Second Brain Query Widget"
></iframe>`} />

            <h3 style={{ fontFamily: 'var(--font-display)', fontWeight: 600, fontSize: 18, color: 'var(--slate-light)', marginBottom: 8, marginTop: 28 }}>
              Paginated list endpoint
            </h3>
            <CodeBlock code={`GET /api/brain?type=insight&sort=newest&limit=24&cursor=<id>

// Response
{
  "data": [ { "id": "clx...", "title": "...", "createdAt": "..." } ],
  "nextCursor": "clx...",   // null when no more pages
  "hasMore": true
}`} />
          </Section>

        </motion.div>
      </div>
    </div>
  )
}
