import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import { Terminal, ChevronRight } from 'lucide-react'
import client from '../api/client'
import useStore from '../store/useStore'

export default function Onboarding() {
  const { t } = useTranslation()
  const navigate = useNavigate()
  const syncFromUser = useStore((s) => s.syncFromUser)

  const [step, setStep] = useState('choice')      // 'choice' | 'test' | 'result'
  const [questions, setQuestions] = useState([])
  const [currentQ, setCurrentQ] = useState(0)
  const [answers, setAnswers] = useState({})      // { [questionId]: selectedIndex }
  const [loading, setLoading] = useState(false)
  const [result, setResult] = useState(null)      // { passed, correct, total }

  const handleBeginner = () => navigate('/pathway')

  const handleAdvanced = async () => {
    setLoading(true)
    try {
      const { data } = await client.get('/lessons/variables-basics')
      const qs = (data.quiz_questions ?? []).slice(0, 5)
      if (qs.length === 0) { navigate('/pathway'); return }
      setQuestions(qs)
      setStep('test')
    } catch {
      navigate('/pathway')
    } finally {
      setLoading(false)
    }
  }

  const handleSelectAnswer = (questionId, idx) => {
    setAnswers((prev) => ({ ...prev, [questionId]: idx }))
  }

  const handleNext = () => {
    if (currentQ < questions.length - 1) {
      setCurrentQ((q) => q + 1)
    } else {
      finishTest()
    }
  }

  const finishTest = async () => {
    const correct = questions.filter((q) => answers[q.id] === q.correct_index).length
    const passed = correct >= 3

    if (passed) {
      try {
        const { data: allLessons } = await client.get('/lessons')
        const basics = allLessons.filter((l) => l.category === 'basics')
        await Promise.all(basics.map((l) => client.post(`/progress/${l.id}`).catch(() => {})))
        const { data: me } = await client.get('/auth/me')
        syncFromUser(me)
      } catch {}
    }

    setResult({ passed, correct, total: questions.length })
    setStep('result')
  }

  const currentQuestion = questions[currentQ]
  const lang = useStore((s) => s.lang)

  return (
    <div className="min-h-screen bg-background flex flex-col items-center justify-center px-4 py-12">
      <div className="w-full max-w-md">

        {/* Header */}
        <div className="flex items-center gap-2 mb-8">
          <Terminal size={18} className="text-accent" />
          <span className="font-mono text-xs text-muted-foreground uppercase tracking-widest">
            {t('onboarding.breadcrumb')}
          </span>
        </div>

        {/* ── Step: choice ── */}
        {step === 'choice' && (
          <div>
            <h1 className="font-mono text-2xl font-bold text-foreground mb-2">
              {t('onboarding.title')}
            </h1>
            <p className="text-muted-foreground text-sm mb-8">
              {t('onboarding.question')}
            </p>
            <div className="space-y-3">
              <button
                onClick={handleBeginner}
                className="w-full flex items-center gap-3 p-4 rounded-xl border border-hairline glass hover:border-accent/50 transition-all group text-left"
              >
                <span className="font-mono text-accent text-lg">▶</span>
                <div>
                  <p className="font-semibold text-foreground group-hover:text-accent transition-colors">
                    {t('onboarding.beginnerBtn')}
                  </p>
                  <p className="text-xs text-muted-foreground font-mono mt-0.5">
                    {t('onboarding.beginnerHint')}
                  </p>
                </div>
                <ChevronRight size={16} className="text-muted-foreground ml-auto group-hover:text-accent transition-colors" />
              </button>

              <button
                onClick={handleAdvanced}
                disabled={loading}
                className="w-full flex items-center gap-3 p-4 rounded-xl border border-hairline glass hover:border-primary/50 transition-all group text-left disabled:opacity-50"
              >
                <span className="font-mono text-primary text-lg">&gt;_</span>
                <div>
                  <p className="font-semibold text-foreground group-hover:text-primary transition-colors">
                    {t('onboarding.advancedBtn')}
                  </p>
                  <p className="text-xs text-muted-foreground font-mono mt-0.5">
                    {t('onboarding.advancedHint')}
                  </p>
                </div>
                <ChevronRight size={16} className="text-muted-foreground ml-auto group-hover:text-primary transition-colors" />
              </button>
            </div>
          </div>
        )}

        {/* ── Step: test ── */}
        {step === 'test' && currentQuestion && (
          <div>
            <div className="flex items-center justify-between mb-6">
              <span className="font-mono text-xs text-muted-foreground uppercase tracking-wider">
                {t('onboarding.testLabel')}
              </span>
              <span className="font-mono text-xs text-muted-foreground">
                {currentQ + 1} / {questions.length}
              </span>
            </div>

            <div className="h-1 bg-secondary rounded-full overflow-hidden mb-6">
              <div
                className="h-full bg-accent rounded-full transition-all duration-500"
                style={{ width: `${((currentQ + 1) / questions.length) * 100}%` }}
              />
            </div>

            <p className="text-foreground font-medium mb-5">
              {lang === 'ro' ? currentQuestion.question_ro : currentQuestion.question_en}
            </p>

            <div className="space-y-2 mb-6">
              {JSON.parse(currentQuestion.options_json).map((opt, idx) => {
                const label = lang === 'ro' ? opt.ro : opt.en
                const isSelected = answers[currentQuestion.id] === idx
                return (
                  <button
                    key={idx}
                    onClick={() => handleSelectAnswer(currentQuestion.id, idx)}
                    className={`w-full text-left px-4 py-3 rounded-lg border text-sm font-mono transition-all ${
                      isSelected
                        ? 'border-accent bg-accent/10 text-accent'
                        : 'border-hairline text-muted-foreground hover:border-border hover:text-foreground'
                    }`}
                  >
                    <span className="opacity-50 mr-2">{String.fromCharCode(65 + idx)}.</span>
                    {label}
                  </button>
                )
              })}
            </div>

            <button
              onClick={handleNext}
              disabled={answers[currentQuestion.id] === undefined}
              className="w-full bg-accent text-accent-foreground font-mono text-sm font-bold uppercase tracking-[0.12em] py-3 rounded-md hover:shadow-[0_0_40px_-4px_var(--glow-accent)] transition-all disabled:opacity-40 disabled:cursor-not-allowed active:scale-95"
            >
              {currentQ < questions.length - 1 ? t('onboarding.nextQuestion') : t('onboarding.submitTest')}
            </button>
          </div>
        )}

        {/* ── Step: result ── */}
        {step === 'result' && result && (
          <div className="text-center">
            <p className={`font-mono text-4xl mb-3 ${result.passed ? 'text-success' : 'text-muted-foreground'}`}>
              {result.passed ? t('onboarding.pass') : t('onboarding.fail')}
            </p>
            <p className="font-mono text-muted-foreground mb-1">
              {t('onboarding.correctCount', { correct: result.correct, total: result.total })}
            </p>
            {result.passed ? (
              <p className="text-sm text-muted-foreground mb-8">
                {t('onboarding.passMessagePre')} <span className="text-accent font-mono">{t('onboarding.passModule')}</span>.
              </p>
            ) : (
              <p className="text-sm text-muted-foreground mb-8">
                {t('onboarding.failMessagePre')} <span className="text-accent font-mono">{t('onboarding.failModule')}</span> {t('onboarding.failMessagePost')}
              </p>
            )}
            <button
              onClick={() => navigate('/pathway')}
              className="bg-accent text-accent-foreground font-mono text-sm font-bold uppercase tracking-[0.12em] px-6 py-3 rounded-md hover:shadow-[0_0_40px_-4px_var(--glow-accent)] transition-all active:scale-95"
            >
              {t('onboarding.launchBtn')}
            </button>
          </div>
        )}
      </div>
    </div>
  )
}
