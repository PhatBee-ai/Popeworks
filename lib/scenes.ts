import type { Scene, SceneStatus, Unit } from './supabase'

export function parseSceneText(
  text: string,
  jobId: string,
  defaultUnit: Unit = 'a'
): Omit<Scene, 'id' | 'updated_at'>[] {
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
        scene_number: parts[0] ?? '',
        title: parts[1] ?? '',
        location: parts[2] ?? '',
        unit,
        status: 'upcoming' as SceneStatus,
        sort_order: index,
      }
    })
    .filter(s => s.scene_number && s.title)
}
