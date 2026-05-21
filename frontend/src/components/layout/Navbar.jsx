import { useNavigate, useLocation } from 'react-router-dom'
import { useRef, useState, useEffect } from 'react'
import { Sun, Moon, Zap, Users, GraduationCap, Hexagon, User, Trophy, LogOut, ChevronDown, Brain, BarChart2 } from 'lucide-react'
import { useTranslation } from 'react-i18next'
import useStore from '../../store/useStore'
import useAuth from '../../hooks/useAuth'
import { MAX_TOKENS } from '../../utils/constants'
import AchievementsModal from '../gamification/AchievementsModal'

// ── Shared sub-components (reused in main row + overflow rows) ────────────────

function LangPill({ codeLang, setCodeLang }) {
  return (
    <div className="relative inline-flex rounded-full glass p-0.5">
      {['cpp', 'python'].map((l) => (
        <button
          key={l}
          onClick={() => setCodeLang(l)}
          className={`rounded-full px-3 py-1 text-xs font-mono font-semibold tracking-wide transition-all ${
            codeLang === l
              ? 'bg-foreground text-background shadow-[0_0_20px_-6px_var(--glow-primary)]'
              : 'text-muted-foreground hover:text-foreground'
          }`}
        >
          {l === 'cpp' ? 'C++' : 'Python'}
        </button>
      ))}
    </div>
  )
}

function UIPill({ lang, setLang }) {
  return (
    <div className="relative inline-flex rounded-full glass p-0.5">
      {['en', 'ro'].map((l) => (
        <button
          key={l}
          onClick={() => setLang(l)}
          className={`rounded-full px-3 py-1 text-xs font-mono font-semibold tracking-wide transition-all ${
            lang === l
              ? 'bg-foreground text-background shadow-[0_0_20px_-6px_var(--glow-primary)]'
              : 'text-muted-foreground hover:text-foreground'
          }`}
        >
          {l.toUpperCase()}
        </button>
      ))}
    </div>
  )
}

function ViewSwitcher({ isLearning, isCommunity, isLeaderboard, navigate, t }) {
  const tabs = [
    { icon: GraduationCap, label: t('nav.learning'),   path: '/pathway',     active: isLearning },
    { icon: Users,         label: t('nav.guild'),       path: '/community',   active: isCommunity },
    { icon: BarChart2,     label: t('nav.leaderboard'), path: '/leaderboard', active: isLeaderboard },
  ]
  return (
    <div className="inline-flex items-center rounded-full glass p-1 gap-0.5">
      {tabs.map(({ icon: Icon, label, path, active }) => (
        <button
          key={path}
          onClick={() => navigate(path)}
          className={`inline-flex items-center gap-2 rounded-full px-4 py-2 text-sm font-semibold transition-all ${
            active
              ? 'bg-gradient-to-r from-primary/90 to-accent/90 text-background shadow-[0_0_20px_-6px_var(--glow-primary)]'
              : 'text-muted-foreground hover:text-foreground'
          }`}
        >
          <Icon size={14} />
          {label}
        </button>
      ))}
    </div>
  )
}

function UserMenu({ user, onLogout, onAchievements, navigate, t }) {
  const [open, setOpen] = useState(false)
  const ref = useRef(null)
  const setShowProtocolModal = useStore((s) => s.setShowProtocolModal)
  const badges = useStore((s) => s.badges)

  useEffect(() => {
    function handleClick(e) {
      if (ref.current && !ref.current.contains(e.target)) setOpen(false)
    }
    document.addEventListener('mousedown', handleClick)
    return () => document.removeEventListener('mousedown', handleClick)
  }, [])

  const menuItems = [
    { icon: User,   label: t('nav.accountDetails'), action: () => { navigate('/profile'); setOpen(false) } },
    { icon: Trophy, label: t('nav.achievements'), badge: badges.length > 0 ? badges.length : null, action: () => { onAchievements(); setOpen(false) } },
    { icon: LogOut, label: t('nav.signOut'), action: () => { onLogout(); setOpen(false) }, danger: true },
  ]

  return (
    <div ref={ref} className="relative">
      <button
        onClick={() => setOpen((v) => !v)}
        className="flex items-center rounded-full ring-2 ring-background px-1.5 py-1 hover:opacity-90 transition-opacity"
        style={{ background: '#F97316' }}
      >
        <span className="grid h-7 w-7 place-items-center font-mono text-sm font-black text-black">
          {user.username?.[0]?.toUpperCase() ?? '?'}
        </span>
        <ChevronDown size={10} strokeWidth={2.5} className={`-ml-1 text-black/60 transition-transform duration-200 ${open ? 'rotate-180' : ''}`} />
      </button>

      {open && (
        <div className="absolute right-0 top-full mt-2 w-52 rounded-xl glass-strong border border-hairline shadow-lg z-50 overflow-hidden">
          {/* Header */}
          <div className="px-4 py-3 border-b border-hairline">
            <p className="font-mono text-xs font-bold text-foreground truncate">{user.username}</p>
            <p className="font-mono text-[10px] text-muted-foreground truncate">{user.email ?? 'dev-shell'}</p>
          </div>
          {/* Items */}
          <div className="py-1">
            {menuItems.map(({ icon: Icon, label, action, danger, dividerBefore, badge }) => (
              <div key={label}>
                {dividerBefore && <div className="mx-4 my-1 border-t border-hairline" />}
                <button
                  onClick={action}
                  className={`w-full flex items-center gap-3 px-4 py-2.5 text-sm font-medium transition-colors hover:bg-secondary/60 ${
                    danger ? 'text-destructive hover:text-destructive' : 'text-foreground'
                  }`}
                >
                  <Icon size={14} className="flex-shrink-0" />
                  <span className="font-mono text-xs flex-1 text-left">{label}</span>
                  {badge != null && (
                    <span className="font-mono text-[10px] font-bold text-accent bg-accent/15 rounded-full px-1.5 py-0.5">
                      {badge}
                    </span>
                  )}
                </button>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}

// ── Main export ───────────────────────────────────────────────────────────────

export default function Navbar() {
  const navigate = useNavigate()
  const { pathname } = useLocation()
  const { t } = useTranslation()
  const { theme, toggleTheme, lang, setLang, codeLang, setCodeLang, user, lives, streak } = useStore()
  const { logout } = useAuth()
  const [showAchievements, setShowAchievements] = useState(false)

  const handleLogout = () => { logout(); navigate('/') }

  const isLearning = pathname === '/pathway' || pathname.startsWith('/lesson') || pathname.startsWith('/module')
  const isCommunity = pathname === '/community'
  const isLeaderboard = pathname === '/leaderboard'

  const switcherProps = { isLearning, isCommunity, isLeaderboard, navigate, t }

  return (
    <>
    <nav className="sticky top-0 z-40 border-b border-border/60 bg-background/60 backdrop-blur-xl">

      {/* ── Main row ─────────────────────────────────────────────────────── */}
      <div className="mx-auto flex max-w-7xl items-center justify-between gap-3 px-4 py-3 lg:px-8">

        {/* Left: Logo + LANG/UI (md+) */}
        <div className="flex items-center gap-3 flex-shrink-0">

          {/* Logo */}
          <button
            onClick={() => navigate('/pathway')}
            className="flex items-center gap-2.5 hover:opacity-85 transition-opacity"
          >
            <div className="relative grid h-9 w-9 place-items-center rounded-xl glass">
              <span className="font-mono text-base font-bold leading-none">
                <span className="text-gradient">{'{'}</span>
                <span style={{ color: '#F97316' }}>·</span>
                <span className="text-gradient">{'}'}</span>
              </span>
              <span className="absolute -right-0.5 -top-0.5 h-2 w-2 rounded-full bg-accent shadow-[0_0_10px_var(--glow-accent)]" />
            </div>
            <div className="flex flex-col leading-none gap-0.5">
              <span className="font-mono text-[15px] font-bold tracking-tight text-foreground">
                code<span className="text-accent">bite</span>
              </span>
              <span className="font-mono text-[9px] uppercase tracking-[0.28em] text-muted-foreground">
                v0.1 · dev-shell
              </span>
            </div>
          </button>

          {/* LANG + UI — visible at md+ */}
          <div className="hidden md:flex items-center gap-3">
            <div className="flex items-center gap-1.5">
              <span className="font-mono text-[10px] uppercase tracking-[0.2em] text-muted-foreground">LANG</span>
              <LangPill codeLang={codeLang} setCodeLang={setCodeLang} />
            </div>
            <div className="flex items-center gap-1.5">
              <span className="font-mono text-[10px] uppercase tracking-[0.2em] text-muted-foreground">UI</span>
              <UIPill lang={lang} setLang={setLang} />
            </div>
          </div>
        </div>

        {/* Center: ViewSwitcher — visible at lg+ */}
        <div className="hidden lg:flex items-center">
          <ViewSwitcher {...switcherProps} />
        </div>

        {/* Right: stat chips + controls */}
        <div className="flex items-center gap-2 flex-shrink-0">

          {/* UPTIME chip */}
          <div className="hidden items-center gap-1.5 rounded-md glass px-2.5 py-1.5 sm:inline-flex">
            <Zap size={13.5} className="text-accent fill-accent" strokeWidth={2} />
            <span className="font-mono text-[9px] uppercase tracking-[0.2em] text-muted-foreground">{t('gamification.streak')}</span>
            <span className="font-mono text-xs font-bold text-foreground">{streak}d</span>
          </div>

          {/* TOKENS chip */}
          <div className="hidden items-center gap-1.5 rounded-md glass px-2.5 py-1.5 sm:inline-flex">
            <Hexagon size={13.5} className="text-primary fill-primary/30" strokeWidth={2.5} />
            <span className="font-mono text-[9px] uppercase tracking-[0.2em] text-muted-foreground">{t('gamification.lives')}</span>
            <span className="font-mono text-xs font-bold text-foreground">{lives}/{MAX_TOKENS}</span>
          </div>

          {/* Theme toggle — shows target mode icon */}
          <button
            onClick={toggleTheme}
            className="grid h-9 w-9 place-items-center rounded-full glass text-foreground transition-colors hover:bg-secondary"
            title={theme === 'dark' ? 'Switch to Light' : 'Switch to Dark'}
          >
            {theme === 'dark' ? <Sun size={16} /> : <Moon size={16} />}
          </button>

          {/* Avatar dropdown */}
          {user && (
            <UserMenu
              user={user}
              onLogout={handleLogout}
              onAchievements={() => setShowAchievements(true)}
              navigate={navigate}
              t={t}
            />
          )}
        </div>
      </div>

      {/* ── Overflow row 1: ViewSwitcher (under lg) ──────────────────────── */}
      <div className="flex items-center justify-center border-t border-border/60 px-4 py-2 lg:hidden">
        <ViewSwitcher {...switcherProps} />
      </div>

      {/* ── Overflow row 2: LANG + UI pills (under md) ───────────────────── */}
      <div className="flex items-center justify-center gap-4 border-t border-border/60 px-4 py-2 md:hidden">
        <LangPill codeLang={codeLang} setCodeLang={setCodeLang} />
        <UIPill lang={lang} setLang={setLang} />
      </div>

    </nav>
    {showAchievements && <AchievementsModal onClose={() => setShowAchievements(false)} />}
    </>
  )
}
