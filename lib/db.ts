import { Pool } from 'pg'

const globalForPg = globalThis as unknown as { pool: Pool }

export const pool =
  globalForPg.pool ||
  new Pool({
    connectionString: process.env.DATABASE_URL,
    ssl: process.env.NODE_ENV === 'production' ? { rejectUnauthorized: false } : false,
  })

if (process.env.NODE_ENV !== 'production') globalForPg.pool = pool

export async function query(text: string, params?: unknown[]) {
  const client = await pool.connect()
  try {
    const res = await client.query(text, params)
    return res
  } finally {
    client.release()
  }
}

export async function initDB() {
  await query(`
    CREATE TABLE IF NOT EXISTS knowledge_items (
      id SERIAL PRIMARY KEY,
      title TEXT NOT NULL,
      content TEXT NOT NULL,
      type VARCHAR(20) NOT NULL DEFAULT 'note',
      source_url TEXT,
      tags TEXT[] DEFAULT '{}',
      summary TEXT,
      created_at TIMESTAMPTZ DEFAULT NOW(),
      updated_at TIMESTAMPTZ DEFAULT NOW()
    );

    CREATE INDEX IF NOT EXISTS idx_knowledge_items_type ON knowledge_items(type);
    CREATE INDEX IF NOT EXISTS idx_knowledge_items_tags ON knowledge_items USING GIN(tags);
    CREATE INDEX IF NOT EXISTS idx_knowledge_items_created_at ON knowledge_items(created_at DESC);
  `)
  console.log('✅ Database initialized')
}
