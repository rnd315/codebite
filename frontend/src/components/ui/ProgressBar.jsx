export default function ProgressBar({ value = 0, max = 100, color = 'accent', className = '' }) {
  const pct = Math.min(100, Math.max(0, (value / max) * 100))
  return (
    <div className={`h-2 bg-secondary rounded-full overflow-hidden ${className}`}>
      <div
        className={`h-full rounded-full transition-all duration-500 bg-${color}`}
        style={{ width: `${pct}%` }}
      />
    </div>
  )
}
