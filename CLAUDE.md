# CLAUDE.md — CodeBite Project Memory & Guidelines

> This file is the single source of truth for all Claude Code sessions.
> Read this before touching any file. No exceptions.

**Demo credentials (login at `/`):**
- username: `demo`
- password: `Demo1234`
- email: `demo@codebite.dev`

---

## 1. Project Context

**Name:** CodeBite (CodeByte)
**Type:** Developer-tool gamified educational app — "Train like you code"
**Goal:** Teach programming logic and algorithms (C++ and Python) through Macro Modules,
circuit-board micro-pathways, interactive visualizations, and quizzes.
**Competition:** InfoEducație Romania — "Educational Software" category.
The jury evaluates: modularity, Git discipline, scientific accuracy, interactivity, and explainability.
**Production target:** Linux VPS, served by Nginx.

---

## 2. Tech Stack

### Backend (Python — primary language)
| Layer        | Choice                        | Notes                                      |
|--------------|-------------------------------|--------------------------------------------|
| Framework    | FastAPI                       | Async, fast, auto-generates OpenAPI docs   |
| Database     | SQLite via SQLAlchemy (async) | Local file, zero cost, jury-safe           |
| Auth         | JWT (python-jose + passlib)   | Simple, no third-party service             |
| Migrations   | Alembic                       | Schema versioning                          |
| Server       | Uvicorn                       | ASGI server for FastAPI                    |

### Frontend (React)
| Layer        | Choice                        | Notes                                      |
|--------------|-------------------------------|--------------------------------------------|
| Build tool   | Vite                          | Fast HMR                                   |
| UI           | React 18                      | Functional components only                 |
| Styling      | Tailwind CSS only             | No extra CSS frameworks                    |
| Icons        | lucide-react                  | Lightweight, consistent                    |
| State        | Zustand                       | Tokens, uptime, XP, theme, lang, codeLang  |
| Routing      | React Router v6               | SPA navigation                             |
| Animation    | Framer Motion                 | Algorithm visualizer step-through          |
| i18n         | react-i18next                 | EN/RO toggle                               |

### Infrastructure
| Layer        | Choice                        |
|--------------|-------------------------------|
| VPS OS       | Linux (Ubuntu LTS)            |
| Web server   | Nginx (reverse proxy)         |
| Process mgr  | systemd or PM2 for Uvicorn    |

**Production server:** `64.226.108.13` — SSH user: `claude-agent`

### No paid services. No Supabase. No Vercel. No external auth providers.

---

## 3. Project Structure

```
codebite/
├── backend/
│   ├── main.py
│   ├── database.py
│   ├── dependencies.py
│   ├── constants.py             # XP_PER_LESSON, XP_PER_QUIZ, MAX_LIVES (=5), etc.
│   ├── models/
│   │   ├── user.py              # lives (=tokens), streak (=uptime), xp
│   │   ├── lesson.py
│   │   ├── progress.py
│   │   └── community.py
│   ├── routers/
│   │   ├── auth.py
│   │   ├── lessons.py
│   │   ├── progress.py
│   │   └── community.py
│   ├── schemas/
│   ├── crud/
│   ├── core/
│   │   ├── config.py
│   │   └── security.py
│   ├── alembic/
│   │   └── versions/001_initial_schema.py
│   ├── alembic.ini
│   ├── seed.py
│   ├── create_test_user.py
│   ├── .venv/
│   └── codebite.db              # NEVER commit
│
├── frontend/
│   ├── public/locales/
│   │   ├── en/translation.json
│   │   └── ro/translation.json
│   ├── src/
│   │   ├── main.jsx
│   │   ├── App.jsx
│   │   ├── api/client.js
│   │   ├── store/useStore.js
│   │   ├── components/
│   │   │   ├── ui/              # Button, Card, Badge, Modal, ProgressBar
│   │   │   ├── layout/          # Navbar, Sidebar, MobileNav, HeroBanner
│   │   │   ├── gamification/    # TokenDisplay, UptimeCounter, XPBar
│   │   │   ├── pathway/         # MacroModule, CircuitPathway
│   │   │   ├── visualizer/      # AlgorithmVisualizer, ArrayBar, StepControls
│   │   │   ├── lesson/          # CodeBlock, QuizQuestion, MarkdownCodeBlock
│   │   │   └── community/       # QuestionCard, AnswerCard, AnswerForm
│   │   ├── pages/
│   │   │   ├── Home.jsx         # Login/register — redirects to /onboarding after register
│   │   │   ├── Onboarding.jsx   # Beginner check + placement test
│   │   │   ├── Pathway.jsx      # Macro Dashboard: 3 server-rack modules
│   │   │   ├── ModuleView.jsx   # Micro-pathway: circuit-board lesson nodes
│   │   │   ├── Lesson.jsx       # Theory + visualizer + quiz
│   │   │   ├── Community.jsx    # Debugger's Guild Q&A feed
│   │   │   └── Profile.jsx      # User stats
│   │   ├── hooks/
│   │   │   ├── useAuth.js
│   │   │   ├── useLives.js
│   │   │   └── useVisualizer.js
│   │   └── utils/
│   │       ├── algorithms.js
│   │       └── constants.js     # MAX_TOKENS, MODULES array
│   ├── index.html
│   ├── vite.config.js
│   └── tailwind.config.js
│
├── scripts/
│   ├── start.ps1
│   └── start.sh
├── .env
├── .gitignore
├── README.md
└── CLAUDE.md
```

---

## 4. Data Models

Backend column names are **unchanged** (`lives`, `streak`). The frontend relabels them.

| Model | Purpose | Key notes |
|---|---|---|
| `users` | Account + gamification | `lives` = Tokens (💠), `streak` = Uptime (⚡), max 5 tokens |
| `lessons` | Lesson metadata + content | `category` determines which Macro Module it belongs to |
| `quiz_questions` | Multiple-choice questions | `options_json` = `[{en, ro}]`, `correct_index` zero-based |
| `user_progress` | Per-user completion state | UNIQUE(user_id, lesson_id) |
| `questions` | Debugger's Guild questions | `body` = question text, `author_username` in response |
| `answers` | Answers to Guild questions | `accepted` = true grants +1 token to answerer |

### Non-obvious decisions
- `users.last_active` — date only; streak resets if no activity for 24h.
- `answers.accepted` → answerer gets +1 token (capped at 5). Core community-gamification hook.
- `quiz_questions.explanation_en/ro` — shown on wrong answer. Required for jury accuracy criterion.
- Frontend `MODULES` constant (in `utils/constants.js`) maps lesson `category` → Macro Module.
  No DB change needed — grouping is computed on the frontend.

---

## 5. Visual Identity & UI/UX

**Vibe:** Modern developer tool / Server-rack / Mainframe terminal. NOT cartoonish.

**Typography:**
- Body text: System sans-serif
- ALL numbers, stats, buttons, code, module headers: **Strict Monospace** (JetBrains Mono / Fira Code)

**Theme System:**

### Dark Mode (default)
| Token | Color | Usage |
|---|---|---|
| `dark.bg` | `#020617` (slate-950) | Page background |
| `dark.card` | `#0f172a` (slate-900) | Card surfaces |
| `dark.border` | `#334155` (slate-700) | Borders |
| `neon.cyan` | `#22d3ee` (cyan-400) | Primary interactive, active states |
| `neon.purple` | `#c084fc` (purple-400) | Secondary accent |
| `neon.green` | `#34d399` (emerald-400) | Completed/success states ONLY |

### Light Mode
| Usage | Class |
|---|---|
| Page background | `bg-slate-100` |
| Cards | `bg-white border-slate-200 shadow-sm` |
| Primary interactive | `text-deep-cyan` / `bg-deep-cyan` (`#0e7490`, cyan-700) |
| Accent | `text-deep-indigo` (`#4338ca`, indigo-700) |
| Body text | `text-slate-900` |

### State colors (both modes)
- **Active/available** → Cyan (neon-cyan dark / deep-cyan light)
- **Completed** → Emerald-400 (dark) / emerald-600 (light)
- **Locked** → slate-600/700 (both modes)
- **Wrong answer** → red-500

---

## 6. Navigation Architecture (CRITICAL)

```
/                    → Home (login/register)
  ↓ register         → /onboarding
  ↓ login            → /pathway

/onboarding          → Skill check + optional placement test
  ↓ beginner         → /pathway (start at MOD_01)
  ↓ advanced + pass  → /pathway (MOD_01 pre-completed, MOD_02 active)

/pathway             → Macro Dashboard (3 server-rack Macro Modules)
  ↓ > boot_module    → /module/:moduleSlug

/module/:moduleSlug  → Micro-pathway (circuit-board node list)
  ↓ tap node         → /lesson/:slug

/lesson/:slug        → Full lesson (theory + visualizer + quiz)
/community           → Debugger's Guild
/profile             → User stats
```

---

## 7. Macro Module Specs (Pathway Page)

3 modules shown as large server-rack cards stacked vertically:

| ID | Label | Subtitle | categories (in DB) |
|---|---|---|---|
| mod_01 | `MOD_01 // FOUNDATIONS` | Variables · I/O · Branches | `basics` |
| mod_02 | `MOD_02 // LOOPS & LOGIC` | While · For · Arrays | `arrays & strings` |
| mod_03 | `MOD_03 // ALGORITHMS` | Sorting · Searching | `sorting`, `searching` |

**Module status rules:**
- `active` — previous module completed (or first module) AND this module not complete
- `completed` — all lessons in module completed
- `locked` — previous module not completed

**Active card:** cyan border glow (`border-neon-cyan/50 shadow-[0_0_25px_rgba(34,211,238,0.12)]`),
lesson list visible, footer button `> boot_module` navigates to `/module/{slug}`.

**Locked card:** fog-of-war overlay (`backdrop-blur-[2px] bg-slate-950/75`), large Lock icon.

**Completed card:** emerald border, `> review_module` button.

---

## 8. Circuit-Board Micro-Pathway (ModuleView Page)

On `/module/:moduleSlug`, lessons are shown as nodes on a vertical circuit-board path.

**Layout:**
- Vertical SVG trunk at x=50%
- Nodes alternate left (x=18%) and right (x=72%)
- 160px vertical gap between nodes
- Horizontal branch lines connect trunk to each node (90° angles — no curves)
- Junction dots at each trunk-branch intersection

**Node styles:**
- Completed → 48px circle, `border-emerald-500 bg-emerald-500/10 text-emerald-400`, static glow
- Active → 56px circle, `border-neon-cyan bg-neon-cyan/10`, `.node-pulse` animation
- Locked → 44px circle, `border-slate-700 bg-dark-card`, opacity-40

**SVG line colors:** emerald-500 for completed segments, cyan-400 for active, slate-700 for locked.

---

## 9. Gamification (Frontend Labels vs Backend Fields)

| Concept | Backend field | Frontend display | Symbol |
|---|---|---|---|
| Tokens | `users.lives` | "Tokens" | 💠 |
| Uptime | `users.streak` | "Uptime" | ⚡ |
| XP | `users.xp` | "XP" | — |

**Rules (unchanged):**
- Tokens: Start 5. −1 on wrong quiz answer. +1 when Guild answer accepted. Max 5.
- Uptime: +1 per day with lesson completed. Reset if day missed.
- XP: +10 per lesson, +5 per correct quiz, +15 per accepted Guild answer.

---

## 10. Debugger's Guild (Community)

Renamed from "Community Q&A". Branding:
- Page title: **Debugger's Guild**
- Subtitle: *"Help a peer, earn a 💠 Token!"*
- Questions displayed in terminal style: monospace username prefix
- Answer submit button: `>_ Debug & Earn`
- Accept answer button: `> Accept Fix` (gains +1 token for answerer)

---

## 11. Onboarding Flow

Triggered after **register only** (not login).

**Step 1 — Skill check:**
```
Are you a complete beginner?
[▶ Start from scratch]   [>_ Test my skills]
```

**Step 2 — Placement test** (if not beginner):
- Fetch quiz questions from `GET /lessons/variables-basics`
- Show 5 questions (one at a time)
- Pass threshold: ≥3/5 correct
- On pass: call `POST /progress/{id}` for all `basics` category lessons → user starts at MOD_02
- On fail: navigate to `/pathway` (starts at MOD_01)

---

## 12. API Endpoints

```
GET    /health
POST   /auth/register         → redirect client to /onboarding
POST   /auth/login            → redirect client to /pathway
GET    /auth/me
GET    /lessons
GET    /lessons/{slug}        → includes quiz_questions array
GET    /progress
POST   /progress/{lesson_id}  → +10 XP, updates uptime
POST   /progress/{lesson_id}/quiz → correct: +5 XP; wrong: −1 token
GET    /community/questions
GET    /community/questions/{id}/answers
POST   /community/questions
POST   /community/answers/{question_id}
PATCH  /community/answers/{answer_id}/accept → +1 token answerer, +15 XP
```

---

## 13. Strict Coding Guidelines

### General
- **Modular first.** Every component does one thing. ~150 line limit per component.
- **No logic in JSX.** Move conditionals to hooks or utils.
- **Monospace for all numbers, stats, buttons, code.** Use `font-mono` class.
- **No console.log in commits.** Use `DEBUG` flag in constants.js.

### React / Frontend
- Functional components only. Custom hooks for stateful logic.
- Zustand in one file (`useStore.js`). No Redux, no Context API.
- All API calls via `src/api/client.js`.
- Tailwind only. No inline `style={{}}` except for dynamic values.
- Mobile-first: write base then `sm:` / `md:` / `lg:`.

### Python / Backend
- One router file per domain. CRUD in `crud/`. Pydantic schemas always.
- All DB operations async. JWT secret from `.env`, never hardcoded.
- **bcrypt pinned to `==4.0.1`** (passlib 1.7.4 compat).
- **SQLAlchemy `>=2.0.36`** (Python 3.13 compat).

### Database
- Alembic for every schema change. Never edit DB manually in production.
- FK constraints always defined. Indexes on `user_id`, `lesson_id` JOIN columns.

### Git
- Commit format: `feat:`, `fix:`, `refactor:`, `docs:`, `style:`
- `.env` and `codebite.db` always in `.gitignore`.

---

## 14. Dev Quickstart

```powershell
# Backend (Windows)
cd backend
.venv\Scripts\uvicorn main:app --reload --port 8000

# Frontend (Windows — npm is blocked, use direct node path)
cd frontend
node .\node_modules\vite\bin\vite.js
```

Dev URLs: `http://localhost:5173` (app), `http://localhost:8000/docs` (API docs).

First-time setup:
```
cd backend && python -m venv .venv
.venv\Scripts\pip install -r requirements.txt
.venv\Scripts\alembic upgrade head
.venv\Scripts\python seed.py
.venv\Scripts\python create_test_user.py   # demo/Demo1234
cd ../frontend && npm install
```

---

## 15. Deploy to Production

```powershell
.\deploy.ps1
```

This script builds the frontend and pushes everything to the production server.
SSH access: `ssh claude-agent@64.226.108.13`

---

## 17. What the Jury Evaluates

1. **Modularity** — isolated, single-purpose components
2. **Git history** — disciplined commit story
3. **Scientific accuracy** — correct algorithm explanations and visualizations
4. **Interactivity** — visualizer teaches, not just displays
5. **Originality** — Debugger's Guild earning tokens is the differentiator
6. **Code explainability** — walk through any function in 30 seconds

---

## 18. Design System (Governing Rule)

All React component markup **MUST** use the semantic token classes from `files/design-system.md`.
This supersedes the old hex/palette color system defined in §5.

**Infrastructure (already applied):**
- CSS variables (OKLCH) live in `frontend/src/index.css` — `:root` (light) and `.dark` blocks.
- Tailwind config maps semantic names to those vars with opacity-modifier support.
- Fonts: `Space Grotesk` (sans / body), `JetBrains Mono` (mono / chrome).

**Hard rules for every component:**
- **Never** use raw Tailwind palette classes: `text-cyan-500`, `bg-slate-900`, `text-white`, `bg-purple-600`, etc.
- **Always** use semantic tokens: `bg-background`, `text-foreground`, `text-muted-foreground`, `bg-card`, `text-primary`, `bg-accent`, `text-accent-foreground`, `bg-success`, `bg-destructive`, `text-streak`, `text-heart`, `border-hairline`.
- **Translucent surfaces:** `.glass` (lighter) or `.glass-strong` (heavier) — never manual `backdrop-blur` + `bg-*`.
- **Cards:** `rounded-2xl glass-strong p-5`. Hero cards: `rounded-3xl glass-strong p-6 sm:p-8`.
- **CTA buttons:** `bg-accent text-accent-foreground font-mono text-xs font-bold uppercase tracking-[0.12em] rounded-md px-5 py-3 hover:shadow-[0_0_40px_-4px_var(--glow-accent)] transition-all`.
- **Micro-labels** (≤12 px, paths, badges, units): `font-mono uppercase tracking-[0.18em]` → `tracking-[0.28em]`.
- **Glow:** one per card max, on hover only. `hover:shadow-[0_0_40px_-4px_var(--glow-accent)]`.
- **Color semantics:** Active/CTA = `accent` (cyan). Completed/success = `success` (emerald). Streak = `streak` (amber). Tokens/decorative = `primary` (purple). Wrong = `destructive` (red).
- **Background FX layer:** every page root should include a fixed `<BackgroundFX>` div (grid + 2 radial halos) as the first child — see `files/design-system.md §4.1`.
- For per-component class recipes (nav, cards, feed, widgets, footer) see `files/design-system.md §4`.

*Last updated: Bootstrap of OKLCH design system — semantic tokens, Space Grotesk, glass utilities.*
