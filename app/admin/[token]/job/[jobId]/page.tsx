import { notFound } from 'next/navigation'
import Link from 'next/link'
import { supabase } from '@/lib/supabase'
import type { Scene, ShootDay } from '@/lib/supabase'
import JobLinks from './JobLinks'
import { addShootDay, addScenes } from '../../actions'

const TYPE_LABEL: Record<string, string> = {
  commercial: 'Commercial',
  film: 'Film',
  series: 'Series',
}

function fmtDate(d: string | null) {
  if (!d) return 'No date'
  return new Date(d).toLocaleDateString('en-ZA', {
    weekday: 'short',
    day: 'numeric',
    month: 'short',
    year: 'numeric',
  })
}

export default async function JobDetailPage({
  params,
}: {
  params: Promise<{ token: string; jobId: string }>
}) {
  const { token, jobId } = await params

  if (token !== process.env.ADMIN_SECRET) notFound()

  const { data: job } = await supabase.from('jobs').select('*').eq('id', jobId).single()
  if (!job) notFound()

  const { data: days } = await supabase
    .from('shoot_days')
    .select('*')
    .eq('job_id', jobId)
    .order('sort_order')

  const { data: scenes } = await supabase
    .from('scenes')
    .select('*')
    .eq('job_id', jobId)
    .order('sort_order')

  const shootDays = (days ?? []) as ShootDay[]
  const allScenes = (scenes ?? []) as Scene[]
  const base = process.env.NEXT_PUBLIC_BASE_URL ?? ''
  const isLongForm = job.type !== 'commercial'

  const addDay = addShootDay.bind(null, token, jobId)
  const totalDone = allScenes.filter(s => s.status === 'complete').length

  return (
    <main className="min-h-screen bg-zinc-950 text-white p-6 max-w-xl mx-auto">
      <Link
        href={`/admin/${token}`}
        className="text-xs text-zinc-500 hover:text-zinc-300 transition-colors mb-6 inline-block"
      >
        ← All productions
      </Link>

      <div className="mb-6">
        <div className="flex items-center gap-2 mb-1">
          <span className="text-[10px] uppercase tracking-wide bg-zinc-800 text-zinc-400 px-1.5 py-0.5 rounded">
            {TYPE_LABEL[job.type] ?? job.type}
          </span>
          <span className="text-xs text-zinc-500">
            {shootDays.length} {shootDays.length === 1 ? 'day' : 'days'} · {allScenes.length} scenes · {totalDone} wrapped
          </span>
        </div>
        <h1 className="text-xl font-medium">{job.title}</h1>
        <p className="text-sm text-zinc-500 mt-1">
          {job.location} · {job.units === 2 ? 'Multi unit' : 'Single unit'}
        </p>
      </div>

      <JobLinks
        opUrl={`${base}/op/${job.op_token}`}
        clientUrl={`${base}/job/${job.client_token}`}
      />

      {/* Shoot days */}
      <div className="mt-8 space-y-6">
        {shootDays.map(day => {
          const dayScenes = allScenes.filter(s => s.shoot_day_id === day.id)
          const addScenesToDay = addScenes.bind(null, token, jobId, day.id)
          const dayDone = dayScenes.filter(s => s.status === 'complete').length
          return (
            <div key={day.id} className="border border-zinc-800 rounded-xl p-5">
              <div className="flex items-baseline justify-between gap-3 mb-3">
                <div>
                  <p className="text-sm font-medium">{day.label || 'Untitled day'}</p>
                  <p className="text-xs text-zinc-500">
                    {fmtDate(day.shoot_date)}
                    {day.location ? ` · ${day.location}` : ''}
                  </p>
                </div>
                <span className="text-xs text-zinc-500 tabular-nums shrink-0">
                  {dayDone}/{dayScenes.length}
                </span>
              </div>

              {dayScenes.length > 0 && (
                <div className="space-y-1 mb-3">
                  {dayScenes.map(scene => (
                    <div
                      key={scene.id}
                      className="flex items-center gap-3 px-3 py-2 bg-zinc-900 border border-zinc-800 rounded-lg"
                    >
                      <span className="text-xs font-medium w-8 text-zinc-300 shrink-0">{scene.scene_number}</span>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm truncate">{scene.title}</p>
                        <p className="text-xs text-zinc-500 truncate">{scene.location}</p>
                      </div>
                      {job.units === 2 && (
                        <span className="text-[10px] bg-zinc-800 text-zinc-400 px-1.5 py-0.5 rounded shrink-0">
                          {scene.unit.toUpperCase()}
                        </span>
                      )}
                    </div>
                  ))}
                </div>
              )}

              <form action={addScenesToDay} className="flex flex-col gap-2">
                <textarea
                  name="scenes"
                  rows={2}
                  placeholder="Add scenes — number, title, location[, unit]"
                  required
                  className="w-full bg-zinc-900 border border-zinc-800 rounded-lg px-3 py-2 text-xs text-white placeholder-zinc-600 font-mono focus:outline-none focus:border-zinc-600 resize-none"
                />
                <button
                  type="submit"
                  className="self-start text-xs font-medium bg-zinc-800 hover:bg-zinc-700 text-white px-3 py-1.5 rounded-lg transition-colors"
                >
                  + Add scenes
                </button>
              </form>
            </div>
          )
        })}
      </div>

      {/* Add a shoot day (long-form) */}
      {isLongForm && (
        <div className="mt-6 border border-dashed border-zinc-800 rounded-xl p-5">
          <p className="text-sm font-medium text-zinc-300 mb-4">Add shoot day</p>
          <form action={addDay} className="space-y-3">
            <div className="grid grid-cols-2 gap-3">
              <input
                name="shoot_date"
                type="date"
                className="w-full bg-zinc-900 border border-zinc-800 rounded-lg px-3 py-2.5 text-sm text-white focus:outline-none focus:border-zinc-600"
              />
              <input
                name="label"
                placeholder={`Day ${shootDays.length + 1}`}
                className="w-full bg-zinc-900 border border-zinc-800 rounded-lg px-3 py-2.5 text-sm text-white placeholder-zinc-600 focus:outline-none focus:border-zinc-600"
              />
            </div>
            <input
              name="location"
              placeholder="Location (optional)"
              className="w-full bg-zinc-900 border border-zinc-800 rounded-lg px-3 py-2.5 text-sm text-white placeholder-zinc-600 focus:outline-none focus:border-zinc-600"
            />
            <textarea
              name="scenes"
              rows={3}
              placeholder="Scenes for this day (optional) — one per line"
              className="w-full bg-zinc-900 border border-zinc-800 rounded-lg px-3 py-2 text-xs text-white placeholder-zinc-600 font-mono focus:outline-none focus:border-zinc-600 resize-none"
            />
            <button
              type="submit"
              className="w-full bg-white text-black py-2.5 rounded-lg text-sm font-medium hover:bg-zinc-100 transition-colors"
            >
              Add day
            </button>
          </form>
        </div>
      )}
    </main>
  )
}
