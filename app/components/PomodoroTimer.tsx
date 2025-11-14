"use client"

import { useEffect, useRef, useState } from 'react'
import { loadFromLocalStorage, saveToLocalStorage } from '@/lib/storage'

function format(seconds: number) {
  const m = Math.floor(seconds / 60).toString().padStart(2, '0')
  const s = (seconds % 60).toString().padStart(2, '0')
  return `${m}:${s}`
}

export default function PomodoroTimer() {
  const [workMinutes, setWorkMinutes] = useState(25)
  const [breakMinutes, setBreakMinutes] = useState(5)
  const [remaining, setRemaining] = useState(workMinutes * 60)
  const [isRunning, setIsRunning] = useState(false)
  const [isBreak, setIsBreak] = useState(false)
  const intervalRef = useRef<number | null>(null)
  const [completed, setCompleted] = useState(0)

  useEffect(() => {
    setCompleted(loadFromLocalStorage<number>('pomodoroSessions', 0))
  }, [])

  useEffect(() => {
    saveToLocalStorage('pomodoroSessions', completed)
  }, [completed])

  useEffect(() => {
    setRemaining(workMinutes * 60)
  }, [workMinutes])

  useEffect(() => {
    if (!isRunning) return
    intervalRef.current = window.setInterval(() => setRemaining((r) => r - 1), 1000)
    return () => {
      if (intervalRef.current) window.clearInterval(intervalRef.current)
    }
  }, [isRunning])

  useEffect(() => {
    if (remaining >= 0) return
    if (!isBreak) {
      setCompleted(c => c + 1)
      setIsBreak(true)
      setRemaining(breakMinutes * 60)
    } else {
      setIsBreak(false)
      setRemaining(workMinutes * 60)
    }
  }, [remaining, isBreak, breakMinutes, workMinutes])

  const reset = () => {
    setIsRunning(false)
    setIsBreak(false)
    setRemaining(workMinutes * 60)
  }

  return (
    <div className="space-y-3">
      <div className="text-center">
        <div className="text-3xl font-bold tabular-nums">{format(Math.max(0, remaining))}</div>
        <div className="text-xs text-slate-400">{isBreak ? 'Break' : 'Focus'}</div>
      </div>
      <div className="grid grid-cols-2 gap-2">
        <div className="card p-3">
          <div className="label">Work (min)</div>
          <input type="number" className="input w-full" min={5} max={120} value={workMinutes} onChange={e => setWorkMinutes(parseInt(e.target.value || '25', 10))} />
        </div>
        <div className="card p-3">
          <div className="label">Break (min)</div>
          <input type="number" className="input w-full" min={1} max={60} value={breakMinutes} onChange={e => setBreakMinutes(parseInt(e.target.value || '5', 10))} />
        </div>
      </div>
      <div className="flex items-center gap-2">
        <button className="btn btn-primary flex-1" onClick={() => setIsRunning(v => !v)}>{isRunning ? 'Pause' : 'Start'}</button>
        <button className="btn btn-secondary" onClick={reset}>Reset</button>
      </div>
      <div className="text-xs text-slate-400">Completed today: {completed}</div>
    </div>
  )
}
