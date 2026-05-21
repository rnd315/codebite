import { useEffect, useState } from 'react'
import { useTranslation } from 'react-i18next'
import client from '../api/client'
import useStore from '../store/useStore'
import MacroModule, { BusConnector } from '../components/pathway/MacroModule'
import HeroBanner from '../components/layout/HeroBanner'
import Sidebar from '../components/layout/Sidebar'
import { ModuleSkeleton } from '../components/ui/Skeleton'
import { MODULES } from '../utils/constants'

function computeModuleStatus(modIndex, lessons, completedIds) {
  const mod = MODULES[modIndex]
  const modLessons = lessons.filter((l) => l.macro === mod.macro)

  if (modLessons.length > 0 && modLessons.every((l) => completedIds.has(l.id)))
    return 'completed'

  // First non-completed module index = the active slot
  let activeIndex = 0
  for (let i = 0; i < MODULES.length; i++) {
    const mLessons = lessons.filter((l) => l.macro === MODULES[i].macro)
    if (!(mLessons.length > 0 && mLessons.every((l) => completedIds.has(l.id)))) {
      activeIndex = i
      break
    }
  }

  if (modIndex === activeIndex) return 'active'
  if (modIndex === activeIndex + 1) return 'locked'
  return 'fog_of_war'
}

export default function Pathway() {
  const { t } = useTranslation()
  const lang = useStore((s) => s.lang)
  const [lessons, setLessons] = useState([])
  const [progress, setProgress] = useState([])
  const [latestQuestion, setLatestQuestion] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    const fetchAll = async () => {
      try {
        const [{ data: l }, { data: p }] = await Promise.all([
          client.get('/lessons'),
          client.get('/progress'),
        ])
        setLessons(l)
        setProgress(p)
        client.get('/community/questions').then(({ data: q }) => {
          if (q.length > 0) setLatestQuestion(q[0])
        }).catch(() => {})
      } catch {
        setError(t('common.error'))
      } finally {
        setLoading(false)
      }
    }
    fetchAll()
  }, [t])

  const completedIds = new Set(progress.filter((p) => p.completed).map((p) => p.lesson_id))
  const completedCount = completedIds.size

  const currentLesson =
    lessons.find((l) => !completedIds.has(l.id)) ?? null

  const clearedModules = MODULES.filter((mod) => {
    const modLessons = lessons.filter((l) => l.macro === mod.macro)
    return modLessons.length > 0 && modLessons.every((l) => completedIds.has(l.id))
  }).length

  if (loading) {
    return (
      <div className="pt-0 pb-6 space-y-2">
        {MODULES.map((mod) => (
          <ModuleSkeleton key={mod.id} />
        ))}
      </div>
    )
  }

  if (error) {
    return <p className="text-center text-destructive py-10 text-sm">{error}</p>
  }

  return (
    <div className="pt-0 pb-6">
      <HeroBanner lessons={lessons} completedCount={completedCount} currentLesson={currentLesson} />

      {/* Skill-tree section header */}
      <div className="mb-5 flex items-end justify-between px-1">
        <div>
          <div className="font-mono text-[10px] uppercase tracking-[0.28em] text-muted-foreground">
            ~/skill-tree
          </div>
          <h2 className="mt-1 font-mono text-lg font-bold text-foreground">
            <span className="text-accent">$</span> tree --macro
          </h2>
        </div>
        <div className="text-right">
          <div className="font-mono text-[10px] uppercase tracking-[0.28em] text-muted-foreground">
            {t('pathway.cleared')}
          </div>
          <div className="font-mono text-sm font-bold text-foreground">
            {String(clearedModules).padStart(2, '0')} / {String(MODULES.length).padStart(2, '0')}
          </div>
        </div>
      </div>

      <div className="flex gap-6 items-start">
        {/* Macro modules column */}
        <div className="flex-1 min-w-0 space-y-2">
          {MODULES.map((mod, idx) => {
            const modLessons = lessons.filter((l) => l.macro === mod.macro)
            const modStatus = mod.demoStatus ?? computeModuleStatus(idx, lessons, completedIds)
            return (
              <div key={mod.id}>
                <MacroModule
                  module={mod}
                  lessons={modLessons}
                  completedIds={completedIds}
                  moduleStatus={modStatus}
                  lang={lang}
                />
                {idx < MODULES.length - 1 && <BusConnector />}
              </div>
            )
          })}
        </div>

        {/* Sidebar */}
        <Sidebar completedToday={0} latestQuestion={latestQuestion} />
      </div>
    </div>
  )
}
