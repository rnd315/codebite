import { useNavigate } from 'react-router-dom'
import { Lock, Play } from 'lucide-react'

export default function LessonNode({ lesson, status, lang }) {
  const navigate = useNavigate()

  const isLocked = status === 'locked'
  const isCompleted = status === 'completed'
  const isAvailable = status === 'available'

  const title = lang === 'ro' ? lesson.title_ro : lesson.title_en
  const category = lesson.category?.toUpperCase().replace(/ & /g, ' · ') ?? ''

  const handleClick = () => {
    if (!isLocked) navigate(`/lesson/${lesson.slug}`)
  }

  return (
    <div
      onClick={handleClick}
      className={`flex flex-col items-center text-center gap-2 select-none ${
        !isLocked ? 'cursor-pointer group' : 'cursor-not-allowed opacity-40'
      }`}
    >
      {/* TAP TO START label — only for active node */}
      {isAvailable && (
        <span className="text-[9px] font-mono text-muted-foreground uppercase tracking-[0.22em] border border-hairline rounded-full px-3 py-1 bg-background/60">
          Tap to start
        </span>
      )}

      {/* Node circle */}
      {isCompleted && (
        <div className="w-14 h-14 rounded-full flex items-center justify-center text-success text-2xl font-bold bg-success/10 border-2 border-success node-glow-success group-hover:scale-105 group-hover:border-success/60 transition-all duration-200">
          ✓
        </div>
      )}

      {isAvailable && (
        <div className="w-16 h-16 rounded-full border-2 border-accent bg-accent/10 flex items-center justify-center node-pulse group-hover:scale-105 transition-transform duration-200">
          <Play size={22} className="text-accent-foreground ml-1" fill="currentColor" />
        </div>
      )}

      {isLocked && (
        <div className="w-12 h-12 rounded-full border border-hairline bg-card flex items-center justify-center text-muted-foreground">
          <Lock size={15} />
        </div>
      )}

      {/* Labels below circle */}
      <div className="space-y-0.5">
        <p className={`text-sm font-bold leading-tight ${isLocked ? 'text-muted-foreground/40' : 'text-foreground'}`}>
          {title}
        </p>
        <p className="text-[9px] font-mono text-muted-foreground uppercase tracking-wider">
          {category}
        </p>
        {isCompleted && (
          <p className="text-streak text-xs tracking-widest mt-1">★★★</p>
        )}
      </div>
    </div>
  )
}
