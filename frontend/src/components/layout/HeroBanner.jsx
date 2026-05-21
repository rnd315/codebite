import { useNavigate } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import { ArrowRight, Zap, Sparkles, Bot } from 'lucide-react'
import useStore from '../../store/useStore'

export default function HeroBanner({ lessons = [], completedCount = 0, currentLesson = null }) {
  const navigate = useNavigate()
  const { t } = useTranslation()
  const { xp, streak, lang } = useStore()

  const currentTitle = currentLesson
    ? (lang === 'ro' ? currentLesson.title_ro : currentLesson.title_en)
    : null

  const handleResume = () => {
    if (currentLesson) navigate(`/lesson/${currentLesson.slug}`)
  }

  return (
    <div className="relative overflow-hidden rounded-3xl glass-strong border border-accent/20 p-6 sm:p-8 mb-8">

      {/* Subtle corner tint — accent, right side only */}
      <div
        aria-hidden
        className="absolute -right-16 -top-16 h-48 w-48 rounded-full opacity-20 blur-3xl pointer-events-none"
        style={{ background: 'radial-gradient(closest-side, var(--glow-accent), transparent)' }}
      />

      {/* Content — grid: left text | right CTA (matches Lovable Hero layout) */}
      <div className="relative z-10 grid gap-6 sm:grid-cols-[1fr_auto] sm:items-end">

        <div>
          {/* Eyebrow pill */}
          <div className="inline-flex items-center gap-2 rounded-full glass px-3 py-1 font-mono text-[10px] uppercase tracking-[0.22em] text-muted-foreground mb-4">
            <span className="h-1.5 w-1.5 animate-pulse-soft rounded-full bg-primary" />
            {t('hero.session')}
          </div>

          {/* Headlines */}
          <h1 className="mt-4 font-mono text-3xl sm:text-5xl font-bold leading-[1.05] tracking-tight text-foreground">
            &gt; {t('hero.headline1')}
            <br />
            <span className="text-accent">{t('hero.headline2')}</span>
          </h1>

          {/* Subtitle */}
          <p className="mt-3 max-w-xl text-sm text-muted-foreground sm:text-base leading-relaxed">
            {currentLesson
              ? t('hero.progressText', { completed: completedCount, total: lessons.length, title: currentTitle })
              : t('hero.completedText', { total: lessons.length })}
          </p>

          {/* Stat chips */}
          <div className="mt-5 flex flex-wrap items-center gap-2 font-mono text-[11px]">
            <span className="inline-flex items-center gap-1.5 rounded-full glass px-2.5 py-1 uppercase tracking-[0.18em] text-muted-foreground">
              <Zap size={12} className="text-primary" />
              {xp.toLocaleString()} {t('hero.xpWeek')}
            </span>
            <span className="inline-flex items-center gap-1.5 rounded-full glass px-2.5 py-1 uppercase tracking-[0.18em] text-muted-foreground">
              <Sparkles size={12} className="text-primary" />
              {streak}D {t('hero.dayStreak')}
            </span>
            <span className="inline-flex items-center gap-1.5 rounded-full glass px-2.5 py-1 uppercase tracking-[0.18em] text-muted-foreground">
              <Bot size={12} className="text-primary" />
              {t('hero.tutor')}
            </span>
          </div>
        </div>

        {/* CTA — right column of grid */}
        {currentLesson && (
          <button
            onClick={handleResume}
            className="group inline-flex items-center gap-2 self-start rounded-md bg-accent px-5 py-3 font-mono text-sm font-bold uppercase tracking-[0.12em] text-accent-foreground transition-all hover:gap-3 hover:shadow-[0_0_40px_-4px_var(--glow-accent)]"
          >
            &gt;_ {t('hero.resumeBtn')}
            <ArrowRight size={16} className="transition-transform group-hover:translate-x-0.5" strokeWidth={3} />
          </button>
        )}

      </div>
    </div>
  )
}
