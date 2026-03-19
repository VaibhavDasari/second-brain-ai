export type KnowledgeType = 'note' | 'link' | 'insight'

// Matches Prisma KnowledgeItem output exactly — all camelCase
export interface KnowledgeItem {
  id:        string        // cuid — never a number
  title:     string
  content:   string
  type:      KnowledgeType
  sourceUrl: string | null
  tags:      string[]
  summary:   string | null
  createdAt: string
  updatedAt: string
}

// POST /api/brain request body
export interface CreateKnowledgeItem {
  title:       string
  content:     string
  type:        KnowledgeType
  source_url?: string
  tags?:       string[]
}

// Paginated list response
export interface PaginatedResponse<T> {
  data:        T[]
  nextCursor:  string | null
  hasMore:     boolean
  total?:      number
}

export interface ApiResponse<T> {
  data?:  T
  error?: string
}
