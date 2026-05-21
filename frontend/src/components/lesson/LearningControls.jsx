import { useEffect } from 'react'
import useStore from '../../store/useStore'

const TECHS = [
  { id: 'cpp', label: 'C++' },
  { id: 'python', label: 'Python' },
]

const STYLES = [
  { id: 'architect', label: 'Architect' },
  { id: 'hacker', label: 'Hacker' },
  { id: 'socrates', label: 'Socrates' },
]

export default function LearningControls() {
  const codeLang = useStore((s) => s.codeLang)
  const setCodeLang = useStore((s) => s.setCodeLang)
  const learningProtocol = useStore((s) => s.learningProtocol)
  const setLearningProtocol = useStore((s) => s.setLearningProtocol)

  useEffect(() => {
    if (!learningProtocol) setLearningProtocol('architect')
  }, [])

  const activeStyle = learningProtocol ?? 'architect'

  return (
    <div className="flex flex-wrap gap-3 items-center">
      <div className="flex gap-1 p-0.5 rounded-md bg-secondary">
        {TECHS.map(({ id, label }) => (
          <button
            key={id}
            onClick={() => setCodeLang(id)}
            className={`font-mono text-xs uppercase tracking-[0.18em] px-3 py-1.5 rounded transition-colors ${
              codeLang === id
                ? 'bg-accent text-accent-foreground'
                : 'text-muted-foreground hover:text-foreground'
            }`}
          >
            {label}
          </button>
        ))}
      </div>

      <div className="flex gap-1 p-0.5 rounded-md bg-secondary">
        {STYLES.map(({ id, label }) => (
          <button
            key={id}
            onClick={() => setLearningProtocol(id)}
            className={`font-mono text-xs uppercase tracking-[0.18em] px-3 py-1.5 rounded transition-colors ${
              activeStyle === id
                ? 'bg-accent text-accent-foreground'
                : 'text-muted-foreground hover:text-foreground'
            }`}
          >
            {label}
          </button>
        ))}
      </div>
    </div>
  )
}
