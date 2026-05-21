import { useState } from 'react'
import { useTranslation } from 'react-i18next'
import Modal from '../ui/Modal'
import useStore from '../../store/useStore'

const MODULES = [
  { value: 'foundations',      labelKey: 'community.topicFoundations' },
  { value: 'control-flow',     labelKey: 'community.topicControlFlow' },
  { value: 'number-crunching', labelKey: 'community.topicNumberCrunching' },
  { value: 'data-structures',  labelKey: 'community.topicDataStructures' },
  { value: 'algorithms',       labelKey: 'community.topicAlgorithms' },
]

export default function OpenTicketModal({ open, onClose, onSubmit }) {
  const { t } = useTranslation()
  const user = useStore((s) => s.user)

  const [title, setTitle] = useState('')
  const [module, setModule] = useState('')
  const [description, setDescription] = useState('')

  const handleSubmit = (e) => {
    e.preventDefault()
    if (!title.trim() || !module || !description.trim()) return
    onSubmit({
      id: `disc-local-${Date.now()}`,
      type: 'discussion',
      module,
      title: title.trim(),
      title_ro: title.trim(),
      body: description.trim(),
      body_ro: description.trim(),
      author: user?.username ?? 'you',
      answer_count: 0,
      status: 'open',
    })
    setTitle(''); setModule(''); setDescription('')
    onClose()
  }

  const inputClass = 'w-full bg-background border border-hairline rounded-lg px-3 py-2.5 text-sm font-mono text-foreground placeholder:text-muted-foreground focus:outline-none focus:border-accent transition-colors'

  return (
    <Modal open={open} onClose={onClose} title={t('community.modalTitle')}>
      <form onSubmit={handleSubmit} className="space-y-4">
        {/* Issue Title */}
        <div className="space-y-1.5">
          <label className="font-mono text-[10px] uppercase tracking-[0.18em] text-muted-foreground">
            {t('community.fieldIssueTitle')}
          </label>
          <input
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder={t('community.fieldIssuePlaceholder')}
            required
            className={inputClass}
          />
        </div>

        {/* Select Module */}
        <div className="space-y-1.5">
          <label className="font-mono text-[10px] uppercase tracking-[0.18em] text-muted-foreground">
            {t('community.fieldSelectModule')}
          </label>
          <select
            value={module}
            onChange={(e) => setModule(e.target.value)}
            required
            className={inputClass}
          >
            <option value="">{t('community.fieldModulePlaceholder')}</option>
            {MODULES.map(({ value, labelKey }) => (
              <option key={value} value={value}>{t(labelKey)}</option>
            ))}
          </select>
        </div>

        {/* Code / Description */}
        <div className="space-y-1.5">
          <label className="font-mono text-[10px] uppercase tracking-[0.18em] text-muted-foreground">
            {t('community.fieldCodeDesc')}
          </label>
          <textarea
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder={t('community.fieldCodePlaceholder')}
            rows={4}
            required
            className={`${inputClass} resize-none`}
          />
        </div>

        <button
          type="submit"
          disabled={!title.trim() || !module || !description.trim()}
          className="w-full bg-accent text-accent-foreground font-mono text-xs font-bold uppercase tracking-[0.12em] rounded-md px-5 py-3 hover:shadow-[0_0_40px_-4px_var(--glow-accent)] transition-all disabled:opacity-40 disabled:cursor-not-allowed"
        >
          {t('community.submitToGuild')}
        </button>
      </form>
    </Modal>
  )
}
