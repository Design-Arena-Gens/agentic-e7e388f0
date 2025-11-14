import TaskList from '@/app/components/TaskList'

export const metadata = { title: 'Planner ? Agentic Coach' }

export default function PlannerPage() {
  return (
    <div className="space-y-4">
      <h1 className="text-xl font-semibold">Planner</h1>
      <div className="card p-4">
        <TaskList />
      </div>
    </div>
  )
}
