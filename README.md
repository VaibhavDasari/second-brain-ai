# 🧠 Second Brain — AI-Powered Knowledge System

> A full-stack knowledge management application powered by Claude (Anthropic). Built as the Altibbe/Hedamo Full-Stack Engineering Internship Assignment.

**Live Demo:** [your-app.vercel.app](https://your-app.vercel.app)  
**GitHub:** [github.com/yourusername/second-brain](https://github.com/yourusername/second-brain)

---

## ✨ Features

- **Knowledge Capture** — Rich form for Notes, Links, and Insights with custom tags
- **AI Summarization** — Claude auto-generates concise 2–3 sentence summaries on save
- **AI Auto-Tagging** — Claude intelligently categorizes content with semantic tags
- **Smart Dashboard** — Searchable, filterable grid with skeleton loaders and delete
- **Conversational Querying** — Chat interface backed by your personal knowledge base
- **Public REST API** — `GET /api/public/brain/query?q=...` with CORS support
- **Embeddable Widget** — iframe-embeddable search widget at `/widget`
- **Lenis Smooth Scroll** — Buttery smooth scrolling throughout
- **Framer Motion** — Parallax hero, staggered cards, AnimatePresence transitions

---

## 🛠 Tech Stack

| Layer | Technology |
|---|---|
| Framework | Next.js 14 (App Router, TypeScript strict) |
| Styling | Tailwind CSS + CSS custom properties |
| Animations | Framer Motion v11 + Lenis smooth scroll |
| Database | PostgreSQL via Neon (serverless) |
| ORM | Prisma v5 |
| AI | Anthropic Claude (`claude-sonnet-4-20250514`) |
| Deployment | Vercel |
| Fonts | Clash Display, DM Sans, DM Mono |

---

## 🚀 Getting Started

### Prerequisites
- Node.js 18+
- A [Neon](https://neon.tech) PostgreSQL database (free tier)
- An [Anthropic API key](https://console.anthropic.com)

### 1. Clone & install
```bash
git clone https://github.com/yourusername/second-brain.git
cd second-brain
npm install
```

### 2. Set up environment variables
```bash
cp .env.local.example .env.local
```

Edit `.env.local`:
```env
DATABASE_URL="postgresql://user:password@ep-xxx.us-east-2.aws.neon.tech/neondb?sslmode=require"
ANTHROPIC_API_KEY="sk-ant-..."
NEXT_PUBLIC_BASE_URL="http://localhost:3000"
```

> **Neon tip:** In your Neon dashboard → Connection Details → select **Prisma** from the dropdown to get the exact connection string format.

### 3. Set up the database
```bash
npx prisma generate   # generates the Prisma client
npx prisma db push    # pushes schema to Neon (creates tables)
```

### 4. Run locally
```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000)

---

## 🗄 Database Schema

```prisma
model KnowledgeItem {
  id        String   @id @default(cuid())
  title     String
  content   String
  type      String   // "note" | "link" | "insight"
  sourceUrl String?
  tags      String[]
  summary   String?  // AI-generated
  createdAt DateTime @default(now())
  updatedAt DateTime @updatedAt
}
```

---

## 🔌 API Reference

| Method | Endpoint | Description |
|---|---|---|
| GET | `/api/brain` | List all items (supports `?search=`, `?type=`, `?sort=`) |
| POST | `/api/brain` | Create item (triggers AI summarize + autotag) |
| GET | `/api/brain/:id` | Get single item |
| PATCH | `/api/brain/:id` | Update item |
| DELETE | `/api/brain/:id` | Delete item |
| POST | `/api/brain/query` | Conversational query |
| GET | `/api/public/brain/query?q=` | Public CORS-enabled query endpoint |

---

## 🌐 Deploy to Vercel

```bash
# Push to GitHub first, then:
vercel --prod
```

Add these environment variables in Vercel dashboard → Settings → Environment Variables:
- `DATABASE_URL`
- `ANTHROPIC_API_KEY`
- `NEXT_PUBLIC_BASE_URL` (your Vercel URL)

---

## 📐 Architecture Notes

See [/docs](/docs) in the running app for full architecture documentation including:
- Portable layer architecture (swappable DB, AI, deployment)
- 5 UX design principles
- AI agent pipeline (capture → summarize → tag → query-ready)
- Public infrastructure and embeddable widget docs

---

## 🏗 Architecture Overview

**Capture → AI → Query flow:**
```
User submits form
  → POST /api/brain
  → prisma.create() — item saved instantly, 201 returned
  → processAI() fires in background (fire-and-forget)
      ├── summarizeContent()  ─┐ Promise.all
      └── autoTagContent()    ─┘ (parallel Claude calls)
  → prisma.update() patches summary + tags silently

User asks a question
  → POST /api/brain/query
  → Keywords extracted, stopwords stripped
  → prisma.findMany() — keyword-filtered candidates (max 40)
  → Items scored by relevance (title match = 2×, content = 1×)
  → Top 15 sent to Claude with summaries as context
  → Answer + source titles returned
```

**Serverless considerations:**
- `PrismaClient` is instantiated once via `globalThis` singleton — safe across hot reloads and warm Vercel invocations
- AI processing is fire-and-forget — Vercel function returns in ~200ms, Claude runs in the background
- `prisma db push` syncs schema to Neon without migration files — ideal for solo development
- All Claude API calls are server-side only — API key never reaches the client

---

## 🔑 Environment Variables

| Variable | Required | Description |
|---|---|---|
| `DATABASE_URL` | ✅ | Neon PostgreSQL connection string |
| `ANTHROPIC_API_KEY` | ✅ | Anthropic Claude API key |
| `NEXT_PUBLIC_BASE_URL` | ✅ | App URL (used in docs page) |
