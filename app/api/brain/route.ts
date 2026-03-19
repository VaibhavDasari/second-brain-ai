import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function GET() {
  try {
    const items = await prisma.knowledgeItem.findMany({
      orderBy: { createdAt: 'desc' },
    })

    return NextResponse.json({ data: items })
  } catch (error) {
    console.error('GET /api/brain error:', error)
    return NextResponse.json(
      { error: 'Failed to fetch knowledge items' },
      { status: 500 }
    )
  }
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json()
    const { title, content, type, sourceUrl, source_url, tags, summary } = body

    if (!title || !content || !type) {
      return NextResponse.json(
        { error: 'title, content and type are required' },
        { status: 400 }
      )
    }

    const item = await prisma.knowledgeItem.create({
      data: {
        title,
        content,
        type,
        sourceUrl: sourceUrl ?? source_url ?? null,
        tags: Array.isArray(tags) ? tags : [],
        summary: summary ?? null,
      },
    })

    return NextResponse.json({ data: item }, { status: 201 })
  } catch (error) {
    console.error('POST /api/brain error:', error)
    return NextResponse.json(
      { error: 'Failed to create knowledge item' },
      { status: 500 }
    )
  }
}