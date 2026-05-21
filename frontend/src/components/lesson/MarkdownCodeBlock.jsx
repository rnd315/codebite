import { useState } from 'react'
import useStore from '../../store/useStore'

export default function MarkdownCodeBlock({ className, children }) {
  const codeLang = useStore((s) => s.codeLang)
  const [copied, setCopied] = useState(false)

  const lang = /language-(\w+)/.exec(className || '')?.[1]

  // Hide cpp blocks when Python is selected, and vice versa
  if (lang === 'cpp' && codeLang !== 'cpp') return null
  if (lang === 'python' && codeLang !== 'python') return null

  const code = String(children).replace(/\n$/, '')

  const handleCopy = () => {
    navigator.clipboard?.writeText(code)
    setCopied(true)
    setTimeout(() => setCopied(false), 1500)
  }

  const langLabel = lang === 'cpp' ? 'C++' : lang

  return (
    <div className="my-4 rounded-lg overflow-hidden border border-hairline not-prose">
      {lang && (
        <div className="flex items-center justify-between px-4 py-1.5 bg-secondary text-xs font-mono text-muted-foreground border-b border-hairline">
          <span className="text-accent">{langLabel}</span>
          <button
            onClick={handleCopy}
            className="hover:text-accent transition-colors"
          >
            {copied ? 'Copied!' : 'Copy'}
          </button>
        </div>
      )}
      <pre className="p-4 overflow-x-auto bg-background text-sm font-mono text-foreground leading-relaxed m-0">
        <code>{code}</code>
      </pre>
    </div>
  )
}
