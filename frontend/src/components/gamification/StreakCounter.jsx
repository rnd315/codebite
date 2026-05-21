import { useTranslation } from 'react-i18next'
import useStore from '../../store/useStore'

export default function StreakCounter() {
  const { t } = useTranslation()
  const streak = useStore((s) => s.streak)

  return (
    <span
      className="font-mono text-sm font-bold text-streak"
      title={`${streak} ${t('gamification.streak')}`}
    >
      ⚡ {streak}
    </span>
  )
}
