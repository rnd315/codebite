import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import { AnimatePresence, motion } from 'framer-motion'
import useAuth from '../hooks/useAuth'
import Button from '../components/ui/Button'
import TerminalBoot from '../components/layout/TerminalBoot'

export default function Home() {
  const { t } = useTranslation()
  const navigate = useNavigate()
  const { login, register, loading, error } = useAuth()
  const [tab, setTab] = useState('login') // 'login' | 'register'
  const [form, setForm] = useState({ username: '', email: '', password: '' })
  const [bootDone, setBootDone] = useState(
    () => localStorage.getItem('codebite_boot_v1') === '1'
  )

  const handleBootComplete = () => {
    localStorage.setItem('codebite_boot_v1', '1')
    setBootDone(true)
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    const result =
      tab === 'login'
        ? await login({ email: form.email, password: form.password })
        : await register(form)
    if (result.ok) navigate(tab === 'login' ? '/pathway' : '/onboarding')
  }

  const update = (field) => (e) => setForm((p) => ({ ...p, [field]: e.target.value }))

  return (
    <AnimatePresence mode="wait">
      {!bootDone ? (
        <TerminalBoot key="boot" onComplete={handleBootComplete} />
      ) : (
        <motion.div
          key="login"
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.35, ease: 'easeOut' }}
          className="min-h-screen bg-background flex flex-col items-center justify-center px-4 py-12"
        >
          {/* Hero */}
          <div className="text-center mb-10 max-w-xl">
            <h1 className="text-5xl sm:text-6xl font-bold tracking-tight mb-3 font-mono">
              <span className="text-accent">Code</span>
              <span className="text-foreground">Bite</span>
            </h1>
            <p className="text-xl text-muted-foreground mb-2">{t('auth.tagline')}</p>
            <p className="text-sm text-muted-foreground">{t('auth.subtitle')}</p>

            <div className="flex items-center justify-center gap-6 mt-6 text-sm text-muted-foreground">
              <span className="flex items-center gap-1.5">{t('home.featureTokens')}</span>
              <span className="flex items-center gap-1.5">{t('home.featureUptime')}</span>
              <span className="flex items-center gap-1.5">{t('home.featureVisualizer')}</span>
            </div>
          </div>

          {/* Auth card */}
          <div className="w-full max-w-sm glass-strong rounded-2xl p-6 shadow-2xl">
            {/* Tab switcher */}
            <div className="flex rounded-xl overflow-hidden border border-hairline mb-5">
              {['login', 'register'].map((t_) => (
                <button
                  key={t_}
                  onClick={() => setTab(t_)}
                  className={`flex-1 py-2.5 text-sm font-medium transition-colors font-mono
                    ${tab === t_
                      ? 'bg-accent text-accent-foreground font-bold'
                      : 'text-muted-foreground hover:text-foreground'
                    }`}
                >
                  {t_ === 'login' ? t('auth.login') : t('auth.register')}
                </button>
              ))}
            </div>

            <form onSubmit={handleSubmit} className="space-y-3">
              {tab === 'register' && (
                <input
                  type="text"
                  placeholder={t('auth.username')}
                  value={form.username}
                  onChange={update('username')}
                  required
                  className="w-full bg-background border border-hairline rounded-lg px-4 py-3 text-sm focus:outline-none focus:border-accent text-foreground placeholder:text-muted-foreground font-mono"
                />
              )}
              <input
                type="email"
                placeholder={t('auth.email')}
                value={form.email}
                onChange={update('email')}
                required
                className="w-full bg-background border border-hairline rounded-lg px-4 py-3 text-sm focus:outline-none focus:border-accent text-foreground placeholder:text-muted-foreground font-mono"
              />
              <input
                type="password"
                placeholder={t('auth.password')}
                value={form.password}
                onChange={update('password')}
                required
                className="w-full bg-background border border-hairline rounded-lg px-4 py-3 text-sm focus:outline-none focus:border-accent text-foreground placeholder:text-muted-foreground font-mono"
              />

              {error && (
                <p className="text-xs text-destructive text-center">
                  {error.startsWith('error') ? t(`auth.${error}`) : error}
                </p>
              )}

              <Button type="submit" disabled={loading} className="w-full mt-1">
                {loading
                  ? tab === 'login' ? t('auth.loggingIn') : t('auth.registering')
                  : tab === 'login' ? t('auth.loginBtn') : t('auth.registerBtn')
                }
              </Button>
            </form>

            <button
              onClick={() => setTab(tab === 'login' ? 'register' : 'login')}
              className="mt-4 w-full text-xs text-muted-foreground hover:text-foreground transition-colors text-center"
            >
              {tab === 'login' ? t('auth.switchToRegister') : t('auth.switchToLogin')}
            </button>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}
