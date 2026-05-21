import { useEffect, useRef } from 'react'
import { X, Lock } from 'lucide-react'
import { useTranslation } from 'react-i18next'
import useStore from '../../store/useStore'
import { BADGE_DEFS } from '../../utils/badges'

export default function AchievementsModal({ onClose }) {
  const { t } = useTranslation()
  const badges = useStore((s) => s.badges)
  const overlayRef = useRef(null)

  useEffect(() => {
    const handleKey = (e) => { if (e.key === 'Escape') onClose() }
    document.addEventListener('keydown', handleKey)
    return () => document.removeEventListener('keydown', handleKey)
  }, [onClose])

  return (
    <div
      ref={overlayRef}
      onClick={(e) => { if (e.target === overlayRef.current) onClose() }}
      className="fixed inset-0 z-50 flex items-center justify-center bg-background/80 backdrop-blur-sm px-4"
    >
      <div className="glass-strong rounded-2xl border border-hairline w-full max-w-md shadow-2xl overflow-hidden">

        {/* Header */}
        <div className="flex items-center justify-between border-b border-hairline px-6 py-4">
          <div>
            <h2 className="font-mono text-base font-bold text-foreground">
              🏆 {t('badges.title')}
            </h2>
            <p className="font-mono text-[10px] uppercase tracking-[0.22em] text-muted-foreground mt-0.5">
              {t('badges.subtitle')}
            </p>
          </div>
          <button
            onClick={onClose}
            className="grid h-8 w-8 place-items-center rounded-lg text-muted-foreground hover:text-foreground hover:bg-secondary/60 transition-colors"
          >
            <X size={16} />
          </button>
        </div>

        {/* Badge grid */}
        <div className="grid grid-cols-2 gap-3 p-5">
          {BADGE_DEFS.map((def) => {
            const unlocked = badges.includes(def.id)
            const Icon = def.icon
            return (
              <div
                key={def.id}
                className={`relative rounded-xl border p-4 flex flex-col items-center gap-2.5 text-center transition-all ${
                  unlocked
                    ? `${def.borderActive} ${def.bgActive}`
                    : 'border-hairline bg-secondary/20 opacity-60 grayscale'
                }`}
              >
                {/* Icon */}
                <div className={`grid h-12 w-12 place-items-center rounded-xl ${
                  unlocked ? `${def.bgActive} ring-1 ${def.borderActive}` : 'bg-secondary/40 ring-1 ring-hairline'
                }`}>
                  <Icon
                    size={22}
                    className={unlocked ? def.color : 'text-muted-foreground'}
                    strokeWidth={1.8}
                  />
                </div>

                {/* Name */}
                <div>
                  <p className={`font-mono text-xs font-bold ${unlocked ? def.color : 'text-muted-foreground'}`}>
                    {def.emoji} {t(`badges.${def.id}.name`)}
                  </p>
                  <p className="font-mono text-[10px] text-muted-foreground mt-0.5 leading-tight">
                    {unlocked
                      ? t(`badges.${def.id}.desc`)
                      : t(`badges.${def.id}.req`)}
                  </p>
                </div>

                {/* Lock indicator */}
                {!unlocked && (
                  <div className="absolute top-2 right-2">
                    <Lock size={11} className="text-muted-foreground/60" strokeWidth={2} />
                  </div>
                )}

                {/* Unlocked glow */}
                {unlocked && (
                  <div
                    aria-hidden
                    className="pointer-events-none absolute inset-0 rounded-xl opacity-20"
                    style={{ boxShadow: `inset 0 0 20px var(${def.glowVar})` }}
                  />
                )}
              </div>
            )
          })}
        </div>

        {/* Footer count */}
        <div className="border-t border-hairline px-6 py-3 text-center">
          <span className="font-mono text-[10px] uppercase tracking-[0.22em] text-muted-foreground">
            {badges.length} / {BADGE_DEFS.length} {t('badges.unlocked')}
          </span>
        </div>
      </div>
    </div>
  )
}
