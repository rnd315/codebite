import { useEffect, useState } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { ArrowLeft } from 'lucide-react'
import ReactMarkdown from 'react-markdown'
import client from '../api/client'
import useStore from '../store/useStore'
import LearningControls from '../components/lesson/LearningControls'
import CurriculumQuiz from '../components/lesson/CurriculumQuiz'
import MarkdownCodeBlock from '../components/lesson/MarkdownCodeBlock'

export default function CurriculumLesson() {
  const { lessonId } = useParams()
  const navigate = useNavigate()

  const lang = useStore((s) => s.lang)
  const codeLang = useStore((s) => s.codeLang)
  const learningProtocol = useStore((s) => s.learningProtocol) ?? 'architect'

  const [lesson, setLesson] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [quizDone, setQuizDone] = useState(false)

  useEffect(() => {
    client.get(`/curriculum/${lessonId}`)
      .then(({ data }) => setLesson(data))
      .catch(() => setError(true))
      .finally(() => setLoading(false))
  }, [lessonId])

  if (loading) {
    return <div className="flex items-center justify-center py-20 text-muted-foreground font-mono text-sm">// loading...</div>
  }
  if (error || !lesson) {
    return <p className="text-center text-destructive py-10 font-mono text-sm">// lesson not found</p>
  }

  // Resolve theory block: theory[lang][codeLang][learningProtocol]
  const theoryBlock = lesson.theory?.[lang]?.[codeLang]?.[learningProtocol] ?? ''
  const isStub = lesson.status === 'stub' || !theoryBlock

  const markdownComponents = {
    code({ className, children, ...props }) {
      const isBlock = /language-/.test(className || '')
      if (isBlock) return <MarkdownCodeBlock className={className}>{children}</MarkdownCodeBlock>
      return (
        <code className="text-accent bg-secondary/40 px-1.5 py-0.5 rounded text-sm font-mono" {...props}>
          {children}
        </code>
      )
    },
  }

  return (
    <div className="py-6 max-w-2xl mx-auto space-y-6">
      {/* Back navigation */}
      <button
        onClick={() => navigate(-1)}
        className="flex items-center gap-1 text-sm text-muted-foreground hover:text-accent transition-colors font-mono"
      >
        <ArrowLeft size={14} />
        back
      </button>

      {/* Lesson ID badge */}
      <p className="font-mono text-[9px] text-muted-foreground uppercase tracking-[0.2em]">
        {lessonId}
      </p>

      {/* Learning controls — tech + style selectors */}
      <LearningControls />

      {/* Theory content */}
      <div className="glass-strong rounded-2xl p-5 sm:p-6">
        {isStub ? (
          <div className="text-center py-10 space-y-2">
            <p className="font-mono text-xs text-muted-foreground uppercase tracking-[0.18em]">
              // content_pending
            </p>
            <p className="text-sm text-muted-foreground">
              This lesson is being authored. Check back soon.
            </p>
          </div>
        ) : (
          <article className="prose prose-sm sm:prose dark:prose-invert max-w-none
            prose-code:text-accent prose-code:bg-secondary/40 prose-code:px-1.5 prose-code:py-0.5 prose-code:rounded
            prose-pre:bg-transparent prose-pre:p-0 prose-pre:border-0">
            <ReactMarkdown components={markdownComponents}>{theoryBlock}</ReactMarkdown>
          </article>
        )}
      </div>

      {/* Quiz — only show if theory has content */}
      {!isStub && !quizDone && (
        <CurriculumQuiz quiz={lesson.quiz} onComplete={() => setQuizDone(true)} />
      )}

      {quizDone && (
        <div className="text-center py-4">
          <p className="font-mono text-xs text-success uppercase tracking-[0.18em] mb-3">
            // module_complete
          </p>
          <button
            onClick={() => navigate(-1)}
            className="bg-accent text-accent-foreground font-mono text-xs font-bold uppercase tracking-[0.12em] rounded-md px-5 py-3 hover:shadow-[0_0_40px_-4px_var(--glow-accent)] transition-all"
          >
            {'>'} back_to_module
          </button>
        </div>
      )}
    </div>
  )
}
