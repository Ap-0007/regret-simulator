import { parse } from "partial-json";
import type { PartialSimulationResult, PartialTrajectory, Trajectory } from "@/types/simulation";

export function parsePartialResult(text: string): PartialSimulationResult | null {
  if (!text.trim()) return null;
  try {
    return parse(text) as PartialSimulationResult;
  } catch {
    return null;
  }
}

export function isTrajectoryRenderable(t: PartialTrajectory): boolean {
  return !!(t.name && t.riskLevel && t.tagline);
}

export function isTrajectoryComplete(t: PartialTrajectory): t is Trajectory {
  return !!(
    t.id &&
    t.name &&
    t.tagline &&
    t.riskLevel &&
    Array.isArray(t.years) &&
    t.years.length === 4 &&
    t.years.every((y) => y.year !== undefined && y.narrative) &&
    t.outcome?.careerFinancial &&
    t.outcome?.relationshipsLifestyle &&
    t.outcome?.mentalHealthEnergy &&
    Array.isArray(t.outcome?.valuesAlignment) &&
    t.outcome.valuesAlignment.length > 0 &&
    t.regretScore !== undefined &&
    t.regretExplanation &&
    t.turningPoint &&
    Array.isArray(t.risks) &&
    t.risks.length === 3 &&
    Array.isArray(t.upsides) &&
    t.upsides.length === 3
  );
}

export function countCompletedTrajectories(partial: PartialSimulationResult): number {
  if (!partial.trajectories) return 0;
  return partial.trajectories.filter(isTrajectoryComplete).length;
}
