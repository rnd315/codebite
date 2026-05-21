import { useTranslation } from 'react-i18next'
import { CheckCircle2 } from 'lucide-react'
import useStore from '../../store/useStore'
import Button from '../ui/Button'

export default function AnswerCard({ answer, questionAuthorId, onAccept }) {
  const { t } = useTranslation()
  const user = useStore((s) => s.user)
  const isQuestionAuthor = user?.id === questionAuthorId
  const canAccept = isQuestionAuthor && !answer.accepted

  return (
    <div
      className={`p-3 rounded-lg border text-sm ${
        answer.accepted
          ? 'border-success/30 bg-success/10'
          : 'border-hairline'
      }`}
    >
      <p className="text-foreground whitespace-pre-wrap">{answer.body}</p>
      <div className="mt-2 flex items-center justify-between">
        <span className="text-xs text-muted-foreground">
          {t('community.postedBy')} <span className="font-medium">{answer.author_username}</span>
        </span>
        <div className="flex items-center gap-2">
          {answer.accepted && (
            <span className="flex items-center gap-1 text-xs text-success font-medium">
              <CheckCircle2 size={13} /> {t('community.accepted')}
            </span>
          )}
          {canAccept && (
            <Button variant="success" size="sm" onClick={() => onAccept(answer.id)}>
              {t('community.markUseful')}
            </Button>
          )}
        </div>
      </div>
    </div>
  )
}
