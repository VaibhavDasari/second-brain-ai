import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { queryKnowledgeBase } from '@/lib/ai'

const CORS_HEADERS = {
  'Access-Control-Allow-Origin':  '*',
  'Access-Control-Allow-Methods': 'GET, OPTIONS',
  'Access-Control-Allow-Headers': 'Content-Type',
  'Cache-Control':                'no-store',
}

// GET /api/public/brain/query?q=your+question
export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url)
    const q = (searchParams.get('q') || searchParams.get('question') || '').trim()

    if (!q) {
      return NextResponse.json(
        {
          error:   'Missing query parameter',
          usage:   'GET /api/public/brain/query?q=your+question',
          example: '/api/public/brain/query?q=what+do+I+know+about+machine+learning',
        },
        { status: 400, headers: CORS_HEADERS }
      )
    }

    const items = await prisma.knowledgeItem.findMany({
      orderBy: { createdAt: 'desc' },
      take: 20,
      select: { title: true, content: true, summary: true, tags: true },
    })

    const { answer, sources } = await queryKnowledgeBase(q, items)

    return NextResponse.json(
      { question: q, answer, sources, timestamp: new Date().toISOString(), powered_by: 'Claude (Anthropic)' },
      { headers: CORS_HEADERS }
    )
  } catch (err) {
    console.error('GET /api/public/brain/query error:', err)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500, headers: CORS_HEADERS })
  }
}

export async function OPTIONS() {
  return new NextResponse(null, { headers: CORS_HEADERS })
}
