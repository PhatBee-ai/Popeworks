import type { Job, Scene } from '@/lib/supabase'
import OperatorBoard from '../op/[token]/OperatorBoard'
import ClientBoard from '../job/[token]/ClientBoard'

// Local-only preview with seed data. Not linked anywhere; no Supabase round-trip
// is needed to render — realtime simply no-ops against the dummy host.
const demoJob: Job = {
  id: 'demo-job',
  title: 'Vodacom Hero — Summer 2026',
  shoot_date: '2026-06-20',
  location: 'Eastgate Studio, Johannesburg',
  units: 2,
  qtake_url: 'https://example.com/stream',
  admin_token: 'demo',
  op_token: 'demo',
  client_token: 'demo',
  created_at: '2026-06-18',
}

const demoScenes: Scene[] = [
  { id: '1', job_id: 'demo-job', scene_number: '1A', title: 'Int. kitchen — hero pours coffee', location: 'Studio A', unit: 'a', status: 'complete', sort_order: 0, updated_at: '' },
  { id: '2', job_id: 'demo-job', scene_number: '2A', title: 'Product CU — phone on table', location: 'Studio A', unit: 'a', status: 'inprogress', sort_order: 1, updated_at: '' },
  { id: '3', job_id: 'demo-job', scene_number: '3A', title: 'Int. lounge — family reacts', location: 'Studio A', unit: 'a', status: 'upcoming', sort_order: 2, updated_at: '' },
  { id: '4', job_id: 'demo-job', scene_number: '4A', title: 'Int. hallway — walk & talk', location: 'Studio A', unit: 'a', status: 'upcoming', sort_order: 3, updated_at: '' },
  { id: '5', job_id: 'demo-job', scene_number: '1B', title: 'Ext. driveway — car arrives', location: 'Sandton', unit: 'b', status: 'inprogress', sort_order: 4, updated_at: '' },
  { id: '6', job_id: 'demo-job', scene_number: '2B', title: 'Ext. garden — golden hour wide', location: 'Sandton', unit: 'b', status: 'upcoming', sort_order: 5, updated_at: '' },
]

export default function DemoPage() {
  return (
    <main className="min-h-screen bg-black text-white">
      <div className="max-w-5xl mx-auto p-5">
        <p className="text-xs uppercase tracking-[0.25em] text-amber-500 mb-6">
          Local preview — seed data
        </p>
        <div className="grid lg:grid-cols-2 gap-8">
          <section>
            <h2 className="text-sm text-zinc-500 mb-3">Operator board <code className="text-zinc-600">/op/[token]</code></h2>
            <div className="rounded-3xl border border-white/10 overflow-hidden bg-zinc-950">
              <OperatorBoard job={demoJob} initialScenes={demoScenes} />
            </div>
          </section>
          <section>
            <h2 className="text-sm text-zinc-500 mb-3">Client portal <code className="text-zinc-600">/job/[token]</code></h2>
            <div className="rounded-3xl border border-white/10 overflow-hidden bg-zinc-950">
              <ClientBoard job={demoJob} initialScenes={demoScenes} />
            </div>
          </section>
        </div>
      </div>
    </main>
  )
}
