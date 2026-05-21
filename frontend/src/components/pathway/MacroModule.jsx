import { useNavigate } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import { motion } from 'framer-motion'
import { Lock, Terminal, CheckCircle2, Server, ChevronRight, Play, Signal } from 'lucide-react'

function MainframeBadge({ module, isActive, isCompleted }) {
  return (
    <div className="relative flex-shrink-0">
      <div className={`relative grid h-24 w-24 place-items-center rounded-xl bg-background ring-1 ${
        isActive ? 'ring-accent' : isCompleted ? 'ring-success' : 'ring-hairline'
      }`}>
        {/* Corner pins — accent when active */}
        <span className={`absolute left-1 top-1 h-1 w-1 rounded-full ${isActive ? 'bg-accent' : 'bg-hairline'}`} />
        <span className={`absolute right-1 top-1 h-1 w-1 rounded-full ${isActive ? 'bg-accent' : 'bg-hairline'}`} />
        <span className={`absolute left-1 bottom-1 h-1 w-1 rounded-full ${isActive ? 'bg-accent' : 'bg-hairline'}`} />
        <span className={`absolute right-1 bottom-1 h-1 w-1 rounded-full ${isActive ? 'bg-accent' : 'bg-hairline'}`} />
        {/* Slats + module code inside the box */}
        <div className="flex flex-col items-stretch gap-1.5 px-3 py-2 w-full">
          {[0, 1, 2, 3].map((i) => (
            <div
              key={i}
              className={`h-1.5 rounded-sm ${
                isActive && i < 3 ? 'bg-accent/70' : isCompleted ? 'bg-success/50' : 'bg-hairline'
              }`}
            />
          ))}
          <div className="mt-1 text-center font-mono text-[9px] font-bold tracking-[0.18em] text-muted-foreground">
            {module.id.toUpperCase()}
          </div>
        </div>
      </div>
    </div>
  )
}

function LedRack({ completedCount, isActive, isCompleted }) {
  const rows = Array.from({ length: 6 }, (_, i) => i)
  return (
    <div className="rounded-md border border-hairline bg-background/50 p-2">
      <div className="mb-1.5 flex items-center justify-between font-mono text-[8px] uppercase tracking-[0.22em] text-muted-foreground">
        <span>1U · slots</span>
        <span>{isCompleted ? 'done' : isActive ? 'online' : 'offline'}</span>
      </div>
      <div className="space-y-1">
        {rows.map((i) => {
          const filled = i < completedCount
          const current = i === completedCount && isActive
          return (
            <div key={i} className="flex items-center gap-1.5">
              <span className={`h-1.5 w-1.5 rounded-full flex-shrink-0 ${
                filled ? 'bg-accent shadow-[0_0_6px_var(--accent)]' :
                current ? 'bg-primary/70' : 'bg-hairline'
              }`} />
              <span className="h-px flex-1 bg-hairline" />
              <span className="font-mono text-[8px] tabular-nums text-muted-foreground">
                {String(i).padStart(2, '0')}
              </span>
            </div>
          )
        })}
      </div>
    </div>
  )
}

export function BusConnector() {
  return (
    <div className="my-2 flex justify-center" aria-hidden>
      <div className="flex flex-col items-center gap-1">
        <span className="h-3 w-px bg-hairline" />
        <span className="h-1 w-1 rounded-full bg-accent/70" />
        <span className="h-6 w-px bg-gradient-to-b from-accent/70 to-primary/70" />
        <span className="h-1 w-1 rounded-full bg-primary/70" />
        <span className="h-3 w-px bg-hairline" />
      </div>
    </div>
  )
}

export default function MacroModule({ module, lessons, completedIds, moduleStatus, lang }) {
  const navigate = useNavigate()
  const { t } = useTranslation()

  const isActive = moduleStatus === 'active'
  const isCompleted = moduleStatus === 'completed'
  const isLocked = moduleStatus === 'locked'
  const isFogOfWar = moduleStatus === 'fog_of_war'

  const completedCount = lessons.filter((l) => completedIds.has(l.id)).length
  const xpTotal = lessons.length * 10
  const eta = Math.ceil(lessons.length * 0.25)
  const progressPct = lessons.length > 0 ? Math.round((completedCount / lessons.length) * 100) : 0

  const moduleTitle = t(`modules.${module.id}.title`)

  return (
    <motion.div
      onClick={isActive || isCompleted ? () => navigate(`/module/${module.slug}`) : undefined}
      whileHover={isActive ? { scale: 1.01 } : isCompleted ? { scale: 1.005 } : {}}
      transition={{ duration: 0.18, ease: 'easeOut' }}
      className={`relative overflow-hidden rounded-2xl border bg-background/60 transition-all ${
        isActive
          ? 'border-accent/40 cursor-pointer hover:border-accent/70 hover:shadow-[0_0_50px_-8px_var(--glow-accent)]'
          : isCompleted
            ? 'border-hairline cursor-pointer hover:border-success/40 hover:shadow-[0_0_30px_-8px_var(--glow-accent)]'
            : 'border-hairline cursor-not-allowed'
      }`}
    >

      {/* Inner grid texture */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 opacity-40"
        style={{
          backgroundImage: 'linear-gradient(to right, var(--grid-line) 1px, transparent 1px), linear-gradient(to bottom, var(--grid-line) 1px, transparent 1px)',
          backgroundSize: '24px 24px',
        }}
      />

      {/* Locked overlay */}
      {isLocked && (
        <div
          className="absolute inset-0 z-20 grid place-items-center overflow-hidden rounded-2xl"
          style={{ background: 'linear-gradient(180deg, oklch(0.10 0.03 265 / 70%) 0%, oklch(0.08 0.03 265 / 92%) 100%)' }}
        >
          <div aria-hidden className="absolute inset-0 backdrop-blur-md" />
          <div aria-hidden className="absolute inset-0 bg-grid opacity-30" />
          <div className="relative flex flex-col items-center gap-3 text-center">
            <div className="relative grid h-20 w-20 place-items-center rounded-2xl bg-background/80 ring-1 ring-hairline">
              <span
                aria-hidden
                className="absolute inset-[-2px] rounded-2xl opacity-60 blur-md"
                style={{ background: 'var(--glow-primary)' }}
              />
              <Lock className="relative h-9 w-9 text-foreground" strokeWidth={2} />
            </div>
            <div className="font-mono text-[11px] font-bold uppercase tracking-[0.3em] text-foreground">
              {t('module.sectorLocked')}
            </div>
            <div className="font-mono text-[10px] uppercase tracking-[0.22em] text-muted-foreground">
              {t('module.lockedMessage')}
            </div>
          </div>
        </div>
      )}

      {/* Fog-of-war overlay — heavy distortion for distant modules */}
      {isFogOfWar && (
        <motion.div
          className="absolute inset-0 z-20 grid place-items-center overflow-hidden rounded-2xl"
          style={{ background: 'linear-gradient(180deg, oklch(0.07 0.04 265 / 88%) 0%, oklch(0.05 0.04 265 / 97%) 100%)' }}
          animate={{ opacity: [0.88, 1, 0.88] }}
          transition={{ repeat: Infinity, duration: 3, ease: 'easeInOut' }}
        >
          <div aria-hidden className="absolute inset-0 backdrop-blur-2xl" />
          <div aria-hidden className="absolute inset-0 bg-grid opacity-15" />
          <div className="relative flex flex-col items-center gap-3 text-center">
            <div className="relative grid h-20 w-20 place-items-center rounded-2xl bg-background/60 ring-1 ring-primary/30">
              <span
                aria-hidden
                className="absolute inset-[-2px] rounded-2xl opacity-40 blur-lg"
                style={{ background: 'var(--glow-primary)' }}
              />
              <span className="relative font-mono text-3xl font-black text-primary/60 select-none">?</span>
            </div>
            <div className="font-mono text-[11px] font-bold uppercase tracking-[0.3em] text-primary/70">
              // {t('module.statusClassified')}
            </div>
            <div className="font-mono text-[10px] uppercase tracking-[0.22em] text-muted-foreground/60">
              {t('module.fogUnlockHint')}
            </div>
          </div>
        </motion.div>
      )}

      {/* Header strip */}
      <div className="relative z-10 flex items-center justify-between gap-2 border-b border-hairline bg-secondary/30 px-4 py-2">
        <div className="flex items-center gap-2">
          <Server size={13.5} className="text-muted-foreground" strokeWidth={2} />
          <span className="font-mono text-[10px] uppercase tracking-[0.28em] text-muted-foreground">
            rack / {module.id.toLowerCase()}
          </span>
        </div>
        {isActive && (
          <span className="inline-flex items-center gap-1.5 rounded-md bg-accent px-2 py-0.5 font-mono text-[9px] font-bold uppercase tracking-[0.22em] text-accent-foreground">
            <Terminal size={10} strokeWidth={3} />
            {t('module.statusActive')}
          </span>
        )}
        {isCompleted && (
          <span className="inline-flex items-center gap-1.5 rounded-md border border-hairline bg-background/60 px-2 py-0.5 font-mono text-[9px] font-bold uppercase tracking-[0.22em] text-success">
            <CheckCircle2 size={10} strokeWidth={2.5} />
            {t('module.statusComplete')}
          </span>
        )}
        {isLocked && (
          <span className="inline-flex items-center gap-1.5 rounded-md border border-hairline bg-background/60 px-2 py-0.5 font-mono text-[9px] font-bold uppercase tracking-[0.22em] text-muted-foreground">
            <Lock size={10} strokeWidth={2.5} />
            {t('module.statusLocked')}
          </span>
        )}
        {isFogOfWar && (
          <span className="inline-flex items-center gap-1.5 rounded-md border border-primary/30 bg-background/60 px-2 py-0.5 font-mono text-[9px] font-bold uppercase tracking-[0.22em] text-primary/70">
            <Signal size={10} strokeWidth={2.5} />
            {t('module.statusClassified')}
          </span>
        )}
      </div>

      {/* Card body — 3-column grid */}
      <div className="relative z-10 grid gap-6 p-5 md:grid-cols-[auto_1fr_auto] md:items-center">

        {/* Left: Mainframe badge */}
        <MainframeBadge module={module} isActive={isActive} isCompleted={isCompleted} />

        {/* Center: Module info */}
        <div className="min-w-0">
          <div className="font-mono text-[10px] uppercase tracking-[0.28em] text-accent">
            {module.id.toUpperCase()} //
          </div>
          <h2 className="mt-1 font-mono text-2xl sm:text-3xl font-black tracking-tight text-foreground">
            {moduleTitle}
          </h2>
          <p className="mt-1 font-mono text-[11px] uppercase tracking-[0.18em] text-muted-foreground">
            {t(`modules.${module.id}.subtitle`)}
          </p>

          {/* Meta strip */}
          <div className="mt-4 flex flex-wrap gap-x-5 gap-y-2">
            {[
              { label: t('module.metaUnits'), value: String(lessons.length) },
              { label: t('gamification.xp'), value: xpTotal >= 1000 ? `${(xpTotal / 1000).toFixed(1)}K` : String(xpTotal) },
              { label: t('module.metaEta'), value: `${eta}h` },
            ].map((m) => (
              <div key={m.label} className="flex items-baseline gap-1.5">
                <span className="font-mono text-[9px] uppercase tracking-[0.22em] text-muted-foreground">{m.label}</span>
                <span className="font-mono text-sm font-bold text-foreground">{m.value}</span>
              </div>
            ))}
          </div>

          {/* Progress bar */}
          {(isActive || isCompleted) && lessons.length > 0 && (
            <div className="mt-4 flex items-center gap-3">
              <div className="relative h-1.5 flex-1 overflow-hidden rounded-full bg-secondary/60">
                <div
                  className={`h-full rounded-full transition-all duration-700 ${isCompleted ? 'bg-success' : 'bg-accent'}`}
                  style={{ width: `${progressPct}%` }}
                />
              </div>
              <span className="font-mono text-[10px] tabular-nums text-muted-foreground flex-shrink-0">
                {String(progressPct).padStart(2, '0')}%
              </span>
            </div>
          )}
        </div>

        {/* Right: LED rack + action button */}
        <div className="flex w-full flex-col gap-3 md:w-56">
          <LedRack
            completedCount={Math.min(completedCount, 6)}
            isActive={isActive}
            isCompleted={isCompleted}
          />

          {isActive && (
            <button
              className="pointer-events-none group inline-flex items-center justify-between gap-2 rounded-md bg-accent px-3 py-2 font-mono text-[11px] font-bold uppercase tracking-[0.18em] text-accent-foreground"
            >
              <span className="inline-flex items-center gap-2">
                <Play size={12} className="fill-accent-foreground" strokeWidth={0} />
                &gt; boot_module
              </span>
              <ChevronRight size={13.5} strokeWidth={3} />
            </button>
          )}
          {isCompleted && (
            <button
              className="pointer-events-none inline-flex items-center justify-between gap-2 rounded-md border border-hairline bg-background/40 px-3 py-2 font-mono text-[11px] font-bold uppercase tracking-[0.18em] text-muted-foreground"
            >
              &gt; review_module
            </button>
          )}
          {isLocked && (
            <button
              disabled
              className="inline-flex items-center justify-between gap-2 rounded-md border border-hairline bg-background/40 px-3 py-2 font-mono text-[11px] font-bold uppercase tracking-[0.18em] text-muted-foreground"
            >
              <span className="inline-flex items-center gap-2">
                <Lock size={12} strokeWidth={2.5} />
                {t('module.encrypted')}
              </span>
            </button>
          )}
          {isFogOfWar && (
            <button
              disabled
              className="inline-flex items-center justify-between gap-2 rounded-md border border-primary/20 bg-background/40 px-3 py-2 font-mono text-[11px] font-bold uppercase tracking-[0.18em] text-primary/40"
            >
              // signal_lost
            </button>
          )}
        </div>

      </div>
    </motion.div>
  )
}
