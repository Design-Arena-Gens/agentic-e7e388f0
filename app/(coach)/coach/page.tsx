import CoachPanel from '@/app/components/CoachPanel'

export const metadata = { title: 'AI Coach ? Agentic Coach' }

export default function CoachPage() {
  return (
    <div className="space-y-4">
      <h1 className="text-xl font-semibold">AI Coach</h1>
      <CoachPanel />
    </div>
  )
}
