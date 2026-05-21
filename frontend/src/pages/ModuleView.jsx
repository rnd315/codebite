import { useEffect, useState } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import { ArrowLeft } from 'lucide-react'
import client from '../api/client'
import CircuitPathway from '../components/pathway/CircuitPathway'
import { MODULES } from '../utils/constants'
import useStore from '../store/useStore'

// Orange accent used on the Mod 4 partial card on the dashboard
const PARTIAL_ACCENT = '#C2410C'

export default function ModuleView() {
  const { moduleSlug } = useParams()
  const navigate = useNavigate()
  const { t } = useTranslation()

  const module = MODULES.find((m) => m.slug === moduleSlug)
  const completedCurriculumLessons = useStore((s) => s.completedCurriculumLessons)

  const [dbLessons, setDbLessons] = useState([])
  const [progress, setProgress] = useState([])
  const [dataLoaded, setDataLoaded] = useState(false)

  useEffect(() => {
    Promise.all([client.get('/lessons'), client.get('/progress')])
      .then(([{ data: ls }, { data: pr }]) => {
        setDbLessons(ls)
        setProgress(pr)
      })
      .catch(() => {})
      .finally(() => setDataLoaded(true))
  }, [])

  if (!module) {
    navigate('/pathway', { replace: true })
    return null
  }

  const constLessons = module.lessons ?? []
  const isPartial = module.demoStatus === 'partial'

  // Build completed set from DB progress (integer lesson IDs)
  const completedDbIds = new Set(progress.filter((p) => p.completed).map((p) => p.lesson_id))

  // Match DB lessons for this module by macro, sorted by order_index
  const moduleDbLessons = dbLessons
    .filter((l) => l.macro === module.macro)
    .sort((a, b) => a.order_index - b.order_index)

  // Align constants lessons with DB lessons by position.
  // A lesson counts as completed if either the DB progress record says so,
  // or the user completed it via the file-based curriculum flow (stored in Zustand).
  const withDbStatus = constLessons.map((constLesson, idx) => {
    const dbLesson = moduleDbLessons[idx]
    const dbDone = dbLesson ? completedDbIds.has(dbLesson.id) : false
    const curriculumDone = completedCurriculumLessons.includes(constLesson.id)
    return { ...constLesson, _dbCompleted: dbDone || curriculumDone }
  })

  let computedLessons
  if (isPartial) {
    // Partial modules (e.g. Mod 4): preserve the locked/unlocked status from constants.js —
    // only mod04_01 and mod04_04 are unlocked; all others stay locked.
    // Mark DB-completed lessons as 'completed' but do not sequential-unlock others.
    computedLessons = withDbStatus.map((l) => {
      if (l._dbCompleted) return { ...l, status: 'completed' }
      return l  // keep original status from constants ('unlocked' or 'locked')
    })
  } else {
    // Sequential unlock: completed → 'completed', first non-completed → 'unlocked', rest → 'locked'
    let foundCurrent = false
    computedLessons = withDbStatus.map((l) => {
      if (l._dbCompleted) return { ...l, status: 'completed' }
      if (!foundCurrent) {
        foundCurrent = true
        return { ...l, status: 'unlocked' }
      }
      return { ...l, status: 'locked' }
    })
  }

  const completedCount = computedLessons.filter((l) => l.status === 'completed').length

  // Construct translated header: "MOD_01 // BAZELE" → prefix fixed, name translated
  const modulePrefix = module.id.replace('mod', 'MOD').toUpperCase()  // 'MOD_01'
  const moduleTitle = t(`modules.${module.id}.title`)

  return (
    <div className="py-6 max-w-2xl mx-auto">
      {/* Navigation + header */}
      <div className="mb-10">
        <button
          onClick={() => navigate('/pathway')}
          className="flex items-center gap-1.5 font-mono text-xs text-muted-foreground hover:text-accent transition-colors mb-5"
        >
          <ArrowLeft size={13} />
          {t('module.backToDashboard')}
        </button>

        <p className="font-mono text-[9px] text-muted-foreground uppercase tracking-[0.2em] mb-1">
          {modulePrefix}
        </p>
        <h1 className="font-mono text-xl font-bold text-foreground mb-1">
          {modulePrefix} // {moduleTitle}
        </h1>
        <p className="text-sm text-muted-foreground">{t(`modules.${module.id}.subtitle`)}</p>

        <div className="flex items-center gap-3 mt-4">
          <div className="h-1 flex-1 bg-secondary rounded-full overflow-hidden">
            <div
              className="h-full bg-accent rounded-full transition-all duration-700"
              style={{
                width: constLessons.length > 0
                  ? `${(completedCount / constLessons.length) * 100}%`
                  : '0%',
              }}
            />
          </div>
          <span className="font-mono text-xs text-muted-foreground flex-shrink-0">
            {completedCount} / {constLessons.length}
          </span>
        </div>
      </div>

      {/* Circuit-board micro-pathway */}
      <CircuitPathway
        lessons={dataLoaded ? computedLessons : constLessons}
        accentOverride={isPartial ? PARTIAL_ACCENT : undefined}
      />
    </div>
  )
}
