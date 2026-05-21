import { useNavigate } from 'react-router-dom'
import { Lock, Play } from 'lucide-react'

// SVG coordinate system: viewBox "0 0 100 {height}"
// x values are percentages (0–100), y values are pixels
const SVG_TRUNK_X = 50
const SVG_LEFT_X = 18
const SVG_RIGHT_X = 72
const NODE_GAP = 160   // px between node centers
const TOP_PAD = 60
const BOTTOM_PAD = 50

// Circuit-board line colors per node status — use CSS custom properties
const COLORS = {
  completed: 'var(--success)',
  active:    'var(--accent)',
  locked:    'var(--hairline)',
}

function getStatus(lesson, completedIds, allLessons) {
  if (completedIds.has(lesson.id)) return 'completed'
  const prev = allLessons.find((l) => l.order_index === lesson.order_index - 1)
  if (!prev || completedIds.has(prev.id)) return 'active'
  return 'locked'
}

export default function CircuitPathway({ lessons, completedIds, lang }) {
  const navigate = useNavigate()

  if (lessons.length === 0) {
    return (
      <p className="text-center font-mono text-sm text-muted-foreground py-12">
        // no lessons in this module
      </p>
    )
  }

  const totalHeight = TOP_PAD + (lessons.length - 1) * NODE_GAP + BOTTOM_PAD

  const positions = lessons.map((_, idx) => ({
    x: idx % 2 === 0 ? SVG_LEFT_X : SVG_RIGHT_X,
    y: TOP_PAD + idx * NODE_GAP,
  }))

  const statuses = lessons.map((l) => getStatus(l, completedIds, lessons))

  return (
    <div className="relative" style={{ height: totalHeight }}>
      {/* SVG: trunk + branch lines + junction dots */}
      <svg
        className="absolute inset-0 pointer-events-none overflow-visible"
        width="100%"
        height={totalHeight}
        viewBox={`0 0 100 ${totalHeight}`}
        preserveAspectRatio="none"
      >
        {/* Vertical trunk segments between consecutive nodes */}
        {positions.slice(0, -1).map((from, i) => {
          const to = positions[i + 1]
          const nextStatus = statuses[i + 1]
          const color = COLORS[nextStatus === 'active' ? 'active' : nextStatus]
          return (
            <line
              key={`trunk-${i}`}
              x1={SVG_TRUNK_X} y1={from.y}
              x2={SVG_TRUNK_X} y2={to.y}
              stroke={color}
              strokeWidth="1.5"
              vectorEffect="non-scaling-stroke"
            />
          )
        })}

        {/* Horizontal branch lines from trunk to each node */}
        {positions.map((pos, i) => {
          const status = statuses[i]
          const color = COLORS[status === 'active' ? 'active' : status]
          return (
            <line
              key={`branch-${i}`}
              x1={SVG_TRUNK_X} y1={pos.y}
              x2={pos.x} y2={pos.y}
              stroke={color}
              strokeWidth="1.5"
              vectorEffect="non-scaling-stroke"
            />
          )
        })}

        {/* Junction dots at trunk-branch intersections */}
        {positions.map((pos, i) => {
          const status = statuses[i]
          const color = COLORS[status === 'active' ? 'active' : status]
          return (
            <circle
              key={`dot-${i}`}
              cx={SVG_TRUNK_X}
              cy={pos.y}
              r={2.5}
              fill={color}
              vectorEffect="non-scaling-stroke"
            />
          )
        })}
      </svg>

      {/* Lesson nodes — absolutely positioned over SVG */}
      {lessons.map((lesson, idx) => {
        const { x, y } = positions[idx]
        const status = statuses[idx]
        const isCompleted = status === 'completed'
        const isActive = status === 'active'
        const isLocked = status === 'locked'
        const title = lang === 'ro' ? lesson.title_ro : lesson.title_en

        const handleClick = () => {
          if (!isLocked) navigate(`/lesson/${lesson.slug}`)
        }

        return (
          <div
            key={lesson.id}
            className="absolute flex flex-col items-center gap-1.5"
            style={{ left: `${x}%`, top: y, transform: 'translate(-50%, -50%)' }}
          >
            {/* Active node: "tap to enter" label above */}
            {isActive && (
              <span className="font-mono text-[9px] text-muted-foreground uppercase tracking-[0.2em] border border-hairline rounded-full px-2.5 py-0.5 bg-background/60 mb-0.5">
                tap to enter
              </span>
            )}

            {/* Node circle */}
            {isCompleted && (
              <div
                onClick={handleClick}
                className="w-12 h-12 rounded-full border-2 border-success bg-success/10 flex items-center justify-center text-success text-xl font-bold node-glow-success cursor-pointer hover:scale-105 transition-transform"
              >
                ✓
              </div>
            )}

            {isActive && (
              <div
                onClick={handleClick}
                className="w-14 h-14 rounded-full border-2 border-accent bg-accent/10 flex items-center justify-center cursor-pointer node-pulse hover:scale-105 transition-transform"
              >
                <Play size={20} className="text-accent ml-0.5" fill="currentColor" />
              </div>
            )}

            {isLocked && (
              <div className="w-11 h-11 rounded-full border border-hairline bg-card flex items-center justify-center text-muted-foreground opacity-40">
                <Lock size={14} />
              </div>
            )}

            {/* Labels below node */}
            <div className="text-center mt-0.5 max-w-[100px]">
              <p className={`text-xs font-semibold leading-tight ${isLocked ? 'text-muted-foreground/40' : isCompleted ? 'text-foreground/70' : 'text-foreground'}`}>
                {title}
              </p>
              {isCompleted && (
                <p className="text-streak text-[10px] tracking-widest mt-0.5">★★★</p>
              )}
            </div>
          </div>
        )
      })}
    </div>
  )
}
