import HabitTracker from '@/app/components/HabitTracker'
import MoodEnergyLog from '@/app/components/MoodEnergyLog'

export const metadata = { title: 'Health ? Agentic Coach' }

export default function HealthPage() {
  return (
    <div className="space-y-4">
      <h1 className="text-xl font-semibold">Health</h1>
      <div className="grid gap-4 md:grid-cols-2">
        <div className="card p-4">
          <h2 className="text-lg font-semibold mb-3">Habits</h2>
          <HabitTracker />
        </div>
        <div className="card p-4">
          <h2 className="text-lg font-semibold mb-3">Mood & Energy</h2>
          <MoodEnergyLog />
        </div>
      </div>
    </div>
  )
}
