import { useState } from 'react'
import useStore from '../../store/useStore'

export default function CurriculumQuiz({ quiz, onComplete }) {
  const lang = useStore((s) => s.lang)
  const [selected, setSelected] = useState(null)
  const [submitted, setSubmitted] = useState(false)

  if (!quiz?.question_ro) return null

  const question = lang === 'ro' ? quiz.question_ro : quiz.question_en
  const options = lang === 'ro' ? (quiz.options_ro ?? []) : (quiz.options_en ?? [])
  const explanation = lang === 'ro' ? quiz.explanation_ro : quiz.explanation_en
  const isCorrect = submitted && selected === quiz.correctAnswerIndex

  const handleSubmit = () => {
    if (selected === null) return
    setSubmitted(true)
    if (selected === quiz.correctAnswerIndex) {
      onComplete?.()
    }
  }

  const handleRetry = () => {
    setSelected(null)
    setSubmitted(false)
  }

  return (
    <div className="glass-strong rounded-2xl p-5 space-y-4">
      <p className="font-mono text-[10px] uppercase tracking-[0.18em] text-accent">
        // knowledge_check
      </p>
      <p className="text-sm font-semibold text-foreground">{question}</p>

      <div className="space-y-2">
        {options.map((opt, idx) => {
          let cls = 'w-full text-left px-4 py-2.5 rounded-lg border text-sm font-mono transition-colors '
          if (!submitted) {
            cls += selected === idx
              ? 'border-accent bg-accent/10 text-accent'
              : 'border-hairline bg-secondary/40 text-foreground hover:border-accent/60'
          } else if (idx === quiz.correctAnswerIndex) {
            cls += 'border-success bg-success/10 text-success'
          } else if (idx === selected) {
            cls += 'border-destructive bg-destructive/10 text-destructive'
          } else {
            cls += 'border-hairline bg-secondary/20 text-muted-foreground opacity-50'
          }
          return (
            <button key={idx} className={cls} onClick={() => !submitted && setSelected(idx)}>
              {String.fromCharCode(65 + idx)}. {opt}
            </button>
          )
        })}
      </div>

      {submitted && (
        <p className="text-xs text-muted-foreground bg-secondary/40 rounded-lg px-4 py-3">
          {explanation}
        </p>
      )}

      {!submitted ? (
        <button
          disabled={selected === null}
          onClick={handleSubmit}
          className="bg-accent text-accent-foreground font-mono text-xs font-bold uppercase tracking-[0.12em] rounded-md px-5 py-3 hover:shadow-[0_0_40px_-4px_var(--glow-accent)] transition-all disabled:opacity-40 disabled:cursor-not-allowed"
        >
          {'>'} Submit
        </button>
      ) : !isCorrect ? (
        <button
          onClick={handleRetry}
          className="font-mono text-xs uppercase tracking-[0.18em] text-muted-foreground hover:text-foreground transition-colors"
        >
          {'>'} retry
        </button>
      ) : null}
    </div>
  )
}
