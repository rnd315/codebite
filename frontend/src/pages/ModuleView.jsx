import { useEffect, useState } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import { ArrowLeft } from 'lucide-react'
import client from '../api/client'
import useStore from '../store/useStore'
import CircuitPathway from '../components/pathway/CircuitPathway'
import { MODULES } from '../utils/constants'

export default function ModuleView() {
  const { moduleSlug } = useParams()
  const navigate = useNavigate()
  const { t } = useTranslation()
  const lang = useStore((s) => s.lang)

  const [lessons, setLessons] = useState([])
  const [progress, setProgress] = useState([])
  const [loading, setLoading] = useState(true)

  const module = MODULES.find((m) => m.slug === moduleSlug)

  useEffect(() => {
    if (!module) {
      navigate('/pathway', { replace: true })
      return
    }
    const fetchAll = async () => {
      try {
        const [{ data: l }, { data: p }] = await Promise.all([
          client.get('/lessons'),
          client.get('/progress'),
        ])
        setLessons(l.filter((lesson) => module.categories.includes(lesson.category)))
        setProgress(p)
      } finally {
        setLoading(false)
      }
    }
    fetchAll()
  }, [module, navigate])

  const completedIds = new Set(progress.filter((p) => p.completed).map((p) => p.lesson_id))
  const completedCount = lessons.filter((l) => completedIds.has(l.id)).length

  if (!module) return null

  if (loading) {
    return (
      <div className="flex items-center justify-center py-24 font-mono text-sm text-muted-foreground">
        {t('common.loading')}
      </div>
    )
  }

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
          {module.id.replace('_', '').toUpperCase()}
        </p>
        <h1 className="font-mono text-xl font-bold text-foreground mb-1">{module.label}</h1>
        <p className="text-sm text-muted-foreground">{module.subtitle}</p>

        <div className="flex items-center gap-3 mt-4">
          <div className="h-1 flex-1 bg-secondary rounded-full overflow-hidden">
            <div
              className="h-full bg-accent rounded-full transition-all duration-700"
              style={{ width: lessons.length > 0 ? `${(completedCount / lessons.length) * 100}%` : '0%' }}
            />
          </div>
          <span className="font-mono text-xs text-muted-foreground flex-shrink-0">
            {completedCount} / {lessons.length}
          </span>
        </div>
      </div>

      {/* Circuit-board micro-pathway */}
      <CircuitPathway lessons={lessons} completedIds={completedIds} lang={lang} />
    </div>
  )
}
