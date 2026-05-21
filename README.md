# 🧠 CodeBite — `compile your skills, byte by byte.`

> **Concurs InfoEducație 2026 — Categoria: Software Educațional**
> Realizat cu pasiune pentru programare și pedagogie modernă.

---

## 🔭 Viziunea

CodeBite nu este doar o altă platformă de e-learning.

Platformele tradiționale oferă video-uri pasive și teste simple. **CodeBite înlocuiește consumul pasiv cu *Active Discovery***: fiecare lecție este o misiune, fiecare răspuns greșit costă un Token, iar fiecare egal câștigat în Breasla Debuggerilor îți aduce resurse înapoi.

Inspirat din estetica uneltelor pentru dezvoltatori — terminale, circuite, server-rack-uri — CodeBite creează un mediu în care **programarea se simte ca un skill de câștigat, nu ca o materie de înghițit**.

**Paradigma de predare:** *Reverse Engineering & Visual Sandbox*
- Elevul vede mai întâi comportamentul algoritmului (vizualizarea pas cu pas)
- Deduce regulile din exemple concrete
- Verifică ipoteza prin quizul cu risc de Token
- Solidifică prin provocările din Breasla Debuggerilor

---

## 🏗️ Arhitectura

### Frontend

| Strat | Tehnologie | Rol |
|---|---|---|
| Build tool | **Vite** | HMR rapid, bundling optimizat |
| UI | **React 18** | Componente funcționale, hooks |
| Animații | **Framer Motion** | Feedback fluid, vizualizator algoritmi pas-cu-pas |
| State | **Zustand** | Token-uri, Uptime, XP, temă, limbă, limbaj de cod |
| Stilizare | **Tailwind CSS + Design System OKLCH** | Token-uri semantice, suport dark/light |
| Routing | **React Router v6** | Navigare SPA |
| i18n | **react-i18next** | Bilingv complet: 🇷🇴 Română / 🇬🇧 Engleză |

**Design System:** Sistem propriu de token-uri OKLCH (`--color-primary`, `--color-accent`, `--color-success` etc.), cu utilitare `glass` și `glass-strong` pentru suprafețe translucide. Fonturile `Space Grotesk` (body) și `JetBrains Mono` (chrome monospace) definesc identitatea vizuală.

### Backend

| Strat | Tehnologie | Rol |
|---|---|---|
| Framework | **FastAPI** | Async, auto-generare OpenAPI docs |
| Baza de date | **SQLite + SQLAlchemy (async)** | Zero-cost, portabil, jury-safe |
| Auth | **JWT** (python-jose + passlib) | Fără servicii externe |
| Migrații | **Alembic** | Versionare schemă |
| Server | **Uvicorn** | ASGI server pentru FastAPI |

### Infrastructură

- 🐧 **VPS Linux (Ubuntu LTS)** — producție
- 🔀 **Nginx** — reverse proxy
- ⚙️ **systemd** — process manager pentru Uvicorn
- 🚫 **Zero servicii plătite.** Fără Supabase, Vercel sau auth providers externi.

---

## ⚙️ Motorul de Misiuni (Lesson Engine)

Fiecare lecție urmează un flux în 4 pași proiectați pedagogic:

```
📖 POVESTE (Story Hook)
   └─ Contextul problemei — de ce contează acest concept?

🎮 SANDBOX INTERACTIV
   └─ Vizualizator pas-cu-pas (Framer Motion)
      Elevul controlează viteza, înaintează și retrage pași.
      Algoritmul se dezvăluie vizual, nu verbal.

📚 TEORIE
   └─ Explicație concisă cu exemple de cod (C++ și Python)
      Blocuri de cod colorate, copiabile.

🎯 KNOWLEDGE CHECK (Quiz cu risc)
   └─ 5 întrebări cu variante multiple
      ✅ Răspuns corect  → +5 XP
      ❌ Răspuns greșit  → −1 Token 💠
      📝 Explicație afișată indiferent de răspuns
```

**Riscul de Token transformă fiecare răspuns într-o decizie reală** — nu există buton "skip" sau "mai încearcă gratuit". Dacă ești nesigur, mergi mai întâi la vizualizator.

---

## 🎮 Ecosistemul Gamification

### 💠 Sistemul de Token-uri

| Eveniment | Efect |
|---|---|
| Răspuns corect la quiz | +5 XP |
| Răspuns greșit la quiz | −1 Token 💠 |
| Lecție completată | +10 XP · +1 Uptime ⚡ |
| Răspuns acceptat în Breasla Debuggerilor | **+1 Token 💠 · +15 XP** |
| Token-uri maxime | 5 💠 (plafonat) |
| Zi fără activitate | Reset Uptime ⚡ |

Token-urile nu sunt decorative — sunt **resursa de viață** a platformei. Rămâi fără tokens, rămâi fără quizuri.

### 🛡️ Breasla Debuggerilor (Debugger's Guild)

Feed hibrid de comunitate în stil terminal, unde greșelile din lecții se transformă în oportunități sociale:

- Postezi o întrebare blocantă → primești ajutor de la colegi
- Răspunzi corect și răspunsul îți este acceptat → **câștigi înapoi un Token pierdut**
- Interfața: monospace username prefix, buton `>_ Debug & Earn`, buton `> Accept Fix`

**Acesta este diferențiatorul principal al proiectului:** un loop feedback economic între eroare individuală și colaborare comunitară.

---

## 🌳 Curricula — Arborele de Cunoaștere

```
📦 MOD_01 // FOUNDATIONS
   Variabile · I/O · Ramificații
   ├── 📄 Hello, World! — Primul tău program
   ├── 📄 Variabile și Tipuri de Date
   └── 📄 Instrucțiuni Condiționale (if / else)

📦 MOD_02 // LOOPS & LOGIC
   While · For · Array-uri
   ├── 📄 Bucla While
   ├── 📄 Bucla For
   └── 📄 Array-uri și Indecși

📦 MOD_03 // STRINGS & FUNCTIONS
   Funcții · Recursivitate · Șiruri
   ├── 📄 Funcții și Parametri
   ├── 📄 Recursivitate
   └── 📄 Șiruri de Caractere (Strings)

📦 MOD_04 // DATA STRUCTURES
   Structuri · Pointeri · STL
   ├── 📄 Structuri (struct / class)
   ├── 📄 Pointeri și Memorie
   └── 📄 Liste și Vectori STL

📦 MOD_05 // ALGORITHMS I
   Sortare · Căutare
   ├── 📄 Algoritmi de Sortare (Bubble · Selection · QuickSort)
   └── 📄 Algoritmi de Căutare (Liniară · Binară)

📦 MOD_06 // ALGORITHMS II
   Programare Dinamică · Grafuri
   ├── 📄 Programare Dinamică (DP)
   └── 📄 Grafuri și Parcurgeri (BFS / DFS)
```

**Total: 6 Module Macro · 16 Lecții · Limbaje: C++ și Python**

---

## 🚀 Pornire Rapidă

### Cerințe
- Python 3.11+
- Node.js 18+

### Backend

```powershell
cd backend
python -m venv .venv
.venv\Scripts\pip install -r requirements.txt
.venv\Scripts\alembic upgrade head
.venv\Scripts\python seed.py
.venv\Scripts\python create_test_user.py
.venv\Scripts\uvicorn main:app --reload --port 8000
```

### Frontend

```powershell
cd frontend
npm install
node .\node_modules\vite\bin\vite.js
```

### URL-uri de dezvoltare
| Serviciu | URL |
|---|---|
| Aplicație | `http://localhost:5173` |
| API Docs (Swagger) | `http://localhost:8000/docs` |

### Credențiale demo
```
Username : demo
Parolă   : Demo1234
```

---

## 📁 Structura Proiectului

```
codebite/
├── backend/          # FastAPI, SQLAlchemy, Alembic
│   ├── routers/      # auth, lessons, progress, community
│   ├── models/       # user, lesson, progress, community
│   ├── crud/         # operații DB separate de routere
│   └── seed.py       # date inițiale de demonstrație
├── frontend/
│   ├── src/
│   │   ├── components/
│   │   │   ├── pathway/      # MacroModule, CircuitPathway (SVG)
│   │   │   ├── visualizer/   # AlgorithmVisualizer, StepControls
│   │   │   ├── lesson/       # CodeBlock, QuizQuestion
│   │   │   └── community/    # QuestionCard, AnswerCard
│   │   ├── pages/            # Home, Onboarding, Pathway, ModuleView,
│   │   │                     # Lesson, Community, Profile
│   │   └── store/useStore.js # Zustand — state global
│   └── public/locales/       # Traduceri EN / RO
├── scripts/
│   ├── backup.ps1    # Arhivare ZIP cu changelog automat
│   └── start.ps1     # Pornire backend + frontend simultan
└── CLAUDE.md         # Spec complet pentru sesiunile AI
```

---

## 🏆 Criterii InfoEducație — Cum le Adresăm

| Criteriu | Implementare |
|---|---|
| **Modularitate** | Componente izolate `~150 LOC`, un singur responsabil per fișier |
| **Disciplină Git** | Commit-uri semantice (`feat:`, `fix:`, `refactor:`), CHANGELOG.md automatizat |
| **Acuratețe științifică** | Vizualizator pas-cu-pas verificabil, explicații la răspunsuri greșite (`explanation_en/ro`) |
| **Interactivitate** | Sandbox Framer Motion, quiz cu risc de Token, comunitate cu economie de recompense |
| **Originalitate** | Loop economic Greșeală → Breasla Debuggerilor → Token recuperat |
| **Explicabilitate** | Orice funcție poate fi parcursă în 30 de secunde; API auto-documentat via Swagger |

---

*CodeBite — construit cu ❤️ pentru InfoEducație România 2026.*
