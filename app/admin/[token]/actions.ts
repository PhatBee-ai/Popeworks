'use server'

import { redirect } from 'next/navigation'
import { revalidatePath } from 'next/cache'
import { createClient } from '@supabase/supabase-js'
import { parseSceneText } from '@/lib/scenes'
import type { ProductionType } from '@/lib/supabase'

function adminClient() {
  return createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  )
}

function assertAdmin(token: string) {
  if (token !== process.env.ADMIN_SECRET) throw new Error('Unauthorized')
}

export async function createJob(adminToken: string, formData: FormData) {
  assertAdmin(adminToken)
  const supabase = adminClient()

  const title = formData.get('title') as string
  const type = ((formData.get('type') as string) || 'commercial') as ProductionType
  const shoot_date = (formData.get('shoot_date') as string) || null
  const location = formData.get('location') as string
  const units = parseInt(formData.get('units') as string) as 1 | 2
  const qtake_url = (formData.get('qtake_url') as string) || null
  const scene_text = formData.get('scenes') as string

  const { data: job, error } = await supabase
    .from('jobs')
    .insert({ title, type, shoot_date, location, units, qtake_url })
    .select()
    .single()
  if (error || !job) throw new Error(error?.message ?? 'Failed to create production')

  // Every production starts with one shoot day.
  const { data: day, error: dayError } = await supabase
    .from('shoot_days')
    .insert({ job_id: job.id, shoot_date, label: 'Day 1', location, sort_order: 0 })
    .select()
    .single()
  if (dayError || !day) throw new Error(dayError?.message ?? 'Failed to create shoot day')

  const scenes = parseSceneText(scene_text, job.id, day.id)
  if (scenes.length > 0) {
    const { error: scenesError } = await supabase.from('scenes').insert(scenes)
    if (scenesError) throw new Error(scenesError.message)
  }

  redirect(`/admin/${adminToken}/job/${job.id}`)
}

export async function addShootDay(adminToken: string, jobId: string, formData: FormData) {
  assertAdmin(adminToken)
  const supabase = adminClient()

  const shoot_date = (formData.get('shoot_date') as string) || null
  const location = (formData.get('location') as string) || null
  const scene_text = (formData.get('scenes') as string) || ''

  const { count } = await supabase
    .from('shoot_days')
    .select('id', { count: 'exact', head: true })
    .eq('job_id', jobId)
  const order = count ?? 0
  const label = (formData.get('label') as string) || `Day ${order + 1}`

  const { data: day, error } = await supabase
    .from('shoot_days')
    .insert({ job_id: jobId, shoot_date, label, location, sort_order: order })
    .select()
    .single()
  if (error || !day) throw new Error(error?.message ?? 'Failed to add shoot day')

  const scenes = parseSceneText(scene_text, jobId, day.id)
  if (scenes.length > 0) {
    const { error: scenesError } = await supabase.from('scenes').insert(scenes)
    if (scenesError) throw new Error(scenesError.message)
  }

  revalidatePath(`/admin/${adminToken}/job/${jobId}`)
}

export async function addScenes(
  adminToken: string,
  jobId: string,
  dayId: string,
  formData: FormData
) {
  assertAdmin(adminToken)
  const supabase = adminClient()

  const scene_text = (formData.get('scenes') as string) || ''

  const { count } = await supabase
    .from('scenes')
    .select('id', { count: 'exact', head: true })
    .eq('shoot_day_id', dayId)

  const scenes = parseSceneText(scene_text, jobId, dayId, 'a', count ?? 0)
  if (scenes.length > 0) {
    const { error } = await supabase.from('scenes').insert(scenes)
    if (error) throw new Error(error.message)
  }

  revalidatePath(`/admin/${adminToken}/job/${jobId}`)
}
