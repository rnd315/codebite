import { useState } from 'react'
import { useTranslation } from 'react-i18next'
import { ArrowUpRight, ChevronUp } from 'lucide-react'
import client from '../../api/client'
import useStore from '../../store/useStore'

export default function GuildTicket({ ticket }) {
  const { t } = useTranslation()
  const setLives = useStore((s) => s.setLives)
  const [expanded, setExpanded] = useState(false)
  const [status, setStatus] = useState(null) // null | 'success' | 'fail'
  const [tokensFull, setTokensFull] = useState(false)
  const [loading, setLoading] = useState(false)

  const isResolved = status !== null

  const handleOption = async (index) => {
    if (isResolved || loading) return
    if (index === ticket.correctOptionIndex) {
      setLoading(true)
      try {
        const { data } = await client.post('/community/tokens/earn')
        setLives(data.lives)
        setStatus('success')
      } catch (err) {
        if (err.response?.status === 400 && err.response?.data?.detail === 'TOKENS_FULL') {
          setTokensFull(true)
          setStatus('success')
        }
      } finally {
        setLoading(false)
      }
    } else {
      setStatus('fail')
    }
  }

  return (
    <div className={`relative overflow-hidden rounded-xl border transition-all ${
      isResolved
        ? status === 'success'
          ? 'border-success/40 bg-success/5'
          : 'border-destructive/40 bg-destructive/5'
        : 'border-hairline bg-background/60 hover:border-accent/50 hover:shadow-[0_0_30px_-10px_var(--glow-accent)]'
    }`}>

      {/* macOS title bar */}
      <div className="flex items-center gap-1.5 px-3 py-2 bg-secondary/40 border-b border-hairline">
        <span className="h-2 w-2 rounded-full bg-destructive/70" />
        <span className="h-2 w-2 rounded-full bg-streak/70" />
        <span className="h-2 w-2 rounded-full bg-accent/70" />
        <span className="font-mono text-[9px] uppercase tracking-[0.18em] text-muted-foreground ml-2 flex-1 truncate">
          {ticket.path}
        </span>
        <span className={`font-mono text-[9px] uppercase tracking-wide font-bold ${
          ticket.lang === 'C++' ? 'text-primary' : 'text-accent'
        }`}>
          {ticket.lang}
        </span>
      </div>

      {/* Body */}
      <div className="p-4">
        <p className="font-mono text-[11px] text-accent mb-1.5">
          $ {ticket.user} · {t('community.openTicketLabel')}
        </p>
        <p className="font-mono text-sm font-bold text-foreground mb-1.5">
          &gt; {ticket.issue}
        </p>
        <p className="text-[11px] leading-relaxed text-muted-foreground pl-4">
          {ticket.body}
        </p>

        {/* Expanded: code snippet + option buttons */}
        {expanded && (
          <div className="mt-4 space-y-3">
            <pre className="bg-background border border-hairline rounded-lg p-3 font-mono text-xs text-foreground overflow-x-auto leading-relaxed whitespace-pre">
              {ticket.codeSnippet}
            </pre>

            {!isResolved ? (
              <div className="space-y-2">
                <p className="font-mono text-[10px] uppercase tracking-[0.2em] text-muted-foreground">
                  {t('community.selectFix')}
                </p>
                {ticket.options.map((opt, i) => (
                  <button
                    key={i}
                    onClick={() => handleOption(i)}
                    disabled={loading}
                    className="w-full text-left glass rounded-md px-4 py-2.5 font-mono text-xs text-foreground border border-hairline hover:border-accent/50 transition-all disabled:opacity-50 disabled:cursor-wait"
                  >
                    <span className="text-muted-foreground mr-2">
                      [{String.fromCharCode(65 + i)}]
                    </span>
                    {opt}
                  </button>
                ))}
              </div>
            ) : (
              <div className={`font-mono text-xs px-3 py-2.5 rounded-md border ${
                status === 'success'
                  ? 'text-success border-success/30 bg-success/10'
                  : 'text-destructive border-destructive/30 bg-destructive/10'
              }`}>
                {status === 'success'
                  ? tokensFull
                    ? t('community.tokensFull')
                    : t('community.patchApplied')
                  : t('community.patchFailed')
                }
              </div>
            )}
          </div>
        )}
      </div>

      {/* Footer — hidden once resolved */}
      {!isResolved && (
        <div className="flex items-center justify-between px-4 py-2.5 border-t border-hairline font-mono text-[10px] uppercase tracking-[0.15em]">
          <span className="text-muted-foreground">{t('community.awaitingPatch')}</span>
          <button
            onClick={() => setExpanded((p) => !p)}
            className="inline-flex items-center gap-1 rounded-md bg-accent px-3 py-1.5 text-[11px] font-bold uppercase tracking-[0.1em] text-accent-foreground transition-all hover:shadow-[0_0_20px_-4px_var(--glow-accent)]"
          >
            {t('community.debugEarnBtn')}
            {expanded
              ? <ChevronUp size={12} strokeWidth={3} />
              : <ArrowUpRight size={12} strokeWidth={3} />
            }
          </button>
        </div>
      )}
    </div>
  )
}
