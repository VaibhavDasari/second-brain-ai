import { notFound } from "next/navigation"
import { prisma } from "@/lib/prisma"
import Link from "next/link"

export default async function BrainDetailPage({ params }: { params: { id: string } }) {
  const item = await prisma.knowledgeItem.findUnique({
    where: { id: params.id }
  })

  if (!item) return notFound()

  return (
    <div style={{ minHeight: "100vh", padding: "100px 24px" }}>
      <div style={{ maxWidth: 800, margin: "0 auto" }}>

        <Link href="/dashboard" style={{ color: "#7C3AED", marginBottom: 20, display: "inline-block" }}>
          ← Back to Dashboard
        </Link>

        <h1 style={{ fontSize: 36, fontWeight: 600, marginBottom: 20 }}>
          {item.title}
        </h1>

        {item.summary && (
          <div style={{
            padding: 20,
            borderRadius: 12,
            background: "rgba(124,58,237,0.08)",
            border: "1px solid rgba(124,58,237,0.25)",
            marginBottom: 24
          }}>
            <strong>AI Summary</strong>
            <p style={{ marginTop: 8 }}>{item.summary}</p>
          </div>
        )}

        <p style={{ lineHeight: 1.8, fontSize: 16 }}>
          {item.content}
        </p>

        {item.tags.length > 0 && (
          <div style={{ marginTop: 30 }}>
            <strong>Tags</strong>
            <div style={{ display: "flex", gap: 8, marginTop: 10, flexWrap: "wrap" }}>
              {item.tags.map(tag => (
                <span key={tag} style={{
                  padding: "6px 12px",
                  borderRadius: 999,
                  background: "rgba(255,255,255,0.06)",
                  fontSize: 12
                }}>
                  {tag}
                </span>
              ))}
            </div>
          </div>
        )}

      </div>
    </div>
  )
}