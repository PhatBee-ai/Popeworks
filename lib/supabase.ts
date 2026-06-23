import { createClient } from '@supabase/supabase-js'

export type SceneStatus = 'upcoming' | 'inprogress' | 'complete'
export type Unit = 'a' | 'b'
export type ProductionType = 'commercial' | 'film' | 'series'

export interface Job {
  id: string
  title: string
  shoot_date: string | null
  location: string
  units: 1 | 2
  qtake_url: string | null
  type: ProductionType
  admin_token: string
  op_token: string
  client_token: string
  created_at: string
}

export interface ShootDay {
  id: string
  job_id: string
  shoot_date: string | null
  label: string
  location: string | null
  sort_order: number
  created_at: string
}

export interface Scene {
  id: string
  job_id: string
  shoot_day_id: string | null
  scene_number: string
  title: string
  location: string
  unit: Unit
  status: SceneStatus
  sort_order: number
  updated_at: string
}

export function createSupabaseClient() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL
  const key = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
  if (!url || !key) {
    throw new Error(
      'Supabase is not configured — set NEXT_PUBLIC_SUPABASE_URL and NEXT_PUBLIC_SUPABASE_ANON_KEY.'
    )
  }
  return createClient(url, key)
}

// Lazily created on first use so the build (and the marketing site) never
// depends on Supabase env vars being present — only the data-backed pages do.
let cached: ReturnType<typeof createSupabaseClient> | null = null

export const supabase = new Proxy({} as ReturnType<typeof createSupabaseClient>, {
  get(_target, prop, receiver) {
    if (!cached) cached = createSupabaseClient()
    return Reflect.get(cached, prop, receiver)
  },
})
