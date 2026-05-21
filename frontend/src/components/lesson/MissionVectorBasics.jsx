import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'

const GARBAGE_POOL = [
  -858993460, 1074167520, -2147348480,
  6422856, -1647382528, 2686916, 3832912, -1073610752,
]
const CYAN  = '#00f2ff'
const GREEN = '#deff9a'

const GARBAGE_SLOTS = new Set([0, 1, 4])

function deriveStep(phase, revealedCount) {
  if (phase === 'slides') return 0
  return Math.min(revealedCount, 3)
}

// ── Single Car ─────────────────────────────────────────────────────────────────
function Car({ idx, step, isCpp, garbageTick }) {
  const showGarbage = isCpp && step >= 1 && GARBAGE_SLOTS.has(idx)
  const isInserted  = idx === 2 && step >= 2
  const powered     = step >= 1
  const crashed     = step >= 3

  const garbageVal = GARBAGE_POOL[(garbageTick + idx * 3) % GARBAGE_POOL.length]

  const borderColor = crashed
    ? 'rgba(239,68,68,0.55)'
    : showGarbage
    ? 'rgba(239,68,68,0.50)'
    : isInserted
    ? '#00f2ff66'
    : powered
    ? 'rgba(0,242,255,0.25)'
    : 'rgba(0,242,255,0.07)'

  const bg = showGarbage
    ? 'rgba(239,68,68,0.07)'
    : isInserted
    ? 'rgba(0,242,255,0.07)'
    : powered
    ? 'rgba(0,242,255,0.03)'
    : 'rgba(0,0,0,0.2)'

  return (
    <div className="flex flex-col items-center">
      {/* Index chip */}
      <span
        className="font-mono text-[11px] font-bold mb-1"
        style={{ color: powered ? CYAN : 'rgba(0,242,255,0.12)' }}
      >
        [{idx}]
      </span>

      {/* Connector line */}
      <div
        className="w-px h-3"
        style={{ background: powered ? 'rgba(0,242,255,0.35)' : 'rgba(0,242,255,0.05)' }}
      />

      {/* Car box */}
      <motion.div
        className="w-24 h-24 rounded-xl border-2 flex items-center justify-center overflow-hidden"
        style={{ background: bg, borderColor }}
        animate={
          isInserted && step === 2
            ? {
                boxShadow: [
                  '0 0 0px #00f2ff00',
                  '0 0 28px #00f2ff77',
                  '0 0 14px #00f2ff44',
                  '0 0 28px #00f2ff77',
                  '0 0 8px #00f2ff30',
                ],
              }
            : {}
        }
        transition={{ duration: 1.2 }}
      >
        {showGarbage ? (
          <span className="font-mono text-xs font-bold text-red-400 text-center leading-tight px-1 select-none">
            {garbageVal}
          </span>
        ) : isInserted ? (
          <AnimatePresence mode="wait">
            <motion.span
              key="inserted"
              initial={{ y: -32, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ type: 'spring', stiffness: 220, damping: 15 }}
              className="font-mono text-3xl font-black"
              style={{ color: GREEN, textShadow: `0 0 16px ${GREEN}88` }}
            >
              77
            </motion.span>
          </AnimatePresence>
        ) : (
          <span
            className="font-mono text-xl font-semibold"
            style={{ color: powered ? '#4b5563' : '#111827' }}
          >
            {powered ? '0' : '--'}
          </span>
        )}
      </motion.div>
    </div>
  )
}

// ── Ghost Car (index 5 — forbidden zone) ──────────────────────────────────────
function GhostCar() {
  return (
    <motion.div
      className="flex flex-col items-center"
      initial={{ x: 20, opacity: 0 }}
      animate={{ x: 0, opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ delay: 0.25, duration: 0.35 }}
    >
      <span className="font-mono text-[11px] font-bold mb-1 text-red-500">[5]</span>
      <div className="w-px h-3 bg-red-500/30" />
      <div
        className="w-24 h-24 rounded-xl border-2 border-dashed flex items-center justify-center"
        style={{ borderColor: 'rgba(239,68,68,0.35)', background: 'rgba(239,68,68,0.04)' }}
      >
        <span className="font-mono text-sm text-red-500/50">???</span>
      </div>
    </motion.div>
  )
}

// ── Crash Overlay ──────────────────────────────────────────────────────────────
function CrashOverlay() {
  const [settled, setSettled] = useState(false)

  useEffect(() => {
    const id = setTimeout(() => setSettled(true), 900)
    return () => clearTimeout(id)
  }, [])

  return (
    <motion.div
      className="absolute inset-0 z-20 flex flex-col items-center justify-center gap-3"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.1 }}
      style={{ background: settled ? 'rgba(220,38,38,0.13)' : 'rgba(220,38,38,0.22)' }}
    >
      <motion.div
        className="text-center px-8"
        initial={{ scale: 0.72, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ type: 'spring', stiffness: 240, damping: 18, delay: 0.08 }}
      >
        <p
          className="font-mono text-3xl font-black uppercase tracking-widest"
          style={{
            color: '#ef4444',
            textShadow: '0 0 28px rgba(239,68,68,0.9), 0 0 56px rgba(239,68,68,0.4)',
          }}
        >
          CRASH
        </p>
        <p
          className="font-mono text-base font-bold uppercase tracking-[0.14em] mt-1.5"
          style={{
            color: '#fca5a5',
            textShadow: '0 0 18px rgba(239,68,68,0.7)',
          }}
        >
          INDEX OUT OF BOUNDS
        </p>
        <p
          className="font-mono text-xs mt-4 uppercase tracking-[0.18em]"
          style={{ color: 'rgba(239,68,68,0.55)' }}
        >
          v[5] — forbidden memory zone
        </p>
      </motion.div>
    </motion.div>
  )
}

// ── Main Component ─────────────────────────────────────────────────────────────
export default function MissionVectorBasics({ lang, codeLang, phase, revealedCount }) {
  const step    = deriveStep(phase, revealedCount)
  const isCpp   = codeLang !== 'python'
  const crashed = step >= 3

  // Garbage ticker — active only while cars are powered but not crashed
  const [garbageTick, setGarbageTick] = useState(0)
  useEffect(() => {
    if (step < 1 || step >= 3) return
    const id = setInterval(() => setGarbageTick((t) => t + 1), 135)
    return () => clearInterval(id)
  }, [step])

  return (
    <div className="relative h-full flex flex-col items-center justify-center gap-6 p-6 overflow-hidden">

      {/* Crash overlay */}
      <AnimatePresence>
        {crashed && <CrashOverlay key="crash" />}
      </AnimatePresence>

      {/* Header */}
      <div className="flex items-center gap-3 w-full max-w-3xl z-10">
        <span
          className="font-mono text-xs font-bold uppercase tracking-[0.28em]"
          style={{ color: CYAN, opacity: step === 0 ? 0.18 : 0.72 }}
        >
          VECTOR_MONITOR
        </span>
        <div className="flex-1 h-px" style={{ background: 'rgba(0,242,255,0.1)' }} />
        <span className="font-mono text-[10px]" style={{ color: '#374151' }}>
          {isCpp ? 'int v[5]' : 'v = [0]*5'}
        </span>
      </div>

      {/* Cars row */}
      <div className="flex items-start gap-3 z-10">
        {[0, 1, 2, 3, 4].map((idx) => (
          <Car
            key={idx}
            idx={idx}
            step={step}
            isCpp={isCpp}
            garbageTick={garbageTick}
          />
        ))}
        <AnimatePresence>
          {crashed && <GhostCar key="ghost" />}
        </AnimatePresence>
      </div>

      {/* Status message */}
      <div className="z-10 w-full max-w-3xl">
        <AnimatePresence mode="wait">
          {step === 0 && (
            <motion.p key="s0"
              initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
              className="font-mono text-[10px] uppercase tracking-[0.22em] text-center"
              style={{ color: '#1f2937' }}
            >
              // awaiting_init
            </motion.p>
          )}
          {step === 1 && (
            <motion.p key="s1"
              initial={{ opacity: 0, y: 4 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}
              className="font-mono text-[10px] uppercase tracking-[0.16em] text-center"
              style={{ color: isCpp ? '#ef4444' : '#34d399' }}
            >
              {isCpp
                ? '// WARNING: garbage values in uninitialized slots'
                : '// clean init — all slots = 0'}
            </motion.p>
          )}
          {step === 2 && (
            <motion.p key="s2"
              initial={{ opacity: 0, y: 4 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}
              className="font-mono text-[10px] uppercase tracking-[0.16em] text-center"
              style={{ color: GREEN }}
            >
              // v[2] = 77 — slot #2 updated
            </motion.p>
          )}
          {step >= 3 && (
            <motion.p key="s3"
              initial={{ opacity: 0, y: 4 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}
              className="font-mono text-[10px] uppercase tracking-[0.16em] text-center text-red-400"
            >
              // v[5] — index out of bounds — forbidden!
            </motion.p>
          )}
        </AnimatePresence>
      </div>

      {/* Legend */}
      <AnimatePresence>
        {step >= 1 && (
          <motion.div
            key="legend"
            initial={{ opacity: 0 }} animate={{ opacity: 1 }}
            className="flex gap-5 flex-wrap justify-center z-10"
          >
            {isCpp && (
              <div className="flex items-center gap-1.5">
                <div className="w-3 h-3 rounded-sm bg-red-500/60" />
                <span className="font-mono text-[10px] text-red-400/75 uppercase tracking-wider">garbage</span>
              </div>
            )}
            <div className="flex items-center gap-1.5">
              <div className="w-3 h-3 rounded-sm" style={{ background: 'rgba(0,242,255,0.3)' }} />
              <span className="font-mono text-[10px] uppercase tracking-wider" style={{ color: 'rgba(0,242,255,0.55)' }}>
                {isCpp ? 'zeroed' : 'initialized'}
              </span>
            </div>
            {step >= 2 && (
              <motion.div
                initial={{ opacity: 0, x: 6 }} animate={{ opacity: 1, x: 0 }}
                className="flex items-center gap-1.5"
              >
                <div className="w-3 h-3 rounded-sm" style={{ background: `${GREEN}55` }} />
                <span className="font-mono text-[10px] uppercase tracking-wider" style={{ color: `${GREEN}99` }}>
                  assigned
                </span>
              </motion.div>
            )}
          </motion.div>
        )}
      </AnimatePresence>

    </div>
  )
}
