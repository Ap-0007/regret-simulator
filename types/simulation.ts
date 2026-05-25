import { z } from "zod";

// ── Input ─────────────────────────────────────────────────────────────────────

export const SimulationInputSchema = z.object({
  decision: z
    .string()
    .min(10, "Please describe your decision in at least 10 characters")
    .max(500, "Decision must be 500 characters or fewer"),
  values: z
    .array(z.string().min(1).max(50))
    .min(2, "Add at least 2 values")
    .max(8, "Maximum 8 values"),
  goals: z
    .string()
    .min(10, "Please describe your goals in at least 10 characters")
    .max(500, "Goals must be 500 characters or fewer"),
  context: z.string().max(800, "Context must be 800 characters or fewer").optional(),
  riskTolerance: z
    .number()
    .int()
    .min(1, "Risk tolerance must be between 1 and 10")
    .max(10, "Risk tolerance must be between 1 and 10"),
});

export type SimulationInput = z.infer<typeof SimulationInputSchema>;

// ── Result ────────────────────────────────────────────────────────────────────

export interface ValueAlignment {
  value: string;
  score: number; // 0–10
}

export interface YearNarrative {
  year: 1 | 2 | 3 | 5;
  narrative: string;
}

export interface TrajectoryOutcome {
  careerFinancial: string;
  relationshipsLifestyle: string;
  mentalHealthEnergy: string;
  valuesAlignment: ValueAlignment[];
}

export type RiskLevel = "Low" | "Medium" | "High";
export type TrajectoryId = "A" | "B" | "C";

export interface Trajectory {
  id: TrajectoryId;
  name: string;
  tagline: string;
  riskLevel: RiskLevel;
  years: YearNarrative[];
  outcome: TrajectoryOutcome;
  regretScore: number; // 0–100
  regretExplanation: string;
  turningPoint: string;
  risks: [string, string, string];
  upsides: [string, string, string];
}

export interface SimulationResult {
  trajectories: [Trajectory, Trajectory, Trajectory];
  verdict: string;
}

// ── Partial result (during streaming) ─────────────────────────────────────────

export type PartialValueAlignment = Partial<ValueAlignment>;

export type PartialTrajectoryOutcome = {
  careerFinancial?: string;
  relationshipsLifestyle?: string;
  mentalHealthEnergy?: string;
  valuesAlignment?: PartialValueAlignment[];
};

export type PartialTrajectory = {
  id?: TrajectoryId;
  name?: string;
  tagline?: string;
  riskLevel?: RiskLevel;
  years?: Partial<YearNarrative>[];
  outcome?: PartialTrajectoryOutcome;
  regretScore?: number;
  regretExplanation?: string;
  turningPoint?: string;
  risks?: string[];
  upsides?: string[];
};

export type PartialSimulationResult = {
  trajectories?: PartialTrajectory[];
  verdict?: string;
};

// ── DB record ─────────────────────────────────────────────────────────────────

export interface SimulationRecord {
  id: string;
  share_token: string;
  input: SimulationInput;
  result: SimulationResult | null;
  created_at: string;
  completed_at: string | null;
}

// ── API ───────────────────────────────────────────────────────────────────────

export interface ApiError {
  error: {
    code: string;
    message: string;
    field?: string;
    detail?: unknown;
  };
}

export interface CreateSimulationResponse {
  id: string;
  shareToken: string;
}

export interface GetSimulationResponse {
  id: string;
  shareToken: string;
  input: SimulationInput;
  result: SimulationResult | null;
  completed: boolean;
}
