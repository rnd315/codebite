import { useState } from 'react'
import { useTranslation } from 'react-i18next'
import { motion, AnimatePresence } from 'framer-motion'
import StoryStep from './StoryStep'
import InteractiveMissionStep from './InteractiveMissionStep'
import QuizStep from './QuizStep'

export default function LessonStepper({ steps, lessonId, onComplete, onExit }) {
  const { t } = useTranslation()
  const [currentStep, setCurrentStep] = useState(0)
  const [stepUnlocked, setStepUnlocked] = useState(false)

  const unlock = () => setStepUnlocked(true)

  const handleNext = () => {
    setCurrentStep((s) => s + 1)
    setStepUnlocked(false)
  }

  const step = steps[currentStep]
  const isLastStep = currentStep === steps.length - 1
  const showNextButton = step.type !== 'quiz' && !isLastStep

  const renderStep = (s) => {
    switch (s.type) {
      case 'story':
        return <StoryStep key={currentStep} textKey={s.textKey} onUnlock={unlock} />
      case 'interactive':
        return <InteractiveMissionStep key={currentStep} missionKey={s.missionKey} onUnlock={unlock} />
      case 'quiz':
        return (
          <QuizStep
            key={currentStep}
            questions={s.questions}
            lessonId={lessonId}
            onComplete={onComplete}
            onExit={onExit}
          />
        )
      default:
        return null
    }
  }

  return (
    <div className="space-y-6 max-w-xl mx-auto">
      {/* Progress bar */}
      <div className="flex gap-1.5">
        {steps.map((_, i) => (
          <div
            key={i}
            className={`h-0.5 flex-1 rounded-full transition-all duration-500 ${
              i <= currentStep ? 'bg-accent' : 'bg-secondary'
            }`}
          />
        ))}
      </div>

      {/* Step counter */}
      <p className="font-mono text-[10px] uppercase tracking-[0.22em] text-muted-foreground">
        STEP {currentStep + 1} / {steps.length}
      </p>

      {/* Animated step content */}
      <AnimatePresence mode="wait">
        <motion.div
          key={currentStep}
          initial={{ opacity: 0, x: 24 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: -24 }}
          transition={{ duration: 0.25, ease: 'easeInOut' }}
        >
          {renderStep(step)}
        </motion.div>
      </AnimatePresence>

      {/* Next button (story + interactive steps only) */}
      {showNextButton && (
        <button
          onClick={handleNext}
          disabled={!stepUnlocked}
          className="bg-accent text-accent-foreground font-mono text-xs font-bold uppercase tracking-[0.12em] rounded-md px-5 py-3 hover:shadow-[0_0_40px_-4px_var(--glow-accent)] transition-all disabled:opacity-40 disabled:cursor-not-allowed"
        >
          {t('mission.next')}
        </button>
      )}
    </div>
  )
}
