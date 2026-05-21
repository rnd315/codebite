import { motion, AnimatePresence } from 'framer-motion'

// Slot data keyed by [lang][codeLang]
const SLOTS = {
  ro: {
    cpp: [
      { id: 'uninit', at: 0, type: 'int',  name: 'x',       value: null,   garbage: true },
      { id: 'scor',   at: 1, type: 'int',  name: 'scor',    value: '100'   },
      { id: 'litera', at: 2, type: 'char', name: 'litera',  value: "'A'"   },
      { id: 'trecut', at: 3, type: 'bool', name: 'aTrecut', value: 'true'  },
    ],
    python: [
      { id: 'scor',   at: 1, name: 'scor',    value: '100',  pyType: 'int'  },
      { id: 'litera', at: 2, name: 'litera',  value: "'A'",  pyType: 'str'  },
      { id: 'trecut', at: 3, name: 'aTrecut', value: 'True', pyType: 'bool' },
    ],
  },
  en: {
    cpp: [
      { id: 'uninit', at: 0, type: 'int',  name: 'x',      value: null,   garbage: true },
      { id: 'score',  at: 1, type: 'int',  name: 'score',  value: '100'   },
      { id: 'letter', at: 2, type: 'char', name: 'letter', value: "'A'"   },
      { id: 'passed', at: 3, type: 'bool', name: 'passed', value: 'true'  },
    ],
    python: [
      { id: 'score',  at: 1, name: 'score',  value: '100',  pyType: 'int'  },
      { id: 'letter', at: 2, name: 'letter', value: "'A'",  pyType: 'str'  },
      { id: 'passed', at: 3, name: 'passed', value: 'True', pyType: 'bool' },
    ],
  },
}

const TYPE_COLORS = {
  int:  '#00f2ff',
  char: '#c084fc',
  bool: '#deff9a',
  str:  '#c084fc',
}

function GarbageSlot({ type, name }) {
  return (
    <div
      className="garbage-slot rounded-xl border-2 p-4 flex flex-col gap-2"
      style={{ background: 'rgba(239,68,68,0.07)', borderColor: 'rgba(239,68,68,0.75)' }}
    >
      <div className="flex items-center justify-between">
        <span className="font-mono text-sm font-bold uppercase tracking-widest text-red-400">
          {type}
        </span>
        <span className="font-mono text-xs text-red-400/70 uppercase tracking-wider">uninitialized</span>
      </div>
      <span className="font-mono text-xl font-bold text-red-300">{name}</span>
      <span className="font-mono text-base font-bold text-red-400 animate-pulse tracking-wider">
        GARBAGE_VALUE
      </span>
    </div>
  )
}

function MemorySlot({ slot, isCpp }) {
  const displayType = isCpp ? slot.type : slot.pyType
  const typeColor   = TYPE_COLORS[displayType] ?? '#00f2ff'

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.82 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.35, ease: 'easeOut' }}
      className="slot-active rounded-xl border-2 p-4 flex flex-col gap-2"
      style={{
        background: `rgba(${isCpp ? '0,242,255' : '192,132,252'}, 0.05)`,
        borderColor: typeColor + '55',
      }}
    >
      <div className="flex items-center justify-between">
        <span className="font-mono text-sm font-bold uppercase tracking-wider" style={{ color: typeColor }}>
          {displayType}
        </span>
        <span className="font-mono text-xs uppercase tracking-wider" style={{ color: typeColor, opacity: 0.5 }}>
          {isCpp ? 'addr' : 'ref'}
        </span>
      </div>
      <span className="font-mono text-xl font-bold" style={{ color: typeColor }}>
        {slot.name}
      </span>
      <span className="font-mono text-base font-semibold" style={{ color: '#e5e7eb' }}>
        = {slot.value}
      </span>
    </motion.div>
  )
}

export default function MemoryVisualizer({ lang = 'ro', codeLang = 'cpp', phase, revealedCount }) {
  const langKey = lang === 'ro' ? 'ro' : 'en'
  const isCpp   = codeLang === 'cpp'
  const slots   = SLOTS[langKey]?.[codeLang] ?? SLOTS.ro.cpp

  const visibleSlots = phase === 'slides'
    ? []
    : slots.filter((s) => revealedCount >= s.at)

  const emptyCount = Math.max(0, 4 - visibleSlots.length)

  return (
    <div className="h-full flex flex-col p-5">
      {/* Header */}
      <div className="flex items-center gap-3 mb-4 flex-shrink-0">
        <span className="font-mono text-xs uppercase tracking-[0.28em] font-bold" style={{ color: '#00f2ff', opacity: 0.75 }}>
          RAM_MONITOR
        </span>
        <div className="flex-1 h-px" style={{ background: 'rgba(0,242,255,0.15)' }} />
        <span className="font-mono text-xs font-semibold" style={{ color: '#6b7280' }}>
          {isCpp ? 'C++ / static' : 'Python / dynamic'}
        </span>
      </div>

      {/* Slot grid */}
      <div className="flex-1 grid grid-cols-2 gap-3 content-start overflow-y-auto cyber-scroll">
        <AnimatePresence>
          {visibleSlots.map((slot) =>
            slot.garbage ? (
              <GarbageSlot key={slot.id} type={slot.type} name={slot.name} />
            ) : (
              <MemorySlot key={slot.id} slot={slot} isCpp={isCpp} />
            )
          )}
        </AnimatePresence>

        {/* Empty placeholder cells */}
        {Array.from({ length: emptyCount }).map((_, i) => (
          <div
            key={`empty-${i}`}
            className="rounded-xl border p-4 flex items-center justify-center"
            style={{
              borderColor: 'rgba(255,255,255,0.06)',
              background: 'rgba(0,0,0,0.25)',
              minHeight: '96px',
            }}
          >
            <span className="font-mono text-xs font-bold tracking-widest" style={{ color: '#1f2937' }}>
              -- empty --
            </span>
          </div>
        ))}

        {phase === 'slides' && Array.from({ length: 4 }).map((_, i) => (
          <div
            key={`idle-${i}`}
            className="rounded-xl border p-4 flex items-center justify-center"
            style={{
              borderColor: 'rgba(255,255,255,0.06)',
              background: 'rgba(0,0,0,0.25)',
              minHeight: '96px',
            }}
          >
            <span className="font-mono text-xs font-bold tracking-widest" style={{ color: '#111827' }}>
              -- --
            </span>
          </div>
        ))}
      </div>

      {/* Legend */}
      <div
        className="mt-3 pt-3 flex-shrink-0 border-t flex flex-wrap gap-4"
        style={{ borderColor: 'rgba(0,242,255,0.09)' }}
      >
        {(isCpp ? ['int', 'char', 'bool'] : ['int', 'str', 'bool']).map((t) => (
          <div key={t} className="flex items-center gap-2">
            <div className="w-3.5 h-3.5 rounded-full flex-shrink-0" style={{ background: TYPE_COLORS[t] }} />
            <span className="font-mono text-xs font-semibold uppercase tracking-wider" style={{ color: '#9ca3af' }}>
              {t}
            </span>
          </div>
        ))}
        {isCpp && (
          <div className="flex items-center gap-2">
            <div className="w-3.5 h-3.5 rounded-full flex-shrink-0 bg-red-500" />
            <span className="font-mono text-xs font-semibold uppercase tracking-wider" style={{ color: '#9ca3af' }}>
              uninitialized
            </span>
          </div>
        )}
      </div>
    </div>
  )
}
