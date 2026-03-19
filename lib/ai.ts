import Anthropic from '@anthropic-ai/sdk'

const ANTHROPIC_MODEL = 'claude-sonnet-4-20250514'
const FALLBACK_CONTENT_LIMIT = 320
const DEFAULT_MAX_CONTEXT_ITEMS = 8

export interface KnowledgeQueryItem {
  id?: string
  title: string
  content: string
  summary?: string | null
  tags: string[]
  createdAt?: Date | string
}

type QueryKnowledgeBaseResult = {
  answer: string
  sources: string[]
}

const STOP_WORDS = new Set([
  'a', 'an', 'and', 'are', 'as', 'at', 'be', 'by', 'do', 'for', 'from', 'how',
  'i', 'in', 'is', 'it', 'me', 'my', 'of', 'on', 'or', 'that', 'the', 'these',
  'this', 'to', 'what', 'when', 'where', 'which', 'who', 'why', 'with', 'you',
  'your',
])

function getAnthropicClient() {
  const apiKey = process.env.ANTHROPIC_API_KEY

  if (!apiKey) {
    console.warn('[ai] ANTHROPIC_API_KEY is not set. Falling back to local responses.')
    return null
  }

  return new Anthropic({ apiKey })
}

function clampText(value: string, limit: number) {
  const trimmed = value.trim()
  if (trimmed.length <= limit) return trimmed
  return `${trimmed.slice(0, limit).trimEnd()}...`
}

function normalizeWhitespace(value: string) {
  return value.replace(/\s+/g, ' ').trim()
}

function escapeRegExp(value: string) {
  return value.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')
}

function extractTextFromMessageContent(content: unknown): string {
  if (!Array.isArray(content)) return ''

  return content
    .map((block) => {
      if (!block || typeof block !== 'object') return ''

      const maybeText = 'text' in block ? block.text : ''
      return typeof maybeText === 'string' ? maybeText : ''
    })
    .filter(Boolean)
    .join('\n')
    .trim()
}

function simpleSummary(title: string, content: string) {
  const cleanedContent = normalizeWhitespace(content)
  if (!cleanedContent) return title.trim()

  const firstSentence = cleanedContent.split(/(?<=[.!?])\s+/)[0] || cleanedContent
  const summaryCore = clampText(firstSentence, 180)

  if (!title.trim()) return summaryCore
  return clampText(`${title.trim()}: ${summaryCore}`, 220)
}

function extractJsonArray(raw: string): string[] {
  const trimmed = raw.trim()
  const directCandidate = trimmed.match(/\[[\s\S]*\]/)?.[0] ?? trimmed

  try {
    const parsed = JSON.parse(directCandidate)
    return Array.isArray(parsed)
      ? parsed.filter((value): value is string => typeof value === 'string')
      : []
  } catch {
    return []
  }
}

function extractTagsLocally(title: string, content: string): string[] {
  const combined = `${title} ${content}`.toLowerCase()
  const matches = combined.match(/[a-z0-9][a-z0-9-]{2,}/g) ?? []
  const seen = new Set<string>()
  const tags: string[] = []

  for (const word of matches) {
    if (STOP_WORDS.has(word) || seen.has(word)) continue
    seen.add(word)
    tags.push(word)
    if (tags.length === 5) break
  }

  return tags
}

export function extractQueryKeywords(question: string): string[] {
  const matches = question.toLowerCase().match(/[a-z0-9][a-z0-9-]{1,}/g) ?? []
  const unique = new Set<string>()

  for (const word of matches) {
    if (STOP_WORDS.has(word)) continue
    unique.add(word)
  }

  return Array.from(unique).slice(0, 8)
}

function countMatches(haystack: string, needle: string) {
  const matches = haystack.match(new RegExp(escapeRegExp(needle), 'g'))
  return matches?.length ?? 0
}

function scoreItem(item: KnowledgeQueryItem, question: string, keywords: string[]) {
  const normalizedQuestion = question.toLowerCase()
  const title = item.title.toLowerCase()
  const summary = (item.summary ?? '').toLowerCase()
  const content = item.content.toLowerCase()
  const tags = item.tags.map((tag) => tag.toLowerCase())

  let score = 0

  if (title.includes(normalizedQuestion)) score += 12
  if (summary.includes(normalizedQuestion)) score += 10
  if (content.includes(normalizedQuestion)) score += 8

  for (const keyword of keywords) {
    score += countMatches(title, keyword) * 6
    score += countMatches(summary, keyword) * 4
    score += Math.min(countMatches(content, keyword), 4) * 2
    score += tags.some((tag) => tag.includes(keyword)) ? 5 : 0
  }

  if (item.createdAt) {
    const createdAt = new Date(item.createdAt)
    if (!Number.isNaN(createdAt.getTime())) {
      const ageInDays = (Date.now() - createdAt.getTime()) / (1000 * 60 * 60 * 24)
      if (ageInDays <= 7) score += 2
      else if (ageInDays <= 30) score += 1
    }
  }

  return score
}

function rankItems(question: string, items: KnowledgeQueryItem[]) {
  const keywords = extractQueryKeywords(question)

  return [...items]
    .map((item) => ({
      item,
      score: scoreItem(item, question, keywords),
    }))
    .sort((a, b) => b.score - a.score)
}

function buildContext(items: KnowledgeQueryItem[]) {
  return items
    .map((item, index) => {
      const detail = item.summary?.trim() || clampText(normalizeWhitespace(item.content), FALLBACK_CONTENT_LIMIT)
      const tagLine = item.tags.length ? `Tags: ${item.tags.join(', ')}` : 'Tags: none'
      return `[${index + 1}] ${item.title}\n${tagLine}\n${detail}`
    })
    .join('\n\n')
}

function extractSourceNumbers(answer: string) {
  const matches = answer.match(/\[(\d+)\]/g) ?? []
  return Array.from(new Set(matches.map((match) => Number.parseInt(match.replace(/\D/g, ''), 10)).filter(Number.isFinite)))
}

function buildFallbackAnswer(question: string, items: KnowledgeQueryItem[]) {
  const selected = items.slice(0, 3)
  const answerBody = selected
    .map((item, index) => {
      const detail = item.summary?.trim() || clampText(normalizeWhitespace(item.content), 220)
      return `${index + 1}. ${item.title}: ${detail}`
    })
    .join('\n')

  const sourceLine = selected.length
    ? `Sources: ${selected.map((_, index) => `[${index + 1}]`).join(', ')}`
    : 'Sources: none'

  return [
    `Based on the notes currently in your Second Brain, here is the best available answer to "${question}":`,
    answerBody || 'Your recent notes do not contain enough detail to answer confidently yet, so this response is limited to the strongest available context.',
    'Some parts may be inferred from related notes when the match is indirect.',
    sourceLine,
  ].join('\n\n')
}

function ensureSources(answer: string, items: KnowledgeQueryItem[]) {
  const sourceIndexes = extractSourceNumbers(answer)

  if (sourceIndexes.length > 0) {
    return sourceIndexes
      .map((index) => items[index - 1]?.title)
      .filter((title): title is string => Boolean(title))
  }

  return items.slice(0, 3).map((item) => item.title)
}

export async function summarizeContent(title: string, content: string): Promise<string> {
  const anthropic = getAnthropicClient()
  if (!anthropic) return simpleSummary(title, content)

  try {
    const message = await anthropic.messages.create({
      model: ANTHROPIC_MODEL,
      max_tokens: 300,
      messages: [
        {
          role: 'user',
          content: `Summarize the following knowledge item in 2-3 concise sentences. Be precise and capture the key insight.

Title: ${title}
Content: ${content}

Return only the summary.`,
        },
      ],
    })

    const summary = extractTextFromMessageContent(message.content)
    return summary || simpleSummary(title, content)
  } catch (error) {
    console.error('[ai] summarizeContent failed:', error)
    return simpleSummary(title, content)
  }
}

export async function autoTagContent(title: string, content: string): Promise<string[]> {
  const anthropic = getAnthropicClient()
  if (!anthropic) return extractTagsLocally(title, content)

  try {
    const message = await anthropic.messages.create({
      model: ANTHROPIC_MODEL,
      max_tokens: 100,
      messages: [
        {
          role: 'user',
          content: `Generate 3-5 relevant tags. Return ONLY JSON array.

Title: ${title}
Content: ${content}`,
        },
      ],
    })

    const raw = extractTextFromMessageContent(message.content)
    const tags = extractJsonArray(raw)
    return tags.length ? tags.slice(0, 5) : extractTagsLocally(title, content)
  } catch (error) {
    console.error('[ai] autoTagContent failed:', error)
    return extractTagsLocally(title, content)
  }
}

export async function queryKnowledgeBase(
  question: string,
  items: KnowledgeQueryItem[]
): Promise<QueryKnowledgeBaseResult> {
  if (!items.length) {
    return {
      answer: 'Your knowledge base is empty right now. Save a few notes, links, or insights and I will answer from them with cited sources.',
      sources: [],
    }
  }

  const ranked = rankItems(question, items)
  const strongMatches = ranked.filter(({ score }) => score > 0).map(({ item }) => item)
  const selectedItems = (strongMatches.length ? strongMatches : items).slice(0, DEFAULT_MAX_CONTEXT_ITEMS)
  const fallbackAnswer = buildFallbackAnswer(question, selectedItems)
  const fallbackSources = selectedItems.slice(0, 3).map((item) => item.title)
  const anthropic = getAnthropicClient()

  console.debug('[ai] queryKnowledgeBase', {
    question,
    totalItems: items.length,
    strongMatches: strongMatches.length,
    selectedItems: selectedItems.length,
  })

  if (!anthropic) {
    return { answer: fallbackAnswer, sources: fallbackSources }
  }

  try {
    const context = buildContext(selectedItems)
    const message = await anthropic.messages.create({
      model: ANTHROPIC_MODEL,
      max_tokens: 700,
      messages: [
        {
          role: 'user',
          content: `You are the conversational retrieval assistant for a personal knowledge base called Second Brain.

Answer the user's question using the notes below.
- Prefer grounded answers based on the notes.
- If the notes are incomplete, still provide the most helpful answer you can using partial inference, but clearly signal when you are inferring.
- Do not say "answer not found" or refuse when there is at least loosely related material.
- Cite supporting notes inline with bracketed references like [1] and [2].
- End with a final line in the format: Sources: [1], [2]
- Keep the response concise but intelligent.

Notes:
${context}

Question:
${question}`,
        },
      ],
    })

    const answer = extractTextFromMessageContent(message.content)

    if (!answer) {
      console.warn('[ai] Claude returned empty query response. Using fallback answer.')
      return { answer: fallbackAnswer, sources: fallbackSources }
    }

    return {
      answer,
      sources: ensureSources(answer, selectedItems),
    }
  } catch (error) {
    console.error('[ai] queryKnowledgeBase failed:', error)
    return { answer: fallbackAnswer, sources: fallbackSources }
  }
}
