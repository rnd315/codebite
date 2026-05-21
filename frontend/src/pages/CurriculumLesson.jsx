import { useEffect, useRef, useState, useMemo } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { ArrowLeft, ChevronRight } from 'lucide-react'
import ReactMarkdown from 'react-markdown'
import client from '../api/client'
import useStore from '../store/useStore'
import LearningControls from '../components/lesson/LearningControls'
import CurriculumQuiz from '../components/lesson/CurriculumQuiz'
import MarkdownCodeBlock from '../components/lesson/MarkdownCodeBlock'

// Split cascade markdown into sectors: prose → code block → post-code prose.
// Code fences are never split; surrounding text is one sector each.
function splitIntoSectors(md) {
  if (!md) return []
  const lines = md.split('\n')
  const sectors = []
  let current = []
  let inCode = false

  for (const line of lines) {
    if (line.startsWith('```')) {
      if (inCode) {
        current.push(line)
        sectors.push(current.join('\n'))
        current = []
        inCode = false
      } else {
        if (current.some((l) => l.trim())) {
          sectors.push(current.join('\n').trim())
          current = []
        }
        inCode = true
        current.push(line)
      }
    } else {
      current.push(line)
    }
  }
  if (current.some((l) => l.trim())) sectors.push(current.join('\n').trim())
  return sectors.filter(Boolean)
}

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

function TheoryBlock({ md }) {
  return (
    <article className="prose prose-sm sm:prose dark:prose-invert max-w-none
      prose-code:text-accent prose-code:bg-secondary/40 prose-code:px-1.5 prose-code:py-0.5 prose-code:rounded
      prose-pre:bg-transparent prose-pre:p-0 prose-pre:border-0">
      <ReactMarkdown components={markdownComponents}>{md}</ReactMarkdown>
    </article>
  )
}

export default function CurriculumLesson() {
  const { lessonId } = useParams()
  const navigate = useNavigate()

  const lang = useStore((s) => s.lang)
  const codeLang = useStore((s) => s.codeLang)
  const learningProtocol = useStore((s) => s.learningProtocol) ?? 'architect'
  const addXp = useStore((s) => s.addXp)
  const checkAndUpdateDailyStreak = useStore((s) => s.checkAndUpdateDailyStreak)
  const addCompletedCurriculumLesson = useStore((s) => s.addCompletedCurriculumLesson)

  const [lesson, setLesson] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  // Phase state: 'pages' | 'cascade' | 'quiz' | 'done'
  const [phase, setPhase] = useState('pages')
  const [pageIndex, setPageIndex] = useState(0)
  const [revealedCount, setRevealedCount] = useState(1)
  const [quizDone, setQuizDone] = useState(false)

  const [elapsedSec, setElapsedSec] = useState(0)
  const timerRef = useRef(null)
  const lastSectorRef = useRef(null)

  useEffect(() => {
    client.get(`/curriculum/${lessonId}`)
      .then(({ data }) => setLesson(data))
      .catch(() => setError(true))
      .finally(() => setLoading(false))
  }, [lessonId])

  // Background timer from mount
  useEffect(() => {
    timerRef.current = setInterval(() => setElapsedSec((s) => s + 1), 1000)
    return () => clearInterval(timerRef.current)
  }, [])

  // Resolve theory content — supports both new {pages, cascade} and legacy flat string
  const theoryContent = lesson?.theory?.[lang]?.[codeLang]?.[learningProtocol]
  const isObject = theoryContent && typeof theoryContent === 'object'
  const pages = useMemo(() => (isObject ? (theoryContent.pages ?? []) : []), [theoryContent, isObject])
  const cascadeText = isObject ? (theoryContent.cascade ?? '') : (theoryContent ?? '')
  const isStub = lesson?.status === 'stub' || (!cascadeText && pages.length === 0)

  const sectors = useMemo(() => splitIntoSectors(cascadeText), [cascadeText])

  // Reset all phase state when the theory variant changes (lang / tech / style toggle)
  useEffect(() => {
    setPhase(pages.length > 0 ? 'pages' : 'cascade')
    setPageIndex(0)
    setRevealedCount(1)
  }, [theoryContent, pages.length])

  const handleNextPage = () => {
    if (pageIndex < pages.length - 1) {
      setPageIndex((i) => i + 1)
    } else {
      setPhase('cascade')
    }
  }

  const handleRevealNext = () => {
    setRevealedCount((c) => c + 1)
    setTimeout(() => {
      lastSectorRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' })
    }, 60)
  }

  const allSectorsRevealed = revealedCount >= sectors.length

  const handleComplete = () => {
    clearInterval(timerRef.current)
    addCompletedCurriculumLesson(lessonId)
    checkAndUpdateDailyStreak()   // streak +1 only if first lesson today
    addXp(10)                      // XP_PER_LESSON
    setQuizDone(true)
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center py-20 text-muted-foreground font-mono text-sm">
        // loading...
      </div>
    )
  }
  if (error || !lesson) {
    return <p className="text-center text-destructive py-10 font-mono text-sm">// lesson not found</p>
  }

  return (
    <div className="py-6 max-w-2xl mx-auto space-y-6">
      {/* Back */}
      <button
        onClick={() => navigate(-1)}
        className="flex items-center gap-1 text-sm text-muted-foreground hover:text-accent transition-colors font-mono"
      >
        <ArrowLeft size={14} />
        back
      </button>

      {/* Lesson ID + Controls */}
      <p className="font-mono text-[9px] text-muted-foreground uppercase tracking-[0.2em]">{lessonId}</p>
      <LearningControls />

      {isStub ? (
        <div className="glass-strong rounded-2xl p-5 sm:p-6 text-center py-10 space-y-2">
          <p className="font-mono text-xs text-muted-foreground uppercase tracking-[0.18em]">// content_pending</p>
          <p className="text-sm text-muted-foreground">This lesson is being authored. Check back soon.</p>
        </div>
      ) : (
        <>
          {/* ── PHASE: PAGES (Duolingo-style micro-slides) ─────────────────── */}
          {phase === 'pages' && pages.length > 0 && (
            <div className="glass-strong rounded-2xl p-5 sm:p-6 space-y-5 sector-fade-in">
              {/* Progress dots */}
              <div className="flex gap-1.5 justify-center">
                {pages.map((_, i) => (
                  <span
                    key={i}
                    className={`h-1 rounded-full transition-all duration-300 ${
                      i <= pageIndex ? 'w-6 bg-accent' : 'w-3 bg-secondary'
                    }`}
                  />
                ))}
              </div>

              <TheoryBlock md={pages[pageIndex]} />

              <button
                onClick={handleNextPage}
                className="w-full flex items-center justify-center gap-2 bg-accent text-accent-foreground
                           font-mono text-xs font-bold uppercase tracking-[0.12em] rounded-md px-5 py-3
                           hover:shadow-[0_0_40px_-4px_var(--glow-accent)] transition-all"
              >
                {pageIndex < pages.length - 1 ? (
                  <><ChevronRight size={14} /> NEXT</>
                ) : (
                  <>{'>'} START DEEP DIVE</>
                )}
              </button>
            </div>
          )}

          {/* ── PHASE: CASCADE (progressive sector reveal) ─────────────────── */}
          {(phase === 'cascade' || phase === 'quiz') && (
            <div className="glass-strong rounded-2xl p-5 sm:p-6 space-y-4">
              {sectors.slice(0, revealedCount).map((sector, i) => (
                <div
                  key={`${cascadeText.slice(0, 12)}-${i}`}
                  className="sector-fade-in"
                  ref={i === revealedCount - 1 ? lastSectorRef : null}
                >
                  <TheoryBlock md={sector} />
                  {i < revealedCount - 1 && <hr className="border-hairline mt-4" />}
                </div>
              ))}

              {!allSectorsRevealed && (
                <button
                  onClick={handleRevealNext}
                  className="w-full font-mono text-xs text-accent uppercase tracking-[0.18em]
                             border border-accent/30 rounded px-4 py-2.5
                             hover:bg-accent/10 transition-colors"
                >
                  {'>'} COMPILING NEXT SECTOR...
                </button>
              )}
            </div>
          )}

          {/* ── PHASE: QUIZ (after all sectors revealed) ────────────────────── */}
          {allSectorsRevealed && (phase === 'cascade' || phase === 'quiz') && !quizDone && (
            <CurriculumQuiz quiz={lesson.quiz} onComplete={handleComplete} />
          )}

          {/* ── DONE ─────────────────────────────────────────────────────────── */}
          {quizDone && (
            <div className="text-center py-4">
              <p className="font-mono text-xs text-success uppercase tracking-[0.18em] mb-3">
                // lesson_archived
              </p>
              <button
                onClick={() => navigate(-1)}
                className="bg-accent text-accent-foreground font-mono text-xs font-bold uppercase tracking-[0.12em] rounded-md px-5 py-3 hover:shadow-[0_0_40px_-4px_var(--glow-accent)] transition-all"
              >
                {'>'} back_to_module
              </button>
            </div>
          )}
        </>
      )}
    </div>
  )
}
