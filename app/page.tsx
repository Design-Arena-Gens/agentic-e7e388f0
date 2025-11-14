import TaskList from '@/app/components/TaskList'
import HabitTracker from '@/app/components/HabitTracker'
import PomodoroTimer from '@/app/components/PomodoroTimer'
import MoodEnergyLog from '@/app/components/MoodEnergyLog'
import Link from 'next/link'

export default function DashboardPage() {
  return (
    <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
      <div className="card p-4 lg:col-span-2">
        <div className="flex items-center justify-between mb-3">
          <h2 className="text-lg font-semibold">Today\'s Plan</h2>
          <Link className="text-sm text-brand-400 hover:underline" href="/planner">Open planner</Link>
        </div>
        <TaskList compact />
      </div>
      <div className="card p-4">
        <h2 className="text-lg font-semibold mb-3">Focus Timer</h2>
        <PomodoroTimer />
      </div>

      <div className="card p-4">
        <div className="flex items-center justify-between mb-3">
          <h2 className="text-lg font-semibold">Habits</h2>
          <Link className="text-sm text-brand-400 hover:underline" href="/health">Open health</Link>
        </div>
        <HabitTracker compact />
      </div>
      <div className="card p-4 md:col-span-2">
        <div className="flex items-center justify-between mb-3">
          <h2 className="text-lg font-semibold">Mood & Energy</h2>
          <Link className="text-sm text-brand-400 hover:underline" href="/health">Log details</Link>
        </div>
        <MoodEnergyLog compact />
      </div>
    </div>
  )
}
