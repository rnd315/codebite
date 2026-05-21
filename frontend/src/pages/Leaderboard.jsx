import { useTranslation } from 'react-i18next'
import useStore from '../store/useStore'

const MOCK_PLAYERS = [
  { username: 'root_hacker',      xp: 2840, lessons: 28 },
  { username: 'null_pointer',     xp: 2310, lessons: 23 },
  { username: 'cyber_student99',  xp: 1980, lessons: 19 },
  { username: 'bytecruncher',     xp: 1450, lessons: 14 },
  { username: 'kernel_panic_grl', xp: 980,  lessons: 9  },
]

const RANK_STYLES = {
  1: { label: '#1', class: 'text-streak font-black', glow: '0 0 14px -2px var(--glow-accent)' },
  2: { label: '#2', class: 'text-foreground font-bold', glow: '0 0 10px -4px var(--glow-primary)' },
  3: { label: '#3', class: 'text-muted-foreground font-bold', glow: '' },
}

export default function Leaderboard() {
  const { t } = useTranslation()
  const { user, xp } = useStore()
  const completedCurriculumLessons = useStore((s) => s.completedCurriculumLessons)

  const realPlayer = {
    username: user?.username ?? 'you',
    xp,
    lessons: completedCurriculumLessons.length || null,
    isYou: true,
  }

  const merged = [...MOCK_PLAYERS, realPlayer]
    .sort((a, b) => b.xp - a.xp)
    .map((p, i) => ({ ...p, rank: i + 1 }))

  return (
    <div className="py-6 max-w-2xl mx-auto space-y-5">

      {/* Header */}
      <div>
        <div className="font-mono text-[10px] uppercase tracking-[0.28em] text-muted-foreground">
          ~/global
        </div>
        <h1 className="mt-1 font-mono text-2xl font-bold text-foreground">
          {t('leaderboard.title')}
        </h1>
        <p className="mt-1 font-mono text-[11px] uppercase tracking-[0.18em] text-muted-foreground">
          {t('leaderboard.subtitle')}
        </p>
      </div>

      {/* Table card */}
      <div className="rounded-2xl glass-strong border border-hairline overflow-hidden">

        {/* Table header */}
        <div className="grid grid-cols-[3rem_1fr_auto_auto] gap-4 items-center border-b border-hairline bg-secondary/30 px-5 py-3">
          {[
            t('leaderboard.rank'),
            t('leaderboard.player'),
            t('leaderboard.xp'),
            t('leaderboard.lessons'),
          ].map((h) => (
            <span key={h} className="font-mono text-[9px] uppercase tracking-[0.28em] text-muted-foreground">
              {h}
            </span>
          ))}
        </div>

        {/* Rows */}
        <div className="divide-y divide-hairline">
          {merged.map((player) => {
            const rankStyle = RANK_STYLES[player.rank]
            const isYou = player.isYou

            return (
              <div
                key={player.username}
                className={`grid grid-cols-[3rem_1fr_auto_auto] gap-4 items-center px-5 py-3.5 transition-colors ${
                  isYou ? 'bg-accent/5 border-l-2 border-l-accent' : 'hover:bg-secondary/20'
                }`}
              >
                {/* Rank */}
                <div className="flex items-center justify-center">
                  {rankStyle ? (
                    <span
                      className={`font-mono text-sm ${rankStyle.class} inline-block`}
                      style={rankStyle.glow ? { textShadow: rankStyle.glow } : undefined}
                    >
                      {rankStyle.label}
                    </span>
                  ) : (
                    <span className="font-mono text-sm text-muted-foreground">
                      #{player.rank}
                    </span>
                  )}
                </div>

                {/* Username */}
                <div className="flex items-center gap-2 min-w-0">
                  <div className={`h-7 w-7 flex-shrink-0 rounded-full flex items-center justify-center font-mono text-xs font-bold ${
                    isYou
                      ? 'bg-gradient-to-br from-primary to-accent text-background'
                      : 'bg-secondary text-muted-foreground'
                  }`}>
                    {player.username[0].toUpperCase()}
                  </div>
                  <div className="min-w-0">
                    <span className={`font-mono text-sm font-semibold truncate block ${
                      isYou ? 'text-accent' : 'text-foreground'
                    }`}>
                      {player.username}
                    </span>
                    {isYou && (
                      <span className="font-mono text-[9px] uppercase tracking-[0.22em] text-accent/70">
                        {t('leaderboard.you')}
                      </span>
                    )}
                  </div>
                </div>

                {/* XP */}
                <span className={`font-mono text-sm tabular-nums font-bold ${
                  isYou ? 'text-accent' : player.rank <= 3 ? 'text-foreground' : 'text-muted-foreground'
                }`}>
                  {player.xp.toLocaleString()}
                </span>

                {/* Lessons */}
                <span className="font-mono text-sm tabular-nums text-muted-foreground">
                  {player.lessons ?? '—'}
                </span>
              </div>
            )
          })}
        </div>
      </div>

      {/* Footer note */}
      <p className="text-center font-mono text-[10px] uppercase tracking-[0.22em] text-muted-foreground/60">
        {t('leaderboard.headerLabel')}
      </p>
    </div>
  )
}
