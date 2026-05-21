import { useState } from 'react'
import { useTranslation } from 'react-i18next'
import useVisualizer from '../../hooks/useVisualizer'
import useStore from '../../store/useStore'
import ArrayBar from './ArrayBar'
import StepControls from './StepControls'
import Card from '../ui/Card'

const ALGO_SLUGS = {
  'bubble-sort': 'bubble-sort',
  'linear-search': 'linear-search',
  'binary-search': 'binary-search',
}

export default function AlgorithmVisualizer({ lessonSlug }) {
  const { t, i18n } = useTranslation()
  const lang = useStore((s) => s.lang)
  const algorithmName = ALGO_SLUGS[lessonSlug] ?? 'bubble-sort'
  const isSearch = algorithmName.includes('search')

  const {
    step,
    steps,
    currentStep,
    totalSteps,
    isPlaying,
    speed,
    array,
    target,
    play,
    pause,
    stepForward,
    stepBack,
    reset,
    setSpeed,
    setCustomArray,
    setSearchTarget,
  } = useVisualizer(algorithmName)

  const [customInput, setCustomInput] = useState(array.join(', '))
  const [targetInput, setTargetInput] = useState(String(target))

  const maxValue = Math.max(...(step?.array ?? array), 1)

  const applyCustomArray = () => {
    const parsed = customInput
      .split(',')
      .map((s) => parseInt(s.trim(), 10))
      .filter((n) => !isNaN(n))
    if (parsed.length > 1) setCustomArray(parsed)
  }

  const applyTarget = () => {
    const val = parseInt(targetInput, 10)
    if (!isNaN(val)) setSearchTarget(val)
  }

  const message = step
    ? (lang === 'ro' ? step.message_ro : step.message_en)
    : ''

  return (
    <Card className="p-4 sm:p-6 space-y-4">
      <h3 className="text-base font-semibold text-accent">{t('visualizer.title')}</h3>

      {/* Custom input row */}
      <div className="flex flex-col sm:flex-row gap-2">
        <input
          type="text"
          value={customInput}
          onChange={(e) => setCustomInput(e.target.value)}
          onBlur={applyCustomArray}
          onKeyDown={(e) => e.key === 'Enter' && applyCustomArray()}
          placeholder={t('visualizer.customArray')}
          className="flex-1 bg-background border border-hairline rounded-lg px-3 py-2 text-sm font-mono focus:outline-none focus:border-accent text-foreground placeholder:text-muted-foreground"
        />
        {isSearch && (
          <input
            type="number"
            value={targetInput}
            onChange={(e) => setTargetInput(e.target.value)}
            onBlur={applyTarget}
            onKeyDown={(e) => e.key === 'Enter' && applyTarget()}
            placeholder={t('visualizer.searchTarget')}
            className="w-32 bg-background border border-hairline rounded-lg px-3 py-2 text-sm font-mono focus:outline-none focus:border-accent text-foreground placeholder:text-muted-foreground"
          />
        )}
      </div>

      {/* Array bars */}
      <div className="flex items-end gap-1.5 h-36 px-1">
        {(step?.array ?? array).map((val, i) => (
          <ArrayBar key={i} index={i} value={val} maxValue={maxValue} step={step} />
        ))}
      </div>

      {/* Step annotation */}
      <div className="min-h-[44px] flex items-center justify-center px-3 py-2 bg-background rounded-lg border border-hairline">
        <p className="text-sm text-center font-mono text-foreground">
          {message || '—'}
        </p>
      </div>

      {/* Controls */}
      <StepControls
        isPlaying={isPlaying}
        currentStep={currentStep}
        totalSteps={totalSteps}
        speed={speed}
        onPlay={play}
        onPause={pause}
        onStepBack={stepBack}
        onStepForward={stepForward}
        onReset={reset}
        onSpeedChange={setSpeed}
      />
    </Card>
  )
}
