import ConsoleVisualizer from './ConsoleVisualizer'
import MemoryVisualizer from './MemoryVisualizer'
import MissionVectorBasics from './MissionVectorBasics'

const COMPONENT_MAP = {
  MissionKernelCout:      ConsoleVisualizer,
  MissionMemoryAllocator: MemoryVisualizer,
  MissionVectorBasics:    MissionVectorBasics,
}

export default function VisualizerController({ interactiveComponent, lang, codeLang, phase, revealedCount }) {
  const VisComponent = COMPONENT_MAP[interactiveComponent]

  if (!VisComponent) {
    return (
      <div className="h-full flex flex-col items-center justify-center gap-4 p-6">
        <div className="w-16 h-16 rounded-full border-2 flex items-center justify-center"
          style={{ borderColor: 'rgba(0,242,255,0.2)' }}>
          <span className="font-mono text-lg" style={{ color: 'rgba(0,242,255,0.4)' }}>?</span>
        </div>
        <p className="font-mono text-[10px] uppercase tracking-[0.22em]" style={{ color: '#374151' }}>
          // no visualizer
        </p>
      </div>
    )
  }

  return (
    <VisComponent
      lang={lang}
      codeLang={codeLang}
      phase={phase}
      revealedCount={revealedCount}
    />
  )
}
