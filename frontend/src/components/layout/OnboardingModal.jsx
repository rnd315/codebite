import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { useTranslation } from 'react-i18next'
import { X, Check } from 'lucide-react'
import useStore from '../../store/useStore'

// ── Step 1: Language ──────────────────────────────────────────────────────────

function StepLanguage({ onSelect }) {
  const { t } = useTranslation()
  return (
    <div className="flex gap-3 justify-center">
      {[
        { value: 'ro', flag: '🇷🇴', label: t('onboardingWizard.langRO') },
        { value: 'en', flag: '🇬🇧', label: t('onboardingWizard.langEN') },
      ].map(({ value, flag, label }) => (
        <button
          key={value}
          onClick={() => onSelect(value)}
          className="flex-1 max-w-[180px] border border-hairline rounded-xl p-5 text-center hover:border-accent/60 hover:text-accent transition-colors group"
        >
          <div className="text-4xl mb-2">{flag}</div>
          <div className="font-mono text-sm font-bold text-foreground group-hover:text-accent transition-colors">
            {label}
          </div>
        </button>
      ))}
    </div>
  )
}

// ── Step 2: Compiler ──────────────────────────────────────────────────────────

function StepCompiler({ onSelect }) {
  const { t } = useTranslation()
  const options = [
    { value: 'cpp',    label: t('onboardingWizard.cppLabel'),    tag: t('onboardingWizard.cppTag'), symbol: 'C++', sub: 'ISO/IEC 14882', recommended: true },
    { value: 'python', label: t('onboardingWizard.pythonLabel'), tag: null,                          symbol: 'Py',  sub: 'PEP 8 · Scripting', recommended: false },
  ]
  return (
    <div className="flex gap-3 justify-center">
      {options.map(({ value, label, tag, symbol, sub, recommended }) => (
        <button
          key={value}
          onClick={() => onSelect(value)}
          className={`flex-1 max-w-[200px] border rounded-xl p-5 text-left transition-colors group ${
            recommended
              ? 'border-accent/40 hover:border-accent'
              : 'border-hairline hover:border-accent/60'
          }`}
        >
          <div className="flex items-start justify-between mb-3">
            <span className={`font-mono text-xl font-black ${recommended ? 'text-accent' : 'text-foreground'}`}>
              {symbol}
            </span>
            {tag && (
              <span className="font-mono text-[9px] uppercase tracking-[0.2em] bg-accent text-accent-foreground px-2 py-0.5 rounded">
                {tag}
              </span>
            )}
          </div>
          <div className="font-mono text-sm font-semibold text-foreground group-hover:text-accent transition-colors">
            {label}
          </div>
          <div className="mt-1 font-mono text-[10px] text-muted-foreground">{sub}</div>
        </button>
      ))}
    </div>
  )
}

// ── Step 3: Protocol ──────────────────────────────────────────────────────────

const PROTOCOLS = [
  { value: 'architect', titleKey: 'architectTitle', descKey: 'architectDesc' },
  { value: 'hacker',    titleKey: 'hackerTitle',    descKey: 'hackerDesc'    },
  { value: 'socrates',  titleKey: 'socratesTitle',  descKey: 'socratesDesc'  },
]

function StepProtocol({ selected, onSelect }) {
  const { t } = useTranslation()
  return (
    <div className="space-y-2">
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
        {PROTOCOLS.map(({ value, titleKey, descKey }) => {
          const isSelected = selected === value
          return (
            <button
              key={value}
              onClick={() => onSelect(value)}
              className={`border rounded-xl p-4 text-left transition-colors ${
                isSelected
                  ? 'border-accent bg-accent/5'
                  : 'border-hairline hover:border-accent/50'
              }`}
            >
              <div className="flex items-center justify-between mb-2">
                <div className={`font-mono text-xs font-black tracking-tight ${isSelected ? 'text-accent' : 'text-foreground'}`}>
                  {t(`onboardingWizard.${titleKey}`)}
                </div>
                {isSelected && (
                  <span className="h-4 w-4 rounded-full bg-accent grid place-items-center flex-shrink-0">
                    <Check size={9} className="text-accent-foreground" strokeWidth={3} />
                  </span>
                )}
              </div>
              <div className="font-mono text-[11px] text-muted-foreground leading-relaxed">
                {t(`onboardingWizard.${descKey}`)}
              </div>
            </button>
          )
        })}
      </div>
      <p className="font-mono text-[10px] text-muted-foreground/50 text-center pt-1">
        {t('onboardingWizard.step3Note')}
      </p>
    </div>
  )
}

// ── Main modal ────────────────────────────────────────────────────────────────

export default function OnboardingModal() {
  const { t, i18n } = useTranslation()
  const token              = useStore((s) => s.token)
  const isOnboarded        = useStore((s) => s.isOnboarded)
  const showProtocolModal  = useStore((s) => s.showProtocolModal)
  const setLang            = useStore((s) => s.setLang)
  const setCodeLang        = useStore((s) => s.setCodeLang)
  const setLearningProtocol = useStore((s) => s.setLearningProtocol)
  const setIsOnboarded     = useStore((s) => s.setIsOnboarded)
  const setShowProtocolModal = useStore((s) => s.setShowProtocolModal)
  const currentProtocol    = useStore((s) => s.learningProtocol)

  const isReconfigure = isOnboarded && showProtocolModal
  const showModal = token && (!isOnboarded || showProtocolModal)

  const [step, setStep] = useState(isReconfigure ? 3 : 1)
  const [selectedProtocol, setSelectedProtocol] = useState(currentProtocol)

  if (!showModal) return null

  const TOTAL_STEPS = isReconfigure ? 1 : 3
  const displayStep = isReconfigure ? 1 : step

  function handleLangSelect(lang) {
    i18n.changeLanguage(lang)
    setLang(lang)
    setStep(2)
  }

  function handleFinish() {
    if (selectedProtocol) setLearningProtocol(selectedProtocol)
    if (!isReconfigure) setIsOnboarded(true)
    setShowProtocolModal(false)
  }

  const titles = {
    1: t('onboardingWizard.step1Title'),
    2: t('onboardingWizard.step2Title'),
    3: t('onboardingWizard.step3Title'),
  }
  const subtitles = {
    2: t('onboardingWizard.step2Subtitle'),
    3: t('onboardingWizard.step3Subtitle'),
  }
  const currentStep = isReconfigure ? 3 : step

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-background/95 backdrop-blur-md">
      <motion.div
        initial={{ opacity: 0, y: 12, scale: 0.98 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        transition={{ duration: 0.2, ease: 'easeOut' }}
        className="border border-hairline rounded-2xl bg-card p-6 max-w-xl w-full relative"
      >
        {/* Header row */}
        <div className="flex items-center justify-between mb-5">
          <div className="font-mono text-[10px] uppercase tracking-[0.28em] text-muted-foreground">
            ~/codebite/init
          </div>
          <div className="flex items-center gap-3">
            {!isReconfigure && (
              <div className="flex items-center gap-1.5">
                {[1, 2, 3].map((s) => (
                  <div
                    key={s}
                    className={`h-0.5 rounded-full transition-all duration-300 ${
                      s === step ? 'w-5 bg-accent' : s < step ? 'w-2.5 bg-success' : 'w-2.5 bg-hairline'
                    }`}
                  />
                ))}
              </div>
            )}
            <span className="font-mono text-[10px] text-muted-foreground">
              {String(displayStep).padStart(2, '0')} / {String(TOTAL_STEPS).padStart(2, '0')}
            </span>
            {isReconfigure && (
              <button
                onClick={() => setShowProtocolModal(false)}
                className="grid h-7 w-7 place-items-center rounded-lg text-muted-foreground hover:text-foreground hover:bg-secondary/60 transition-colors"
              >
                <X size={14} />
              </button>
            )}
          </div>
        </div>

        {/* Title */}
        <AnimatePresence mode="wait">
          <motion.div
            key={currentStep}
            initial={{ opacity: 0, x: 6 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -6 }}
            transition={{ duration: 0.15 }}
            className="mb-1"
          >
            <span className="font-mono text-[10px] text-accent mr-1">$</span>
            <span className="font-mono text-lg font-black text-foreground">
              {titles[currentStep]}
            </span>
          </motion.div>
        </AnimatePresence>

        {/* Subtitle */}
        {subtitles[currentStep] ? (
          <p className="font-mono text-xs text-muted-foreground mb-5">
            {subtitles[currentStep]}
          </p>
        ) : (
          <div className="mb-5" />
        )}

        {/* Step content */}
        <AnimatePresence mode="wait">
          <motion.div
            key={isReconfigure ? 'reconfigure' : step}
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            transition={{ duration: 0.15 }}
          >
            {!isReconfigure && step === 1 && <StepLanguage onSelect={handleLangSelect} />}
            {!isReconfigure && step === 2 && <StepCompiler onSelect={(lang) => { setCodeLang(lang); setStep(3) }} />}
            {(isReconfigure || step === 3) && (
              <StepProtocol selected={selectedProtocol} onSelect={setSelectedProtocol} />
            )}
          </motion.div>
        </AnimatePresence>

        {/* Confirm button — step 3 only */}
        {(isReconfigure || step === 3) && (
          <button
            onClick={handleFinish}
            disabled={!selectedProtocol}
            className={`mt-5 w-full font-mono text-xs font-black uppercase tracking-[0.18em] rounded-xl py-3 transition-all ${
              selectedProtocol
                ? 'bg-accent text-accent-foreground hover:shadow-[0_0_30px_-6px_var(--glow-accent)]'
                : 'bg-secondary text-muted-foreground cursor-not-allowed'
            }`}
          >
            {`[ ${isReconfigure ? t('onboardingWizard.saveBtn') : t('onboardingWizard.initBtn')} ]`}
          </button>
        )}
      </motion.div>
    </div>
  )
}
