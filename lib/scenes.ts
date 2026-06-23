import type { Scene, SceneStatus, Unit } from './supabase'

type NewScene = Omit<Scene, 'id' | 'updated_at'>

// Parse the bulk-paste scene textarea into rows for one shoot day.
// Format per line: number, title, location[, unit a/b]
export function parseSceneText(
  text: string,
  jobId: string,
  shootDayId: string,
  defaultUnit: Unit = 'a',
  startOrder = 0
): NewScene[] {
  return text
    .split('\n')
    .map(line => line.trim())
    .filter(Boolean)
    .map((line, index) => {
      const parts = line.split(',').map(p => p.trim())
      const rawUnit = parts[3]?.toLowerCase()
      const unit: Unit = rawUnit === 'b' ? 'b' : defaultUnit
      return {
        job_id: jobId,
        shoot_day_id: shootDayId,
        scene_number: parts[0] ?? '',
        title: parts[1] ?? '',
        location: parts[2] ?? '',
        unit,
        status: 'upcoming' as SceneStatus,
        sort_order: startOrder + index,
      }
    })
    .filter(s => s.scene_number && s.title)
}
