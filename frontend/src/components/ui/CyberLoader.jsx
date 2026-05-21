import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'

const LINES = [
  '>_ LOADING MODULES...',
  '>_ SYNCING PROGRESS...',
  '>_ MOUNTING DASHBOARD...',
]

export default function CyberLoader({ visible }) {
  const [lineIdx, setLineIdx] = useState(0)

  useEffect(() => {
    if (!visible) { setLineIdx(0); return }
    const id = setInterval(() => {
      setLineIdx((i) => (i < LINES.length - 1 ? i + 1 : i))
    }, 500)
    return () => clearInterval(id)
  }, [visible])

  return (
    <AnimatePresence>
      {visible && (
        <motion.div
          initial={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.45, ease: 'easeOut' }}
          className="fixed inset-0 z-50 bg-background flex flex-col items-center justify-center gap-6"
        >
          {/* Spinner */}
          <div className="relative w-14 h-14">
            <div className="absolute inset-0 rounded-full border-2 border-accent/15" />
            <div className="absolute inset-0 rounded-full border-2 border-transparent border-t-accent animate-spin" />
            <div className="absolute inset-[6px] rounded-full border border-accent/10 border-t-primary/40 animate-spin"
              style={{ animationDuration: '1.8s', animationDirection: 'reverse' }}
            />
          </div>

          {/* Status line */}
          <p className="font-mono text-sm text-accent tracking-[0.12em]">
            {LINES[lineIdx]}
            <span className="ml-1 inline-block h-3.5 w-px bg-accent animate-pulse align-middle" />
          </p>
        </motion.div>
      )}
    </AnimatePresence>
  )
}
