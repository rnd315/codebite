import { useNavigate } from 'react-router-dom'
import { Terminal, ChevronRight } from 'lucide-react'

export default function Onboarding() {
  const navigate = useNavigate()

  return (
    <div className="min-h-screen bg-background flex flex-col items-center justify-center px-4 py-12">
      <div className="w-full max-w-md">

        <div className="flex items-center gap-2 mb-8">
          <Terminal size={18} className="text-accent" />
          <span className="font-mono text-xs text-muted-foreground uppercase tracking-widest">
            codebite / onboarding
          </span>
        </div>

        <h1 className="font-mono text-2xl font-bold text-foreground mb-2">
          &gt;_ calibrare.exe
        </h1>
        <p className="text-muted-foreground text-sm mb-8">
          Ești gata să înveți programare?
        </p>

        <button
          onClick={() => navigate('/pathway')}
          className="w-full flex items-center gap-3 p-4 rounded-xl border border-hairline glass hover:border-accent/50 transition-all group text-left"
        >
          <span className="font-mono text-accent text-lg">▶</span>
          <div>
            <p className="font-semibold text-foreground group-hover:text-accent transition-colors">
              Pornește de la zero
            </p>
            <p className="text-xs text-muted-foreground font-mono mt-0.5">
              // Începe la MOD_01 — Fundamente
            </p>
          </div>
          <ChevronRight size={16} className="text-muted-foreground ml-auto group-hover:text-accent transition-colors" />
        </button>

      </div>
    </div>
  )
}
