export default function AlgorithmView({ theory, visualizer }) {
  return (
    <div className="flex flex-col md:flex-row gap-4 min-h-[600px]">

      {/* LEFT — Theory + Visualizer (~40%) */}
      <div className="flex flex-col gap-4 md:w-[40%] flex-shrink-0">

        {/* Theory panel */}
        <div className="glass-strong rounded-2xl p-5">
          <p className="font-mono text-[10px] uppercase tracking-[0.28em] text-accent mb-3">
            ~/theory
          </p>
          {theory ?? (
            <p className="text-sm text-muted-foreground font-mono">// theory content goes here</p>
          )}
        </div>

        {/* Visualizer panel */}
        <div className="glass-strong rounded-2xl p-5">
          <p className="font-mono text-[10px] uppercase tracking-[0.28em] text-accent mb-3">
            ~/visualizer
          </p>
          {visualizer ?? (
            <div className="h-36 flex items-center justify-center border border-hairline rounded-xl">
              <span className="font-mono text-xs text-muted-foreground">
                // no visualizer for this lesson
              </span>
            </div>
          )}
        </div>

      </div>

      {/* RIGHT — Editor + Terminal (~60%) */}
      <div className="flex flex-col gap-4 flex-1 min-w-0">

        {/* Code editor panel */}
        <div className="glass-strong rounded-2xl overflow-hidden flex-1 min-h-[260px] flex flex-col">
          {/* macOS-style title bar */}
          <div className="flex items-center gap-1.5 px-3 py-2 bg-secondary/40 border-b border-hairline flex-shrink-0">
            <span className="h-2 w-2 rounded-full bg-destructive/70" />
            <span className="h-2 w-2 rounded-full bg-streak/70" />
            <span className="h-2 w-2 rounded-full bg-accent/70" />
            <span className="font-mono text-[9px] uppercase tracking-[0.18em] text-muted-foreground ml-2">
              ~/editor/main.cpp
            </span>
          </div>
          <pre className="p-4 font-mono text-sm text-muted-foreground leading-relaxed flex-1 overflow-auto">
            <code className="text-muted-foreground/60">{'// code editor — coming soon'}</code>
          </pre>
        </div>

        {/* Terminal / console panel */}
        <div className="glass-strong rounded-2xl overflow-hidden">
          {/* Terminal title bar */}
          <div className="flex items-center justify-between px-3 py-2 bg-secondary/40 border-b border-hairline">
            <span className="font-mono text-[9px] uppercase tracking-[0.18em] text-muted-foreground">
              ~/terminal
            </span>
            <span className="h-1.5 w-1.5 animate-pulse-soft rounded-full bg-success" />
          </div>

          {/* Terminal body */}
          <div className="p-4 min-h-[100px] font-mono text-sm">
            <p className="text-muted-foreground">
              <span className="text-accent">$</span> _
            </p>
          </div>

          {/* Execute button row */}
          <div className="flex items-center justify-end gap-2 px-4 pb-4">
            <span className="font-mono text-[10px] uppercase tracking-[0.18em] text-muted-foreground">
              execution disabled
            </span>
            <button
              disabled
              className="inline-flex items-center gap-2 rounded-md bg-accent/20 text-accent-foreground/40 font-mono text-xs font-bold uppercase tracking-[0.12em] px-4 py-2 cursor-not-allowed border border-hairline"
            >
              &gt;_ execute_code
            </button>
          </div>
        </div>

      </div>
    </div>
  )
}
