import { useState } from 'react'
import { useTranslation } from 'react-i18next'
import Button from '../ui/Button'

export default function AnswerForm({ onSubmit, submitLabel }) {
  const { t } = useTranslation()
  const [body, setBody] = useState('')
  const [submitting, setSubmitting] = useState(false)

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (!body.trim()) return
    setSubmitting(true)
    await onSubmit(body.trim())
    setBody('')
    setSubmitting(false)
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-2">
      <textarea
        value={body}
        onChange={(e) => setBody(e.target.value)}
        placeholder={t('community.answerPlaceholder')}
        rows={3}
        className="w-full bg-background border border-hairline rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-accent resize-none font-mono text-foreground placeholder:text-muted-foreground"
      />
      <Button type="submit" disabled={!body.trim() || submitting} size="sm">
        {submitting ? '...' : (submitLabel ?? t('community.answer'))}
      </Button>
    </form>
  )
}
