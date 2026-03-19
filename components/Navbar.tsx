'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { Brain, Plus, LayoutDashboard, MessageSquare, BookOpen } from 'lucide-react'

const links = [
  { href: '/dashboard', label: 'Dashboard', icon: LayoutDashboard },
  { href: '/capture', label: 'Capture', icon: Plus },
  { href: '/query', label: 'Query AI', icon: MessageSquare },
  { href: '/docs', label: 'Docs', icon: BookOpen },
]

export default function Navbar() {
  const pathname = usePathname()

  return (
    <nav
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        right: 0,
        zIndex: 100,
        borderBottom: '1px solid rgba(136,146,176,0.1)',
        background: 'rgba(10,10,15,0.85)',
        backdropFilter: 'blur(20px)',
        WebkitBackdropFilter: 'blur(20px)',
      }}
    >
      <div
        style={{
          maxWidth: 1200,
          margin: '0 auto',
          padding: '0 24px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          height: 60,
        }}
      >
        {/* Logo */}
        <Link
          href="/"
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: 10,
            textDecoration: 'none',
          }}
        >
          <div
            style={{
              width: 32,
              height: 32,
              borderRadius: 8,
              background: 'rgba(124,58,237,0.15)',
              border: '1px solid rgba(124,58,237,0.3)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
            }}
          >
            <Brain size={16} color="var(--violet-soft)" />
          </div>
          <span
            style={{
              fontFamily: 'var(--font-display)',
              fontSize: 18,
              color: '#ccd6f6',
              letterSpacing: '-0.01em',
            }}
          >
            Second Brain
          </span>
        </Link>

        {/* Nav links */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
          {links.map(({ href, label, icon: Icon }) => {
            const isActive = pathname === href || pathname.startsWith(href + '/')
            return (
              <Link
                key={href}
                href={href}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: 6,
                  padding: '6px 14px',
                  borderRadius: 6,
                  textDecoration: 'none',
                  fontSize: 13,
                  fontWeight: 500,
                  transition: 'all 0.2s ease',
                  color: isActive ? 'var(--violet-soft)' : '#8892b0',
                  background: isActive ? 'rgba(124,58,237,0.08)' : 'transparent',
                  border: isActive ? '1px solid rgba(124,58,237,0.2)' : '1px solid transparent',
                }}
              >
                <Icon size={14} />
                {label}
              </Link>
            )
          })}
        </div>
      </div>
    </nav>
  )
}
