import { useEffect, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { Hexagon, Zap, BookOpen, Pencil, Check, X, Brain } from 'lucide-react'
import client from '../api/client'
import useStore from '../store/useStore'
import { MAX_TOKENS } from '../utils/constants'

function StatCard({ icon: Icon, value, label, iconClass }) {
  return (
    <div className="glass-strong rounded-xl p-4 flex flex-col items-center gap-2">
      <Icon size={22} className={iconClass} strokeWidth={2} />
      <span className={`text-2xl font-bold font-mono ${iconClass}`}>{value}</span>
      <span className="text-xs text-muted-foreground text-center">{label}</span>
    </div>
  )
}

export default function Profile() {
  const { t } = useTranslation()
  const { user, lives, streak, syncFromUser, setUser, setShowProtocolModal } = useStore()
  const [completedCount, setCompletedCount] = useState(0)
  const [loading, setLoading] = useState(true)

  const [editing, setEditing] = useState(false)
  const [nameInput, setNameInput] = useState('')
  const [saving, setSaving] = useState(false)
  const [nameError, setNameError] = useState('')

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

  const startEdit = () => {
    setNameInput(user?.username ?? '')
    setNameError('')
    setEditing(true)
  }

  const cancelEdit = () => {
    setEditing(false)
    setNameError('')
  }

  const saveUsername = async () => {
    const trimmed = nameInput.trim()
    if (!trimmed || trimmed === user?.username) { setEditing(false); return }
    setSaving(true)
    setNameError('')
    try {
      const { data } = await client.patch('/auth/me', { username: trimmed })
      setUser(data)
      syncFromUser(data)
      setEditing(false)
    } catch (err) {
      setNameError(err?.response?.data?.detail ?? t('common.error'))
    } finally {
      setSaving(false)
    }
  }

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
        <div className="w-20 h-20 rounded-full bg-gradient-to-br from-primary to-accent flex items-center justify-center text-3xl font-bold text-background font-mono ring-2 ring-background">
          {user?.username?.[0]?.toUpperCase() ?? '?'}
        </div>

        <div className="text-center space-y-1">
          {/* Editable username row */}
          {editing ? (
            <div className="flex items-center gap-2">
              <input
                autoFocus
                value={nameInput}
                onChange={(e) => setNameInput(e.target.value)}
                onKeyDown={(e) => { if (e.key === 'Enter') saveUsername(); if (e.key === 'Escape') cancelEdit() }}
                className="rounded-md border border-hairline bg-secondary/60 px-3 py-1.5 font-mono text-sm text-foreground outline-none focus:border-accent focus:ring-1 focus:ring-accent w-40 text-center"
                maxLength={32}
              />
              <button
                onClick={saveUsername}
                disabled={saving}
                className="grid h-7 w-7 place-items-center rounded-md bg-accent text-accent-foreground hover:opacity-80 disabled:opacity-40 transition-opacity"
              >
                <Check size={13} strokeWidth={3} />
              </button>
              <button
                onClick={cancelEdit}
                className="grid h-7 w-7 place-items-center rounded-md border border-hairline text-muted-foreground hover:text-foreground transition-colors"
              >
                <X size={13} strokeWidth={2.5} />
              </button>
            </div>
          ) : (
            <div className="flex items-center gap-2 justify-center">
              <h1 className="text-xl font-bold font-mono">{user?.username}</h1>
              <button
                onClick={startEdit}
                className="text-muted-foreground hover:text-foreground transition-colors"
                title={t('profile.editUsername')}
              >
                <Pencil size={14} strokeWidth={2} />
              </button>
            </div>
          )}

          {nameError && (
            <p className="font-mono text-xs text-destructive">{nameError}</p>
          )}

          <p className="text-sm text-muted-foreground">{user?.email}</p>
          <p className="text-xs text-muted-foreground">
            {t('profile.member')} {joinDate}
          </p>
        </div>
      </div>

      {/* Stats grid — 3 cards, no XP */}
      <div>
        <h2 className="text-base font-semibold mb-3">{t('profile.stats')}</h2>
        <div className="grid grid-cols-3 gap-3">
          <StatCard
            icon={Hexagon}
            value={`${lives}/${MAX_TOKENS}`}
            label={t('profile.lives')}
            iconClass="text-primary"
          />
          <StatCard
            icon={Zap}
            value={streak}
            label={t('profile.streak')}
            iconClass="text-accent"
          />
          <StatCard
            icon={BookOpen}
            value={completedCount}
            label={t('profile.completed')}
            iconClass="text-success"
          />
        </div>
      </div>

      {/* Account settings */}
      <div>
        <h2 className="text-base font-semibold mb-3">{t('nav.settings')}</h2>
        <button
          onClick={() => setShowProtocolModal(true)}
          className="w-full flex items-center gap-3 border border-hairline rounded-xl px-4 py-3 text-left hover:border-accent/50 hover:bg-accent/5 transition-colors group"
        >
          <Brain size={16} className="text-muted-foreground group-hover:text-accent transition-colors flex-shrink-0" strokeWidth={2} />
          <div>
            <div className="font-mono text-sm font-semibold text-foreground group-hover:text-accent transition-colors">
              {t('onboardingWizard.reconfigureBtn')}
            </div>
            <div className="font-mono text-[11px] text-muted-foreground">
              {t('onboardingWizard.step3Subtitle')}
            </div>
          </div>
        </button>
      </div>

    </div>
  )
}
