import { useState } from 'react'
import { CheckCircle2, XCircle, Hexagon, Home } from 'lucide-react'
import { motion, AnimatePresence } from 'framer-motion'
import useStore from '../../store/useStore'
import useLives from '../../hooks/useLives'
import { MAX_TOKENS } from '../../utils/constants'

export default function KnowledgeCheckView({ questions, lessonId, lang, onPass, onOutOfTokens }) {
  const lives    = useStore((s) => s.lives)
  const setLives = useStore((s) => s.setLives)
  const { submitQuizAnswer } = useLives()

  const [qIndex,     setQIndex]     = useState(0)
  const [selected,   setSelected]   = useState(null)
  const [result,     setResult]     = useState(null)
  const [submitting, setSubmitting] = useState(false)
  const [shakeIdx,   setShakeIdx]   = useState(null)

  const q       = questions[qIndex]
  const options = JSON.parse(q.options_json)
  const qText   = lang === 'ro' ? q.question_ro : q.question_en
  const explainText = result
    ? (lang === 'ro' ? result.explanation_ro : result.explanation_en)
    : null

  const isMock    = q.id?.toString().startsWith('mock')
  const isOutOfTokens = lives === 0 && result && !result.correct
  const isLastQ   = qIndex + 1 >= questions.length

  const handleSubmit = async () => {
    if (selected === null || submitting || result) return
    setSubmitting(true)

    let data
    if (isMock) {
      const correct = selected === q.correct_index
      data = {
        correct,
        correct_index: q.correct_index,
        explanation_en: q.explanation_en,
        explanation_ro: q.explanation_ro,
        lives_remaining: correct ? lives : Math.max(0, lives - 1),
        xp: 0,
      }
      if (!correct) setLives(Math.max(0, lives - 1))
    } else {
      data = await submitQuizAnswer(lessonId, q.id, selected)
    }

    if (!data) { setSubmitting(false); return }
    setResult(data)
    if (!data.correct) setShakeIdx(selected)
    setSubmitting(false)
  }

  const handleNext = () => {
    if (isLastQ) {
      onPass()
    } else {
      setQIndex((i) => i + 1)
      setSelected(null)
      setResult(null)
    }
  }

  const handleRetry = () => {
    setSelected(null)
    setResult(null)
  }

  return (
    <div className="max-w-2xl mx-auto mt-4 pb-10">

      {/* ── Header strip ──────────────────────────────────────────── */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <p className="font-mono text-[10px] uppercase tracking-[0.28em] text-accent">
            &gt;_ system knowledge check
          </p>
          <p className="font-mono text-[11px] text-muted-foreground mt-0.5">
            question {qIndex + 1} / {questions.length}
          </p>
        </div>

        {/* Live token display */}
        <div className="inline-flex items-center gap-1.5 rounded-md glass px-2.5 py-1.5">
          <Hexagon size={13} className="text-primary fill-primary/30" strokeWidth={2.5} />
          <span className="font-mono text-xs font-bold text-foreground">
            {lives}/{MAX_TOKENS}
          </span>
        </div>
      </div>

      {/* Progress bar */}
      <div className="flex gap-1.5 mb-8">
        {questions.map((_, i) => (
          <div
            key={i}
            className={`h-0.5 flex-1 rounded-full transition-colors duration-300 ${
              i < qIndex ? 'bg-accent' : 'bg-muted'
            }`}
          />
        ))}
      </div>

      {/* ── Main card ─────────────────────────────────────────────── */}
      <div className="relative glass-strong rounded-2xl overflow-hidden">

        {/* Out-of-tokens fatal overlay */}
        {isOutOfTokens && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="absolute inset-0 z-50 flex flex-col items-center justify-center gap-4 bg-background/90 backdrop-blur-md rounded-2xl text-center p-8"
          >
            <div
              className="font-mono text-xl sm:text-2xl font-black text-destructive"
              style={{ textShadow: '0 0 30px var(--destructive)' }}
            >
              &gt;_ FATAL: OUT OF TOKENS
            </div>
            <p className="text-sm text-muted-foreground">
              You have no 💠 Tokens remaining. Earn them back by answering community questions.
            </p>
            <button
              onClick={onOutOfTokens}
              className="inline-flex items-center gap-2 rounded-md bg-destructive/20 border border-destructive/50 text-destructive font-mono text-sm font-bold uppercase tracking-[0.12em] px-6 py-3 hover:bg-destructive/30 transition-all mt-2"
            >
              <Home size={14} />
              Return to Dashboard
            </button>
          </motion.div>
        )}

        <div className="p-6 sm:p-8 space-y-6">

          {/* Question */}
          <AnimatePresence mode="wait">
            <motion.div
              key={qIndex}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.18, ease: 'easeOut' }}
            >
              <p className="text-lg sm:text-xl font-semibold text-foreground leading-relaxed">
                {qText}
              </p>
            </motion.div>
          </AnimatePresence>

          {/* Options */}
          <div className="space-y-2.5">
            {options.map((opt, i) => {
              const label      = lang === 'ro' ? opt.ro : opt.en
              const isSelected = selected === i
              const isCorrect  = result && i === result.correct_index
              const isWrong    = result && isSelected && !result.correct

              return (
                <motion.button
                  key={i}
                  onClick={() => !result && setSelected(i)}
                  animate={shakeIdx === i ? { x: [0, -10, 10, -8, 8, -4, 4, 0] } : {}}
                  transition={{ duration: 0.4, ease: 'easeOut' }}
                  onAnimationComplete={() => shakeIdx === i && setShakeIdx(null)}
                  whileTap={!result ? { scale: 0.98 } : {}}
                  disabled={!!result}
                  className={`w-full text-left px-5 py-3.5 rounded-xl border font-mono text-sm transition-all ${
                    isCorrect
                      ? 'border-success bg-success/10 text-success shadow-[0_0_20px_-6px_var(--success)]'
                      : isWrong
                        ? 'border-destructive bg-destructive/10 text-destructive'
                        : isSelected
                          ? 'border-accent bg-accent/10 text-accent'
                          : 'border-hairline bg-muted/20 text-foreground hover:border-accent hover:shadow-[0_0_20px_-10px_var(--glow-accent)] hover:bg-accent/5'
                  } disabled:cursor-not-allowed`}
                >
                  <span className="opacity-50 mr-3 text-xs">{String.fromCharCode(65 + i)}.</span>
                  {label}
                  {isCorrect && (
                    <CheckCircle2 size={14} className="inline ml-2 mb-0.5" />
                  )}
                  {isWrong && (
                    <XCircle size={14} className="inline ml-2 mb-0.5" />
                  )}
                </motion.button>
              )
            })}
          </div>

          {/* Explanation panel */}
          <AnimatePresence>
            {result && (
              <motion.div
                initial={{ opacity: 0, y: -6 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0 }}
                className={`flex items-start gap-3 p-4 rounded-xl text-sm ${
                  result.correct
                    ? 'bg-success/10 text-success border border-success/20'
                    : 'bg-destructive/10 text-destructive border border-destructive/20'
                }`}
              >
                {result.correct
                  ? <CheckCircle2 size={16} className="flex-shrink-0 mt-0.5" />
                  : <XCircle     size={16} className="flex-shrink-0 mt-0.5" />
                }
                <div>
                  <p className="font-bold font-mono text-xs uppercase tracking-wider mb-1">
                    {result.correct ? '✓ Correct' : '✗ Wrong answer'}
                  </p>
                  <p className="leading-relaxed opacity-90">{explainText}</p>
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          {/* ── Footer button ──────────────────────────────────────── */}
          <div className="pt-2">
            {!result && (
              <button
                onClick={handleSubmit}
                disabled={selected === null || submitting}
                className={`w-full inline-flex items-center justify-center gap-2 rounded-md font-mono text-sm font-bold uppercase tracking-[0.12em] py-3.5 transition-all ${
                  selected !== null
                    ? 'bg-accent text-accent-foreground hover:shadow-[0_0_30px_-6px_var(--glow-accent)]'
                    : 'bg-secondary text-muted-foreground cursor-not-allowed opacity-60'
                }`}
              >
                {submitting ? '...' : '> Submit Answer'}
              </button>
            )}

            {result && result.correct && (
              <button
                onClick={handleNext}
                className="w-full inline-flex items-center justify-center gap-2 rounded-md bg-success text-success-foreground font-mono text-sm font-bold uppercase tracking-[0.12em] py-3.5 hover:shadow-[0_0_30px_-6px_var(--success)] transition-all"
              >
                <CheckCircle2 size={15} />
                {isLastQ ? '> Complete Lesson' : '> Next Question'}
              </button>
            )}

            {result && !result.correct && !isOutOfTokens && (
              <button
                onClick={handleRetry}
                className="w-full inline-flex items-center justify-center gap-2 rounded-md border border-hairline bg-background/40 text-muted-foreground font-mono text-sm font-bold uppercase tracking-[0.12em] py-3.5 hover:border-accent hover:text-accent transition-all"
              >
                &gt; Try Again
              </button>
            )}
          </div>

        </div>
      </div>
    </div>
  )
}
