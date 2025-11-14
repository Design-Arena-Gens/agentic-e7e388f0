"use client"

import { useEffect, useMemo, useState } from 'react'
import { loadFromLocalStorage, saveToLocalStorage } from '@/lib/storage'

export type Task = {
  id: string
  title: string
  done: boolean
  createdAt: string
  due?: string | null
}

export default function TaskList({ compact = false }: { compact?: boolean }) {
  const [tasks, setTasks] = useState<Task[]>([])
  const [title, setTitle] = useState('')
  const [filter, setFilter] = useState<'all'|'open'|'done'>('all')

  useEffect(() => {
    const initial = loadFromLocalStorage<Task[]>('tasks', [])
    setTasks(initial)
  }, [])

  useEffect(() => {
    saveToLocalStorage('tasks', tasks)
  }, [tasks])

  const stats = useMemo(() => {
    const total = tasks.length
    const done = tasks.filter(t => t.done).length
    const open = total - done
    return { total, done, open, percent: total ? Math.round((done/total)*100) : 0 }
  }, [tasks])

  const addTask = () => {
    const t = title.trim()
    if (!t) return
    const newTask: Task = {
      id: crypto.randomUUID(),
      title: t,
      done: false,
      createdAt: new Date().toISOString(),
      due: null,
    }
    setTasks(prev => [newTask, ...prev])
    setTitle('')
  }

  const toggleTask = (id: string) => setTasks(prev => prev.map(t => t.id === id ? { ...t, done: !t.done } : t))
  const removeTask = (id: string) => setTasks(prev => prev.filter(t => t.id !== id))

  const shown = useMemo(() => tasks.filter(t => filter==='all' ? true : filter==='open' ? !t.done : t.done), [tasks, filter])

  return (
    <div>
      <div className="flex flex-col gap-2 md:flex-row md:items-center md:gap-3">
        <input className="input flex-1" placeholder="Add a task..." value={title} onChange={e => setTitle(e.target.value)} onKeyDown={e => e.key==='Enter' && addTask()} />
        <button className="btn btn-primary" onClick={addTask}>Add</button>
        {!compact && (
          <div className="ml-auto flex items-center gap-2">
            <span className="badge">{stats.done}/{stats.total} done</span>
            <span className="badge">{stats.percent}%</span>
          </div>
        )}
      </div>
      <div className="mt-3 flex items-center gap-2 text-sm">
        <button onClick={() => setFilter('all')} className={`badge ${filter==='all' ? 'bg-brand-700 text-white' : ''}`}>All</button>
        <button onClick={() => setFilter('open')} className={`badge ${filter==='open' ? 'bg-brand-700 text-white' : ''}`}>Open</button>
        <button onClick={() => setFilter('done')} className={`badge ${filter==='done' ? 'bg-brand-700 text-white' : ''}`}>Done</button>
      </div>
      <ul className="mt-3 space-y-2">
        {shown.map(task => (
          <li key={task.id} className="flex items-center gap-2 rounded-lg border border-slate-800 bg-slate-900 p-2">
            <input type="checkbox" checked={task.done} onChange={() => toggleTask(task.id)} className="h-4 w-4" />
            <span className={`flex-1 ${task.done ? 'line-through text-slate-500' : ''}`}>{task.title}</span>
            <button className="text-slate-400 hover:text-red-400" onClick={() => removeTask(task.id)} title="Delete">?</button>
          </li>
        ))}
        {shown.length === 0 && (
          <li className="text-sm text-slate-400">No tasks yet.</li>
        )}
      </ul>
    </div>
  )
}
