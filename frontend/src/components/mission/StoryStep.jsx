import { useState, useEffect } from 'react'
import { useTranslation } from 'react-i18next'

export default function StoryStep({ textKey, onUnlock }) {
  const { t } = useTranslation()
  const text = t(textKey)
  const [displayed, setDisplayed] = useState('')

  useEffect(() => {
    onUnlock()
  }, []) // eslint-disable-line react-hooks/exhaustive-deps

  useEffect(() => {
    setDisplayed('')
    let i = 0
    const interval = setInterval(() => {
      i++
      setDisplayed(text.slice(0, i))
      if (i >= text.length) clearInterval(interval)
    }, 40)
    return () => clearInterval(interval)
  }, [text])

  const done = displayed.length >= text.length

  return (
    <div className="glass p-6 rounded-xl font-mono text-sm text-foreground leading-relaxed min-h-[80px] flex items-start">
      <span>{displayed}</span>
      {!done && (
        <span className="inline-block h-3.5 w-px bg-accent animate-pulse ml-0.5 self-center" />
      )}
    </div>
  )
}
