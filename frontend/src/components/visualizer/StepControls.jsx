import { useTranslation } from 'react-i18next'
import { Play, Pause, SkipBack, SkipForward, RotateCcw } from 'lucide-react'
import Button from '../ui/Button'

export default function StepControls({
  isPlaying,
  currentStep,
  totalSteps,
  speed,
  onPlay,
  onPause,
  onStepBack,
  onStepForward,
  onReset,
  onSpeedChange,
}) {
  const { t } = useTranslation()

  return (
    <div className="flex flex-col gap-3">
      {/* Step counter */}
      <p className="text-center text-sm text-muted-foreground font-mono">
        {t('visualizer.step')} {currentStep + 1} / {totalSteps}
      </p>

      {/* Control buttons */}
      <div className="flex items-center justify-center gap-2 flex-wrap">
        <Button variant="ghost" size="sm" onClick={onReset} title={t('visualizer.reset')}>
          <RotateCcw size={16} />
        </Button>
        <Button variant="ghost" size="sm" onClick={onStepBack} disabled={currentStep === 0} title={t('visualizer.stepBack')}>
          <SkipBack size={16} />
        </Button>
        <Button
          variant="primary"
          size="md"
          onClick={isPlaying ? onPause : onPlay}
          className="px-6"
        >
          {isPlaying ? (
            <><Pause size={18} /> {t('visualizer.pause')}</>
          ) : (
            <><Play size={18} /> {t('visualizer.play')}</>
          )}
        </Button>
        <Button variant="ghost" size="sm" onClick={onStepForward} disabled={currentStep >= totalSteps - 1} title={t('visualizer.stepForward')}>
          <SkipForward size={16} />
        </Button>
      </div>

      {/* Speed slider */}
      <div className="flex items-center gap-3">
        <span className="text-xs text-muted-foreground w-12 font-mono">{t('visualizer.speed')}</span>
        <input
          type="range"
          min={1}
          max={5}
          value={speed}
          onChange={(e) => onSpeedChange(Number(e.target.value))}
          className="flex-1"
          style={{ accentColor: 'var(--accent)' }}
        />
        <span className="text-xs text-muted-foreground w-4 text-right font-mono">{speed}x</span>
      </div>
    </div>
  )
}
