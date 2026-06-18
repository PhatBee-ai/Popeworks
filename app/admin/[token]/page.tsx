import { notFound } from 'next/navigation'
import Link from 'next/link'
import { supabase } from '@/lib/supabase'
import { createJob } from './actions'

export default async function AdminPage({
  params,
}: {
  params: Promise<{ token: string }>
}) {
  const { token } = await params

  if (token !== process.env.ADMIN_SECRET) notFound()

  const { data: jobs } = await supabase
    .from('jobs')
    .select('id, title, shoot_date')
    .order('shoot_date', { ascending: false })
    .limit(20)

  const createJobAction = createJob.bind(null, token)

  return (
    <main className="min-h-screen bg-zinc-950 text-white p-6 max-w-xl mx-auto">
      <div className="mb-8">
        <p className="text-xs tracking-widest text-zinc-500 uppercase mb-1">PopeWorks</p>
        <h1 className="text-xl font-medium">Shoot days</h1>
      </div>

      {jobs && jobs.length > 0 && (
        <div className="mb-8 space-y-2">
          {jobs.map(job => (
            <Link
              key={job.id}
              href={`/admin/${token}/job/${job.id}`}
              className="flex items-center justify-between p-4 bg-zinc-900 border border-zinc-800 rounded-xl hover:border-zinc-700 transition-colors"
            >
              <div>
                <p className="text-sm font-medium">{job.title}</p>
                <p className="text-xs text-zinc-500 mt-0.5">
                  {new Date(job.shoot_date).toLocaleDateString('en-ZA', {
                    day: 'numeric',
                    month: 'short',
                    year: 'numeric',
                  })}
                </p>
              </div>
              <svg className="w-4 h-4 text-zinc-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 5l7 7-7 7" />
              </svg>
            </Link>
          ))}
        </div>
      )}

      <div className="border border-zinc-800 rounded-xl p-6">
        <p className="text-sm font-medium text-zinc-300 mb-5">New shoot day</p>
        <form action={createJobAction} className="space-y-4">
          <div>
            <label className="text-xs text-zinc-500 block mb-1.5">Job title</label>
            <input
              name="title"
              required
              placeholder="Vodacom Hero — Summer 2026"
              className="w-full bg-zinc-900 border border-zinc-800 rounded-lg px-3 py-2.5 text-sm text-white placeholder-zinc-600 focus:outline-none focus:border-zinc-600"
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="text-xs text-zinc-500 block mb-1.5">Shoot date</label>
              <input
                name="shoot_date"
                type="date"
                required
                className="w-full bg-zinc-900 border border-zinc-800 rounded-lg px-3 py-2.5 text-sm text-white focus:outline-none focus:border-zinc-600"
              />
            </div>
            <div>
              <label className="text-xs text-zinc-500 block mb-1.5">Units</label>
              <select
                name="units"
                className="w-full bg-zinc-900 border border-zinc-800 rounded-lg px-3 py-2.5 text-sm text-white focus:outline-none focus:border-zinc-600"
              >
                <option value="1">Single unit</option>
                <option value="2">Multi unit</option>
              </select>
            </div>
          </div>

          <div>
            <label className="text-xs text-zinc-500 block mb-1.5">Location</label>
            <input
              name="location"
              required
              placeholder="Eastgate Studio"
              className="w-full bg-zinc-900 border border-zinc-800 rounded-lg px-3 py-2.5 text-sm text-white placeholder-zinc-600 focus:outline-none focus:border-zinc-600"
            />
          </div>

          <div>
            <label className="text-xs text-zinc-500 block mb-1.5">
              QTake stream URL <span className="text-zinc-600">(optional)</span>
            </label>
            <input
              name="qtake_url"
              type="url"
              placeholder="https://…"
              className="w-full bg-zinc-900 border border-zinc-800 rounded-lg px-3 py-2.5 text-sm text-white placeholder-zinc-600 focus:outline-none focus:border-zinc-600"
            />
          </div>

          <div>
            <label className="text-xs text-zinc-500 block mb-1.5">
              Scenes{' '}
              <span className="text-zinc-600">— one per line: number, title, location[, unit a/b]</span>
            </label>
            <textarea
              name="scenes"
              rows={8}
              placeholder={
                '1A, Int. kitchen, Eastgate Studio\n1B, Ext. driveway, Sandton\n2A, Product CU table, Studio, a\n3A, Ext. garden, Sandton, b'
              }
              className="w-full bg-zinc-900 border border-zinc-800 rounded-lg px-3 py-2.5 text-sm text-white placeholder-zinc-600 font-mono focus:outline-none focus:border-zinc-600 resize-none"
            />
          </div>

          <button
            type="submit"
            className="w-full bg-white text-black py-3 rounded-lg text-sm font-medium hover:bg-zinc-100 transition-colors"
          >
            Create shoot day
          </button>
        </form>
      </div>
    </main>
  )
}
