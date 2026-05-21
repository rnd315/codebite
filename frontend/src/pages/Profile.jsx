import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import { Hexagon, Zap, BookOpen, Pencil, Check, X, Brain, KeyRound, Trash2 } from 'lucide-react'
import client from '../api/client'
import useStore from '../store/useStore'
import Modal from '../components/ui/Modal'
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
  const navigate = useNavigate()
  const { user, lives, streak, syncFromUser, setUser, setShowProtocolModal, logout } = useStore()
  const [completedCount, setCompletedCount] = useState(0)
  const [loading, setLoading] = useState(true)

  // Username edit
  const [editing, setEditing] = useState(false)
  const [nameInput, setNameInput] = useState('')
  const [saving, setSaving] = useState(false)
  const [nameError, setNameError] = useState('')

  // Change password
  const [showPwForm, setShowPwForm] = useState(false)
  const [pwForm, setPwForm] = useState({ current: '', next: '' })
  const [pwLoading, setPwLoading] = useState(false)
  const [pwError, setPwError] = useState('')
  const [pwSuccess, setPwSuccess] = useState(false)

  // Delete account
  const [showDeleteModal, setShowDeleteModal] = useState(false)
  const [deleteLoading, setDeleteLoading] = useState(false)

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

  const handleChangePassword = async (e) => {
    e.preventDefault()
    if (pwForm.next.length < 4) {
      setPwError('Parola nouă trebuie să aibă cel puțin 4 caractere.')
      return
    }
    setPwLoading(true)
    setPwError('')
    setPwSuccess(false)
    try {
      await client.patch('/auth/me/password', {
        current_password: pwForm.current,
        new_password: pwForm.next,
      })
      setPwSuccess(true)
      setPwForm({ current: '', next: '' })
    } catch (err) {
      setPwError(err?.response?.data?.detail ?? 'Eroare la schimbarea parolei.')
    } finally {
      setPwLoading(false)
    }
  }

  const handleDeleteAccount = async () => {
    setDeleteLoading(true)
    try {
      await client.delete('/auth/me')
      logout()
      navigate('/', { replace: true })
    } catch {
      setDeleteLoading(false)
      setShowDeleteModal(false)
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

      {/* Stats grid */}
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
      <div className="space-y-2">
        <h2 className="text-base font-semibold mb-3">{t('nav.settings')}</h2>

        {/* Reconfigure protocol */}
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

        {/* Change password toggle */}
        <button
          onClick={() => { setShowPwForm((p) => !p); setPwError(''); setPwSuccess(false) }}
          className="w-full flex items-center gap-3 border border-hairline rounded-xl px-4 py-3 text-left hover:border-accent/50 hover:bg-accent/5 transition-colors group"
        >
          <KeyRound size={16} className="text-muted-foreground group-hover:text-accent transition-colors flex-shrink-0" strokeWidth={2} />
          <div className="font-mono text-sm font-semibold text-foreground group-hover:text-accent transition-colors">
            Schimbă parola
          </div>
        </button>

        {/* Change password form (collapsible) */}
        {showPwForm && (
          <form
            onSubmit={handleChangePassword}
            className="glass-strong rounded-xl px-4 py-4 space-y-3"
          >
            <input
              type="password"
              placeholder="Parola curentă"
              value={pwForm.current}
              onChange={(e) => setPwForm((p) => ({ ...p, current: e.target.value }))}
              required
              className="w-full bg-background border border-hairline rounded-lg px-3 py-2.5 text-sm font-mono text-foreground placeholder:text-muted-foreground focus:outline-none focus:border-accent"
            />
            <div>
              <input
                type="password"
                placeholder="Parola nouă (min. 4 caractere)"
                value={pwForm.next}
                onChange={(e) => setPwForm((p) => ({ ...p, next: e.target.value }))}
                required
                className="w-full bg-background border border-hairline rounded-lg px-3 py-2.5 text-sm font-mono text-foreground placeholder:text-muted-foreground focus:outline-none focus:border-accent"
              />
              {pwForm.next.length > 0 && pwForm.next.length < 4 && (
                <p className="text-xs text-destructive mt-1 font-mono pl-1">
                  Parola trebuie să aibă cel puțin 4 caractere.
                </p>
              )}
            </div>

            {pwError && <p className="text-xs text-destructive font-mono">{pwError}</p>}
            {pwSuccess && <p className="text-xs text-success font-mono">Parola a fost schimbată cu succes.</p>}

            <button
              type="submit"
              disabled={pwLoading}
              className="w-full bg-accent text-accent-foreground font-mono text-xs font-bold uppercase tracking-[0.12em] rounded-md px-4 py-2.5 hover:shadow-[0_0_30px_-6px_var(--glow-accent)] transition-all disabled:opacity-50"
            >
              {pwLoading ? 'Se salvează...' : 'Salvează parola'}
            </button>
          </form>
        )}
      </div>

      {/* Danger zone — Delete Account */}
      <div className="rounded-xl border border-destructive/30 px-4 py-4 space-y-3">
        <h2 className="text-sm font-semibold text-destructive font-mono">// Zonă periculoasă</h2>
        <p className="text-xs text-muted-foreground">
          Ștergerea contului este ireversibilă. Toate datele tale (progres, întrebări, răspunsuri) vor fi șterse permanent.
        </p>
        <button
          onClick={() => setShowDeleteModal(true)}
          className="flex items-center gap-2 border border-destructive/50 text-destructive font-mono text-xs font-bold uppercase tracking-[0.1em] rounded-md px-4 py-2 hover:bg-destructive/10 transition-colors"
        >
          <Trash2 size={13} />
          Șterge contul
        </button>
      </div>

      {/* Delete confirmation modal */}
      <Modal open={showDeleteModal} onClose={() => setShowDeleteModal(false)} title="Confirmare ștergere cont">
        <p className="text-sm text-muted-foreground mb-6">
          Ești sigur? Această acțiune este <span className="text-destructive font-semibold">ireversibilă</span>.
          Toate datele tale vor fi șterse permanent.
        </p>
        <div className="flex gap-3">
          <button
            onClick={() => setShowDeleteModal(false)}
            className="flex-1 border border-hairline rounded-md py-2.5 text-sm font-mono font-semibold text-muted-foreground hover:text-foreground transition-colors"
          >
            Anulează
          </button>
          <button
            onClick={handleDeleteAccount}
            disabled={deleteLoading}
            className="flex-1 bg-destructive text-white rounded-md py-2.5 text-sm font-mono font-bold uppercase tracking-[0.1em] hover:opacity-90 transition-opacity disabled:opacity-50"
          >
            {deleteLoading ? 'Se șterge...' : 'Șterge contul'}
          </button>
        </div>
      </Modal>

    </div>
  )
}
