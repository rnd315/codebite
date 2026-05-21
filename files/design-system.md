# Codebite — Styling Instructions for Claude Agent

Goal: restyle an existing app (same component structure) to match the **Codebite "neo-shell / cyberpunk terminal"** look. **Do not change markup, props, state, or behavior.** Only edit Tailwind classes, CSS tokens, and small style-only props (inline `style`, SVGs, gradients).

Stack assumed: React + Tailwind **v4** (CSS-first config via `@import "tailwindcss"` in a `styles.css`). If the target uses Tailwind v3, port the `@theme inline` block into `tailwind.config` `theme.extend.colors` and keep the `:root` / `.dark` CSS variables as-is.

---

## 1. Design language (read first)

- **Vibe:** dark cyberpunk terminal by default, with a "Daylight Editor" light mode. Monospace-forward, lots of `>_`, `~/path`, `MOD_01`, `01 / 03` micro-copy already present in markup — **keep typography styles that reinforce that**.
- **Surfaces:** translucent "glass" cards over a fixed background grid + two big blurred radial halos (one cyan, one purple).
- **Color rule:** Cyan = active/CTA. Purple = decorative/tokens. Emerald = success only. Amber = streak. Red = destructive. **Never** use neon green.
- **Type:** Display + body = `Space Grotesk`. All chrome, labels, code, chips, headings inside cards = `JetBrains Mono` with wide tracking (`tracking-[0.18em]`–`tracking-[0.28em]`) and `uppercase` for micro-labels.
- **Radii:** generous. `--radius: 1rem`. Cards `rounded-2xl`/`rounded-3xl`, pills `rounded-full`, buttons `rounded-md`.
- **Borders:** almost always use a semi-transparent `--hairline` token, never solid gray.
- **Glow:** active/CTA elements use `box-shadow: 0 0 Npx -Mpx var(--glow-accent|--glow-primary)` on hover or when active. Use sparingly — only on the hero CTA, active module card, hovered feed cards, and active toggle pill.

---

## 2. Drop-in CSS (paste verbatim into `src/styles.css` or equivalent)

Replace the project's theme block with this. It uses **OKLCH** and Tailwind v4's `@theme inline` bridge so utilities like `bg-primary`, `text-accent`, `border-hairline`, `bg-success`, `text-streak` all work.

```css
@import "tailwindcss" source(none);
@source "../src";
@import "tw-animate-css";

@custom-variant dark (&:is(.dark *));

@theme inline {
  --radius-sm: calc(var(--radius) - 4px);
  --radius-md: calc(var(--radius) - 2px);
  --radius-lg: var(--radius);
  --radius-xl: calc(var(--radius) + 4px);
  --radius-2xl: calc(var(--radius) + 8px);
  --radius-3xl: calc(var(--radius) + 12px);

  --color-background: var(--background);
  --color-foreground: var(--foreground);
  --color-card: var(--card);
  --color-card-foreground: var(--card-foreground);
  --color-popover: var(--popover);
  --color-popover-foreground: var(--popover-foreground);
  --color-primary: var(--primary);
  --color-primary-foreground: var(--primary-foreground);
  --color-accent: var(--accent);
  --color-accent-foreground: var(--accent-foreground);
  --color-secondary: var(--secondary);
  --color-secondary-foreground: var(--secondary-foreground);
  --color-muted: var(--muted);
  --color-muted-foreground: var(--muted-foreground);
  --color-destructive: var(--destructive);
  --color-destructive-foreground: var(--destructive-foreground);
  --color-success: var(--success);
  --color-success-foreground: var(--success-foreground);
  --color-streak: var(--streak);
  --color-heart: var(--heart);
  --color-border: var(--border);
  --color-input: var(--input);
  --color-ring: var(--ring);
  --color-hairline: var(--hairline);

  --font-sans: "Space Grotesk", ui-sans-serif, system-ui, sans-serif;
  --font-mono: "JetBrains Mono", ui-monospace, "SF Mono", Menlo, monospace;
}

/* LIGHT — "Daylight Editor": cool slate-50 bg, deep indigo + deep cyan (WCAG AA) */
:root {
  --radius: 1rem;

  --background: oklch(0.975 0.006 250);
  --foreground: oklch(0.20 0.04 265);

  --card: oklch(1 0 0 / 75%);
  --card-foreground: oklch(0.20 0.04 265);
  --popover: oklch(1 0 0);
  --popover-foreground: oklch(0.20 0.04 265);

  --primary: oklch(0.42 0.20 275);            /* deep indigo */
  --primary-foreground: oklch(0.99 0 0);

  --accent: oklch(0.52 0.13 220);              /* deep cyan */
  --accent-foreground: oklch(0.99 0 0);

  --secondary: oklch(0.94 0.01 250);
  --secondary-foreground: oklch(0.20 0.04 265);

  --muted: oklch(0.94 0.01 250);
  --muted-foreground: oklch(0.42 0.02 260);

  --destructive: oklch(0.62 0.24 27);
  --destructive-foreground: oklch(0.99 0 0);

  --success: oklch(0.55 0.16 155);             /* emerald-700, completed only */
  --success-foreground: oklch(0.99 0 0);

  --streak: oklch(0.72 0.18 65);               /* amber */
  --heart: oklch(0.62 0.24 20);

  --border: oklch(0.20 0.04 265 / 12%);
  --input: oklch(0.20 0.04 265 / 12%);
  --ring: oklch(0.52 0.13 220);

  --glow-primary: oklch(0.55 0.22 285 / 45%);
  --glow-accent:  oklch(0.60 0.18 220 / 50%);
  --surface-glass: oklch(1 0 0 / 60%);
  --surface-elev:  oklch(1 0 0 / 82%);
  --grid-line: oklch(0.20 0.04 265 / 6%);
  --hairline:  oklch(0.20 0.04 265 / 14%);
}

/* DARK — "Cyberpunk": slate-950 bg, neon purple + electric cyan */
.dark {
  --background: oklch(0.13 0.025 265);
  --foreground: oklch(0.97 0.01 240);

  --card: oklch(0.20 0.03 265 / 60%);
  --card-foreground: oklch(0.97 0.01 240);
  --popover: oklch(0.18 0.03 265);
  --popover-foreground: oklch(0.97 0.01 240);

  --primary: oklch(0.72 0.26 305);             /* neon purple/fuchsia */
  --primary-foreground: oklch(0.10 0.03 265);

  --accent: oklch(0.82 0.16 210);              /* electric cyan */
  --accent-foreground: oklch(0.10 0.03 265);

  --secondary: oklch(0.24 0.03 265);
  --secondary-foreground: oklch(0.97 0.01 240);

  --muted: oklch(0.24 0.03 265);
  --muted-foreground: oklch(0.70 0.02 260);

  --destructive: oklch(0.68 0.24 22);
  --destructive-foreground: oklch(0.97 0.01 240);

  --success: oklch(0.80 0.20 155);
  --success-foreground: oklch(0.10 0.03 265);

  --streak: oklch(0.82 0.18 65);
  --heart: oklch(0.74 0.24 20);

  --border: oklch(0.97 0.01 240 / 10%);
  --input: oklch(0.97 0.01 240 / 12%);
  --ring: oklch(0.82 0.16 210);

  --glow-primary: oklch(0.72 0.28 305 / 65%);
  --glow-accent:  oklch(0.85 0.20 210 / 70%);
  --surface-glass: oklch(0.20 0.03 265 / 55%);
  --surface-elev:  oklch(0.20 0.03 265 / 82%);
  --grid-line: oklch(0.97 0.01 240 / 6%);
  --hairline:  oklch(0.97 0.01 240 / 12%);
}

@layer base {
  * { border-color: var(--color-border); }
  html, body { font-family: var(--font-sans); }
  body {
    background-color: var(--color-background);
    color: var(--color-foreground);
    font-feature-settings: "ss01", "ss02", "cv01";
  }
}

/* Utility classes used across components — keep these names */
.glass {
  background: var(--surface-glass);
  backdrop-filter: blur(16px) saturate(140%);
  -webkit-backdrop-filter: blur(16px) saturate(140%);
  border: 1px solid var(--hairline);
}
.glass-strong {
  background: var(--surface-elev);
  backdrop-filter: blur(20px) saturate(160%);
  -webkit-backdrop-filter: blur(20px) saturate(160%);
  border: 1px solid var(--hairline);
}
.font-mono { font-family: var(--font-mono); }
.text-gradient {
  background: linear-gradient(120deg, var(--primary), var(--accent));
  -webkit-background-clip: text;
  background-clip: text;
  color: transparent;
}
.glow-primary { box-shadow: 0 0 0 1px var(--hairline), 0 0 40px -8px var(--glow-primary); }
.glow-accent  { box-shadow: 0 0 0 1px var(--hairline), 0 0 40px -8px var(--glow-accent); }

@keyframes spin-slow { to { transform: rotate(360deg); } }
.halo-spin { animation: spin-slow 6s linear infinite; }

@keyframes dash-flow { to { stroke-dashoffset: -32; } }
.dash-flow { stroke-dasharray: 6 6; animation: dash-flow 1.4s linear infinite; }

@keyframes float-y { 0%,100%{transform:translateY(0)} 50%{transform:translateY(-6px)} }
.animate-float { animation: float-y 5s ease-in-out infinite; }

@keyframes shimmer { 0%{background-position:0% 50%} 100%{background-position:200% 50%} }
.animate-shimmer { background-size: 200% 200%; animation: shimmer 6s linear infinite; }

@keyframes pulse-soft { 0%,100%{opacity:.55} 50%{opacity:1} }
.animate-pulse-soft { animation: pulse-soft 2.4s ease-in-out infinite; }

.bg-grid {
  background-image:
    linear-gradient(to right, var(--grid-line) 1px, transparent 1px),
    linear-gradient(to bottom, var(--grid-line) 1px, transparent 1px);
  background-size: 56px 56px;
}
```

Make sure `Space Grotesk` and `JetBrains Mono` are loaded (Google Fonts `<link>` in `index.html` head, or `@import` at the top of `styles.css`).

Theme toggle: set `<html class="dark">` for dark mode, remove the class for light mode. Persist to `localStorage`.

---

## 3. Global semantic-token rules (enforce on every file)

1. **Never** hard-code hex/RGB colors or Tailwind palette colors (`text-white`, `bg-slate-900`, `text-cyan-500`, `bg-purple-600`, etc.) in components. Always use the semantic utility: `bg-background`, `text-foreground`, `text-muted-foreground`, `bg-card`, `bg-secondary`, `text-primary`, `bg-accent`, `text-accent-foreground`, `border-hairline`, `bg-success`, `bg-destructive`, `text-streak`, `text-heart`, `ring-ring`.
2. **Borders:** prefer `border border-hairline` over `border-border` for card/inset chrome (subtler). Use `border-border/60` only on top-level chrome dividers (nav, footer).
3. **Translucent fills:** `bg-background/60`, `bg-secondary/30`, `bg-secondary/40` for inset terminal panels.
4. **Mono everywhere micro:** any label ≤ 12px, any path-like text (`~/foo`), any numeric badge → wrap in `font-mono` + `uppercase` + `tracking-[0.18em]` to `tracking-[0.28em]` (more for smaller text).
5. **Active CTA recipe:** `bg-accent text-accent-foreground font-mono text-xs font-bold uppercase tracking-[0.12em] rounded-md px-5 py-3 hover:shadow-[0_0_40px_-4px_var(--glow-accent)] transition-all`.
6. **Card recipe:** `rounded-2xl glass-strong p-5` (or `glass` for lighter weight). Top-level hero: `rounded-3xl glass-strong p-6 sm:p-8`.

---

## 4. Component-by-component restyle

For each existing component, **only swap classes** (don't restructure JSX). Match names approximately; apply to whichever components in the target play these roles.

### 4.1 App shell / `<body>` / root layout
- Add a fixed background layer (call it `BackgroundFX`) as the first child of the root:
  ```tsx
  <div aria-hidden className="pointer-events-none fixed inset-0 -z-10 overflow-hidden">
    <div className="absolute inset-0 bg-grid opacity-70" />
    <div className="absolute -top-40 left-1/2 h-[520px] w-[820px] -translate-x-1/2 rounded-full opacity-60 blur-3xl"
         style={{ background: "radial-gradient(closest-side, var(--glow-primary), transparent)" }} />
    <div className="absolute bottom-[-200px] right-[-160px] h-[480px] w-[640px] rounded-full opacity-50 blur-3xl"
         style={{ background: "radial-gradient(closest-side, var(--glow-accent), transparent)" }} />
    <div className="absolute inset-0 opacity-[0.5]"
         style={{ background: "radial-gradient(ellipse at top, transparent 0%, var(--background) 75%)" }} />
  </div>
  ```
- Page container: `mx-auto max-w-7xl px-4 py-8 lg:px-8`. Root wrapper: `relative min-h-screen text-foreground` (no bg color — `body` already paints it).

### 4.2 Top navigation
- Header: `sticky top-0 z-40 border-b border-border/60 bg-background/60 backdrop-blur-xl`.
- Inner row: `mx-auto flex max-w-7xl items-center justify-between gap-3 px-4 py-3 lg:px-8`.
- **Logo** mark: a 36px rounded glass tile (`grid h-9 w-9 place-items-center rounded-xl glass`) containing a mono `{·}` glyph styled with `.text-gradient`. Add an absolute `h-2 w-2 rounded-full bg-accent shadow-[0_0_10px_var(--glow-accent)]` notification dot at `-right-0.5 -top-0.5`.
- Wordmark: mono, with the second half in `text-accent`, plus a tiny `animate-pulse-soft` accent dot. Subline: `font-mono text-[9px] uppercase tracking-[0.28em] text-muted-foreground` — e.g. `v0.1 · dev-shell`.
- **Stat chips** (uptime / tokens): `inline-flex items-center gap-1.5 rounded-md glass px-2.5 py-1.5` with a colored Lucide icon (use `text-accent fill-accent` for streak Zap; `text-primary fill-primary/30` for the Hexagon tokens icon), a `font-mono text-[9px] uppercase tracking-[0.2em] text-muted-foreground` label, and `font-mono text-xs font-bold text-foreground` value.
- **Theme toggle button**: `grid h-9 w-9 place-items-center rounded-full glass hover:bg-secondary`. Swap `<Sun/>` and `<Moon/>` from Lucide.
- **Avatar**: `relative grid h-9 w-9 place-items-center rounded-full bg-gradient-to-br from-primary to-accent text-xs font-black text-background ring-2 ring-background`, with a `bg-streak` status dot at `-bottom-0.5 -right-0.5`.

### 4.3 Pill toggles (e.g. language switchers)
- Track: `relative inline-flex rounded-full glass p-0.5`.
- Buttons: `rounded-full px-3 py-1 text-xs font-semibold tracking-wide transition-all`.
- Active state: `bg-foreground text-background shadow-[0_0_20px_-6px_var(--glow-primary)]`.
- Inactive: `text-muted-foreground hover:text-foreground`.

### 4.4 Segmented view switcher (e.g. Learn / Community)
- Track: `relative inline-flex items-center rounded-full glass p-1`.
- Slider thumb (absolute element): `absolute inset-y-1 w-1/2 rounded-full bg-gradient-to-r from-primary/90 to-accent/90 shadow-[0_0_30px_-4px_var(--glow-primary)] transition-transform duration-300`. Translate it `translateX(0)` for index 0 and `translateX(100%)` for index 1.
- Items: `relative z-10 inline-flex items-center gap-2 rounded-full px-4 py-2 text-sm font-semibold`. Active → `text-background`, inactive → `text-muted-foreground hover:text-foreground`. Use Lucide icons at `h-4 w-4`.

### 4.5 Hero section
- Wrapper: `relative overflow-hidden rounded-3xl glass-strong p-6 sm:p-8`.
- Decorative shimmer ring (absolute, behind content):
  ```tsx
  <div aria-hidden className="pointer-events-none absolute -inset-px rounded-3xl opacity-60 animate-shimmer"
    style={{
      background: "conic-gradient(from 120deg at 50% 50%, transparent 0deg, var(--glow-primary) 90deg, transparent 180deg, var(--glow-accent) 270deg, transparent 360deg)",
      maskImage: "linear-gradient(#000 0 0) content-box, linear-gradient(#000 0 0)",
      WebkitMaskComposite: "xor", maskComposite: "exclude", padding: 1,
    }} />
  ```
- Corner halo: `absolute -right-20 -top-24 h-72 w-72 rounded-full opacity-40 blur-3xl` with `background: radial-gradient(closest-side, var(--glow-accent), transparent)`.
- Eyebrow tag: glass pill, mono uppercase, leading pulsing dot (`h-1.5 w-1.5 animate-pulse-soft rounded-full bg-primary`).
- H1: `font-mono text-3xl font-bold leading-[1.05] tracking-tight text-foreground sm:text-5xl`. Second line wrapped in `<span className="text-accent">`.
- Sub: `mt-3 max-w-xl text-sm text-muted-foreground sm:text-base` (sans).
- Stat chips row: each chip `inline-flex items-center gap-1.5 rounded-full glass px-2.5 py-1 font-mono text-[11px] uppercase tracking-[0.18em] text-muted-foreground`, icon `text-primary h-3 w-3`.
- Primary CTA button: see §3 recipe; add `group … hover:gap-3` and an `ArrowRight` icon that `group-hover:translate-x-0.5`.

### 4.6 Skill / module list cards ("constellation")
For each card:
- Wrapper: `relative overflow-hidden rounded-2xl border bg-background/60 transition-colors`. Active → `border-accent/40`. Locked → `border-hairline`.
- Inner grid layer: a 24px faint grid using `--grid-line` (see existing `SkillConstellation` style for the inline `backgroundImage`).
- Active glow: absolute `-inset-px rounded-2xl opacity-60 blur-2xl` with `background: var(--glow-accent)`.
- Header strip: `flex items-center justify-between border-b border-hairline bg-secondary/30 px-4 py-2`. Left = small `Server` icon + mono path label `rack / mod_01`. Right = status pill:
  - Active: `bg-accent text-accent-foreground` mono pill with `Terminal` icon.
  - Locked: `border border-hairline bg-background/60 text-muted-foreground` mono pill with `Lock` icon.
- Body grid: `grid gap-6 p-5 md:grid-cols-[auto_1fr_auto] md:items-center`.
- "Mainframe badge" (left): 96×96 rounded tile with ring (`ring-accent` if active else `ring-hairline`), 4 corner pin dots, and 4 horizontal slats. Active slats `bg-accent/70`. Behind it, an absolute `blur-md animate-pulse-soft` halo using `var(--glow-accent)`.
- Center column: mono caption (`text-accent` `MOD_01 //`), big title `font-mono text-2xl font-black sm:text-3xl tracking-tight`, subtitle in mono uppercase muted, meta row of inline `LABEL value` pairs (mono), and a progress bar:
  - Track: `h-1.5 rounded-full bg-secondary/60`.
  - Fill: `bg-accent` (active) or `bg-hairline` (idle), width = `${progress}%`.
- Right column: a "1U LED rack" — 6 rows of `h-1.5 w-1.5 rounded-full` LEDs. First 4 active: `bg-accent shadow-[0_0_6px_var(--accent)]`. Row 5 = `bg-primary/70`. Others = `bg-hairline`. Underneath, the "Boot module" CTA (active) or a disabled `Lock` button.
- Locked overlay: absolute `inset-0 grid place-items-center` with a strong dark gradient (`linear-gradient(180deg, oklch(0.10 0.03 265 / 70%) 0%, oklch(0.08 0.03 265 / 92%) 100%)`) + `bg-grid opacity-30`. Center a Lock tile with a `var(--glow-primary)` halo and mono "SECTOR LOCKED" labels.
- Between cards: `BusConnector` — a small centered column with two `h-1 w-1` dots and a `h-6 w-px bg-gradient-to-b from-accent/70 to-primary/70` line between hairline caps.

### 4.7 Community / feed cards (terminal windows)
- Section eyebrow: `font-mono text-[10px] uppercase tracking-[0.28em] text-accent` (e.g. `~/guild --live`), title in mono bold, sub in sans muted.
- Filter bar: `flex items-center gap-1 rounded-md border border-hairline bg-background/60 p-1 font-mono`. Buttons `rounded-sm px-3 py-1.5 text-[11px] font-bold uppercase tracking-[0.15em]`. Active → `bg-foreground text-background`. Inactive → `text-muted-foreground hover:text-foreground`.
- Grid: `grid gap-3 sm:grid-cols-2`.
- Card: `group relative overflow-hidden rounded-xl border border-hairline bg-background/60 transition-all hover:border-accent/50 hover:shadow-[0_0_30px_-10px_var(--glow-accent)]`.
- macOS-style traffic lights using **semantic** tokens, not literal colors:
  ```tsx
  <span className="h-2 w-2 rounded-full bg-destructive/70" />
  <span className="h-2 w-2 rounded-full bg-streak/70" />
  <span className="h-2 w-2 rounded-full bg-accent/70" />
  ```
- Title bar background: `bg-secondary/40`, border-b hairline, mono micro path on the left, mono tag (`C++`/`PY`) on the right — `text-primary` for C++, `text-accent` for PY (or whatever the two-language split is).
- Body uses `font-mono text-xs`: lead line `$ user · 2m ago` with `$` in `text-accent`; question line prefixed with `>` in `text-accent` followed by `font-bold text-foreground`; body `text-[11px] leading-relaxed text-muted-foreground line-clamp-2 pl-4`.
- Footer row: border-t hairline, mono tiny stats; the "reward multiplier" badge → `inline-flex items-center gap-1 rounded-sm bg-accent/15 px-1.5 py-0.5 text-accent` with a `Sparkles` icon. Action button = standard accent CTA (smaller padding `px-3 py-1.5 text-[11px]`).

### 4.8 Right rail widgets (quests / leaderboard / snippet)
- Each panel: `rounded-2xl glass-strong p-5` with mono `text-sm font-bold text-foreground` titles and an icon (`Target` → `text-primary`, `Trophy` → `text-accent`, `MessageCircleQuestion` → `text-accent`).
- Progress bar in quest: track `h-1.5 rounded-full bg-secondary`, fill `bg-gradient-to-r from-primary to-accent`.
- Leaderboard row: rank in `font-mono text-[10px] text-muted-foreground`, name `font-semibold text-foreground`, points `font-mono text-[11px] font-bold text-primary`.
- Snippet panel: inner box `rounded-md border border-hairline bg-background/70 p-3 font-mono text-[11px]` with a `$` prompt in `text-accent`, body in `text-foreground`, and a blinking caret `inline-block h-3 w-1.5 animate-pulse-soft bg-accent`. CTA same accent button recipe.

### 4.9 Footer
- `mt-16 flex flex-wrap items-center justify-between gap-2 border-t border-border/60 pt-6 font-mono text-[10px] uppercase tracking-[0.22em] text-muted-foreground` with a small pulsing `bg-primary` dot beside the build string.

---

## 5. Iconography & micro-details

- Use `lucide-react` icons throughout. Standard size in chrome is `h-3.5 w-3.5` to `h-4 w-4`. Increase `strokeWidth` (2.25–3) on small icons so they read cleanly.
- Anywhere a "live" indicator is appropriate, add a `h-1.5 w-1.5 rounded-full bg-primary animate-pulse-soft` dot.
- Every CTA/active surface should have **one** glow shadow on hover only — don't stack glows.
- Maintain a single accent-CTA per card; secondary actions stay as ghost text-only buttons (`text-muted-foreground hover:text-foreground`).

---

## 6. Acceptance checklist (run after edits)

- [ ] No literal Tailwind palette colors remain in components (`rg -n "bg-(slate|gray|zinc|cyan|purple|indigo|emerald|green|red|blue|yellow|orange|pink|fuchsia|violet)-\d"`); only `bg-success`, `bg-destructive`, etc. are allowed.
- [ ] No hex colors in JSX (`rg -n "#[0-9a-fA-F]{3,8}" src/components`). Inline gradients reference `var(--glow-*)` / `var(--background)` only.
- [ ] Toggling `<html class="dark">` flips the entire app without any color regressions; both modes pass WCAG AA on body text.
- [ ] Hero CTA, active module CTA, active toggle slider, and hovered feed cards each show a single soft glow.
- [ ] All micro-labels (paths, status, units, percentages) are mono + uppercase + wide tracking.
- [ ] Background grid + 2 radial halos are visible behind all content.
- [ ] No layout/markup changes were introduced — diff should be class-only.
