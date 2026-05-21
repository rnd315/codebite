export function Skeleton({ className = '' }) {
  return (
    <div
      className={`animate-pulse rounded-md bg-muted/60 ${className}`}
    />
  )
}

/* ── Macro Module card skeleton ──────────────────────────────────────────── */
export function ModuleSkeleton() {
  return (
    <div className="rounded-2xl glass-strong border border-hairline p-5 space-y-4">
      {/* Header strip */}
      <div className="flex items-center justify-between">
        <Skeleton className="h-3 w-32" />
        <Skeleton className="h-5 w-16 rounded-full" />
      </div>
      {/* Body: badge + text + led rack */}
      <div className="grid grid-cols-[auto_1fr_auto] gap-4 items-start">
        <Skeleton className="h-24 w-24 rounded-lg" />
        <div className="space-y-2.5 pt-1">
          <Skeleton className="h-4 w-40" />
          <Skeleton className="h-3 w-28" />
          <div className="flex gap-3 pt-1">
            <Skeleton className="h-3 w-14" />
            <Skeleton className="h-3 w-10" />
            <Skeleton className="h-3 w-12" />
          </div>
          <Skeleton className="h-1.5 w-full rounded-full mt-2" />
        </div>
        <div className="space-y-1.5 w-28">
          <Skeleton className="h-3 w-full" />
          {Array.from({ length: 6 }).map((_, i) => (
            <Skeleton key={i} className="h-3 w-full" />
          ))}
        </div>
      </div>
    </div>
  )
}

/* ── Community ticket card skeleton ─────────────────────────────────────── */
export function TicketSkeleton() {
  return (
    <div className="rounded-xl glass-strong border border-hairline overflow-hidden">
      {/* Terminal title bar */}
      <div className="flex items-center gap-2 px-4 py-2.5 border-b border-hairline">
        <div className="flex gap-1.5">
          <Skeleton className="h-3 w-3 rounded-full" />
          <Skeleton className="h-3 w-3 rounded-full" />
          <Skeleton className="h-3 w-3 rounded-full" />
        </div>
        <Skeleton className="h-3 w-32 ml-2" />
        <Skeleton className="h-4 w-10 ml-auto rounded" />
      </div>
      {/* Body */}
      <div className="p-4 space-y-3">
        <div className="flex items-center gap-2">
          <Skeleton className="h-3 w-20" />
          <Skeleton className="h-3 w-16" />
        </div>
        <Skeleton className="h-4 w-3/4" />
        <Skeleton className="h-3 w-full" />
        <Skeleton className="h-3 w-5/6" />
      </div>
      {/* Footer */}
      <div className="flex items-center justify-between px-4 py-3 border-t border-hairline">
        <Skeleton className="h-3 w-28" />
        <Skeleton className="h-7 w-24 rounded-md" />
      </div>
    </div>
  )
}
