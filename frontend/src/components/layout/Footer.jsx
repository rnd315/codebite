import { useTranslation } from 'react-i18next'

export default function Footer() {
  const { t } = useTranslation()

  return (
    <footer className="relative z-10 border-t border-white/5 bg-background/60 backdrop-blur-md">
      <div className="mx-auto flex max-w-7xl flex-col items-center gap-3 px-4 py-4 text-xs text-muted-foreground lg:flex-row lg:justify-between lg:gap-0 lg:px-8">

        {/* Left — branding */}
        <p className="font-mono tracking-wide text-center lg:text-left">
          {t('footer.copyright')}
        </p>

        {/* Center — links */}
        <div className="flex items-center gap-4 font-mono">
          <a
            href="/README.md"
            target="_blank"
            rel="noopener noreferrer"
            className="hover:text-foreground transition-colors"
          >
            {t('footer.docs')}
          </a>
          <span className="text-hairline">·</span>
          <a
            href="https://github.com/rnd315/codebite"
            target="_blank"
            rel="noopener noreferrer"
            className="hover:text-foreground transition-colors"
          >
            {t('footer.github')}
          </a>
        </div>

        {/* Right — author */}
        <div className="font-mono text-center lg:text-right space-y-0.5">
          <p>{t('footer.author')}</p>
          <p>{t('footer.school')}</p>
        </div>

      </div>
    </footer>
  )
}
