import { notFound } from 'next/navigation'
import Link from 'next/link'
import { supabase } from '@/lib/supabase'
import JobLinks from './JobLinks'

export default async function JobDetailPage({
  params,
}: {
  params: Promise<{ token: string; jobId: string }>
}) {
  const { token, jobId } = await params

  if (token !== process.env.ADMIN_SECRET) notFound()

  const { data: job } = await supabase
    .from('jobs')
    .select('*')
    .eq('id', jobId)
    .single()

  if (!job) notFound()

  const { data: scenes } = await supabase
    .from('scenes')
    .select('*')
    .eq('job_id', jobId)
    .order('sort_order')

  const base = process.env.NEXT_PUBLIC_BASE_URL ?? ''

  return (
    <main className="min-h-screen bg-zinc-950 text-white p-6 max-w-xl mx-auto">
      <Link
        href={`/admin/${token}`}
        className="text-xs text-zinc-500 hover:text-zinc-300 transition-colors mb-6 inline-block"
      >
        ← All jobs
      </Link>

      <div className="mb-6">
        <p className="text-xs text-zinc-500 mb-1">
          {new Date(job.shoot_date).toLocaleDateString('en-ZA', {
            weekday: 'long',
            day: 'numeric',
            month: 'long',
            year: 'numeric',
          })}
        </p>
        <h1 className="text-xl font-medium">{job.title}</h1>
        <p className="text-sm text-zinc-500 mt-1">
          {job.location} · {job.units === 2 ? 'Multi unit' : 'Single unit'}
        </p>
      </div>

      <JobLinks
        opUrl={`${base}/op/${job.op_token}`}
        clientUrl={`${base}/job/${job.client_token}`}
      />

      <div className="mt-8">
        <p className="text-xs text-zinc-500 uppercase tracking-widest mb-3">
          {scenes?.length ?? 0} scenes
        </p>
        <div className="space-y-1">
          {scenes?.map(scene => (
            <div
              key={scene.id}
              className="flex items-center gap-3 px-4 py-3 bg-zinc-900 border border-zinc-800 rounded-lg"
            >
              <span className="text-sm font-medium w-8 text-zinc-300">{scene.scene_number}</span>
              <div className="flex-1">
                <p className="text-sm">{scene.title}</p>
                <p className="text-xs text-zinc-500">{scene.location}</p>
              </div>
              {job.units === 2 && (
                <span className="text-xs bg-blue-950 text-blue-400 px-2 py-0.5 rounded-full">
                  Unit {scene.unit === 'a' ? 'A' : 'B'}
                </span>
              )}
            </div>
          ))}
        </div>
      </div>
    </main>
  )
}
