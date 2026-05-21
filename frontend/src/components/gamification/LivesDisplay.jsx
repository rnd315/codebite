import { useTranslation } from 'react-i18next'
import useStore from '../../store/useStore'
import { MAX_TOKENS } from '../../utils/constants'

export default function LivesDisplay() {
  const { t } = useTranslation()
  const lives = useStore((s) => s.lives)

  return (
    <span
      className="font-mono text-sm font-bold text-accent"
      title={`${lives} ${t('gamification.lives')}`}
    >
      💠 {lives}/{MAX_TOKENS}
    </span>
  )
}
