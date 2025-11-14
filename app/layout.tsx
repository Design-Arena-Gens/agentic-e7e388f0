import type { Metadata } from 'next'
import Link from 'next/link'
import './globals.css'

export const metadata: Metadata = {
  title: 'Agentic Coach ? Productivity & Health',
  description: 'Plan better, feel better. Your AI coach for work and wellbeing.'
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>
        <header className="border-b border-slate-800 sticky top-0 z-40 backdrop-blur supports-[backdrop-filter]:bg-slate-950/70">
          <div className="container-max flex h-14 items-center justify-between">
            <Link href="/" className="flex items-center gap-2 font-semibold">
              <span className="inline-block h-2 w-2 rounded-sm bg-brand-500" />
              <span>Agentic Coach</span>
            </Link>
            <nav className="flex items-center gap-2">
              <Link className="btn btn-secondary" href="/">Dashboard</Link>
              <Link className="btn btn-secondary" href="/planner">Planner</Link>
              <Link className="btn btn-secondary" href="/health">Health</Link>
              <Link className="btn btn-primary" href="/coach">AI Coach</Link>
            </nav>
          </div>
        </header>
        <main className="container-max py-6 space-y-6">{children}</main>
        <footer className="container-max py-8 text-center text-sm text-slate-400">
          <p>Built for focus and wellbeing.</p>
        </footer>
      </body>
    </html>
  )
}
