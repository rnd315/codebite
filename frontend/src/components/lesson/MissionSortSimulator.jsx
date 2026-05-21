import { useState, useEffect, useRef } from 'react'
import { motion } from 'framer-motion'

const INITIAL = [8, 3, 5, 1, 9, 2]

const STEPS = [
  { step: 1,  pass: 1, action: 'HIGHLIGHT', indices: [0, 1], state: [8, 3, 5, 1, 9, 2] },
  { step: 2,  pass: 1, action: 'SWAP',      indices: [0, 1], state: [3, 8, 5, 1, 9, 2] },
  { step: 3,  pass: 1, action: 'HIGHLIGHT', indices: [1, 2], state: [3, 8, 5, 1, 9, 2] },
  { step: 4,  pass: 1, action: 'SWAP',      indices: [1, 2], state: [3, 5, 8, 1, 9, 2] },
  { step: 5,  pass: 1, action: 'HIGHLIGHT', indices: [2, 3], state: [3, 5, 8, 1, 9, 2] },
  { step: 6,  pass: 1, action: 'SWAP',      indices: [2, 3], state: [3, 5, 1, 8, 9, 2] },
  { step: 7,  pass: 1, action: 'HIGHLIGHT', indices: [3, 4], state: [3, 5, 1, 8, 9, 2] },
  { step: 8,  pass: 1, action: 'HIGHLIGHT', indices: [4, 5], state: [3, 5, 1, 8, 9, 2] },
  { step: 9,  pass: 1, action: 'SWAP',      indices: [4, 5], state: [3, 5, 1, 8, 2, 9] },
  { step: 10, pass: 1, action: 'LOCK',      indices: [5],    state: [3, 5, 1, 8, 2, 9] },
  { step: 11, pass: 2, action: 'HIGHLIGHT', indices: [0, 1], state: [3, 5, 1, 8, 2, 9] },
  { step: 12, pass: 2, action: 'HIGHLIGHT', indices: [1, 2], state: [3, 5, 1, 8, 2, 9] },
  { step: 13, pass: 2, action: 'SWAP',      indices: [1, 2], state: [3, 1, 5, 8, 2, 9] },
  { step: 14, pass: 2, action: 'HIGHLIGHT', indices: [2, 3], state: [3, 1, 5, 8, 2, 9] },
  { step: 15, pass: 2, action: 'HIGHLIGHT', indices: [3, 4], state: [3, 1, 5, 8, 2, 9] },
  { step: 16, pass: 2, action: 'SWAP',      indices: [3, 4], state: [3, 1, 5, 2, 8, 9] },
  { step: 17, pass: 2, action: 'LOCK',      indices: [4],    state: [3, 1, 5, 2, 8, 9] },
  { step: 18, pass: 3, action: 'HIGHLIGHT', indices: [0, 1], state: [3, 1, 5, 2, 8, 9] },
  { step: 19, pass: 3, action: 'SWAP',      indices: [0, 1], state: [1, 3, 5, 2, 8, 9] },
  { step: 20, pass: 3, action: 'HIGHLIGHT', indices: [1, 2], state: [1, 3, 5, 2, 8, 9] },
  { step: 21, pass: 3, action: 'HIGHLIGHT', indices: [2, 3], state: [1, 3, 5, 2, 8, 9] },
  { step: 22, pass: 3, action: 'SWAP',      indices: [2, 3], state: [1, 3, 2, 5, 8, 9] },
  { step: 23, pass: 3, action: 'LOCK',      indices: [3],    state: [1, 3, 2, 5, 8, 9] },
  { step: 24, pass: 4, action: 'HIGHLIGHT', indices: [0, 1], state: [1, 3, 2, 5, 8, 9] },
  { step: 25, pass: 4, action: 'HIGHLIGHT', indices: [1, 2], state: [1, 3, 2, 5, 8, 9] },
  { step: 26, pass: 4, action: 'SWAP',      indices: [1, 2], state: [1, 2, 3, 5, 8, 9] },
  { step: 27, pass: 4, action: 'LOCK',      indices: [2],    state: [1, 2, 3, 5, 8, 9] },
  { step: 28, pass: 5, action: 'HIGHLIGHT', indices: [0, 1], state: [1, 2, 3, 5, 8, 9] },
  { step: 29, pass: 5, action: 'LOCK',      indices: [1],    state: [1, 2, 3, 5, 8, 9] },
  { step: 30, pass: 5, action: 'LOCK',      indices: [0],    state: [1, 2, 3, 5, 8, 9] },
]

const BAR_MAX_H = 132

function computeState(idx) {
  if (idx < 0) {
    return { arr: INITIAL, action: null, active: new Set(), locked: new Set(), stats: { pass: 0, cmp: 0, swp: 0, lkd: 0 } }
  }
  const step = STEPS[idx]
  const locked = new Set()
  let cmp = 0, swp = 0
  for (let i = 0; i <= idx; i++) {
    const s = STEPS[i]
    if (s.action === 'HIGHLIGHT') cmp++
    if (s.action === 'SWAP') swp++
    if (s.action === 'LOCK') s.indices.forEach(k => locked.add(k))
  }
  const active = (step.action === 'HIGHLIGHT' || step.action === 'SWAP')
    ? new Set(step.indices)
    : new Set()
  return { arr: step.state, action: step.action, active, locked, stats: { pass: step.pass, cmp, swp, lkd: locked.size } }
}

function BarColumn({ val, barIdx, isLocked, isHighlight, isSwapping }) {
  const barH = Math.max(8, Math.round((val / 9) * BAR_MAX_H))

  let borderCls, bgCls, textCls, glowStyle
  if (isLocked) {
    borderCls = 'border-success'
    bgCls     = 'bg-success/20'
    textCls   = 'text-success'
    glowStyle = { boxShadow: '0 0 14px -3px rgba(52, 211, 153, 0.55)' }
  } else if (isSwapping) {
    borderCls = 'border-streak'
    bgCls     = 'bg-streak/20'
    textCls   = 'text-streak'
    glowStyle = { boxShadow: '0 0 18px -3px rgba(251, 191, 36, 0.6)' }
  } else if (isHighlight) {
    borderCls = 'border-accent'
    bgCls     = 'bg-accent/20'
    textCls   = 'text-accent'
    glowStyle = { boxShadow: '0 0 18px -3px var(--glow-accent)' }
  } else {
    borderCls = 'border-accent/30'
    bgCls     = 'bg-accent/10'
    textCls   = 'text-muted-foreground'
    glowStyle = {}
  }

  return (
    <div className="flex flex-col items-center gap-1" style={{ flex: 1, maxWidth: 56, minWidth: 28 }}>
      <span className={`font-mono text-xs font-bold transition-colors duration-200 ${textCls}`}>
        {val}
      </span>
      <motion.div
        animate={{ height: barH }}
        transition={{ type: 'spring', stiffness: 380, damping: 30 }}
        className={`w-full rounded-t border-2 transition-colors duration-200 ${borderCls} ${bgCls}`}
        style={glowStyle}
      />
      <span className="font-mono text-[9px] text-muted-foreground/40">[{barIdx}]</span>
    </div>
  )
}

export default function MissionSortSimulator({ phase }) {
  const [stepIdx, setStepIdx]   = useState(-1)
  const [isPlaying, setIsPlaying] = useState(false)
  const timerRef = useRef(null)

  const isActive = phase !== 'slides'
  const isDone   = stepIdx >= STEPS.length - 1
  const { arr, action, active, locked, stats } = computeState(stepIdx)

  useEffect(() => {
    if (isPlaying && isActive) {
      timerRef.current = setInterval(() => {
        setStepIdx(p => {
          if (p >= STEPS.length - 1) { setIsPlaying(false); return p }
          return p + 1
        })
      }, 500)
    } else {
      clearInterval(timerRef.current)
    }
    return () => clearInterval(timerRef.current)
  }, [isPlaying, isActive])

  useEffect(() => {
    if (!isActive) { setIsPlaying(false); setStepIdx(-1) }
  }, [isActive])

  const handlePlay = () => {
    if (isDone) { setStepIdx(-1); setIsPlaying(true); return }
    setIsPlaying(p => !p)
  }

  const btnBase = 'font-mono text-[9px] sm:text-[10px] uppercase tracking-[0.12em] border border-hairline rounded px-2 py-1.5 text-muted-foreground hover:text-foreground hover:border-accent/40 disabled:opacity-30 disabled:cursor-not-allowed transition-colors'

  return (
    <div className="h-full flex flex-col gap-3 p-4 overflow-hidden select-none">

      {/* Header */}
      <div className="flex items-center gap-2 flex-shrink-0">
        <span className="font-mono text-[10px] uppercase tracking-[0.22em] text-accent/70">SORT_VIZ</span>
        <div className="flex-1 h-px bg-accent/15" />
        <span className="font-mono text-[10px] text-muted-foreground">
          {isDone ? '// SORTED' : stepIdx < 0 ? '// STANDBY' : `PASS ${stats.pass} / 5`}
        </span>
      </div>

      {/* Bar chart */}
      <div className="flex-1 flex items-end justify-center gap-1.5 sm:gap-2.5 px-2 min-h-0">
        {arr.map((val, i) => (
          <BarColumn
            key={i}
            val={val}
            barIdx={i}
            isLocked={locked.has(i)}
            isHighlight={active.has(i) && action === 'HIGHLIGHT'}
            isSwapping={active.has(i) && action === 'SWAP'}
          />
        ))}
      </div>

      {/* Stats panel */}
      <div className="flex-shrink-0 grid grid-cols-4 gap-1 sm:gap-1.5">
        {[
          { lbl: 'PASS',  val: stepIdx < 0 ? '--'       : `${stats.pass}/5` },
          { lbl: 'CMP',   val: stepIdx < 0 ? '--'       : stats.cmp         },
          { lbl: 'SWAP',  val: stepIdx < 0 ? '--'       : stats.swp         },
          { lbl: 'DONE',  val: stepIdx < 0 ? '0/6'     : `${stats.lkd}/6`  },
        ].map(({ lbl, val }) => (
          <div key={lbl} className="glass rounded-xl px-1.5 py-2 text-center">
            <div className="font-mono text-[8px] sm:text-[9px] uppercase tracking-[0.16em] text-muted-foreground">{lbl}</div>
            <div className="font-mono text-sm font-bold text-foreground leading-tight">{val}</div>
          </div>
        ))}
      </div>

      {/* Legend */}
      <div className="flex-shrink-0 flex flex-wrap items-center justify-center gap-x-3 gap-y-1">
        {[
          { cls: 'bg-accent',  label: 'COMPARE' },
          { cls: 'bg-streak',  label: 'SWAP'    },
          { cls: 'bg-success', label: 'LOCKED'  },
        ].map(({ cls, label }) => (
          <div key={label} className="flex items-center gap-1.5">
            <div className={`w-2.5 h-2.5 rounded-sm flex-shrink-0 ${cls}`} />
            <span className="font-mono text-[9px] uppercase tracking-[0.14em] text-muted-foreground">{label}</span>
          </div>
        ))}
      </div>

      {/* Controls */}
      <div className="flex-shrink-0 flex items-center gap-1.5">
        <button
          onClick={() => { setStepIdx(-1); setIsPlaying(false) }}
          disabled={!isActive || stepIdx < 0}
          className={btnBase}
          title="Reset"
        >◀◀</button>

        <button
          onClick={() => setStepIdx(p => Math.max(-1, p - 1))}
          disabled={!isActive || stepIdx < 0}
          className={btnBase}
          title="Previous step"
        >◀</button>

        <button
          onClick={handlePlay}
          disabled={!isActive}
          className="flex-1 font-mono text-[10px] sm:text-xs font-bold uppercase tracking-[0.12em] rounded px-3 py-1.5
                     bg-accent text-accent-foreground
                     hover:shadow-[0_0_24px_-4px_var(--glow-accent)]
                     disabled:opacity-30 disabled:cursor-not-allowed transition-all"
        >
          {isPlaying ? '⏸ PAUSE' : isDone ? '↺ REPLAY' : '▶ PLAY'}
        </button>

        <button
          onClick={() => setStepIdx(p => Math.min(STEPS.length - 1, p + 1))}
          disabled={!isActive || isDone}
          className={btnBase}
          title="Next step"
        >▶</button>

        <button
          onClick={() => { setIsPlaying(false); setStepIdx(STEPS.length - 1) }}
          disabled={!isActive || isDone}
          className={btnBase}
          title="Skip to end"
        >▶▶</button>
      </div>
    </div>
  )
}
