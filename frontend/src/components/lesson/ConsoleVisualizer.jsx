import { useEffect, useState, useRef } from 'react'
import { motion, AnimatePresence } from 'framer-motion'

// Lines to reveal per cascade sector, keyed by codeLang
const OUTPUT_STEPS = {
  cpp: [
    { text: '$ g++ main.cpp -o main', color: '#00f2ff' },
    { text: '$ ./main', color: '#00f2ff' },
    { text: 'Hello, world!', color: '#deff9a' },
    { text: 'exit code: 0', color: '#6b7280' },
  ],
  python: [
    { text: '$ python main.py', color: '#00f2ff' },
    { text: 'Hello, world!', color: '#deff9a' },
    { text: 'Process finished with exit code 0', color: '#6b7280' },
  ],
}

function TypewriterLine({ text, color, speed = 28 }) {
  const [displayed, setDisplayed] = useState('')

  useEffect(() => {
    setDisplayed('')
    let i = 0
    const id = setInterval(() => {
      i++
      setDisplayed(text.slice(0, i))
      if (i >= text.length) clearInterval(id)
    }, speed)
    return () => clearInterval(id)
  }, [text, speed])

  return (
    <span style={{ color }} className="font-mono text-sm">
      {displayed}
    </span>
  )
}

export default function ConsoleVisualizer({ codeLang, phase, revealedCount }) {
  const steps = OUTPUT_STEPS[codeLang] ?? OUTPUT_STEPS.cpp
  const terminalRef = useRef(null)

  // How many lines to show based on phase and cascade progress
  const visibleLines = phase === 'slides' ? 0 : Math.min(revealedCount, steps.length)

  useEffect(() => {
    if (terminalRef.current) {
      terminalRef.current.scrollTop = terminalRef.current.scrollHeight
    }
  }, [visibleLines])

  return (
    <div className="h-full flex flex-col p-6">
      {/* Header bar */}
      <div className="flex items-center gap-2 mb-4 flex-shrink-0">
        <div className="w-3 h-3 rounded-full bg-red-500/70" />
        <div className="w-3 h-3 rounded-full bg-yellow-500/70" />
        <div className="w-3 h-3 rounded-full" style={{ background: '#deff9a', opacity: 0.8 }} />
        <span className="ml-2 font-mono text-[10px] uppercase tracking-[0.22em]" style={{ color: '#00f2ff', opacity: 0.6 }}>
          ~/terminal
        </span>
      </div>

      {/* Terminal body */}
      <div
        ref={terminalRef}
        className="flex-1 rounded-xl border overflow-y-auto cyber-scroll p-4 space-y-2"
        style={{
          background: 'rgba(0, 0, 0, 0.6)',
          borderColor: 'rgba(0, 242, 255, 0.15)',
          backdropFilter: 'blur(8px)',
        }}
      >
        {/* Prompt when idle */}
        {visibleLines === 0 && (
          <div className="flex items-center gap-2">
            <span className="font-mono text-sm" style={{ color: '#00f2ff' }}>{'>'}</span>
            <span className="inline-block w-2 h-4 bg-current terminal-cursor" style={{ color: '#00f2ff' }} />
          </div>
        )}

        {/* Typed output lines */}
        <AnimatePresence>
          {steps.slice(0, visibleLines).map((step, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 4 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.2 }}
              className="flex items-start gap-2"
            >
              {i > 0 && i === visibleLines - 1 ? (
                <TypewriterLine text={step.text} color={step.color} />
              ) : (
                <span className="font-mono text-sm" style={{ color: step.color }}>
                  {step.text}
                </span>
              )}
            </motion.div>
          ))}
        </AnimatePresence>

        {/* Trailing cursor when active */}
        {visibleLines > 0 && visibleLines < steps.length && (
          <div className="flex items-center gap-2">
            <span className="inline-block w-2 h-4 terminal-cursor" style={{ background: '#00f2ff' }} />
          </div>
        )}

        {/* Done marker */}
        {visibleLines >= steps.length && steps.length > 0 && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.5 }}
            className="font-mono text-xs mt-2"
            style={{ color: '#deff9a', opacity: 0.6 }}
          >
            // execution complete
          </motion.div>
        )}
      </div>

      {/* Status footer */}
      <div className="mt-3 flex items-center gap-2 flex-shrink-0">
        <div
          className="w-2 h-2 rounded-full"
          style={{
            background: phase === 'slides' ? '#6b7280' : '#deff9a',
            boxShadow: phase !== 'slides' ? '0 0 6px #deff9a' : 'none',
          }}
        />
        <span className="font-mono text-[10px] uppercase tracking-[0.18em]" style={{ color: '#6b7280' }}>
          {phase === 'slides' ? 'standby' : phase === 'done' ? 'archived' : 'running'}
        </span>
      </div>
    </div>
  )
}
