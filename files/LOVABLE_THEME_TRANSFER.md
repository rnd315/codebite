# Lovable → Claude Theme Transfer

This document contains everything needed to replicate the exact visual styling
(colors, fonts, sizes, glows, animations) from the Lovable project into another
codebase that already has the same component structure.

---

## INSTRUCTIONS FOR CLAUDE

You are being asked to port the visual design system from a Lovable project
into this codebase. The component structure, JSX, props, state, routing, and
business logic in this project are already correct.

**HARD RULES — do not violate any of these:**

1. **Do NOT change** any JSX structure, component props, hooks, state, routing,
   imports, or business logic. Only change CSS, design tokens, fonts, and
   `className` strings.
2. **Replace** the project's main CSS file (likely `src/styles.css`,
   `src/index.css`, `src/app.css`, or `src/globals.css`) **entirely** with the
   `styles.css` block in section A below. Do not merge — overwrite. This file
   is the single source of truth for all tokens.
3. **Tailwind version detection:**
   - If the project uses **Tailwind v4** (the CSS starts with `@import "tailwindcss"`),
     the `@theme inline` block in my CSS works as-is. Done.
   - If the project uses **Tailwind v3** (has a `tailwind.config.{js,ts}` with
     `content: [...]`), also port the token map into `tailwind.config.ts` —
     see section C below.
4. **Load Google Fonts.** Add the `<link>` tags from section B into the HTML
   `<head>` (either `index.html`, the root layout, or the framework's head
   helper). Fonts required: Space Grotesk (400/500/600/700) and JetBrains Mono
   (400/500/700).
5. **Dark mode** is class-based. The `.dark` class on `<html>` swaps the
   palette. Make sure the theme toggle adds/removes that class on
   `document.documentElement` and nothing else.
6. **Components must use semantic tokens ONLY.** Search the codebase for these
   patterns and replace every hit with the semantic equivalent:
   - `text-white`, `text-black` → `text-foreground` / `text-background`
   - `bg-white`, `bg-black` → `bg-background` / `bg-foreground`
   - `bg-slate-*`, `bg-gray-*`, `bg-zinc-*`, `bg-neutral-*` → `bg-background` / `bg-card` / `bg-secondary` / `bg-muted`
   - `text-slate-*`, `text-gray-*` → `text-foreground` / `text-muted-foreground`
   - `text-cyan-*`, `text-blue-*`, `text-sky-*` → `text-accent` (active CTAs, glowing traces)
   - `text-purple-*`, `text-fuchsia-*`, `text-indigo-*`, `text-violet-*` → `text-primary` (tokens, decorative)
   - `text-green-*`, `text-emerald-*`, `text-lime-*` → `text-success` (completed/correct only)
   - `text-amber-*`, `text-yellow-*`, `text-orange-*` (for streak/uptime) → `text-streak`
   - `text-red-*`, `text-rose-*` → `text-destructive`
   - `border-slate-*`, `border-gray-*`, `border-white/10` → `border-border` or `border-hairline`
   Run this grep before finishing:
   `grep -rE "(text|bg|border|ring|fill|stroke)-(white|black|slate|gray|zinc|neutral|cyan|blue|sky|purple|fuchsia|indigo|violet|green|emerald|lime|amber|yellow|orange|red|rose|pink)-[0-9]+" src/components src/routes`
   Every hit must be replaced.
7. **Use these utility classes verbatim** where appropriate: `glass`, `glass-strong`,
   `text-gradient`, `bg-grid`, `glow-primary`, `glow-accent`, `font-mono`,
   `halo-spin`, `dash-flow`, `animate-shimmer`, `animate-pulse-soft`, `animate-float`.
8. **Sizes / spacing / radii** come from tokens. `--radius: 1rem` means
   `rounded-lg`, `rounded-xl`, `rounded-2xl`, `rounded-3xl` are sized off that.
   Don't introduce arbitrary `rounded-[Npx]` where a token-based class works.

**Verification checklist — do this after editing:**

1. Run the grep from rule 6. Zero raw-palette classes remain in
   `src/components/**` and `src/routes/**`.
2. Both `:root` and `.dark` blocks define every token listed in `@theme inline`.
3. Body computed font is Space Grotesk; `.font-mono` elements are JetBrains Mono.
4. Toggling `.dark` on `<html>` swaps the full palette with no leftover
   light-mode colors visible.
5. Visual check — both themes:
   - **Dark mode:** deep slate/navy background with cyan glows for active
     elements, neon purple for tokens/decoration, emerald only on success,
     amber on the streak dot. No neon green anywhere.
   - **Light mode:** cool slate-50 background (NOT pure white), deep cyan
     primary actions, deep indigo for decoration, WCAG-AA contrast.

---

## SECTION A — `src/styles.css` (DROP-IN REPLACEMENT)

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

/* Light: Daylight Editor — cool slate-50 bg, deep cyan + indigo for WCAG AA */
:root {
  --radius: 1rem;

  --background: oklch(0.975 0.006 250);
  --foreground: oklch(0.20 0.04 265);

  --card: oklch(1 0 0 / 75%);
  --card-foreground: oklch(0.20 0.04 265);
  --popover: oklch(1 0 0);
  --popover-foreground: oklch(0.20 0.04 265);

  --primary: oklch(0.42 0.20 275);
  --primary-foreground: oklch(0.99 0 0);

  --accent: oklch(0.52 0.13 220);
  --accent-foreground: oklch(0.99 0 0);

  --secondary: oklch(0.94 0.01 250);
  --secondary-foreground: oklch(0.20 0.04 265);

  --muted: oklch(0.94 0.01 250);
  --muted-foreground: oklch(0.42 0.02 260);

  --destructive: oklch(0.62 0.24 27);
  --destructive-foreground: oklch(0.99 0 0);

  --success: oklch(0.55 0.16 155);
  --success-foreground: oklch(0.99 0 0);

  --streak: oklch(0.72 0.18 65);
  --heart: oklch(0.62 0.24 20);

  --border: oklch(0.20 0.04 265 / 12%);
  --input: oklch(0.20 0.04 265 / 12%);
  --ring: oklch(0.52 0.13 220);

  --glow-primary: oklch(0.55 0.22 285 / 45%);
  --glow-accent: oklch(0.60 0.18 220 / 50%);
  --surface-glass: oklch(1 0 0 / 60%);
  --surface-elev: oklch(1 0 0 / 82%);
  --grid-line: oklch(0.20 0.04 265 / 6%);
  --hairline: oklch(0.20 0.04 265 / 14%);
}

/* Dark: Cyberpunk — slate-950 bg, electric cyan + neon purple */
.dark {
  --background: oklch(0.13 0.025 265);
  --foreground: oklch(0.97 0.01 240);

  --card: oklch(0.20 0.03 265 / 60%);
  --card-foreground: oklch(0.97 0.01 240);
  --popover: oklch(0.18 0.03 265);
  --popover-foreground: oklch(0.97 0.01 240);

  --primary: oklch(0.72 0.26 305);
  --primary-foreground: oklch(0.10 0.03 265);

  --accent: oklch(0.82 0.16 210);
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
  --glow-accent: oklch(0.85 0.20 210 / 70%);
  --surface-glass: oklch(0.20 0.03 265 / 55%);
  --surface-elev: oklch(0.20 0.03 265 / 82%);
  --grid-line: oklch(0.97 0.01 240 / 6%);
  --hairline: oklch(0.97 0.01 240 / 12%);
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

/* Reusable utility classes */
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

@keyframes float-y {
  0%, 100% { transform: translateY(0); }
  50% { transform: translateY(-6px); }
}
.animate-float { animation: float-y 5s ease-in-out infinite; }

@keyframes shimmer {
  0% { background-position: 0% 50%; }
  100% { background-position: 200% 50%; }
}
.animate-shimmer {
  background-size: 200% 200%;
  animation: shimmer 6s linear infinite;
}

@keyframes pulse-soft {
  0%, 100% { opacity: 0.55; }
  50% { opacity: 1; }
}
.animate-pulse-soft { animation: pulse-soft 2.4s ease-in-out infinite; }

.bg-grid {
  background-image:
    linear-gradient(to right, var(--grid-line) 1px, transparent 1px),
    linear-gradient(to bottom, var(--grid-line) 1px, transparent 1px);
  background-size: 56px 56px;
}
```

---

## SECTION B — Google Fonts (add to `<head>`)

Add these three tags to `index.html` (or the framework's root head helper):

```html
<link rel="preconnect" href="https://fonts.googleapis.com" />
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin />
<link
  rel="stylesheet"
  href="https://fonts.googleapis.com/css2?family=Space+Grotesk:wght@400;500;600;700&family=JetBrains+Mono:wght@400;500;700&display=swap"
/>
```

If the project has no plain `index.html` (e.g. Next.js, Remix, TanStack Start),
add them via the framework's head API. For TanStack Start, that's the `head()`
function in `src/routes/__root.tsx` returning `{ links: [...] }`.

---

## SECTION C — Tailwind v3 Fallback (only if project is NOT on Tailwind v4)

If `tailwind.config.{js,ts}` exists, ensure it contains:

```ts
import type { Config } from "tailwindcss";

export default {
  darkMode: ["class"],
  content: ["./index.html", "./src/**/*.{ts,tsx}"],
  theme: {
    extend: {
      colors: {
        background: "var(--background)",
        foreground: "var(--foreground)",
        card: { DEFAULT: "var(--card)", foreground: "var(--card-foreground)" },
        popover: { DEFAULT: "var(--popover)", foreground: "var(--popover-foreground)" },
        primary: { DEFAULT: "var(--primary)", foreground: "var(--primary-foreground)" },
        accent: { DEFAULT: "var(--accent)", foreground: "var(--accent-foreground)" },
        secondary: { DEFAULT: "var(--secondary)", foreground: "var(--secondary-foreground)" },
        muted: { DEFAULT: "var(--muted)", foreground: "var(--muted-foreground)" },
        destructive: { DEFAULT: "var(--destructive)", foreground: "var(--destructive-foreground)" },
        success: { DEFAULT: "var(--success)", foreground: "var(--success-foreground)" },
        streak: "var(--streak)",
        heart: "var(--heart)",
        border: "var(--border)",
        input: "var(--input)",
        ring: "var(--ring)",
        hairline: "var(--hairline)",
      },
      borderRadius: {
        lg: "var(--radius)",
        md: "calc(var(--radius) - 2px)",
        sm: "calc(var(--radius) - 4px)",
        xl: "calc(var(--radius) + 4px)",
        "2xl": "calc(var(--radius) + 8px)",
        "3xl": "calc(var(--radius) + 12px)",
      },
      fontFamily: {
        sans: ['"Space Grotesk"', "ui-sans-serif", "system-ui", "sans-serif"],
        mono: ['"JetBrains Mono"', "ui-monospace", "SF Mono", "Menlo", "monospace"],
      },
    },
  },
  plugins: [],
} satisfies Config;
```

In Tailwind v3 mode, keep my `:root` and `.dark` blocks from section A but
remove the `@import "tailwindcss" source(none);`, `@source`, `@custom-variant`,
and `@theme inline` lines (those are v4-only) and replace the top with the v3
directives:

```css
@tailwind base;
@tailwind components;
@tailwind utilities;
```

Done.
