const COLOR_MAP = {
  basics:             'bg-accent/20 text-accent border-accent/30',
  sorting:            'bg-primary/20 text-primary border-primary/30',
  searching:          'bg-accent/20 text-accent border-accent/30',
  'arrays & strings': 'bg-streak/20 text-streak border-streak/30',
  recursion:          'bg-primary/20 text-primary border-primary/30',
  primes:             'bg-streak/20 text-streak border-streak/30',
  complexity:         'bg-success/20 text-success border-success/30',
  easy:               'bg-success/20 text-success border-success/30',
  medium:             'bg-streak/20 text-streak border-streak/30',
  hard:               'bg-destructive/20 text-destructive border-destructive/30',
}

export default function Badge({ label, type = '', className = '' }) {
  const color = COLOR_MAP[type?.toLowerCase()] ?? 'bg-secondary/40 text-muted-foreground border-hairline'
  return (
    <span
      className={`inline-block text-xs font-mono font-medium px-2.5 py-0.5 rounded-full border ${color} ${className}`}
    >
      {label}
    </span>
  )
}
