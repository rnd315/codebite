import { useEffect, useState } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import ReactMarkdown from 'react-markdown'
import { ArrowLeft } from 'lucide-react'
import MarkdownCodeBlock from '../components/lesson/MarkdownCodeBlock'
import AlgorithmView from '../components/lesson/AlgorithmView'
import ConceptView from '../components/lesson/ConceptView'
import KnowledgeCheckView from '../components/lesson/KnowledgeCheckView'
import client from '../api/client'
import useStore from '../store/useStore'
import Button from '../components/ui/Button'
import Badge from '../components/ui/Badge'
import AlgorithmVisualizer from '../components/visualizer/AlgorithmVisualizer'
import { MODULES } from '../utils/constants'
import { BADGE_DEFS } from '../utils/badges'
import LessonStepper from '../components/mission/LessonStepper'
import { LESSON_FLOWS, LESSON_QUIZ_FALLBACK } from '../utils/lessonFlows'

export default function Lesson() {
  const { slug } = useParams()
  const { t } = useTranslation()
  const navigate = useNavigate()
  const lang = useStore((s) => s.lang)
  const { setXp, setStreak, unlockBadge, badges } = useStore()

  const [lesson, setLesson] = useState(null)
  const [loading, setLoading] = useState(true)
  const [completing, setCompleting] = useState(false)
  const [error, setError] = useState(null)
  const [phase, setPhase] = useState('learning') // 'learning' | 'quiz'

  useEffect(() => {
    client.get(`/lessons/${slug}`)
      .then(({ data }) => setLesson(data))
      .catch(() => setError(t('common.error')))
      .finally(() => setLoading(false))
  }, [slug, t])

  const handleComplete = async () => {
    if (completing) return
    setCompleting(true)
    try {
      await client.post(`/progress/${lesson.id}`, { score: 100, attempts: 1 })
      const [{ data: me }, { data: progress }] = await Promise.all([
        client.get('/auth/me'),
        client.get('/progress'),
      ])
      setXp(me.xp)
      setStreak(me.streak)

      // Badge: first ever lesson completion
      unlockBadge('FIRST_PATCH')

      // Badge: all MOD_01 (basics) lessons completed
      const { data: allLessons } = await client.get('/lessons')
      const completedIds = new Set(progress.filter((p) => p.completed).map((p) => p.lesson_id))
      completedIds.add(lesson.id) // include current lesson just completed
      const mod01Lessons = allLessons.filter((l) => l.category === 'basics')
      if (mod01Lessons.length > 0 && mod01Lessons.every((l) => completedIds.has(l.id))) {
        unlockBadge('FOUNDATIONS_MASTER')
      }
    } catch {
      // mark complete even on API error so user isn't stuck
    } finally {
      setCompleting(false)
    }
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center py-20 text-muted-foreground">{t('common.loading')}</div>
    )
  }
  if (error || !lesson) {
    return <p className="text-center text-destructive py-10">{error ?? t('common.error')}</p>
  }

  const title = lang === 'ro' ? lesson.title_ro : lesson.title_en
  const content = lang === 'ro' ? lesson.content_ro : lesson.content_en

  // Shared markdown renderer
  const markdownComponents = {
    code({ className, children, ...props }) {
      const isBlock = /language-/.test(className || '')
      if (isBlock) {
        return <MarkdownCodeBlock className={className}>{children}</MarkdownCodeBlock>
      }
      return (
        <code className="text-accent bg-secondary/40 px-1.5 py-0.5 rounded text-sm font-mono" {...props}>
          {children}
        </code>
      )
    },
  }

  const articleNode = (
    <article className="prose prose-sm sm:prose dark:prose-invert max-w-none
      prose-code:text-accent prose-code:bg-secondary/40 prose-code:px-1.5 prose-code:py-0.5 prose-code:rounded
      prose-pre:bg-transparent prose-pre:p-0 prose-pre:border-0">
      <ReactMarkdown components={markdownComponents}>{content}</ReactMarkdown>
    </article>
  )

  const moduleLabel = MODULES.find((m) => m.categories.includes(lesson.category))?.label
    ?? lesson.category.toUpperCase()

  const quizQuestions = lesson.quiz_questions?.length
    ? lesson.quiz_questions
    : (LESSON_QUIZ_FALLBACK[lesson.slug] ?? [])

  // ── Lesson flow: multi-step stepper for interactive lessons ──────
  const flow = LESSON_FLOWS[lesson.slug]
  if (flow) {
    return (
      <div className="py-6">
        <LessonStepper
          steps={flow}
          lessonId={lesson.id}
          onComplete={async () => { await handleComplete(); navigate('/pathway') }}
          onExit={() => navigate('/pathway')}
        />
      </div>
    )
  }

  // ── Quiz phase (gated knowledge check) ────────────────────────────
  if (phase === 'quiz') {
    return (
      <div className="py-6">
        <KnowledgeCheckView
          questions={quizQuestions}
          lessonId={lesson.id}
          lang={lang}
          onPass={async () => { await handleComplete(); navigate('/pathway') }}
          onOutOfTokens={() => navigate('/pathway')}
        />
      </div>
    )
  }

  const advanceToQuiz = () => {
    if (quizQuestions.length === 0) {
      handleComplete().then(() => navigate('/pathway'))
    } else {
      setPhase('quiz')
    }
  }

  // ── ConceptView: theory-only lessons (no visualizer) ───────────────
  if (!lesson.has_visualizer) {
    return (
      <div className="py-0">
        <ConceptView
          moduleLabel={moduleLabel}
          lessonTitle={title}
          theory={articleNode}
          onContinue={advanceToQuiz}
          onBack={() => navigate('/pathway')}
        />
      </div>
    )
  }

  // ── AlgorithmView: lessons with visualizer ─────────────────────────
  const completeNode = (
    <div className="pt-2 pb-4">
      <Button onClick={advanceToQuiz} variant="success" className="w-full">
        {t('lesson.markComplete')}
      </Button>
    </div>
  )

  const theoryNode = (
    <div className="space-y-6">
      {articleNode}
      {completeNode}
    </div>
  )

  const visualizerNode = <AlgorithmVisualizer lessonSlug={lesson.slug} />

  return (
    <div className="py-6 space-y-4">
      <div className="flex items-start gap-4">
        <button
          onClick={() => navigate('/pathway')}
          className="flex items-center gap-1 text-sm text-muted-foreground hover:text-accent transition-colors mt-1"
        >
          <ArrowLeft size={16} />
          {t('lesson.back')}
        </button>
      </div>

      <div className="space-y-2">
        <div className="flex items-center gap-2 flex-wrap">
          <Badge label={lesson.category} type={lesson.category} />
          <span className="text-xs text-accent font-mono">⚡ visualizer</span>
        </div>
        <h1 className="text-2xl sm:text-3xl font-bold">{title}</h1>
      </div>

      <AlgorithmView theory={theoryNode} visualizer={visualizerNode} />
    </div>
  )
}
