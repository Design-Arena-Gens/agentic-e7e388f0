"use client"

import { useEffect, useMemo, useState } from 'react'
import { loadFromLocalStorage } from '@/lib/storage'

type CoachResponse = {
  content: string
}

export default function CoachPanel() {
  const [message, setMessage] = useState('I want help planning my day focusing on the top 3 tasks while keeping my energy balanced.')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [response, setResponse] = useState<string>('')
  const [includeData, setIncludeData] = useState(true)

  const dataBundle = useMemo(() => {
    return {
      tasks: loadFromLocalStorage('tasks', []),
      habits: loadFromLocalStorage('habits', []),
      moodEnergy: loadFromLocalStorage('moodEnergy', []),
      pomodoroSessions: loadFromLocalStorage('pomodoroSessions', 0)
    }
  }, [])

  const ask = async () => {
    setError(null); setResponse(''); setLoading(true)
    try {
      const res = await fetch('/api/coach', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ message, data: includeData ? dataBundle : undefined })
      })
      if (!res.ok) {
        const text = await res.text()
        throw new Error(text || 'Request failed')
      }
      const json = await res.json() as CoachResponse
      setResponse(json.content)
    } catch (e: any) {
      setError(e.message || 'Something went wrong')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    // pre-warm response on first mount to show capability
  }, [])

  return (
    <div className="space-y-4">
      <div className="card p-4 space-y-2">
        <label className="label">Ask your coach</label>
        <textarea className="input min-h-[100px]" value={message} onChange={e => setMessage(e.target.value)} />
        <label className="flex items-center gap-2 text-sm text-slate-300">
          <input type="checkbox" checked={includeData} onChange={e => setIncludeData(e.target.checked)} /> Include my recent data
        </label>
        <div className="flex items-center gap-2">
          <button className="btn btn-primary" onClick={ask} disabled={loading}>{loading ? 'Thinking?' : 'Ask Coach'}</button>
          <span className="text-xs text-slate-400">The AI uses your local data when enabled.</span>
        </div>
      </div>
      <div className="card p-4">
        <div className="label mb-1">Response</div>
        {error ? (
          <div className="text-red-400 text-sm whitespace-pre-wrap">{error}</div>
        ) : response ? (
          <div className="prose prose-invert max-w-none whitespace-pre-wrap">{response}</div>
        ) : (
          <div className="text-sm text-slate-400">No response yet.</div>
        )}
      </div>
    </div>
  )
}
