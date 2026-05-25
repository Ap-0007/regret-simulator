import type { SimulationInput } from "@/types/simulation";

export const SYSTEM_PROMPT = `You are a life-trajectory simulator. Your job is to rigorously and honestly model diverging futures given a major decision. You do not hedge. You do not give empty positivity. You write like a novelist crossed with a financial analyst — precise, vivid, honest.

CRITICAL OUTPUT RULES:
1. Output ONLY a raw JSON object — no markdown fences, no commentary, no text before or after.
2. The JSON must start with { and end with }
3. The top-level keys must be exactly: "trajectories" (array of 3) and "verdict" (string)
4. Never output a bare array. Always wrap in the object.`;

export function buildUserPrompt(input: SimulationInput): string {
  const riskLabel =
    input.riskTolerance <= 3
      ? "very risk-averse"
      : input.riskTolerance <= 5
        ? "moderately risk-averse"
        : input.riskTolerance <= 7
            ? "moderately risk-tolerant"
            : "highly risk-tolerant";

  return `Simulate 3 diverging 5-year life trajectories for this decision. Be honest, specific, and unsparing.

## The Decision
${input.decision}

## Personal Values (ranked by importance)
${input.values.map((v, i) => `${i + 1}. ${v}`).join("\n")}

## 5-Year Goals
${input.goals}

## Relevant Context
${input.context?.trim() || "None provided."}

## Risk Tolerance
${input.riskTolerance}/10 — ${riskLabel}

---

Generate exactly 3 trajectories:
- Trajectory A: the most ambitious path (lean into the decision fully)
- Trajectory B: the most conservative path (resist or delay the change)
- Trajectory C: a middle-ground or hybrid path

Name each trajectory evocatively (e.g. "The Leap", "The Stay", "The Hedge"). Each name must reflect the actual trajectory, not a generic label.

The verdict must be 150–250 words, written in second person ("You"), and must take a clear position recommending one trajectory. It must reference the person's stated values directly.

YOUR RESPONSE MUST BE A SINGLE JSON OBJECT WITH THIS EXACT SHAPE:
{
  "trajectories": [ ...3 trajectory objects... ],
  "verdict": "...150-250 word verdict..."
}

Each trajectory object shape:
{
  "id": "A" | "B" | "C",
  "name": string,
  "tagline": string,
  "riskLevel": "Low" | "Medium" | "High",
  "years": [
    { "year": 1, "narrative": "2-3 sentences" },
    { "year": 2, "narrative": "2-3 sentences" },
    { "year": 3, "narrative": "2-3 sentences" },
    { "year": 5, "narrative": "2-3 sentences" }
  ],
  "outcome": {
    "careerFinancial": "2-3 sentences",
    "relationshipsLifestyle": "2-3 sentences",
    "mentalHealthEnergy": "2-3 sentences",
    "valuesAlignment": [
      { "value": "<each user value>", "score": <0-10> }
    ]
  },
  "regretScore": <0-100>,
  "regretExplanation": "1-2 sentences",
  "turningPoint": "2-3 sentences describing the decisive moment",
  "risks": ["risk 1", "risk 2", "risk 3"],
  "upsides": ["upside 1", "upside 2", "upside 3"]
}

Start your response with { and nothing else.`;
}
