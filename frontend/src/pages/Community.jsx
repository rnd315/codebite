import { useEffect, useState } from 'react'
import { useSearchParams } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import client from '../api/client'
import useStore from '../store/useStore'
import FilterSidebar from '../components/community/FilterSidebar'
import TicketCard from '../components/community/TicketCard'
import QuestionCard from '../components/community/QuestionCard'
import OpenTicketModal from '../components/community/OpenTicketModal'
import { TicketSkeleton } from '../components/ui/Skeleton'
import { GUILD_TICKETS } from '../utils/constants'

function detectLang(body = '') {
  const b = body.toLowerCase()
  if (b.includes('python') || b.includes('.py') || b.includes('def ') || b.includes('print(')) return 'PY'
  return 'C++'
}

function normalizeBounties() {
  return GUILD_TICKETS.map((t) => ({
    id: `bounty-${t.id}`,
    type: 'bounty',
    module: t.module,
    lang: t.lang === 'PY' ? 'PY' : 'C++',
    title: t.issue,
    title_ro: t.issue_ro,
    body: t.body,
    body_ro: t.body_ro,
    path: t.path,
    user: t.user,
    codeSnippet: t.codeSnippet,
    options: t.options,
    options_ro: t.options_ro,
    correctOptionIndex: t.correctOptionIndex,
    status: 'open',
  }))
}

function normalizeDiscussions(questions) {
  return questions.map((q) => ({
    id: `disc-${q.id}`,
    rawId: q.id,
    type: 'discussion',
    module: 'all',
    lang: detectLang(q.body),
    title: q.body?.slice(0, 80) ?? '',
    body: q.body ?? '',
    author: q.author_username,
    author_username: q.author_username,
    user_id: q.user_id,
    answer_count: q.answer_count ?? 0,
    status: q.answer_count > 0 ? 'solved' : 'open',
  }))
}

const LANG_TABS = [
  { key: 'all', label: 'All' },
  { key: 'C++', label: 'C++' },
  { key: 'PY',  label: 'Python' },
]

export default function Community() {
  const { t } = useTranslation()
  const { user, lang, unlockBadge } = useStore()
  const [searchParams, setSearchParams] = useSearchParams()

  const [tickets, setTickets] = useState(normalizeBounties)
  const [loading, setLoading] = useState(true)
  const [topicFilter, setTopicFilter] = useState('all')
  const [statusFilter, setStatusFilter] = useState('all')
  const [sortBy, setSortBy] = useState('newest')
  const [langFilter, setLangFilter] = useState('all')
  const [showModal, setShowModal] = useState(false)

  useEffect(() => {
    client.get('/community/questions')
      .then(({ data }) => setTickets((prev) => [...prev, ...normalizeDiscussions(data)]))
      .catch(() => {})
      .finally(() => setLoading(false))
  }, [])

  // Auto-open modal when ?new=1 query param is present
  useEffect(() => {
    if (searchParams.get('new') === '1') {
      setShowModal(true)
      setSearchParams({}, { replace: true })
    }
  }, [searchParams, setSearchParams])

  const handleSolve = (id) =>
    setTickets((prev) => prev.map((t) => t.id === id ? { ...t, status: 'solved' } : t))

  const handleNewTicket = (ticket) => {
    setTickets((prev) => [{ ...ticket, type: 'bounty', lang: 'C++', module: 'all' }, ...prev])
    unlockBadge('GUILD_MEMBER')
  }

  const handleAnswerAccepted = (ticketId) => {
    setTickets((prev) => prev.map((t) => t.id === ticketId ? { ...t, status: 'solved' } : t))
  }

  const filtered = tickets.filter((ticket) => {
    const topicOk = topicFilter === 'all' || ticket.module === topicFilter
    const langOk = langFilter === 'all' || ticket.lang === langFilter
    const statusOk = statusFilter === 'all'
      || (statusFilter === 'open-bounties' && ticket.type === 'bounty' && ticket.status === 'open')
      || (statusFilter === 'solved' && ticket.status === 'solved')
      || (statusFilter === 'my-stack' && (ticket.author === user?.username || ticket.user === user?.username))
    return topicOk && langOk && statusOk
  })

  const sorted = [...filtered].sort((a, b) => {
    if (sortBy === 'most-answers') return (b.answer_count ?? 0) - (a.answer_count ?? 0)
    if (sortBy === 'bounties-first') return a.type === 'bounty' && b.type !== 'bounty' ? -1 : 1
    return 0
  })

  const isFiltered = topicFilter !== 'all' || statusFilter !== 'all' || sortBy !== 'newest' || langFilter !== 'all'

  return (
    <div className="relative py-6 space-y-6">

      {/* ── Ambient purple halo ───────────────────────── */}
      <div
        aria-hidden
        className="pointer-events-none absolute left-0 top-0 -z-10 h-full w-full"
        style={{
          background: [
            'radial-gradient(ellipse 70% 50% at 18% 38%, oklch(var(--primary-ch) / 0.14) 0%, transparent 62%)',
            'radial-gradient(ellipse 50% 40% at 82% 65%, oklch(var(--primary-ch) / 0.07) 0%, transparent 55%)',
          ].join(', ')
        }}
      />

      {/* ── Header ───────────────────────────────────── */}
      <div className="flex items-center justify-between gap-4">
        <h1 className="font-mono text-2xl font-bold text-foreground">
          {t('community.guildTitle')}
        </h1>
        <button
          onClick={() => setShowModal(true)}
          className="flex-shrink-0 bg-accent text-accent-foreground font-mono text-xs font-bold uppercase tracking-[0.12em] rounded-md px-5 py-3 hover:shadow-[0_0_40px_-4px_var(--glow-accent)] transition-all"
        >
          {t('community.openTicketBtn')}
        </button>
      </div>

      {/* ── Sidebar + grid ───────────────────────────── */}
      <div className="flex gap-6 items-start">
        <FilterSidebar
          topicFilter={topicFilter}   setTopicFilter={setTopicFilter}
          statusFilter={statusFilter} setStatusFilter={setStatusFilter}
          sortBy={sortBy}             setSortBy={setSortBy}
        />

        <div className="flex-1 min-w-0 space-y-4">
          {/* Language filter tabs */}
          <div className="flex rounded-xl overflow-hidden border border-hairline w-fit">
            {LANG_TABS.map(({ key, label }) => (
              <button
                key={key}
                onClick={() => setLangFilter(key)}
                className={`px-4 py-2 text-xs font-mono font-bold uppercase tracking-[0.1em] transition-colors
                  ${langFilter === key
                    ? 'bg-accent text-accent-foreground'
                    : 'text-muted-foreground hover:text-foreground'
                  }`}
              >
                {label}
              </button>
            ))}
          </div>

          {loading ? (
            <div className="grid grid-cols-1 xl:grid-cols-2 gap-4">
              {Array.from({ length: 4 }).map((_, i) => <TicketSkeleton key={i} />)}
            </div>
          ) : sorted.length === 0 ? (
            <p className="font-mono text-sm text-muted-foreground py-4">{t('community.noTickets')}</p>
          ) : (
            <div className="grid grid-cols-1 xl:grid-cols-2 gap-4">
              {sorted.map((ticket) =>
                ticket.type === 'discussion' ? (
                  <QuestionCard
                    key={ticket.id}
                    question={ticket}
                    onAnswerAccepted={() => handleAnswerAccepted(ticket.id)}
                  />
                ) : (
                  <TicketCard
                    key={ticket.id}
                    ticket={ticket}
                    lang={lang}
                    isFiltered={isFiltered}
                    onSolve={handleSolve}
                  />
                )
              )}
            </div>
          )}
        </div>
      </div>

      <OpenTicketModal
        open={showModal}
        onClose={() => setShowModal(false)}
        onSubmit={handleNewTicket}
      />
    </div>
  )
}
