import type { ReactNode } from 'react'

interface LayoutProps {
  header: ReactNode
  children: ReactNode
}

export default function Layout({ header, children }: LayoutProps) {
  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 font-sans">
      <header className="sticky top-0 z-20 border-b border-slate-800 bg-slate-900/90 backdrop-blur-sm">
        {header}
      </header>
      <main className="mx-auto max-w-screen-2xl px-4 py-6 space-y-6">
        {children}
      </main>
    </div>
  )
}
