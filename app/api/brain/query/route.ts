import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { queryKnowledgeBase } from '@/lib/ai'

// Minimum word length worth matching against
const MIN_KEYWORD_LEN = 3

// Stopwords to strip before keyword matching
const STOPWORDS = new Set([
  'the','and','for','are','was','with','this','that','have',
  'from','they','what','which','when','will','about','been',
  'does','did','can','could','should','would','tell','show',
  'find','give','list','want','know','like','just','how',
])

function extractKeywords(text: string): string[] {
  return text
    .toLowerCase()
    .replace(/[^\w\s]/g, '')
    .split(/\s+/)
    .filter((w) => w.length >= MIN_KEYWORD_LEN && !STOPWORDS.has(w))
}

// Score an item by how many query keywords it matches
function scoreItem(
  item: { title: string; content: string; summary: string | null; tags: string[] },
  keywords: string[]
): number {
  if (keywords.length === 0) return 1

  const haystack = [
    item.title.toLowerCase(),
    (item.summary || item.content.slice(0, 500)).toLowerCase(),
    item.tags.join(' ').toLowerCase(),
  ].join(' ')

  return keywords.reduce((score, kw) => {
    // title match counts double
    if (item.title.toLowerCase().includes(kw)) return score + 2
    if (haystack.includes(kw)) return score + 1
    return score
  }, 0)
}

// POST /api/brain/query
export async function POST(req: NextRequest) {
  try {
    console.log("QUERY API HIT")
    const { question } = await req.json()

    if (!question?.trim()) {
      return NextResponse.json({ error: 'Question is required' }, { status: 400 })
    }

    const keywords = extractKeywords(question)

    // Pull candidate items — keyword-filtered when possible, recent fallback
    let candidates = await prisma.knowledgeItem.findMany({
      where: keywords.length
        ? {
            OR: [
              ...keywords.map((k) => ({ title:   { contains: k, mode: 'insensitive' as const } })),
              ...keywords.map((k) => ({ content: { contains: k, mode: 'insensitive' as const } })),
              ...keywords.map((k) => ({ tags:    { has: k } })),
            ],
          }
        : {},
      orderBy: { createdAt: 'desc' },
      take:    40,
      select:  { title: true, content: true, summary: true, tags: true },
    })

    // Fallback: no keyword hits → use most recent items
    if (candidates.length === 0) {
      candidates = await prisma.knowledgeItem.findMany({
        orderBy: { createdAt: 'desc' },
        take:    20,
        select:  { title: true, content: true, summary: true, tags: true },
      })
    }

    // Score + sort by relevance, keep top 15 to control tokens
    const ranked = candidates
      .map((item) => ({ item, score: scoreItem(item, keywords) }))
      .sort((a, b) => b.score - a.score)
      .slice(0, 15)
      .map(({ item }) => item)

    const { answer, sources } = await queryKnowledgeBase(question, ranked)

    return NextResponse.json({ answer, sources })
  } catch (err) {
    console.error('POST /api/brain/query error:', err)
    return NextResponse.json({ error: 'Failed to query knowledge base' }, { status: 500 })
  }
}
