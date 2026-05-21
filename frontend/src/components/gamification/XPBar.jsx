import { useTranslation } from 'react-i18next'
import useStore from '../../store/useStore'

const XP_PER_LEVEL = 100

export default function XPBar() {
  const { t } = useTranslation()
  const xp = useStore((s) => s.xp)
  const level = Math.floor(xp / XP_PER_LEVEL) + 1
  const progressInLevel = xp % XP_PER_LEVEL

  return (
    <div className="hidden md:flex items-center gap-2 text-xs" title={`${xp} ${t('gamification.xp')}`}>
      <span className="text-streak font-bold font-mono">Lv.{level}</span>
      <div className="w-20 h-1.5 bg-secondary rounded-full overflow-hidden">
        <div
          className="h-full bg-streak rounded-full transition-all duration-500"
          style={{ width: `${progressInLevel}%` }}
        />
      </div>
    </div>
  )
}
