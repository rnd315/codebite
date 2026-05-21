import { useEffect, useRef, useState, useMemo } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { ArrowLeft, ChevronLeft, ChevronRight } from 'lucide-react'
import { motion, AnimatePresence } from 'framer-motion'
import ReactMarkdown from 'react-markdown'
import client from '../api/client'
import useStore from '../store/useStore'
import LearningControls from '../components/lesson/LearningControls'
import CurriculumQuiz from '../components/lesson/CurriculumQuiz'
import MarkdownCodeBlock from '../components/lesson/MarkdownCodeBlock'
import VisualizerController from '../components/lesson/VisualizerController'

// ── Sector splitter ────────────────────────────────────────────────────────────
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
        if (current.some((l) => l.trim())) { sectors.push(current.join('\n').trim()); current = [] }
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

// ── Markdown renderer ──────────────────────────────────────────────────────────
const mdComponents = {
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

function Prose({ md }) {
  return (
    <article className="prose prose-sm dark:prose-invert max-w-none
      prose-code:text-accent prose-code:bg-secondary/40 prose-code:px-1.5 prose-code:py-0.5 prose-code:rounded
      prose-pre:bg-transparent prose-pre:p-0 prose-pre:border-0">
      <ReactMarkdown components={mdComponents}>{md}</ReactMarkdown>
    </article>
  )
}

// ── Cyber grid background style (used in right pane) ──────────────────────────
const cyberGrid = {
  background: `
    linear-gradient(rgba(0,242,255,0.035) 1px, transparent 1px),
    linear-gradient(90deg, rgba(0,242,255,0.035) 1px, transparent 1px),
    #0a0a0c
  `,
  backgroundSize: '44px 44px, 44px 44px',
}

const vignette = {
  background: 'radial-gradient(ellipse at center, transparent 35%, rgba(0,0,0,0.75) 100%)',
  pointerEvents: 'none',
}

// ── Main component ─────────────────────────────────────────────────────────────
export default function CurriculumLesson() {
  const { lessonId } = useParams()
  const navigate = useNavigate()

  const lang               = useStore((s) => s.lang)
  const codeLang           = useStore((s) => s.codeLang)
  const learningProtocol   = useStore((s) => s.learningProtocol) ?? 'architect'
  const addXp              = useStore((s) => s.addXp)
  const checkAndUpdateDailyStreak = useStore((s) => s.checkAndUpdateDailyStreak)
  const addCompletedCurriculumLesson = useStore((s) => s.addCompletedCurriculumLesson)

  const [lesson, setLesson]       = useState(null)
  const [loading, setLoading]     = useState(true)
  const [error, setError]         = useState(null)
  const [phase, setPhase]         = useState('slides')  // 'slides'|'cascade'|'quiz'|'done'
  const [pageIndex, setPageIndex] = useState(0)
  const [revealedCount, setRevealedCount] = useState(1)
  const [quizDone, setQuizDone]   = useState(false)
  const [wrongFlash, setWrongFlash] = useState(false)

  const timerRef       = useRef(null)
  const lastSectorRef  = useRef(null)

  useEffect(() => {
    client.get(`/curriculum/${lessonId}`)
      .then(({ data }) => setLesson(data))
      .catch(() => setError(true))
      .finally(() => setLoading(false))
  }, [lessonId])

  useEffect(() => {
    timerRef.current = setInterval(() => {}, 1000)
    return () => clearInterval(timerRef.current)
  }, [])

  // ── Theory resolution ────────────────────────────────────────────────────────
  const theoryContent = lesson?.theory?.[lang]?.[codeLang]?.[learningProtocol]
  const isObject   = theoryContent && typeof theoryContent === 'object'
  const pages      = useMemo(() => (isObject ? (theoryContent.pages ?? []) : []), [theoryContent, isObject])
  const cascadeText = isObject ? (theoryContent.cascade ?? '') : (theoryContent ?? '')
  const isStub     = lesson?.status === 'stub' || (!cascadeText && pages.length === 0)
  const sectors    = useMemo(() => splitIntoSectors(cascadeText), [cascadeText])

  useEffect(() => {
    setPhase(pages.length > 0 ? 'slides' : 'cascade')
    setPageIndex(0)
    setRevealedCount(1)
    setQuizDone(false)
  }, [theoryContent, pages.length])

  const allSectorsRevealed = revealedCount >= sectors.length

  // ── Handlers ─────────────────────────────────────────────────────────────────
  const handleNextPage = () => {
    if (pageIndex < pages.length - 1) setPageIndex((i) => i + 1)
    else setPhase('cascade')
  }

  const handlePrevPage = () => {
    if (pageIndex > 0) setPageIndex((i) => i - 1)
  }

  const handleRevealNext = () => {
    setRevealedCount((c) => c + 1)
    setTimeout(() => lastSectorRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' }), 60)
  }

  const handleWrongAnswer = () => {
    setWrongFlash(true)
    setTimeout(() => setWrongFlash(false), 500)
  }

  const handleComplete = () => {
    clearInterval(timerRef.current)
    addCompletedCurriculumLesson(lessonId)
    checkAndUpdateDailyStreak()
    addXp(10)
    setQuizDone(true)
  }

  // ── Loading / error states ────────────────────────────────────────────────────
  if (loading) {
    return (
      <div className="flex h-full items-center justify-center font-mono text-sm text-muted-foreground">
        // loading...
      </div>
    )
  }
  if (error || !lesson) {
    return <p className="flex h-full items-center justify-center font-mono text-sm text-destructive">// lesson not found</p>
  }

  // ── Render ────────────────────────────────────────────────────────────────────
  return (
    <div className="flex flex-col lg:flex-row h-full overflow-hidden">

      {/* ── LEFT PANE: Learning Engine ─────────────────────────────────────── */}
      <div
        className={`flex-1 lg:w-1/2 overflow-y-auto cyber-scroll ${wrongFlash ? 'glitch' : ''}`}
        style={{ background: 'var(--background)' }}
      >
        <div className="max-w-xl mx-auto px-5 py-6 space-y-5">

          {/* Nav + lesson ID */}
          <div className="flex items-center justify-between">
            <button
              onClick={() => navigate(-1)}
              className="flex items-center gap-1 font-mono text-xs text-muted-foreground hover:text-accent transition-colors"
            >
              <ArrowLeft size={13} /> back
            </button>
            <span className="font-mono text-[9px] text-muted-foreground uppercase tracking-[0.22em]">
              {lessonId}
            </span>
          </div>

          {/* Tech + style toggles */}
          <LearningControls />

          {/* ─ STUB placeholder ─ */}
          {isStub && (
            <div className="glass-strong rounded-2xl p-5 text-center space-y-2 py-12">
              <p className="font-mono text-xs text-muted-foreground uppercase tracking-[0.18em]">// content_pending</p>
              <p className="text-sm text-muted-foreground">This lesson is being authored. Check back soon.</p>
            </div>
          )}

          {/* ─ SLIDES phase ─────────────────────────────────────────────────── */}
          {!isStub && phase === 'slides' && pages.length > 0 && (
            <div className="glass-strong rounded-2xl p-5 space-y-5">
              {/* Progress dots */}
              <div className="flex gap-1.5 justify-center">
                {pages.map((_, i) => (
                  <span key={i} className={`h-1 rounded-full transition-all duration-300 ${
                    i === pageIndex ? 'w-8 bg-accent' : i < pageIndex ? 'w-4 bg-accent/40' : 'w-3 bg-secondary'
                  }`} />
                ))}
              </div>

              {/* Slide with Framer Motion */}
              <AnimatePresence mode="wait">
                <motion.div
                  key={pageIndex}
                  initial={{ opacity: 0, x: 16 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -16 }}
                  transition={{ duration: 0.22 }}
                >
                  <Prose md={pages[pageIndex]} />
                </motion.div>
              </AnimatePresence>

              {/* Slide navigation */}
              <div className="flex items-center gap-3">
                {pageIndex > 0 && (
                  <button
                    onClick={handlePrevPage}
                    className="flex items-center gap-1 font-mono text-xs text-muted-foreground hover:text-foreground
                               border border-hairline rounded px-3 py-2 transition-colors"
                  >
                    <ChevronLeft size={13} /> PREV
                  </button>
                )}
                <button
                  onClick={handleNextPage}
                  className="flex-1 flex items-center justify-center gap-2 bg-accent text-accent-foreground
                             font-mono text-xs font-bold uppercase tracking-[0.12em] rounded-md px-5 py-3
                             hover:shadow-[0_0_40px_-4px_var(--glow-accent)] transition-all"
                >
                  {pageIndex < pages.length - 1
                    ? <><ChevronRight size={13} /> NEXT</>
                    : <>{'>'} START DEEP DIVE</>}
                </button>
              </div>
            </div>
          )}

          {/* ─ CASCADE phase ─────────────────────────────────────────────────── */}
          {!isStub && (phase === 'cascade' || phase === 'quiz') && (
            <div className="glass-strong rounded-2xl p-5 space-y-4">
              {sectors.slice(0, revealedCount).map((sector, i) => (
                <div
                  key={`${cascadeText.slice(0, 10)}-${i}`}
                  className="sector-fade-in"
                  ref={i === revealedCount - 1 ? lastSectorRef : null}
                >
                  <Prose md={sector} />
                  {i < revealedCount - 1 && <hr className="border-hairline my-4" />}
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

          {/* ─ QUIZ phase ─────────────────────────────────────────────────────── */}
          {!isStub && allSectorsRevealed && (phase === 'cascade' || phase === 'quiz') && !quizDone && (
            <CurriculumQuiz
              quiz={lesson.quiz}
              onComplete={handleComplete}
              onWrongAnswer={handleWrongAnswer}
            />
          )}

          {/* ─ DONE ──────────────────────────────────────────────────────────── */}
          {quizDone && (
            <motion.div
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              className="text-center py-6 space-y-3"
            >
              <p className="font-mono text-xs text-success uppercase tracking-[0.18em]">
                // lesson_archived
              </p>
              <button
                onClick={() => navigate(-1)}
                className="bg-accent text-accent-foreground font-mono text-xs font-bold uppercase
                           tracking-[0.12em] rounded-md px-5 py-3
                           hover:shadow-[0_0_40px_-4px_var(--glow-accent)] transition-all"
              >
                {'>'} back_to_module
              </button>
            </motion.div>
          )}
        </div>
      </div>

      {/* ── RIGHT PANE: Visualizer ─────────────────────────────────────────── */}
      <div
        className="hidden lg:flex lg:w-1/2 flex-col relative overflow-hidden"
        style={cyberGrid}
      >
        {/* Vignette overlay */}
        <div className="absolute inset-0 z-0 pointer-events-none" style={vignette} />

        {/* Visualizer content */}
        <div className="relative z-10 flex-1 overflow-hidden">
          <VisualizerController
            interactiveComponent={lesson?.interactiveComponent}
            lang={lang}
            codeLang={codeLang}
            phase={phase}
            revealedCount={revealedCount}
          />
        </div>

        {/* Bottom status strip */}
        <div
          className="relative z-10 flex items-center justify-between px-5 py-2.5 border-t flex-shrink-0"
          style={{ borderColor: 'rgba(0,242,255,0.08)', background: 'rgba(0,0,0,0.4)' }}
        >
          <span className="font-mono text-[9px] uppercase tracking-[0.22em]" style={{ color: '#374151' }}>
            {lesson?.interactiveComponent ?? 'visualizer'}
          </span>
          <span className="font-mono text-[9px]" style={{ color: '#374151' }}>
            {codeLang === 'cpp' ? 'C++' : 'Python'} / {learningProtocol}
          </span>
        </div>
      </div>

    </div>
  )
}
