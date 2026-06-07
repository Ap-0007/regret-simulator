<p align="center">
  <img src="https://capsule-render.vercel.app/api?type=waving&color=0:0d1117,50:161b22,100:1a1b27&height=220&section=header&text=REGRET%20SIMULATOR&fontSize=55&fontColor=e6edf3&fontAlignY=35&desc=3%20Futures%20%E2%80%A2%205%20Years%20%E2%80%A2%20Every%20Decision%20Has%20a%20Shadow&descSize=16&descAlignY=55&descColor=8b949e&animation=fadeIn" width="100%" />
</p>

<p align="center">
  <img src="https://img.shields.io/badge/TypeScript-3178C6?style=for-the-badge&logo=typescript&logoColor=white&labelColor=0d1117&color=0d1117" />
  <img src="https://img.shields.io/badge/Next.js_14-000000?style=for-the-badge&logo=next.js&logoColor=white&labelColor=0d1117&color=0d1117" />
  <img src="https://img.shields.io/badge/Supabase-3FCF8E?style=for-the-badge&logo=supabase&logoColor=white&labelColor=0d1117&color=0d1117" />
  <img src="https://img.shields.io/badge/Ollama-000000?style=for-the-badge&logo=ollama&logoColor=white&labelColor=0d1117&color=0d1117" />
  <img src="https://img.shields.io/badge/Tailwind-06B6D4?style=for-the-badge&logo=tailwindcss&logoColor=white&labelColor=0d1117&color=0d1117" />
</p>

---

## 🔮 What is this?

**Regret Simulator** takes a single life decision and unfolds it into **three diverging 5-year timelines** — the best case, the worst case, and the one you didn't see coming.

You type in a crossroads:

> *"Should I drop out and start a company?"*

The simulator generates three deeply detailed, year-by-year narratives of how that decision could play out — complete with emotional arcs, financial consequences, relationship shifts, and the compound effects of every small choice that follows.

Powered by local LLM inference through **Ollama**, your decisions and fears never touch a cloud.

> *You can't undo a decision. But you can preview the regret.*

---

## ⚙️ How It Works

```
┌──────────────────────────────────────────────────────────┐
│                  🎯 YOUR DECISION                        │
│                                                          │
│     "Should I move to Berlin for that job offer?"       │
└──────────────────────┬───────────────────────────────────┘
                       │
                       ▼
┌──────────────────────────────────────────────────────────┐
│               🧠 OLLAMA LLM ENGINE                       │
│                                                          │
│  Context analysis ──▶ Decision tree generation           │
│  Risk factors ──▶ Emotional modeling                     │
│  Compound effects ──▶ Timeline divergence                │
└──────────────────────┬───────────────────────────────────┘
                       │
          ┌────────────┼────────────┐
          ▼            ▼            ▼
┌──────────────┐ ┌──────────────┐ ┌──────────────┐
│  🟢 PATH A   │ │  🔴 PATH B   │ │  🟡 PATH C   │
│  Best Case   │ │  Worst Case  │ │  Wild Card   │
│              │ │              │ │              │
│  Year 1...   │ │  Year 1...   │ │  Year 1...   │
│  Year 2...   │ │  Year 2...   │ │  Year 2...   │
│  Year 3...   │ │  Year 3...   │ │  Year 3...   │
│  Year 4...   │ │  Year 4...   │ │  Year 4...   │
│  Year 5...   │ │  Year 5...   │ │  Year 5...   │
└──────────────┘ └──────────────┘ └──────────────┘
                       │
                       ▼
┌──────────────────────────────────────────────────────────┐
│                💾 SUPABASE                                │
│                                                          │
│  Simulations persisted · Browse past decisions           │
│  Compare trajectories · Track decision patterns          │
└──────────────────────────────────────────────────────────┘
```

---

## 🧱 Tech Stack

| Layer | Technology | Purpose |
|:------|:-----------|:--------|
| **Frontend** | Next.js 14 (App Router) | Server components + streaming UI |
| **Styling** | Tailwind CSS | Dark, cinematic timeline interface |
| **AI** | Ollama | Local LLM for trajectory generation |
| **Database** | Supabase (PostgreSQL) | Simulation persistence & history |
| **Language** | TypeScript | End-to-end type safety |
| **State** | Zustand (store/) | Client-side state management |

---

## 🚀 Getting Started

### Prerequisites

```bash
node >= 18.0.0
ollama           # Running locally with a model pulled
supabase         # Account or local instance
```

### Installation

```bash
# Clone the repository
git clone https://github.com/Ap-0007/regret-simulator.git
cd regret-simulator

# Install dependencies
npm install

# Set up environment
cp .env.example .env.local
# Add your Supabase URL, anon key, and Ollama endpoint

# Initialize the database
# Run schema.sql against your Supabase project
psql $DATABASE_URL < schema.sql

# Start the development server
npm run dev

# Open in browser
open http://localhost:3000
```

---

## 📁 Project Structure

```
regret-simulator/
├── app/                    # Next.js 14 App Router
│   ├── layout.tsx          # Root layout
│   ├── page.tsx            # Landing / decision input
│   └── simulation/        # Trajectory display routes
├── components/             # React components
│   ├── timeline/           # Year-by-year timeline cards
│   └── ui/                 # Shared UI primitives
├── lib/                    # Utilities & API clients
│   ├── ollama.ts           # LLM integration
│   └── supabase.ts         # Database client
├── store/                  # Zustand state management
├── types/                  # TypeScript type definitions
├── schema.sql              # Supabase database schema
├── next.config.mjs         # Next.js configuration
├── tailwind.config.ts      # Tailwind configuration
└── postcss.config.js       # PostCSS configuration
```

---

## 🤝 Contributing

The best contributions come from people who've faced decisions they couldn't undo.

```bash
# Fork the repo
# Create your feature branch
git checkout -b feat/your-feature

# Commit your changes
git commit -m "feat: add your feature"

# Push and open a PR
git push origin feat/your-feature
```

---

<p align="center">
  <img src="https://img.shields.io/badge/license-MIT-e6edf3?style=flat-square&labelColor=0d1117&color=161b22" />
</p>

<p align="center">
  <sub>Built by <a href="https://github.com/Ap-0007">vanta.nox</a> · every decision casts three shadows</sub>
</p>

<img src="https://capsule-render.vercel.app/api?type=waving&color=0:0d1117,50:161b22,100:1a1b27&height=100&section=footer" width="100%" />
