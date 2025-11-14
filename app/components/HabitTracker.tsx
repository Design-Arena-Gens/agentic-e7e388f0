"use client"

import { useEffect, useMemo, useState } from 'react'
import { loadFromLocalStorage, saveToLocalStorage, todayKey } from '@/lib/storage'

type Habit = {
  id: string
  name: string
  createdAt: string
  completedDates: string[]
}

export default function HabitTracker({ compact = false }: { compact?: boolean }) {
  const [habits, setHabits] = useState<Habit[]>([])
  const [name, setName] = useState('')
  const day = todayKey()

  useEffect(() => {
    setHabits(loadFromLocalStorage<Habit[]>('habits', []))
  }, [])

  useEffect(() => {
    saveToLocalStorage('habits', habits)
  }, [habits])

  const addHabit = () => {
    const n = name.trim(); if (!n) return
    setHabits(prev => [{ id: crypto.randomUUID(), name: n, createdAt: new Date().toISOString(), completedDates: [] }, ...prev])
    setName('')
  }

  const toggleToday = (id: string) => {
    setHabits(prev => prev.map(h => {
      if (h.id !== id) return h
      const set = new Set(h.completedDates)
      if (set.has(day)) set.delete(day); else set.add(day)
      return { ...h, completedDates: Array.from(set).sort() }
    }))
  }

  const stats = useMemo(() => {
    const total = habits.length
    const doneToday = habits.filter(h => h.completedDates.includes(day)).length
    return { total, doneToday }
  }, [habits, day])

  return (
    <div>
      {!compact && (
        <div className="mb-2 text-sm text-slate-400">{stats.doneToday}/{stats.total} done today</div>
      )}
      <div className="flex gap-2">
        <input className="input flex-1" placeholder="Add a habit (e.g., Walk 20m)" value={name} onChange={e => setName(e.target.value)} onKeyDown={e => e.key==='Enter' && addHabit()} />
        <button className="btn btn-primary" onClick={addHabit}>Add</button>
      </div>
      <ul className="mt-3 space-y-2">
        {habits.map(h => (
          <li key={h.id} className="flex items-center gap-2 rounded-lg border border-slate-800 bg-slate-900 p-2">
            <button onClick={() => toggleToday(h.id)} className={`badge ${h.completedDates.includes(day) ? 'bg-brand-700 text-white' : ''}`}>Today</button>
            <span className="flex-1">{h.name}</span>
          </li>
        ))}
        {habits.length === 0 && <li className="text-sm text-slate-400">No habits yet.</li>}
      </ul>
    </div>
  )
}
