'use client'

import { useEffect, useState } from 'react'
import { createSupabaseClient } from '@/lib/supabase'
import type { Job, Scene } from '@/lib/supabase'

type Props = {
  job: Job
  initialScenes: Scene[]
}

export default function ClientBoard({ job, initialScenes }: Props) {
  const [scenes, setScenes] = useState<Scene[]>(initialScenes)

  useEffect(() => {
    let client: ReturnType<typeof createSupabaseClient>
    try {
      client = createSupabaseClient()
    } catch {
      return // no Supabase configured — show initial data without live updates
    }
    const channel = client
      .channel(`client-scenes-${job.id}`)
      .on(
        'postgres_changes',
        { event: 'UPDATE', schema: 'public', table: 'scenes', filter: `job_id=eq.${job.id}` },
        (payload) => {
          setScenes(prev =>
            prev.map(s => (s.id === payload.new.id ? (payload.new as Scene) : s))
          )
        }
      )
      .subscribe()

    return () => { client.removeChannel(channel) }
  }, [job.id])

  const total = scenes.length
  const done = scenes.filter(s => s.status === 'complete').length
  const isMultiUnit = job.units === 2

  return (
    <div className="max-w-xl mx-auto px-5 py-8 sm:py-10">
      {/* Masthead — reads like the top of a shot list */}
      <header className="border-b-2 border-black pb-4">
        <div className="flex items-baseline justify-between gap-3">
          <p className="font-display uppercase text-xs tracking-[0.3em]">Shot list</p>
          <p className="text-xs tabular-nums text-black/50">{done}/{total} shot</p>
        </div>
        <h1 className="font-display uppercase text-2xl sm:text-3xl tracking-tight mt-1.5 leading-none">
          {job.title}
        </h1>
        <p className="text-xs text-black/50 mt-2">
          {new Date(job.shoot_date).toLocaleDateString('en-ZA', {
            weekday: 'long',
            day: 'numeric',
            month: 'long',
          })}
          {' · '}
          {job.location}
        </p>
      </header>

      {/* Watch live — only when a stream exists */}
      {job.qtake_url && (
        <a
          href={job.qtake_url}
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center justify-center gap-2.5 w-full mt-5 px-5 py-3.5 bg-black text-white font-bold uppercase text-sm border-2 border-black shadow-[5px_5px_0_#000] hover:translate-x-[2px] hover:translate-y-[2px] hover:shadow-[2px_2px_0_#000] transition-all"
        >
          <span className="flex h-2.5 w-2.5 relative">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-white opacity-75" />
            <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-white" />
          </span>
          Watch live
        </a>
      )}

      {/* The list itself */}
      <ol className="mt-6 border-t border-black/10">
        {scenes.map(scene => (
          <ShotRow key={scene.id} scene={scene} isMultiUnit={isMultiUnit} />
        ))}
      </ol>
    </div>
  )
}

function ShotRow({ scene, isMultiUnit }: { scene: Scene; isMultiUnit: boolean }) {
  const complete = scene.status === 'complete'
  const now = scene.status === 'inprogress'

  const meta =
    scene.location + (isMultiUnit ? ` · Unit ${scene.unit.toUpperCase()}` : '')

  // Current shot inverts to a solid black row — the "you are here" marker.
  if (now) {
    return (
      <li className="flex items-center gap-4 px-4 py-4 bg-black text-white">
        <span className="font-display text-lg w-10 shrink-0 tabular-nums">{scene.scene_number}</span>
        <div className="flex-1 min-w-0">
          <p className="text-[15px] font-medium truncate">{scene.title}</p>
          <p className="text-xs text-white/60 truncate">{meta}</p>
        </div>
        <span className="flex items-center gap-1.5 text-[10px] font-bold uppercase tracking-[0.2em] shrink-0">
          <span className="h-2 w-2 rounded-full bg-white animate-pulse" />
          Now
        </span>
      </li>
    )
  }

  return (
    <li className="flex items-center gap-4 px-4 py-3.5 border-b border-black/10">
      <span
        className={`font-display text-lg w-10 shrink-0 tabular-nums ${
          complete ? 'line-through text-black/30' : ''
        }`}
      >
        {scene.scene_number}
      </span>
      <div className="flex-1 min-w-0">
        <p className={`text-[15px] truncate ${complete ? 'line-through text-black/30' : 'font-medium'}`}>
          {scene.title}
        </p>
        <p className={`text-xs truncate ${complete ? 'text-black/25' : 'text-black/45'}`}>{meta}</p>
      </div>
      {complete && (
        <svg className="w-4 h-4 text-black/30 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5 13l4 4L19 7" />
        </svg>
      )}
    </li>
  )
}
