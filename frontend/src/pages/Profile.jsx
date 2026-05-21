import { useEffect, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { Heart, Flame, Star, BookOpen } from 'lucide-react'
import client from '../api/client'
import useStore from '../store/useStore'
import { MAX_LIVES } from '../utils/constants'

function StatCard({ icon: Icon, value, label, color }) {
  return (
    <div className="glass-strong rounded-xl p-4 flex flex-col items-center gap-2">
      <Icon size={22} className={color} />
      <span className={`text-2xl font-bold font-mono ${color}`}>{value}</span>
      <span className="text-xs text-muted-foreground text-center">{label}</span>
    </div>
  )
}

export default function Profile() {
  const { t } = useTranslation()
  const { user, lives, streak, xp, syncFromUser } = useStore()
  const [completedCount, setCompletedCount] = useState(0)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [{ data: me }, { data: progress }] = await Promise.all([
          client.get('/auth/me'),
          client.get('/progress'),
        ])
        syncFromUser(me)
        setCompletedCount(progress.filter((p) => p.completed).length)
      } finally {
        setLoading(false)
      }
    }
    fetchData()
  }, [syncFromUser])

  const joinDate = user?.created_at
    ? new Date(user.created_at).toLocaleDateString()
    : '—'

  if (loading) {
    return (
      <div className="flex items-center justify-center py-20 text-muted-foreground">{t('common.loading')}</div>
    )
  }

  return (
    <div className="py-6 max-w-xl mx-auto space-y-6">
      {/* Avatar + username */}
      <div className="flex flex-col items-center gap-3">
        <div className="w-20 h-20 rounded-full bg-accent/20 border-2 border-accent flex items-center justify-center text-3xl font-bold text-accent font-mono">
          {user?.username?.[0]?.toUpperCase() ?? '?'}
        </div>
        <div className="text-center">
          <h1 className="text-xl font-bold">{user?.username}</h1>
          <p className="text-sm text-muted-foreground">{user?.email}</p>
          <p className="text-xs text-muted-foreground mt-1">
            {t('profile.member')} {joinDate}
          </p>
        </div>
      </div>

      {/* Stats grid */}
      <div>
        <h2 className="text-base font-semibold mb-3">{t('profile.stats')}</h2>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          <StatCard icon={Heart} value={`${lives}/${MAX_LIVES}`} label={t('profile.lives')} color="text-destructive" />
          <StatCard icon={Flame} value={streak} label={t('profile.streak')} color="text-streak" />
          <StatCard icon={Star} value={xp} label={t('profile.xp')} color="text-streak" />
          <StatCard icon={BookOpen} value={completedCount} label={t('profile.completed')} color="text-accent" />
        </div>
      </div>

      {/* XP progress */}
      <div className="glass-strong rounded-xl p-4">
        <div className="flex items-center justify-between text-sm mb-2">
          <span className="text-muted-foreground">Level {Math.floor(xp / 100) + 1}</span>
          <span className="text-muted-foreground text-xs font-mono">{xp % 100}/100 XP</span>
        </div>
        <div className="h-2.5 bg-secondary rounded-full overflow-hidden">
          <div
            className="h-full bg-streak rounded-full transition-all duration-700"
            style={{ width: `${xp % 100}%` }}
          />
        </div>
      </div>
    </div>
  )
}
