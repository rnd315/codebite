import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { useTranslation } from 'react-i18next'

export default function TerminalBoot({ onComplete }) {
  const { t } = useTranslation()
  const [visibleLines, setVisibleLines] = useState([])
  const [showWelcome, setShowWelcome] = useState(false)

  useEffect(() => {
    const lines = [
      t('boot.line1'),
      t('boot.line2'),
      t('boot.line3'),
      t('boot.line4'),
    ]

    let i = 0
    const interval = setInterval(() => {
      i++
      setVisibleLines(lines.slice(0, i))
      if (i >= lines.length) {
        clearInterval(interval)
        setTimeout(() => {
          setShowWelcome(true)
          setTimeout(onComplete, 800)
        }, 500)
      }
    }, 600)

    return () => clearInterval(interval)
  }, [])

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0, scale: 0.98 }}
      transition={{ duration: 0.4, ease: 'easeInOut' }}
      className="fixed inset-0 z-50 bg-background flex flex-col items-center justify-center px-6"
    >
      <div className="w-full max-w-lg space-y-2">
        {visibleLines.map((line, i) => (
          <p
            key={i}
            className={`font-mono text-sm tracking-wide ${
              i === visibleLines.length - 1 && line === t('boot.line4')
                ? 'text-success'
                : 'text-muted-foreground'
            }`}
          >
            {line}
            {i === visibleLines.length - 1 && (
              <span className="ml-1 inline-block h-3.5 w-px bg-accent animate-pulse" />
            )}
          </p>
        ))}

        {showWelcome && (
          <p className="font-mono text-xl font-bold text-accent mt-4 tracking-[0.12em]">
            {t('boot.welcome')}
          </p>
        )}
      </div>
    </motion.div>
  )
}
