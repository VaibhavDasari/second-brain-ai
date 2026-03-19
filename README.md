# 🧠 Second Brain — AI-Powered Knowledge System

A full-stack AI knowledge management application that allows users to capture notes, links, and insights, automatically enrich them with AI summaries and tags, and query their personal knowledge base conversationally.

Built as part of a Full-Stack Engineering Internship Assignment.

---

## 🚀 Live Demo

**Production URL:** https://second-brain-ai-flame.vercel.app
**GitHub Repo:** https://github.com/VaibhavDasari/second-brain-ai

---

## ✨ Features

### 📥 Knowledge Capture

Create Notes, Links, or Insights with tags and optional source URLs.

### 🤖 AI Summarization

Claude generates concise summaries automatically when content is saved.

### 🏷 AI Auto-Tagging

Semantic tags are generated to improve retrieval quality.

### 📊 Smart Dashboard

* Search
* Filter by type
* Sort
* Skeleton loaders
* Delete actions
* Smooth animations

### 💬 Conversational Query

Ask natural language questions.
The AI retrieves relevant notes and responds with cited sources.

### 🌐 Public Query API

External systems can query the knowledge base via:

```
GET /api/public/brain/query?q=...
```

### 🧩 Embeddable Widget

A lightweight iframe search widget available at:

```
/widget
```

### 🎨 Premium UX

* Framer Motion stagger animations
* Parallax hero
* Lenis smooth scrolling
* Electric-violet design system

---

## 🛠 Tech Stack

| Layer      | Technology                                 |
| ---------- | ------------------------------------------ |
| Framework  | Next.js 14 (App Router, TypeScript Strict) |
| Styling    | Tailwind CSS                               |
| Animations | Framer Motion + Lenis                      |
| Database   | PostgreSQL (Neon Serverless)               |
| ORM        | Prisma                                     |
| AI         | Anthropic Claude                           |
| Deployment | Vercel                                     |

---

## 🗄 Database Schema

```prisma
model KnowledgeItem {
  id          String   @id @default(cuid())
  title       String
  content     String
  type        String
  sourceUrl   String?
  tags        String[]
  summary     String?
  createdAt   DateTime @default(now())
  updatedAt   DateTime @updatedAt
}
```

---

## ⚙️ Local Setup

### 1. Clone repo

```
git clone https://github.com/VaibhavDasari/second-brain-ai.git
cd second-brain-ai
npm install
```

### 2. Create environment file

```
.env
```

Add:

```
DATABASE_URL=your_neon_connection_string
ANTHROPIC_API_KEY=your_claude_key
NEXT_PUBLIC_BASE_URL=http://localhost:3000
```

### 3. Sync database

```
npx prisma generate
npx prisma db push
```

### 4. Run dev server

```
npm run dev
```

Open → http://localhost:3000

---

## 🔌 API Overview

| Method | Endpoint                  | Description             |
| ------ | ------------------------- | ----------------------- |
| GET    | `/api/brain`              | List all items          |
| POST   | `/api/brain`              | Create item             |
| GET    | `/api/brain/:id`          | Fetch item              |
| PATCH  | `/api/brain/:id`          | Update item             |
| DELETE | `/api/brain/:id`          | Delete item             |
| POST   | `/api/brain/query`        | Conversational AI query |
| GET    | `/api/public/brain/query` | Public query endpoint   |

---

## 🧠 AI Retrieval Flow

1. User submits question
2. Keywords extracted
3. Prisma fetches candidate notes
4. Notes ranked by relevance
5. Top context sent to Claude
6. AI responds with cited sources

---

## ☁️ Deployment

1. Push project to GitHub
2. Import repo into Vercel
3. Add environment variables:

```
DATABASE_URL
ANTHROPIC_API_KEY
NEXT_PUBLIC_BASE_URL
```

4. Deploy

---

## 🔮 Future Improvements

* Vector embedding semantic search
* Authentication & multi-user workspaces
* Real-time collaborative notes
* Knowledge graph visualization
* Offline-first sync

---

## 👨‍💻 Author

Vaibhav Dasari
Full-Stack Developer
