<p align="center">
  <img width="100%" src="https://capsule-render.vercel.app/api?type=waving&color=0:0d1117,50:161b22,100:1a1b27&height=220&section=header&text=regret-simulator&fontSize=58&fontColor=e6edf3&fontAlignY=35&desc=Simulate%20three%20diverging%20futures.%20Pick%20the%20one%20you%20can%20live%20with.&descSize=15&descAlignY=55&descColor=8b949e&animation=fadeIn" />
</p>

<p align="center">
  <img src="https://img.shields.io/badge/Next.js-000000?style=for-the-badge&logo=nextdotjs&logoColor=white&labelColor=0d1117&color=0d1117" />
  <img src="https://img.shields.io/badge/Ollama-000000?style=for-the-badge&logoColor=white&labelColor=0d1117&color=0d1117" />
  <img src="https://img.shields.io/badge/Supabase-3ECF8E?style=for-the-badge&logo=supabase&logoColor=white&labelColor=0d1117&color=0d1117" />
  <img src="https://img.shields.io/badge/Tailwind_CSS-06B6D4?style=for-the-badge&logo=tailwindcss&logoColor=white&labelColor=0d1117&color=0d1117" />
  <img src="https://img.shields.io/badge/TypeScript-3178C6?style=for-the-badge&logo=typescript&logoColor=white&labelColor=0d1117&color=0d1117" />
</p>

---

## 🔮 What is this?

**regret-simulator** answers the question most people are too afraid to model: *what happens if I make this decision?*

You describe a major life choice. The AI generates **3 diverging 5-year trajectories** — optimistic, realistic, and pessimistic — with enough specificity to feel real and enough uncertainty to stay honest.

It doesn't tell you what to do. It shows you what you're actually choosing between.

> *Every decision is a bet on a future. This makes the futures visible.*

---

## ⚙️ How It Works

```
┌──────────────────────────────────────────────────────────┐
│                   YOU DESCRIBE A DECISION                │
│  "Should I quit my job to build my startup full-time?"   │
│  + Context: salary, runway, team, product stage          │
└───────────────────────────────┬──────────────────────────┘
                                │
                                ▼
┌──────────────────────────────────────────────────────────┐
│                🧠 OLLAMA INFERENCE ENGINE                │
│                                                          │
│  ┌─────────────┐  ┌──────────────┐  ┌────────────────┐  │
│  │ 🟢 OPTIMISTIC│  │ 🟡 REALISTIC │  │ 🔴 PESSIMISTIC  │  │
│  │ Year 1: ... │  │ Year 1: ...  │  │ Year 1: ...    │  │
│  │ Year 3: ... │  │ Year 3: ...  │  │ Year 3: ...    │  │
│  │ Year 5: ... │  │ Year 5: ...  │  │ Year 5: ...    │  │
│  └─────────────┘  └──────────────┘  └────────────────┘  │
└───────────────────────────────┬──────────────────────────┘
                                │
                                ▼
┌──────────────────────────────────────────────────────────┐
│                   💾 SUPABASE STORAGE                    │
│  Simulation saved → shareable link generated             │
│  Compare across decisions over time                      │
└──────────────────────────────────────────────────────────┘
```

---

## 🧱 Tech Stack

| Layer | Technology | Purpose |
|:---|:---|:---|
| **Framework** | Next.js 14 (App Router) | Full-stack React application |
| **AI** | Ollama (local LLM) | Trajectory generation |
| **Database** | Supabase (PostgreSQL) | Simulation storage & sharing |
| **Styling** | Tailwind CSS | UI components |
| **Language** | TypeScript | Type-safe everywhere |

---

## 🚀 Getting Started

### Prerequisites

```bash
# Install Ollama
curl -fsSL https://ollama.ai/install.sh | sh
ollama pull llama3.2

node >= 18.0.0
```

### Installation

```bash
git clone https://github.com/Ap-0007/regret-simulator.git
cd regret-simulator

npm install
cp .env.example .env.local
npm run dev
# App at http://localhost:3000
```

### Environment Variables

```bash
NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_anon_key
OLLAMA_BASE_URL=http://localhost:11434
OLLAMA_MODEL=llama3.2
```

---

## 🏛️ Philosophy

The pessimistic path is the most important one. If you can accept it, you're ready to decide.

Most people make decisions by imagining the best case and hoping. This forces you to hold all three futures simultaneously — and choose the *distribution* you can live with.

---

## 🔗 Related

- **[parallel-you-engine](https://github.com/Ap-0007/parallel-you-engine)** — build your psychological profile first, then run the simulation

---

<p align="center">
  <img src="https://capsule-render.vercel.app/api?type=waving&color=0:58a6ff,60:1f6feb,100:0d1117&height=120&section=footer&animation=fadeIn" width="100%" />
</p>
