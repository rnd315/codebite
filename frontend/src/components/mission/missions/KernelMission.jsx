import { useState } from 'react'
import { useTranslation } from 'react-i18next'

export default function KernelMission({ onSuccess, onFailure, status }) {
  const { t } = useTranslation()
  const [operator, setOperator] = useState('wrong') // 'wrong' = >> | 'correct' = <<

  const toggleOperator = () => {
    if (status !== 'playing') return
    setOperator((prev) => (prev === 'wrong' ? 'correct' : 'wrong'))
  }

  const handleExecute = () => {
    if (status !== 'playing') return
    if (operator === 'correct') onSuccess()
    else onFailure()
  }

  const isPlaying = status === 'playing'
  const isSuccess = status === 'success'
  const codeColor = isSuccess ? 'text-success' : 'text-foreground'
  const codeBlockClass = `bg-card border border-hairline rounded-xl font-mono text-sm transition-all overflow-hidden${
    isSuccess ? ' shadow-[0_0_30px_-4px_var(--success)]' : ''
  }`

  return (
    <div className="space-y-4">
      {/* Section label */}
      <p className="font-mono text-[10px] uppercase tracking-[0.22em] text-muted-foreground">
        // REVERSE ENGINEERING MISSION
      </p>

      {/* Code block */}
      <div className={codeBlockClass}>
        {/* macOS traffic-light header */}
        <div className="flex items-center gap-1.5 px-3 py-2 bg-secondary/40 border-b border-hairline">
          <span className="h-2 w-2 rounded-full bg-destructive/70" />
          <span className="h-2 w-2 rounded-full bg-streak/70" />
          <span className="h-2 w-2 rounded-full bg-accent/70" />
          <span className="font-mono text-[9px] uppercase tracking-[0.18em] text-muted-foreground ml-2">
            ~/kernel/main.cpp
          </span>
        </div>

        {/* Code line */}
        <div className="p-6 flex items-center gap-1 select-none flex-wrap">
          <span className={codeColor}>cout</span>
          <span className={codeColor}>&nbsp;</span>
          <button
            onClick={toggleOperator}
            disabled={!isPlaying}
            className={`px-1.5 py-0.5 rounded border font-mono text-sm font-bold transition-all ${
              isPlaying
                ? 'border-accent text-accent hover:bg-accent/10 cursor-pointer'
                : 'border-hairline text-muted-foreground cursor-not-allowed'
            }`}
          >
            {operator === 'wrong' ? '>>' : '<<'}
          </button>
          <span className={codeColor}>&nbsp;&quot;System Online!&quot;;</span>
        </div>
      </div>

      {/* Execute button */}
      <button
        onClick={handleExecute}
        disabled={!isPlaying}
        className="bg-accent text-accent-foreground font-mono text-xs font-bold uppercase tracking-[0.12em] rounded-md px-5 py-3 hover:shadow-[0_0_40px_-4px_var(--glow-accent)] transition-all disabled:opacity-50 disabled:cursor-not-allowed"
      >
        {t('mission.kernel.execute')}
      </button>
    </div>
  )
}
