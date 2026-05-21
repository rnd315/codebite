import useStore from '../../store/useStore'

export default function CodeBlock({ cpp, python }) {
  const codeLang = useStore((s) => s.codeLang)
  const code = codeLang === 'cpp' ? cpp : python
  const label = codeLang === 'cpp' ? 'C++' : 'Python'

  if (!code) return null

  return (
    <div className="rounded-xl overflow-hidden border border-hairline">
      <div className="flex items-center justify-between px-4 py-2 bg-secondary text-xs font-mono text-muted-foreground">
        <span>{label}</span>
        <button
          onClick={() => navigator.clipboard?.copyText(code)}
          className="hover:text-accent transition-colors"
        >
          copy
        </button>
      </div>
      <pre className="bg-background p-4 text-sm font-mono text-foreground overflow-x-auto leading-relaxed">
        <code>{code}</code>
      </pre>
    </div>
  )
}
