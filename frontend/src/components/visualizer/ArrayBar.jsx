import { motion } from 'framer-motion'

function getBarColor(index, step) {
  if (!step) return 'var(--muted-foreground)'
  if (step.done) return 'var(--success)'
  if (step.found === true && step.current === index) return 'var(--success)'
  if (step.comparing?.includes(index)) {
    return step.swapped ? 'var(--success)' : 'var(--accent)'
  }
  if (step.mid === index) return 'var(--accent)'
  if (step.current === index) return 'var(--accent)'
  if (step.low !== undefined && step.high !== undefined) {
    if (index >= step.low && index <= step.high) return 'var(--muted-foreground)'
    return 'var(--border)'
  }
  return 'var(--muted-foreground)'
}

export default function ArrayBar({ value, index, maxValue, step }) {
  const heightPct = Math.max(8, (value / maxValue) * 100)
  const color = getBarColor(index, step)

  return (
    <motion.div
      layout
      className="flex flex-col items-center justify-end gap-1 flex-1 min-w-0"
      style={{ height: '140px' }}
    >
      <span className="text-xs font-mono text-muted-foreground truncate">{value}</span>
      <motion.div
        animate={{ height: `${heightPct}%`, backgroundColor: color }}
        transition={{ duration: 0.25 }}
        className="w-full rounded-t-sm"
        style={{ minHeight: '8px' }}
      />
    </motion.div>
  )
}
