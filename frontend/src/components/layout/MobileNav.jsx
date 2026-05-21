import { useNavigate, useLocation } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import { Map, MessageCircle, User } from 'lucide-react'

const TABS = [
  { path: '/pathway', icon: Map, key: 'mobileNav.learn' },
  { path: '/community', icon: MessageCircle, key: 'mobileNav.community' },
  { path: '/profile', icon: User, key: 'mobileNav.profile' },
]

export default function MobileNav() {
  const navigate = useNavigate()
  const { pathname } = useLocation()
  const { t } = useTranslation()

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-40 sm:hidden h-16 glass-strong border-t border-border/60 flex items-center">
      {TABS.map(({ path, icon: Icon, key }) => {
        const active = pathname === path || pathname.startsWith(path + '/')
        return (
          <button
            key={path}
            onClick={() => navigate(path)}
            className={`flex-1 h-full flex flex-col items-center justify-center gap-0.5 text-[10px] font-mono transition-colors ${
              active ? 'text-accent' : 'text-muted-foreground hover:text-foreground'
            }`}
          >
            <Icon size={19} strokeWidth={active ? 2.5 : 1.6} />
            <span className="uppercase tracking-wide">{t(key)}</span>
          </button>
        )
      })}
    </nav>
  )
}
