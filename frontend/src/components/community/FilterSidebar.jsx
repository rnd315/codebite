import { useTranslation } from 'react-i18next'

const TOPIC_FILTERS = [
  { key: 'all',               labelKey: 'community.topicAll' },
  { key: 'foundations',       labelKey: 'community.topicFoundations' },
  { key: 'control-flow',      labelKey: 'community.topicControlFlow' },
  { key: 'number-crunching',  labelKey: 'community.topicNumberCrunching' },
  { key: 'data-structures',   labelKey: 'community.topicDataStructures' },
  { key: 'algorithms',        labelKey: 'community.topicAlgorithms' },
]

const STATUS_FILTERS = [
  { key: 'all',           labelKey: 'community.topicAll' },
  { key: 'open-bounties', labelKey: 'community.statusOpenBounties' },
  { key: 'solved',        labelKey: 'community.statusSolved' },
  { key: 'my-stack',      labelKey: 'community.statusMyStack' },
]

const SORT_OPTIONS = [
  { key: 'newest',         labelKey: 'community.sortNewest' },
  { key: 'most-answers',   labelKey: 'community.sortMostAnswers' },
  { key: 'bounties-first', labelKey: 'community.sortBountiesFirst' },
]

function FilterGroup({ label, filters, active, onChange }) {
  const { t } = useTranslation()
  return (
    <div className="space-y-0.5">
      <p className="font-mono text-[9px] uppercase tracking-[0.22em] text-muted-foreground px-3 py-1.5">
        {label}
      </p>
      {filters.map(({ key, labelKey }) => (
        <button
          key={key}
          onClick={() => onChange(key)}
          className={`w-full text-left px-3 py-2 rounded-lg font-mono text-xs transition-all ${
            active === key
              ? 'bg-accent/10 text-accent border border-accent/30'
              : 'text-muted-foreground hover:text-foreground hover:bg-secondary/40 border border-transparent'
          }`}
        >
          {t(labelKey)}
        </button>
      ))}
    </div>
  )
}

export default function FilterSidebar({
  topicFilter, setTopicFilter,
  statusFilter, setStatusFilter,
  sortBy, setSortBy,
}) {
  const { t } = useTranslation()

  return (
    <aside className="w-64 flex-shrink-0 space-y-5 hidden md:block sticky top-6 self-start">
      <FilterGroup
        label={t('community.filterByTopic')}
        filters={TOPIC_FILTERS}
        active={topicFilter}
        onChange={setTopicFilter}
      />
      <FilterGroup
        label={t('community.filterByStatus')}
        filters={STATUS_FILTERS}
        active={statusFilter}
        onChange={setStatusFilter}
      />
      <FilterGroup
        label={t('community.sortBy')}
        filters={SORT_OPTIONS}
        active={sortBy}
        onChange={setSortBy}
      />
    </aside>
  )
}
