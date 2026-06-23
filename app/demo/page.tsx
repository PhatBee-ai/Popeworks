import type { Job, Scene, ShootDay } from '@/lib/supabase'
import OperatorBoard from '../op/[token]/OperatorBoard'
import ClientBoard from '../job/[token]/ClientBoard'

// Local-only preview with seed data — a long-form (series) production across
// two shoot days. Realtime no-ops against the dummy host; the UI still renders.
const demoJob: Job = {
  id: 'demo-job',
  title: 'The Estate — Season 1',
  shoot_date: null,
  location: 'Johannesburg',
  units: 2,
  qtake_url: 'https://example.com/stream',
  type: 'series',
  admin_token: 'demo',
  op_token: 'demo',
  client_token: 'demo',
  created_at: '2026-06-18',
}

const demoJobNoStream: Job = { ...demoJob, id: 'demo-job-2', qtake_url: null }

const DAY1 = 'day-1'
const DAY2 = 'day-2'

const demoDays: ShootDay[] = [
  { id: DAY1, job_id: 'demo-job', shoot_date: '2026-06-19', label: 'Day 1', location: 'Studio A', sort_order: 0, created_at: '' },
  { id: DAY2, job_id: 'demo-job', shoot_date: '2026-06-20', label: 'Day 2', location: 'Sandton', sort_order: 1, created_at: '' },
]

const demoScenes: Scene[] = [
  // Day 1 — fully wrapped
  { id: '1', job_id: 'demo-job', shoot_day_id: DAY1, scene_number: '1A', title: 'Int. kitchen — hero pours coffee', location: 'Studio A', unit: 'a', status: 'complete', sort_order: 0, updated_at: '' },
  { id: '2', job_id: 'demo-job', shoot_day_id: DAY1, scene_number: '2A', title: 'Int. lounge — family reacts', location: 'Studio A', unit: 'a', status: 'complete', sort_order: 1, updated_at: '' },
  { id: '3', job_id: 'demo-job', shoot_day_id: DAY1, scene_number: '1B', title: 'Ext. courtyard — establishing', location: 'Studio A', unit: 'b', status: 'complete', sort_order: 2, updated_at: '' },
  // Day 2 — in progress (the active day)
  { id: '4', job_id: 'demo-job', shoot_day_id: DAY2, scene_number: '3A', title: 'Product CU — phone on table', location: 'Sandton', unit: 'a', status: 'inprogress', sort_order: 3, updated_at: '' },
  { id: '5', job_id: 'demo-job', shoot_day_id: DAY2, scene_number: '4A', title: 'Int. hallway — walk & talk', location: 'Sandton', unit: 'a', status: 'upcoming', sort_order: 4, updated_at: '' },
  { id: '6', job_id: 'demo-job', shoot_day_id: DAY2, scene_number: '2B', title: 'Ext. driveway — car arrives', location: 'Sandton', unit: 'b', status: 'inprogress', sort_order: 5, updated_at: '' },
  { id: '7', job_id: 'demo-job', shoot_day_id: DAY2, scene_number: '3B', title: 'Ext. garden — golden hour wide', location: 'Sandton', unit: 'b', status: 'upcoming', sort_order: 6, updated_at: '' },
]

function Panel({ children }: { children: React.ReactNode }) {
  return <div className="rounded-2xl overflow-hidden border border-white/10">{children}</div>
}

export default function DemoPage() {
  return (
    <main className="min-h-screen bg-zinc-900 text-white">
      <div className="max-w-5xl mx-auto p-5 sm:p-8">
        <p className="text-xs uppercase tracking-[0.25em] text-zinc-500 mb-8">
          Local preview — series, 2 shoot days, seed data
        </p>

        <div className="grid lg:grid-cols-2 gap-8">
          <section>
            <h2 className="text-sm text-zinc-400 mb-3">
              Operator board <code className="text-zinc-600">/op/[token]</code>
            </h2>
            <Panel>
              <div className="bg-zinc-950">
                <OperatorBoard job={demoJob} shootDays={demoDays} initialScenes={demoScenes} />
              </div>
            </Panel>
          </section>

          <section>
            <h2 className="text-sm text-zinc-400 mb-3">
              Client shot list <code className="text-zinc-600">/job/[token]</code>
            </h2>
            <Panel>
              <div className="bg-white">
                <ClientBoard job={demoJob} shootDays={demoDays} initialScenes={demoScenes} />
              </div>
            </Panel>
          </section>

          <section>
            <h2 className="text-sm text-zinc-400 mb-3">
              Client shot list — <span className="text-zinc-500">no stream attached</span> (no “Watch live”)
            </h2>
            <Panel>
              <div className="bg-white">
                <ClientBoard job={demoJobNoStream} shootDays={demoDays} initialScenes={demoScenes} />
              </div>
            </Panel>
          </section>
        </div>
      </div>
    </main>
  )
}
