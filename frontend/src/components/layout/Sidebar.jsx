import { useNavigate } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import { Target, Trophy, MessageCircleQuestion, BatteryFull } from 'lucide-react'

const PLACEHOLDER_HELPERS = [
  { name: 'Maria', xp: 320 },
  { name: 'Jin',   xp: 285 },
  { name: 'Sofia', xp: 210 },
]

export default function Sidebar({ completedToday = 0, latestQuestion = null }) {
  const navigate = useNavigate()
  const { t } = useTranslation()

  return (
    <div className="hidden lg:flex flex-col gap-3 w-72 flex-shrink-0">

      {/* Daily Quest */}
      <div className="rounded-2xl glass-strong p-5">
        <div className="flex items-center justify-between mb-1.5">
          <div className="flex items-center gap-2">
            <Target size={14} className="text-primary" strokeWidth={2.25} />
            <span className="text-sm font-bold text-foreground">{t('sidebar.dailyQuest')}</span>
          </div>
          <span className="font-mono text-[11px] text-muted-foreground">{completedToday} / 1</span>
        </div>
        <p className="text-xs text-muted-foreground mb-3">{t('sidebar.questGoal')}</p>
        <div className="h-1.5 rounded-full bg-secondary overflow-hidden">
          <div
            className="sidebar-progress-fill h-full rounded-full bg-gradient-to-r from-primary to-accent transition-all duration-700"
            style={{ width: `${Math.min(completedToday, 1) * 100}%` }}
          />
        </div>
      </div>

      {/* Top Debuggers leaderboard */}
      <div className="rounded-2xl glass-strong p-5">
        <div className="flex items-center gap-2 mb-4">
          <Trophy size={14} className="text-accent" strokeWidth={2.25} />
          <span className="text-sm font-bold text-foreground">{t('sidebar.topDebuggers')}</span>
          <span className="font-mono text-[9px] uppercase tracking-[0.18em] text-muted-foreground ml-auto">· today</span>
        </div>
        <div className="space-y-3">
          {PLACEHOLDER_HELPERS.map((helper, i) => (
            <div key={helper.name} className="flex items-center gap-3">
              <span className="font-mono text-[10px] text-muted-foreground w-4 flex-shrink-0">
                0{i + 1}
              </span>
              <span className="flex-1 text-sm font-semibold text-foreground">{helper.name}</span>
              <span className="sidebar-xp-value font-mono text-[11px] font-bold text-primary">+{helper.xp}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Debugger's Guild community preview */}
      <div className="rounded-2xl glass-strong p-5">
        <div className="flex items-center gap-2 mb-4">
          <MessageCircleQuestion size={14} className="text-accent" strokeWidth={2.25} />
          <span className="text-sm font-bold text-foreground">{t('sidebar.latestCommunity')}</span>
        </div>

        <div className="rounded-md border border-hairline bg-background/70 p-3 font-mono text-[11px] mb-4">
          {latestQuestion ? (
            <>
              <p className="text-accent mb-1">$ {latestQuestion.author_username}:</p>
              <p className="text-foreground leading-relaxed line-clamp-2">
                {latestQuestion.body}
              </p>
            </>
          ) : (
            <>
              <p className="text-accent mb-1">$ User_1337:</p>
              <p className="text-foreground">{t('sidebar.noQuestions')}</p>
            </>
          )}
          <span className="inline-block h-3 w-1.5 animate-pulse-soft bg-accent mt-1" />
        </div>

        <button
          onClick={() => navigate('/community')}
          className="w-full inline-flex items-center justify-center gap-2 bg-accent text-accent-foreground font-mono text-xs font-bold uppercase tracking-[0.12em] rounded-md px-4 py-2.5 hover:shadow-[0_0_30px_-6px_var(--glow-accent)] transition-all"
        >
          {t('sidebar.jumpToFeed')} <BatteryFull size={12} />
        </button>
      </div>

    </div>
  )
}
