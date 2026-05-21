import { useState } from 'react'
import { useTranslation } from 'react-i18next'
import { motion, AnimatePresence } from 'framer-motion'
import useStore from '../../store/useStore'
import KernelMission from './missions/KernelMission'

const MISSION_COMPONENTS = {
  kernel: KernelMission,
}

export default function InteractiveMissionStep({ missionKey, onUnlock }) {
  const { t } = useTranslation()
  const lives = useStore((s) => s.lives)
  const setLives = useStore((s) => s.setLives)

  const [status, setStatus] = useState('playing')
  const [isShaking, setIsShaking] = useState(false)

  const handleSuccess = () => {
    setStatus('success')
    onUnlock()
  }

  const handleFailure = () => {
    setStatus('failed')
    setIsShaking(true)
    // TODO: PATCH /users/me/lives when endpoint exists
    setLives(Math.max(0, lives - 1))
  }

  const statusColors = {
    playing: 'text-muted-foreground',
    success: 'text-success',
    failed: 'text-destructive',
  }

  const MissionComponent = MISSION_COMPONENTS[missionKey]

  return (
    <motion.div
      animate={isShaking ? { x: [0, -10, 10, -8, 8, -4, 4, 0] } : {}}
      transition={{ duration: 0.4, ease: 'easeOut' }}
      onAnimationComplete={() => isShaking && setIsShaking(false)}
      className="space-y-4"
    >
      {/* Status chip */}
      <span className={`font-mono text-[10px] uppercase tracking-[0.22em] ${statusColors[status]}`}>
        {status}
      </span>

      {/* Mission mini-game */}
      <MissionComponent onSuccess={handleSuccess} onFailure={handleFailure} status={status} />

      {/* Failure message */}
      <AnimatePresence>
        {status === 'failed' && (
          <motion.div
            initial={{ opacity: 0, y: -6 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="font-mono text-sm text-destructive bg-destructive/10 border border-destructive/20 rounded-xl p-4"
          >
            {t('mission.kernel.failMsg')}
          </motion.div>
        )}
      </AnimatePresence>

      {/* Success message */}
      <AnimatePresence>
        {status === 'success' && (
          <motion.div
            initial={{ opacity: 0, y: 6 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="bg-success/10 border border-success/20 rounded-xl p-4 text-center"
          >
            <p
              className="font-mono font-black text-lg text-success tracking-[0.12em]"
              style={{ textShadow: '0 0 24px var(--success)' }}
            >
              {t('mission.kernel.successMsg')}
            </p>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  )
}
