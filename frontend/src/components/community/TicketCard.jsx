import { useState } from 'react'
import { useTranslation } from 'react-i18next'
import { ArrowUpRight, ChevronUp } from 'lucide-react'
import { motion, AnimatePresence } from 'framer-motion'
import client from '../../api/client'
import useStore from '../../store/useStore'

export default function TicketCard({ ticket, isFiltered = false, onSolve }) {
  const { t, i18n } = useTranslation()
  const lang = i18n.language?.startsWith('ro') ? 'ro' : 'en'
  const setLives = useStore((s) => s.setLives)

  const [expanded, setExpanded] = useState(false)
  const [result, setResult] = useState(null)   // null | 'success' | 'fail'
  const [tokensFull, setTokensFull] = useState(false)
  const [loading, setLoading] = useState(false)
  const [reply, setReply] = useState('')

  const isBounty = ticket.type === 'bounty'
  const isResolved = result !== null

  const title = lang === 'ro' && ticket.title_ro ? ticket.title_ro : ticket.title
  const body  = lang === 'ro' && ticket.body_ro  ? ticket.body_ro  : ticket.body
  const opts  = lang === 'ro' && ticket.options_ro ? ticket.options_ro : ticket.options

  const handleOption = async (index) => {
    if (isResolved || loading) return
    if (index === ticket.correctOptionIndex) {
      setLoading(true)
      try {
        const { data } = await client.post('/community/tokens/earn')
        setLives(data.lives)
        setResult('success')
        onSolve?.(ticket.id)
      } catch (err) {
        if (err.response?.status === 400 && err.response?.data?.detail === 'TOKENS_FULL') {
          setTokensFull(true)
          setResult('success')
          onSolve?.(ticket.id)
        }
      } finally {
        setLoading(false)
      }
    } else {
      setResult('fail')
    }
  }

  const borderClass = isResolved
    ? result === 'success' ? 'border-success/40 bg-success/5' : 'border-destructive/40 bg-destructive/5'
    : isFiltered
      ? 'border-hairline bg-card hover:border-accent/40'
      : 'border-primary/30 bg-primary/5 hover:border-primary/50 hover:shadow-[0_0_30px_-10px_var(--glow-primary)]'

  return (
    <motion.div layout className={`rounded-xl overflow-hidden border transition-colors ${borderClass}`}>

      {/* ── Terminal top bar ─────────────────────────── */}
      <div className="flex items-center gap-1.5 px-3 py-2 bg-secondary/40 border-b border-hairline">
        <span className="h-2 w-2 rounded-full bg-destructive/70" />
        <span className="h-2 w-2 rounded-full bg-streak/70" />
        <span className="h-2 w-2 rounded-full bg-accent/70" />
        <span className="font-mono text-[9px] uppercase tracking-[0.18em] text-muted-foreground ml-2 flex-1 truncate">
          {ticket.path ?? `~/threads/${ticket.id}`}
        </span>
        <span className={`font-mono text-[9px] font-bold ${ticket.lang === 'C++' ? 'text-primary' : 'text-accent'}`}>
          {ticket.lang ?? (ticket.type === 'discussion' ? 'THREAD' : '')}
        </span>
      </div>

      {/* ── Card body ────────────────────────────────── */}
      <div className="p-4 space-y-1.5">
        <p className="font-mono text-[11px] text-accent">
          $ {ticket.user ?? ticket.author} &middot; {t('community.openTicketLabel')}
        </p>
        <p className="font-mono text-sm font-bold text-foreground">
          &gt; {title}
        </p>
        <p className="text-[11px] leading-relaxed text-muted-foreground pl-3 line-clamp-2">
          {body}
        </p>
      </div>

      {/* ── Expanded content (AnimatePresence) ───────── */}
      <AnimatePresence>
        {expanded && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.22, ease: 'easeInOut' }}
            className="overflow-hidden"
          >
            <div className="px-4 pb-4 pt-3 space-y-3 border-t border-hairline">
              {isBounty ? (
                <>
                  <pre className="bg-background border border-hairline rounded-lg p-3 font-mono text-xs text-foreground overflow-x-auto leading-relaxed whitespace-pre">
                    {ticket.codeSnippet}
                  </pre>
                  {!isResolved ? (
                    <div className="space-y-2">
                      <p className="font-mono text-[10px] uppercase tracking-[0.2em] text-muted-foreground">
                        {t('community.selectFix')}
                      </p>
                      {opts?.map((opt, i) => (
                        <button
                          key={i}
                          onClick={() => handleOption(i)}
                          disabled={loading}
                          className="w-full text-left glass rounded-md px-4 py-2.5 font-mono text-xs text-foreground border border-hairline hover:border-accent/50 transition-all disabled:opacity-50"
                        >
                          <span className="text-muted-foreground mr-2">[{String.fromCharCode(65 + i)}]</span>
                          {opt}
                        </button>
                      ))}
                    </div>
                  ) : (
                    <p className={`font-mono text-xs px-3 py-2.5 rounded-md border ${
                      result === 'success'
                        ? 'text-success border-success/30 bg-success/10'
                        : 'text-destructive border-destructive/30 bg-destructive/10'
                    }`}>
                      {result === 'success'
                        ? tokensFull ? t('community.tokensFull') : t('community.patchApplied')
                        : t('community.patchFailed')}
                    </p>
                  )}
                </>
              ) : (
                <>
                  <p className="text-sm text-muted-foreground leading-relaxed">{body}</p>
                  <textarea
                    value={reply}
                    onChange={(e) => setReply(e.target.value)}
                    placeholder={t('community.replyPlaceholder')}
                    rows={2}
                    className="w-full bg-background border border-hairline rounded-lg px-3 py-2 font-mono text-xs text-foreground placeholder:text-muted-foreground focus:outline-none focus:border-accent resize-none"
                  />
                  <button
                    onClick={() => setReply('')}
                    disabled={!reply.trim()}
                    className="font-mono text-xs font-bold uppercase tracking-[0.12em] rounded-md px-4 py-2 bg-accent text-accent-foreground hover:shadow-[0_0_30px_-4px_var(--glow-accent)] transition-all disabled:opacity-40 disabled:cursor-not-allowed"
                  >
                    {t('community.submitReply')}
                  </button>
                </>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* ── Footer (hidden once resolved) ────────────── */}
      {!isResolved && (
        <div className="flex items-center justify-between px-4 py-2.5 border-t border-dashed border-hairline/50 font-mono text-[10px] uppercase tracking-[0.15em]">
          <span className="text-muted-foreground">{t('community.awaitingPatch')}</span>
          <button
            onClick={() => setExpanded((p) => !p)}
            className="inline-flex items-center gap-1.5 rounded-md bg-accent px-3 py-1.5 text-[11px] font-bold uppercase tracking-[0.1em] text-accent-foreground transition-all hover:shadow-[0_0_20px_-4px_var(--glow-accent)]"
          >
            {isBounty ? t('community.debugAndEarnBtn') : t('community.viewThread')}
            {expanded
              ? <ChevronUp size={12} strokeWidth={3} />
              : <ArrowUpRight size={12} strokeWidth={3} />}
          </button>
        </div>
      )}
    </motion.div>
  )
}
