import { useNavigate, useLocation } from 'react-router-dom'
import { useRef, useState, useEffect } from 'react'
import { Sun, Moon, Zap, Users, GraduationCap, Hexagon, User, Trophy, LogOut, ChevronDown } from 'lucide-react'
import { useTranslation } from 'react-i18next'
import useStore from '../../store/useStore'
import useAuth from '../../hooks/useAuth'
import { MAX_TOKENS } from '../../utils/constants'

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

function ViewSwitcher({ isLearning, isCommunity, activeTab, navigate, t }) {
  return (
    <div className={`relative inline-flex items-center rounded-full glass p-1 transition-shadow duration-300 ${isCommunity ? 'shadow-[0_0_40px_-6px_var(--glow-primary)]' : ''}`}>
      {/* Sliding gradient thumb */}
      <div
        className="absolute inset-y-1 rounded-full bg-gradient-to-r from-primary/90 to-accent/90 shadow-[0_0_30px_-4px_var(--glow-primary)] transition-transform duration-300"
        style={{
          width: 'calc(50% - 4px)',
          transform: activeTab === 0 ? 'translateX(2px)' : 'translateX(calc(100% + 6px))',
        }}
      />
      <button
        onClick={() => navigate('/pathway')}
        className={`relative z-10 inline-flex items-center gap-2 rounded-full px-4 py-2 text-sm font-semibold transition-colors ${
          isLearning ? 'text-background' : 'text-muted-foreground hover:text-foreground'
        }`}
      >
        <GraduationCap size={14} />
        {t('nav.learning')}
      </button>
      <button
        onClick={() => navigate('/community')}
        className={`relative z-10 inline-flex items-center gap-2 rounded-full px-4 py-2 text-sm font-semibold transition-colors ${
          isCommunity ? 'text-background' : 'text-muted-foreground hover:text-foreground'
        }`}
      >
        <Users size={14} />
        {t('nav.guild')}
      </button>
    </div>
  )
}

function UserMenu({ user, onLogout, navigate, t }) {
  const [open, setOpen] = useState(false)
  const ref = useRef(null)

  useEffect(() => {
    function handleClick(e) {
      if (ref.current && !ref.current.contains(e.target)) setOpen(false)
    }
    document.addEventListener('mousedown', handleClick)
    return () => document.removeEventListener('mousedown', handleClick)
  }, [])

  const menuItems = [
    { icon: User,   label: t('nav.accountDetails'), action: () => { navigate('/profile'); setOpen(false) } },
    { icon: Trophy, label: t('nav.achievements'),   action: () => { navigate('/profile'); setOpen(false) } },
    { icon: LogOut, label: t('nav.signOut'),         action: () => { onLogout(); setOpen(false) }, danger: true },
  ]

  return (
    <div ref={ref} className="relative">
      <button
        onClick={() => setOpen((v) => !v)}
        className="relative flex items-center gap-1.5 rounded-full bg-gradient-to-br from-primary to-accent text-xs font-black text-background ring-2 ring-background pl-1 pr-2 py-1 hover:opacity-90 transition-opacity"
      >
        <span className="grid h-7 w-7 place-items-center rounded-full">
          {user.username?.[0]?.toUpperCase() ?? '?'}
        </span>
        <ChevronDown size={11} className={`transition-transform duration-200 ${open ? 'rotate-180' : ''}`} />
        <span className="absolute -bottom-0.5 -right-0.5 h-2.5 w-2.5 rounded-full bg-streak ring-2 ring-background" />
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
            {menuItems.map(({ icon: Icon, label, action, danger }) => (
              <button
                key={label}
                onClick={action}
                className={`w-full flex items-center gap-3 px-4 py-2.5 text-sm font-medium transition-colors hover:bg-secondary/60 ${
                  danger ? 'text-destructive hover:text-destructive' : 'text-foreground'
                }`}
              >
                <Icon size={14} className="flex-shrink-0" />
                <span>{label}</span>
              </button>
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

  const handleLogout = () => { logout(); navigate('/') }

  const isLearning = pathname === '/pathway' || pathname.startsWith('/lesson') || pathname.startsWith('/module')
  const isCommunity = pathname === '/community'
  const activeTab = isCommunity ? 1 : 0

  const switcherProps = { isLearning, isCommunity, activeTab, navigate, t }

  return (
    <nav className="sticky top-0 z-40 border-b border-border/60 bg-background/60 backdrop-blur-xl">

      {/* ── Main row ─────────────────────────────────────────────────────── */}
      <div className="mx-auto flex max-w-7xl items-center justify-between gap-3 px-4 py-3 lg:px-8">

        {/* Left: Logo + LANG/UI (md+) */}
        <div className="flex items-center gap-3 flex-shrink-0">

          {/* Logo */}
          <button
            onClick={() => window.location.reload()}
            className="flex items-center gap-2.5 hover:opacity-85 transition-opacity"
          >
            <div className="relative grid h-9 w-9 place-items-center rounded-xl glass">
              <span className="text-gradient font-mono text-base font-bold leading-none">{'{·}'}</span>
              <span className="absolute -right-0.5 -top-0.5 h-2 w-2 rounded-full bg-accent shadow-[0_0_10px_var(--glow-accent)]" />
            </div>
            <div className="flex flex-col leading-none gap-0.5">
              <span className="font-mono text-[15px] font-bold tracking-tight text-foreground">
                code<span className="text-accent">bite</span>
                <span className="ml-0.5 inline-block h-1.5 w-1.5 translate-y-[-2px] animate-pulse-soft rounded-full bg-accent align-middle" />
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
            <span className="font-mono text-[9px] uppercase tracking-[0.2em] text-muted-foreground">UPTIME</span>
            <span className="font-mono text-xs font-bold text-foreground">{streak}d</span>
          </div>

          {/* TOKENS chip */}
          <div className="hidden items-center gap-1.5 rounded-md glass px-2.5 py-1.5 sm:inline-flex">
            <Hexagon size={13.5} className="text-primary fill-primary/30" strokeWidth={2.5} />
            <span className="font-mono text-[9px] uppercase tracking-[0.2em] text-muted-foreground">TOKENS</span>
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
            <UserMenu user={user} onLogout={handleLogout} navigate={navigate} t={t} />
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
  )
}
