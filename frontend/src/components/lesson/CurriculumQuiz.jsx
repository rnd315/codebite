import { useState } from 'react'
import client from '../../api/client'
import useStore from '../../store/useStore'

function SingleQuestion({ q, onCorrect, onWrong, lang }) {
  const [selected, setSelected] = useState(null)
  const [submitted, setSubmitted] = useState(false)
  const [shakeIdx, setShakeIdx] = useState(null)

  const question    = lang === 'ro' ? q.question_ro : q.question_en
  const options     = lang === 'ro' ? (q.options_ro ?? []) : (q.options_en ?? [])
  const explanation = lang === 'ro' ? q.explanation_ro : q.explanation_en
  const isCorrect   = submitted && selected === q.correctAnswerIndex

  const handleSubmit = () => {
    if (selected === null) return
    setSubmitted(true)
    if (selected === q.correctAnswerIndex) {
      onCorrect()
    } else {
      setShakeIdx(selected)
      onWrong()
      setTimeout(() => setShakeIdx(null), 450)
    }
  }

  const handleRetry = () => {
    setSelected(null)
    setSubmitted(false)
  }

  return (
    <div className="space-y-3">
      <p className="text-sm font-semibold text-foreground">{question}</p>

      <div className="space-y-2">
        {options.map((opt, idx) => {
          let cls = 'w-full text-left px-4 py-2.5 rounded-lg border text-sm font-mono transition-colors '
          if (!submitted) {
            cls += selected === idx
              ? 'border-accent bg-accent/10 text-accent'
              : 'border-hairline bg-secondary/40 text-foreground hover:border-accent/60'
          } else if (idx === q.correctAnswerIndex) {
            cls += 'border-success bg-success/10 text-success'
          } else if (idx === selected) {
            cls += 'border-destructive bg-destructive/10 text-destructive'
          } else {
            cls += 'border-hairline bg-secondary/20 text-muted-foreground opacity-50'
          }
          return (
            <button
              key={idx}
              className={`${cls} ${shakeIdx === idx ? 'shake' : ''}`}
              onClick={() => !submitted && setSelected(idx)}
            >
              {String.fromCharCode(65 + idx)}. {opt}
            </button>
          )
        })}
      </div>

      {submitted && explanation && (
        <p className="text-xs text-muted-foreground bg-secondary/40 rounded-lg px-4 py-3">
          {explanation}
        </p>
      )}

      {!submitted && (
        <button
          disabled={selected === null}
          onClick={handleSubmit}
          className="bg-accent text-accent-foreground font-mono text-xs font-bold uppercase
                     tracking-[0.12em] rounded-md px-5 py-3
                     hover:shadow-[0_0_40px_-4px_var(--glow-accent)] transition-all
                     disabled:opacity-40 disabled:cursor-not-allowed"
        >
          {'>'} Submit
        </button>
      )}

      {submitted && !isCorrect && (
        <button
          onClick={handleRetry}
          className="font-mono text-xs uppercase tracking-[0.18em] text-muted-foreground hover:text-foreground transition-colors"
        >
          {'>'} retry
        </button>
      )}
    </div>
  )
}

export default function CurriculumQuiz({ quiz, onComplete }) {
  const lang      = useStore((s) => s.lang)
  const codeLang  = useStore((s) => s.codeLang)
  const lives     = useStore((s) => s.lives)
  const setLives  = useStore((s) => s.setLives)
  const syncFromUser = useStore((s) => s.syncFromUser)
  const addXp     = useStore((s) => s.addXp)

  const [questionIndex, setQuestionIndex] = useState(0)
  const [showComplete, setShowComplete]   = useState(false)

  // Support both new codeLang-keyed object and legacy flat array
  let questions
  if (Array.isArray(quiz)) {
    questions = quiz
  } else if (quiz && typeof quiz === 'object') {
    questions = quiz[codeLang] ?? quiz.cpp ?? []
  } else {
    questions = []
  }

  if (questions.length === 0) return null

  const currentQ      = questions[questionIndex]
  const isLastQuestion = questionIndex === questions.length - 1

  const handleCorrect = () => {
    addXp(5)  // XP_PER_QUIZ
    if (isLastQuestion) {
      setShowComplete(true)
    } else {
      setTimeout(() => setQuestionIndex((i) => i + 1), 900)
    }
  }

  const handleWrong = () => {
    // Deduct locally for immediate feedback
    setLives(Math.max(0, lives - 1))
    // Sync with backend so community token rewards reflect the real count
    client.post('/auth/me/deduct-token')
      .then(({ data }) => syncFromUser(data))
      .catch(() => {})
  }

  return (
    <div className="glass-strong rounded-2xl p-5 space-y-4">
      <div className="flex items-center justify-between">
        <p className="font-mono text-[10px] uppercase tracking-[0.18em] text-accent">
          // knowledge_check
        </p>
        <p className="font-mono text-[10px] text-muted-foreground">
          {questionIndex + 1} / {questions.length}
        </p>
      </div>

      <div className="h-0.5 bg-secondary rounded-full overflow-hidden">
        <div
          className="h-full bg-accent rounded-full transition-all duration-500"
          style={{ width: `${((questionIndex + (showComplete ? 1 : 0)) / questions.length) * 100}%` }}
        />
      </div>

      {!showComplete && (
        <SingleQuestion
          key={questionIndex}
          q={currentQ}
          lang={lang}
          onCorrect={handleCorrect}
          onWrong={handleWrong}
        />
      )}

      {showComplete && (
        <div className="space-y-3">
          <p className="font-mono text-xs text-success uppercase tracking-[0.18em] text-center">
            // all checks passed
          </p>
          <button
            onClick={onComplete}
            className="w-full bg-success text-white font-mono text-xs font-bold uppercase
                       tracking-[0.12em] rounded-md px-5 py-3
                       hover:shadow-[0_0_40px_-4px_var(--glow-accent)] transition-all"
          >
            {'>'} COMPLETE &amp; ARCHIVE LESSON
          </button>
        </div>
      )}
    </div>
  )
}
