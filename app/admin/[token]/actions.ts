'use server'

import { redirect } from 'next/navigation'
import { createClient } from '@supabase/supabase-js'
import { parseSceneText } from '@/lib/scenes'

function adminClient() {
  return createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  )
}

export async function createJob(adminToken: string, formData: FormData) {
  if (adminToken !== process.env.ADMIN_SECRET) {
    throw new Error('Unauthorized')
  }

  const supabase = adminClient()
  const title = formData.get('title') as string
  const shoot_date = formData.get('shoot_date') as string
  const location = formData.get('location') as string
  const units = parseInt(formData.get('units') as string) as 1 | 2
  const qtake_url = (formData.get('qtake_url') as string) || null
  const scene_text = formData.get('scenes') as string

  const { data: job, error } = await supabase
    .from('jobs')
    .insert({ title, shoot_date, location, units, qtake_url })
    .select()
    .single()

  if (error || !job) throw new Error(error?.message ?? 'Failed to create job')

  const scenes = parseSceneText(scene_text, job.id)
  if (scenes.length > 0) {
    const { error: scenesError } = await supabase.from('scenes').insert(scenes)
    if (scenesError) throw new Error(scenesError.message)
  }

  redirect(`/admin/${adminToken}/job/${job.id}`)
}
