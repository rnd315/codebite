import { useState } from 'react'
import { useTranslation } from 'react-i18next'
import { Sparkles, BatteryFull, MessageSquare, ArrowUpRight } from 'lucide-react'
import client from '../../api/client'
import useStore from '../../store/useStore'
import AnswerCard from './AnswerCard'
import AnswerForm from './AnswerForm'

export default function QuestionCard({ question, onAnswerAccepted }) {
  const { t } = useTranslation()
  const user = useStore((s) => s.user)
  const [expanded, setExpanded] = useState(false)
  const [answers, setAnswers] = useState(null)
  const [loading, setLoading] = useState(false)

  const toggle = async () => {
    if (!expanded && answers === null) {
      setLoading(true)
      try {
        const { data } = await client.get(`/community/questions/${question.id}/answers`)
        setAnswers(data)
      } finally {
        setLoading(false)
      }
    }
    setExpanded((p) => !p)
  }

  const handlePostAnswer = async (body) => {
    const { data } = await client.post(`/community/answers/${question.id}`, { body })
    setAnswers((prev) => [...(prev ?? []), data])
  }

  const handleAccept = async (answerId) => {
    const { data } = await client.patch(`/community/answers/${answerId}/accept`)
    setAnswers((prev) => prev.map((a) => (a.id === answerId ? data : a)))
    onAnswerAccepted?.()
  }

  const isPython = question.body?.toLowerCase().includes('python')
    || question.body?.toLowerCase().includes('.py')
  const langBadge = isPython ? 'PY' : 'C++'
  const repAmount = Math.max(4, (question.answer_count ?? 0) * 3 + 4)

  return (
    <div className="group relative overflow-hidden rounded-xl border border-hairline bg-background/60 transition-all hover:border-accent/50 hover:shadow-[0_0_30px_-10px_var(--glow-accent)]">

      {/* macOS title bar */}
      <div className="flex items-center gap-1.5 px-3 py-2 bg-secondary/40 border-b border-hairline">
        <span className="h-2 w-2 rounded-full bg-destructive/70" />
        <span className="h-2 w-2 rounded-full bg-streak/70" />
        <span className="h-2 w-2 rounded-full bg-accent/70" />
        <span className="font-mono text-[9px] uppercase tracking-[0.18em] text-muted-foreground ml-2 flex-1 truncate">
          ~/THREADS/{question.author_username?.toUpperCase()}
        </span>
        <span className={`font-mono text-[9px] uppercase tracking-wide font-bold ${
          isPython ? 'text-accent' : 'text-primary'
        }`}>
          {langBadge}
        </span>
      </div>

      {/* Body — clickable toggle */}
      <button onClick={toggle} className="w-full text-left p-4">
        <p className="font-mono text-[11px] text-accent mb-1.5">
          $ {question.author_username}
        </p>
        <p className="font-mono text-sm font-bold text-foreground mb-1.5 text-left">
          &gt; {question.body}
        </p>
        <p className="text-[11px] leading-relaxed text-muted-foreground line-clamp-2 pl-4">
          {question.body}
        </p>
      </button>

      {/* Expanded answers section */}
      {expanded && (
        <div className="px-4 pb-4 space-y-3 border-t border-hairline pt-3">
          {loading && (
            <p className="font-mono text-xs text-muted-foreground">{t('common.loading')}</p>
          )}
          {answers !== null && answers.length === 0 && (
            <p className="font-mono text-xs text-muted-foreground">// No fixes yet — be the first.</p>
          )}
          {answers?.map((a) => (
            <AnswerCard
              key={a.id}
              answer={a}
              questionAuthorId={question.user_id}
              onAccept={handleAccept}
            />
          ))}
          <AnswerForm onSubmit={handlePostAnswer} submitLabel=">_ Debug & Earn" />
        </div>
      )}

      {/* Footer */}
      <div className="flex items-center justify-between px-4 py-2.5 border-t border-hairline font-mono text-[10px] uppercase tracking-[0.15em]">
        <div className="flex items-center gap-3 text-muted-foreground">
          <span className="inline-flex items-center gap-1">
            <MessageSquare size={12} /> {question.answer_count}
          </span>
          <span className="inline-flex items-center gap-1 text-primary">
            <BatteryFull size={12} /> +{repAmount}
          </span>
        </div>
        <button
          onClick={toggle}
          className="inline-flex items-center gap-1 rounded-md bg-accent px-3 py-1.5 text-[11px] font-bold uppercase tracking-[0.1em] text-accent-foreground transition-all hover:shadow-[0_0_20px_-4px_var(--glow-accent)]"
        >
          &gt;_ {t('community.debugEarn')}
          <ArrowUpRight size={12} strokeWidth={3} />
        </button>
      </div>
    </div>
  )
}
