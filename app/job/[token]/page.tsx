import { notFound } from 'next/navigation'
import { supabase } from '@/lib/supabase'
import ClientBoard from './ClientBoard'

export default async function ClientPage({
  params,
}: {
  params: Promise<{ token: string }>
}) {
  const { token } = await params

  const { data: job } = await supabase
    .from('jobs')
    .select('*')
    .eq('client_token', token)
    .single()

  if (!job) notFound()

  const { data: scenes } = await supabase
    .from('scenes')
    .select('*')
    .eq('job_id', job.id)
    .order('sort_order')

  return (
    <main className="min-h-screen bg-zinc-950 text-white">
      <ClientBoard job={job} initialScenes={scenes ?? []} />
    </main>
  )
}
