import { useState } from 'react'
import { ArrowLeft, Hexagon, ChevronRight, ChevronLeft } from 'lucide-react'
import { motion, AnimatePresence } from 'framer-motion'
import useStore from '../../store/useStore'
import { MAX_TOKENS } from '../../utils/constants'

const DEFAULT_SNIPPET = '____ age = 17;'
const DEFAULT_OPTIONS = [
  { label: 'int',    isCorrect: true  },
  { label: 'string', isCorrect: false },
  { label: 'bool',   isCorrect: false },
]

const SLIDE = {
  initial:    { opacity: 0, x: 20 },
  animate:    { opacity: 1, x: 0  },
  exit:       { opacity: 0, x: -20 },
  transition: { duration: 0.18, ease: 'easeOut' },
}

export default function ConceptView({
  moduleLabel = 'MOD_01 // FOUNDATIONS',
  lessonTitle  = 'Data Types: The Building Blocks',
  theory,
  quiz,
  snippet = DEFAULT_SNIPPET,
  options = DEFAULT_OPTIONS,
  onContinue,
  onBack,
}) {
  const lives = useStore((s) => s.lives)

  const [step,     setStep]     = useState(1)
  const [selected, setSelected] = useState(null)
  const [checked,  setChecked]  = useState(false)

  const isCorrect   = selected !== null && options[selected]?.isCorrect
  const displayWord = selected !== null ? options[selected].label : null

  const goNext = () => { setStep(2); setSelected(null); setChecked(false) }
  const goBack = () => { setStep(1); setSelected(null); setChecked(false) }

  const handlePick = (i) => {
    setSelected(i)
    setChecked(false)
  }

  const handleRunCheck = () => {
    setChecked(true)
    if (isCorrect) {
      setTimeout(() => onContinue?.(), 420)
    }
  }

  return (
    <div className="py-8">

      {/* ── Context strip ─────────────────────────────────────────────── */}
      <div className="flex items-center justify-between mb-6">
        <button
          onClick={onBack}
          className="inline-flex items-center gap-1.5 font-mono text-sm text-muted-foreground hover:text-accent transition-colors"
        >
          <ArrowLeft size={14} strokeWidth={2.5} />
          return
        </button>

        <span className="font-mono text-[11px] uppercase tracking-[0.22em] text-muted-foreground hidden sm:block">
          {moduleLabel}
        </span>

        <div className="inline-flex items-center gap-1.5 rounded-md glass px-2.5 py-1.5">
          <Hexagon size={13} className="text-primary fill-primary/30" strokeWidth={2.5} />
          <span className="font-mono text-xs font-bold text-foreground">
            {lives}/{MAX_TOKENS}
          </span>
        </div>
      </div>

      {/* ── Centered column ───────────────────────────────────────────── */}
      <div className="max-w-3xl mx-auto">

        {/* Progress bar — 3 segments */}
        <div className="flex gap-1.5 mb-8">
          {[1, 2, 3].map((s) => (
            <div
              key={s}
              className={`h-0.5 flex-1 rounded-full transition-colors duration-300 ${
                step >= s ? 'bg-accent' : 'bg-muted'
              }`}
            />
          ))}
        </div>

        {/* Title */}
        <div className="mb-8">
          <p className="font-mono text-[10px] uppercase tracking-[0.28em] text-accent mb-3">
            ~/concept · step {step} of 2
          </p>
          <h1
            className="font-mono text-3xl sm:text-4xl font-black tracking-tight text-accent leading-tight"
            style={{ textShadow: '0 0 40px var(--glow-accent)' }}
          >
            {lessonTitle}
          </h1>
        </div>

        {/* ── Slide card ────────────────────────────────────────────── */}
        <div className="glass-strong rounded-2xl overflow-hidden">

          {/* Card body — animated */}
          <div className="p-6 sm:p-8 min-h-[280px] flex flex-col">
            <AnimatePresence mode="wait">

              {step === 1 && (
                <motion.div key="step-1" {...SLIDE} className="flex-1 flex flex-col">

                  {/* Step 1 — Theory */}
                  <div className="flex-1 space-y-5">
                    <p className="font-mono text-[10px] uppercase tracking-[0.22em] text-muted-foreground">
                      ~/theory
                    </p>
                    <p className="text-base sm:text-lg leading-[1.8] text-foreground">
                      Think of a variable as a{' '}
                      <span className="text-accent font-semibold">labeled box</span>{' '}
                      in your computer's memory. It has a name, a type, and a value — just like a
                      box with a label that can only hold a specific kind of item.
                    </p>
                    {theory && (
                      <div className="text-sm leading-relaxed text-muted-foreground border-l-2 border-hairline pl-4">
                        {theory}
                      </div>
                    )}
                  </div>

                  {/* Step 1 footer */}
                  <div className="flex items-center justify-between mt-8 pt-5 border-t border-hairline">
                    <button
                      onClick={onContinue}
                      className="font-mono text-sm text-muted-foreground hover:text-foreground transition-colors"
                    >
                      skip
                    </button>
                    <button
                      onClick={goNext}
                      className="inline-flex items-center gap-2 rounded-md bg-accent text-accent-foreground font-mono text-sm font-bold uppercase tracking-[0.12em] px-5 py-2.5 hover:shadow-[0_0_30px_-6px_var(--glow-accent)] transition-all"
                    >
                      &gt; Next Step
                      <ChevronRight size={14} strokeWidth={3} />
                    </button>
                  </div>

                </motion.div>
              )}

              {step === 2 && (
                <motion.div key="step-2" {...SLIDE} className="flex-1 flex flex-col">

                  {/* Step 2 — Interactive */}
                  <div className="flex-1 space-y-6">
                    <p className="font-mono text-[10px] uppercase tracking-[0.22em] text-muted-foreground">
                      ~/interactive
                    </p>
                    <p className="text-base sm:text-lg leading-[1.8] text-foreground">
                      Let's create a box for your age.{' '}
                      <span className="text-muted-foreground text-sm">
                        Pick the correct data type:
                      </span>
                    </p>

                    {/* Code snippet */}
                    <div className="rounded-xl overflow-hidden border border-hairline bg-background">
                      <div className="flex items-center gap-1.5 px-3 py-2 bg-secondary/40 border-b border-hairline">
                        <span className="h-1.5 w-1.5 rounded-full bg-destructive/70" />
                        <span className="h-1.5 w-1.5 rounded-full bg-streak/70" />
                        <span className="h-1.5 w-1.5 rounded-full bg-accent/70" />
                        <span className="font-mono text-[9px] uppercase tracking-[0.18em] text-muted-foreground ml-2">
                          ~/snippet.cpp
                        </span>
                      </div>
                      <pre className="p-5 font-mono text-base sm:text-lg leading-relaxed select-none">
                        <code>
                          <span
                            className={
                              displayWord === null
                                ? 'text-accent underline decoration-dashed underline-offset-4 decoration-accent/50'
                                : checked && isCorrect
                                  ? 'text-success'
                                  : checked && !isCorrect
                                    ? 'text-destructive'
                                    : 'text-accent'
                            }
                          >
                            {displayWord ?? '____'}
                          </span>
                          <span className="text-foreground">
                            {snippet.replace('____', '')}
                          </span>
                        </code>
                      </pre>
                    </div>

                    {/* Pill buttons */}
                    <div className="flex flex-wrap gap-3 justify-center">
                      {options.map((opt, i) => (
                        <motion.button
                          key={opt.label}
                          onClick={() => handlePick(i)}
                          whileTap={{ scale: 0.93 }}
                          className={`rounded-full border px-5 py-2 font-mono text-sm font-bold transition-all ${
                            selected === i
                              ? checked && opt.isCorrect
                                ? 'border-success bg-success/15 text-success shadow-[0_0_20px_-6px_var(--glow-accent)]'
                                : checked && !opt.isCorrect
                                  ? 'border-destructive bg-destructive/15 text-destructive'
                                  : 'border-accent bg-accent/10 text-accent'
                              : 'border-hairline text-muted-foreground hover:border-accent hover:text-accent hover:bg-accent/10'
                          }`}
                        >
                          {opt.label}
                        </motion.button>
                      ))}
                    </div>

                    {/* Feedback */}
                    <AnimatePresence>
                      {checked && (
                        <motion.p
                          initial={{ opacity: 0, y: -6 }}
                          animate={{ opacity: 1, y: 0 }}
                          exit={{ opacity: 0 }}
                          className={`text-center font-mono text-sm ${isCorrect ? 'text-success' : 'text-destructive'}`}
                        >
                          {isCorrect
                            ? '✓ Correct! int stores whole numbers like age.'
                            : '✗ Not quite — think about what type stores a whole number.'}
                        </motion.p>
                      )}
                    </AnimatePresence>
                  </div>

                  {/* Step 2 footer */}
                  <div className="flex items-center justify-between mt-8 pt-5 border-t border-hairline">
                    <button
                      onClick={goBack}
                      className="inline-flex items-center gap-1.5 font-mono text-sm text-muted-foreground hover:text-foreground transition-colors"
                    >
                      <ChevronLeft size={14} strokeWidth={2.5} />
                      Back
                    </button>
                    <button
                      onClick={selected !== null ? handleRunCheck : undefined}
                      disabled={selected === null}
                      className={`inline-flex items-center gap-2 rounded-md font-mono text-sm font-bold uppercase tracking-[0.12em] px-5 py-2.5 transition-all ${
                        selected !== null
                          ? 'bg-accent text-accent-foreground hover:shadow-[0_0_30px_-6px_var(--glow-accent)]'
                          : 'bg-secondary text-muted-foreground cursor-not-allowed opacity-50'
                      }`}
                    >
                      &gt; Run Check
                    </button>
                  </div>

                </motion.div>
              )}

            </AnimatePresence>
          </div>
        </div>

        {/* Quiz questions (below card, if any) */}
        {quiz && <div className="mt-6">{quiz}</div>}

      </div>
    </div>
  )
}
