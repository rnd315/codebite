/** @type {import('tailwindcss').Config} */

// Resolves a CSS-var color with Tailwind v3 opacity modifier support.
// Solid:   bg-accent       → oklch(var(--accent))
// Alpha:   bg-accent/70    → oklch(var(--accent-ch) / 0.7)
function token(channel, full) {
  return ({ opacityValue }) =>
    opacityValue != null
      ? `oklch(var(${channel}) / ${opacityValue})`
      : `var(${full ?? channel.replace('-ch', '')})`;
}

export default {
  darkMode: 'class',
  content: ['./index.html', './src/**/*.{js,jsx}'],
  theme: {
    extend: {
      colors: {
        background:  token('--background-ch'),
        foreground:  token('--foreground-ch'),
        card: {
          DEFAULT:    'var(--card)',
          foreground: 'var(--card-foreground)',
        },
        popover: {
          DEFAULT:    'var(--popover)',
          foreground: 'var(--popover-foreground)',
        },
        primary: {
          DEFAULT:    token('--primary-ch'),
          foreground: 'var(--primary-foreground)',
        },
        accent: {
          DEFAULT:    token('--accent-ch'),
          foreground: 'var(--accent-foreground)',
        },
        secondary: {
          DEFAULT:    token('--secondary-ch'),
          foreground: 'var(--secondary-foreground)',
        },
        muted: {
          DEFAULT:    token('--muted-ch'),
          foreground: 'var(--muted-foreground)',
        },
        destructive: {
          DEFAULT:    token('--destructive-ch'),
          foreground: 'var(--destructive-foreground)',
        },
        success: {
          DEFAULT:    token('--success-ch'),
          foreground: 'var(--success-foreground)',
        },
        streak:   token('--streak-ch'),
        heart:    token('--heart-ch'),
        // Pre-formed with transparency — cannot use opacity modifiers on these
        border:   'var(--border)',
        input:    'var(--input)',
        ring:     'var(--ring)',
        hairline: 'var(--hairline)',
      },
      fontFamily: {
        sans: ['Space Grotesk', 'ui-sans-serif', 'system-ui', 'sans-serif'],
        mono: ['JetBrains Mono', 'ui-monospace', 'SF Mono', 'Menlo', 'monospace'],
      },
      borderRadius: {
        sm:   'calc(var(--radius) - 4px)',
        md:   'calc(var(--radius) - 2px)',
        lg:   'var(--radius)',
        xl:   'calc(var(--radius) + 4px)',
        '2xl': 'calc(var(--radius) + 8px)',
        '3xl': 'calc(var(--radius) + 12px)',
      },
    },
  },
  plugins: [],
}
