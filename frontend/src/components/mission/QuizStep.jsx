import { useState } from 'react'
import { useTranslation } from 'react-i18next'
import { motion, AnimatePresence } from 'framer-motion'
import useStore from '../../store/useStore'

export default function QuizStep({ questions, onComplete, onExit }) {
  const { t, i18n } = useTranslation()
  const lang = i18n.language?.startsWith('ro') ? 'ro' : 'en'
  const lives = useStore((s) => s.lives)
  const setLives = useStore((s) => s.setLives)

  const question = questions[0]
  const options = JSON.parse(question.options_json)

  const [selected, setSelected] = useState(null)
  const [submitted, setSubmitted] = useState(false)
  const [result, setResult] = useState(null) // 'correct' | 'wrong'
  const [passed, setPassed] = useState(false)
  const [outOfTokens, setOutOfTokens] = useState(false)

  const handleSubmit = () => {
    if (selected === null) return
    const correct = selected === question.correct_index
    if (correct) {
      setResult('correct')
      setPassed(true)
    } else {
      const newLives = Math.max(0, lives - 1)
      setLives(newLives)
      setResult('wrong')
      if (newLives === 0) setOutOfTokens(true)
    }
    setSubmitted(true)
  }

  const handleRetry = () => {
    setSelected(null)
    setSubmitted(false)
    setResult(null)
  }

  const questionText = lang === 'ro' ? question.question_ro : question.question_en
  const explanation = lang === 'ro' ? question.explanation_ro : question.explanation_en

  const optionClass = (i) => {
    const base = 'w-full text-left px-4 py-3 rounded-xl border font-mono text-sm transition-all'
    if (!submitted) {
      return `${base} ${selected === i
        ? 'border-accent bg-accent/10 text-accent'
        : 'border-hairline text-foreground hover:border-accent/50'}`
    }
    if (i === question.correct_index) return `${base} border-success bg-success/10 text-success`
    if (i === selected && result === 'wrong') return `${base} border-destructive bg-destructive/10 text-destructive`
    return `${base} border-hairline text-muted-foreground opacity-50`
  }

  return (
    <div className="relative space-y-4">
      {/* OUT OF TOKENS overlay */}
      <AnimatePresence>
        {outOfTokens && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="absolute inset-0 z-10 flex flex-col items-center justify-center gap-4 rounded-xl bg-background/90 backdrop-blur-sm"
          >
            <p className="font-mono font-black text-lg text-destructive tracking-[0.1em]">
              OUT OF TOKENS
            </p>
            <button
              onClick={onExit}
              className="bg-accent text-accent-foreground font-mono text-xs font-bold uppercase tracking-[0.12em] rounded-md px-5 py-3 hover:shadow-[0_0_40px_-4px_var(--glow-accent)] transition-all"
            >
              {t('mission.returnToDashboard')}
            </button>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Token count */}
      <p className="font-mono text-xs text-muted-foreground">
        💠 {lives} / 5 TOKENS
      </p>

      {/* Question */}
      <p className="text-foreground text-base leading-relaxed">{questionText}</p>

      {/* Options */}
      <div className="space-y-2">
        {options.map((opt, i) => (
          <button
            key={i}
            onClick={() => !submitted && setSelected(i)}
            disabled={submitted}
            className={optionClass(i)}
          >
            {lang === 'ro' ? opt.ro : opt.en}
          </button>
        ))}
      </div>

      {/* Explanation */}
      <AnimatePresence>
        {submitted && (
          <motion.div
            initial={{ opacity: 0, y: -4 }}
            animate={{ opacity: 1, y: 0 }}
            className="glass p-3 rounded-xl font-mono text-sm text-muted-foreground"
          >
            {explanation}
          </motion.div>
        )}
      </AnimatePresence>

      {/* CTAs */}
      {!submitted && (
        <button
          onClick={handleSubmit}
          disabled={selected === null}
          className="bg-accent text-accent-foreground font-mono text-xs font-bold uppercase tracking-[0.12em] rounded-md px-5 py-3 hover:shadow-[0_0_40px_-4px_var(--glow-accent)] transition-all disabled:opacity-40 disabled:cursor-not-allowed"
        >
          Submit
        </button>
      )}
      {submitted && result === 'wrong' && !outOfTokens && (
        <button
          onClick={handleRetry}
          className="font-mono text-xs font-bold uppercase tracking-[0.12em] rounded-md px-5 py-3 border border-hairline text-muted-foreground hover:border-accent hover:text-accent transition-all"
        >
          &gt; TRY AGAIN
        </button>
      )}
      {passed && (
        <button
          onClick={onComplete}
          className="bg-accent text-accent-foreground font-mono text-xs font-bold uppercase tracking-[0.12em] rounded-md px-5 py-3 hover:shadow-[0_0_40px_-4px_var(--glow-accent)] transition-all"
        >
          {t('mission.returnToDashboard')}
        </button>
      )}
    </div>
  )
}
