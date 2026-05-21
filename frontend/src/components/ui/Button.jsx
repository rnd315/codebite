const VARIANTS = {
  primary:
    'bg-accent text-accent-foreground font-mono font-bold uppercase tracking-[0.12em] hover:shadow-[0_0_40px_-4px_var(--glow-accent)] active:scale-95 transition-all',
  ghost:
    'border border-hairline text-muted-foreground hover:border-accent hover:text-accent transition-colors',
  danger:
    'bg-destructive text-destructive-foreground hover:bg-destructive/90 active:scale-95',
  success:
    'bg-success text-success-foreground font-mono font-bold active:scale-95',
}

const SIZES = {
  sm: 'text-sm px-3 py-1.5 min-h-[36px]',
  md: 'text-base px-4 py-2.5 min-h-[44px]',
  lg: 'text-lg px-6 py-3 min-h-[52px]',
}

export default function Button({
  children,
  variant = 'primary',
  size = 'md',
  className = '',
  disabled = false,
  ...props
}) {
  return (
    <button
      className={`
        inline-flex items-center justify-center gap-2 rounded-lg
        transition-all duration-150 cursor-pointer select-none
        disabled:opacity-50 disabled:cursor-not-allowed disabled:active:scale-100
        ${VARIANTS[variant]}
        ${SIZES[size]}
        ${className}
      `}
      disabled={disabled}
      {...props}
    >
      {children}
    </button>
  )
}
