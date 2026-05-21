import { useState } from 'react'
import { useTranslation } from 'react-i18next'
import { CheckCircle2, XCircle } from 'lucide-react'
import useLives from '../../hooks/useLives'
import useStore from '../../store/useStore'
import Button from '../ui/Button'

export default function QuizQuestion({ question, lessonId, index, total, lang }) {
  const { t } = useTranslation()
  const { submitQuizAnswer } = useLives()
  const lives = useStore((s) => s.lives)
  const [selected, setSelected] = useState(null)
  const [result, setResult] = useState(null) // { correct, correct_index, explanation_en, explanation_ro }
  const [submitting, setSubmitting] = useState(false)

  const questionText = lang === 'ro' ? question.question_ro : question.question_en
  const options = JSON.parse(question.options_json)
  const explanation = result
    ? (lang === 'ro' ? result.explanation_ro : result.explanation_en)
    : null

  const handleSubmit = async () => {
    if (selected === null || result || lives === 0) return
    setSubmitting(true)
    const data = await submitQuizAnswer(lessonId, question.id, selected)
    if (data) setResult(data)
    setSubmitting(false)
  }

  return (
    <div className="space-y-3 p-4 rounded-xl glass-strong">
      <p className="text-xs text-muted-foreground font-mono">
        {t('quiz.question')} {index + 1} {t('quiz.of')} {total}
      </p>
      <p className="font-medium text-foreground">{questionText}</p>

      {/* Options */}
      <div className="space-y-2">
        {options.map((opt, i) => {
          const label = lang === 'ro' ? opt.ro : opt.en
          const isSelected = selected === i
          const isCorrect = result && i === result.correct_index
          const isWrong = result && isSelected && !result.correct

          return (
            <button
              key={i}
              disabled={!!result || lives === 0}
              onClick={() => !result && setSelected(i)}
              className={`
                w-full text-left px-4 py-3 rounded-lg border text-sm transition-all
                ${isCorrect
                  ? 'border-success bg-success/10 text-success'
                  : isWrong
                  ? 'border-destructive bg-destructive/10 text-destructive'
                  : isSelected
                  ? 'border-accent bg-accent/10 text-accent'
                  : 'border-hairline hover:border-border text-foreground'
                }
                disabled:cursor-not-allowed
              `}
            >
              <span className="font-mono text-xs mr-2 opacity-60">{String.fromCharCode(65 + i)}.</span>
              {label}
            </button>
          )
        })}
      </div>

      {/* Feedback */}
      {result && (
        <div className={`flex items-start gap-2 p-3 rounded-lg text-sm ${
          result.correct ? 'bg-success/10 text-success' : 'bg-destructive/10 text-destructive'
        }`}>
          {result.correct
            ? <CheckCircle2 size={16} className="flex-shrink-0 mt-0.5" />
            : <XCircle size={16} className="flex-shrink-0 mt-0.5" />
          }
          <div>
            <p className="font-semibold">
              {result.correct ? t('quiz.correct') : t('quiz.wrong')}
            </p>
            <p className="mt-1 opacity-90">{explanation}</p>
          </div>
        </div>
      )}

      {/* No lives warning */}
      {lives === 0 && !result && (
        <p className="text-xs text-destructive">{t('quiz.noLives')}</p>
      )}

      {/* Submit button */}
      {!result && (
        <Button
          onClick={handleSubmit}
          disabled={selected === null || submitting || lives === 0}
          className="w-full"
        >
          {submitting ? '...' : t('quiz.submit')}
        </Button>
      )}
    </div>
  )
}
