import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

// GET /api/brain/:id
export async function GET(
  _req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const item = await prisma.knowledgeItem.findUnique({
      where: { id: params.id },
    })
    if (!item) {
      return NextResponse.json({ error: 'Item not found' }, { status: 404 })
    }
    return NextResponse.json({ data: item })
  } catch (err) {
    console.error('GET /api/brain/[id] error:', err)
    return NextResponse.json({ error: 'Failed to fetch item' }, { status: 500 })
  }
}

// PATCH /api/brain/:id
export async function PATCH(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const body = await req.json()
    const { title, content, tags } = body

    const item = await prisma.knowledgeItem.update({
      where: { id: params.id },
      data: {
        ...(title   !== undefined ? { title }   : {}),
        ...(content !== undefined ? { content } : {}),
        ...(tags    !== undefined ? { tags }    : {}),
      },
    })

    return NextResponse.json({ data: item })
  } catch (err: unknown) {
    // Prisma P2025 = record not found
    if ((err as { code?: string }).code === 'P2025') {
      return NextResponse.json({ error: 'Item not found' }, { status: 404 })
    }
    console.error('PATCH /api/brain/[id] error:', err)
    return NextResponse.json({ error: 'Failed to update item' }, { status: 500 })
  }
}

// DELETE /api/brain/:id
export async function DELETE(
  _req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    await prisma.knowledgeItem.delete({
      where: { id: params.id },
    })
    return NextResponse.json({ message: 'Deleted successfully' })
  } catch (err: unknown) {
    if ((err as { code?: string }).code === 'P2025') {
      return NextResponse.json({ error: 'Item not found' }, { status: 404 })
    }
    console.error('DELETE /api/brain/[id] error:', err)
    return NextResponse.json({ error: 'Failed to delete item' }, { status: 500 })
  }
}
