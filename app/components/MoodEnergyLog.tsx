"use client"

import { useEffect, useMemo, useState } from 'react'
import { loadFromLocalStorage, saveToLocalStorage, todayKey } from '@/lib/storage'

type Entry = {
  id: string
  date: string
  mood: number
  energy: number
  sleepHours?: number
  note?: string
}

export default function MoodEnergyLog({ compact = false }: { compact?: boolean }) {
  const [entries, setEntries] = useState<Entry[]>([])
  const [mood, setMood] = useState(3)
  const [energy, setEnergy] = useState(3)
  const [sleep, setSleep] = useState<number | ''>('')
  const [note, setNote] = useState('')

  const day = todayKey()

  useEffect(() => {
    setEntries(loadFromLocalStorage<Entry[]>('moodEnergy', []))
  }, [])

  useEffect(() => {
    saveToLocalStorage('moodEnergy', entries)
  }, [entries])

  const addEntry = () => {
    const newEntry: Entry = {
      id: crypto.randomUUID(),
      date: day,
      mood,
      energy,
      sleepHours: typeof sleep === 'number' ? sleep : undefined,
      note: note || undefined
    }
    setEntries(prev => [newEntry, ...prev.filter(e => e.date !== day)])
    setNote('')
  }

  const latest = useMemo(() => entries.find(e => e.date === day), [entries, day])

  return (
    <div className="space-y-3">
      {latest ? (
        <div className="text-sm text-slate-300">You already logged today. Mood {latest.mood}/5, Energy {latest.energy}/5{latest.sleepHours ? `, Sleep ${latest.sleepHours}h` : ''}.</div>
      ) : (
        <div className="grid gap-3 md:grid-cols-4">
          <div>
            <div className="label">Mood</div>
            <input className="w-full" type="range" min={1} max={5} value={mood} onChange={e => setMood(parseInt(e.target.value, 10))} />
            <div className="text-sm text-slate-300">{mood}/5</div>
          </div>
          <div>
            <div className="label">Energy</div>
            <input className="w-full" type="range" min={1} max={5} value={energy} onChange={e => setEnergy(parseInt(e.target.value, 10))} />
            <div className="text-sm text-slate-300">{energy}/5</div>
          </div>
          <div>
            <div className="label">Sleep (h)</div>
            <input className="input w-full" type="number" min={0} max={24} value={sleep} onChange={e => setSleep(e.target.value === '' ? '' : parseFloat(e.target.value))} />
          </div>
          <div>
            <div className="label">Note</div>
            <input className="input w-full" placeholder="Optional" value={note} onChange={e => setNote(e.target.value)} />
          </div>
          <div className="md:col-span-4">
            <button className="btn btn-primary" onClick={addEntry}>Log today</button>
          </div>
        </div>
      )}

      {!compact && (
        <div className="space-y-2">
          <div className="label">Recent</div>
          <ul className="space-y-2">
            {entries.slice(0, 10).map(e => (
              <li key={e.id} className="rounded-lg border border-slate-800 bg-slate-900 p-2 text-sm">
                <div className="flex items-center justify-between">
                  <span className="text-slate-300">{e.date}</span>
                  <span className="badge">Mood {e.mood}/5 ? Energy {e.energy}/5{e.sleepHours?` ? Sleep ${e.sleepHours}h`:''}</span>
                </div>
                {e.note && <div className="mt-1 text-slate-400">{e.note}</div>}
              </li>
            ))}
            {entries.length === 0 && <li className="text-sm text-slate-400">No entries yet.</li>}
          </ul>
        </div>
      )}
    </div>
  )
}
