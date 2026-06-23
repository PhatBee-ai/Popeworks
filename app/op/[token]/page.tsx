import { notFound } from 'next/navigation'
import { supabase } from '@/lib/supabase'
import OperatorBoard from './OperatorBoard'
import type { ShootDay } from '@/lib/supabase'

export default async function OperatorPage({
  params,
}: {
  params: Promise<{ token: string }>
}) {
  const { token } = await params

  const { data: job } = await supabase
    .from('jobs')
    .select('*')
    .eq('op_token', token)
    .single()

  if (!job) notFound()

  const { data: days } = await supabase
    .from('shoot_days')
    .select('*')
    .eq('job_id', job.id)
    .order('sort_order')

  const { data: scenes } = await supabase
    .from('scenes')
    .select('*')
    .eq('job_id', job.id)
    .order('sort_order')

  return (
    <main className="min-h-screen bg-zinc-950 text-white">
      <OperatorBoard
        job={job}
        shootDays={(days ?? []) as ShootDay[]}
        initialScenes={scenes ?? []}
      />
    </main>
  )
}
