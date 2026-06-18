import { createClient } from '@supabase/supabase-js'

export type SceneStatus = 'upcoming' | 'inprogress' | 'complete'
export type Unit = 'a' | 'b'

export interface Job {
  id: string
  title: string
  shoot_date: string
  location: string
  units: 1 | 2
  qtake_url: string | null
  admin_token: string
  op_token: string
  client_token: string
  created_at: string
}

export interface Scene {
  id: string
  job_id: string
  scene_number: string
  title: string
  location: string
  unit: Unit
  status: SceneStatus
  sort_order: number
  updated_at: string
}

export function createSupabaseClient() {
  return createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  )
}

export const supabase = createSupabaseClient()
