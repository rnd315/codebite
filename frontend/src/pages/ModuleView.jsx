import { useParams, useNavigate } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import { ArrowLeft } from 'lucide-react'
import CircuitPathway from '../components/pathway/CircuitPathway'
import { MODULES } from '../utils/constants'

export default function ModuleView() {
  const { moduleSlug } = useParams()
  const navigate = useNavigate()
  const { t } = useTranslation()

  const module = MODULES.find((m) => m.slug === moduleSlug)

  if (!module) {
    navigate('/pathway', { replace: true })
    return null
  }

  const modLessons = module.lessons ?? []
  const unlockedCount = modLessons.filter((l) => l.status === 'unlocked').length

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
        <p className="text-sm text-muted-foreground">{t(`modules.${module.id}.subtitle`)}</p>

        <div className="flex items-center gap-3 mt-4">
          <div className="h-1 flex-1 bg-secondary rounded-full overflow-hidden">
            <div
              className="h-full bg-accent rounded-full transition-all duration-700"
              style={{ width: modLessons.length > 0 ? `${(unlockedCount / modLessons.length) * 100}%` : '0%' }}
            />
          </div>
          <span className="font-mono text-xs text-muted-foreground flex-shrink-0">
            {unlockedCount} / {modLessons.length}
          </span>
        </div>
      </div>

      {/* Circuit-board micro-pathway */}
      <CircuitPathway lessons={modLessons} />
    </div>
  )
}
