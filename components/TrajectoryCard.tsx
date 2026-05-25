import React from "react";
import { AlertTriangle, TrendingUp, Zap } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { ValueAlignmentList } from "@/components/ValueAlignmentBar";
import { cn } from "@/lib/cn";
import type { PartialTrajectory, RiskLevel } from "@/types/simulation";

const PATH_COLORS = {
  A: {
    border: "border-amber-500/30",
    glow: "shadow-amber-500/10",
    accent: "text-amber-400",
    bg: "bg-amber-500/5",
    bar: "bg-amber-500",
    badge: "ring-amber-500/20",
  },
  B: {
    border: "border-blue-500/30",
    glow: "shadow-blue-500/10",
    accent: "text-blue-400",
    bg: "bg-blue-500/5",
    bar: "bg-blue-500",
    badge: "ring-blue-500/20",
  },
  C: {
    border: "border-violet-500/30",
    glow: "shadow-violet-500/10",
    accent: "text-violet-400",
    bg: "bg-violet-500/5",
    bar: "bg-violet-500",
    badge: "ring-violet-500/20",
  },
} as const;

function riskBadgeVariant(risk: RiskLevel): "low" | "medium" | "high" {
  return risk.toLowerCase() as "low" | "medium" | "high";
}

function RegretGauge({ score }: { score: number }) {
  const color =
    score >= 70 ? "text-red-400" : score >= 40 ? "text-amber-400" : "text-emerald-400";
  return (
    <div className="flex flex-col items-center gap-1">
      <span className={cn("text-5xl font-black tabular-nums leading-none", color)}>
        {score}
      </span>
      <span className="text-xs uppercase tracking-widest text-text-muted">Regret %</span>
    </div>
  );
}

interface SectionProps {
  title: string;
  children: React.ReactNode;
  className?: string;
}

function Section({ title, children, className }: SectionProps) {
  return (
    <div className={cn("flex flex-col gap-3", className)}>
      <h4 className="text-xs font-semibold uppercase tracking-widest text-text-muted">
        {title}
      </h4>
      {children}
    </div>
  );
}

function Divider() {
  return <div className="h-px w-full bg-border" aria-hidden="true" />;
}

interface TrajectoryCardProps {
  trajectory: PartialTrajectory;
  isStreaming?: boolean;
}

export function TrajectoryCard({ trajectory, isStreaming = false }: TrajectoryCardProps) {
  const id = trajectory.id ?? "A";
  const colors = PATH_COLORS[id] ?? PATH_COLORS.A;

  return (
    <article
      className={cn(
        "flex flex-col gap-6 rounded-xl border bg-surface p-6 shadow-lg",
        "animate-slide-up",
        colors.border,
        colors.glow
      )}
      aria-label={`Trajectory ${id}: ${trajectory.name ?? "Loading..."}`}
    >
      {/* Header */}
      <div className="flex items-start justify-between gap-4">
        <div className="flex flex-col gap-1.5">
          <div className="flex items-center gap-2">
            <span className={cn("text-xs font-mono font-bold uppercase tracking-widest", colors.accent)}>
              Path {id}
            </span>
          </div>
          <h3 className="text-xl font-bold text-text-primary">
            {trajectory.name ?? <span className="animate-pulse bg-surface-3 rounded w-32 h-6 inline-block" />}
          </h3>
          {trajectory.tagline && (
            <p className="text-sm text-text-secondary italic">{trajectory.tagline}</p>
          )}
        </div>
        {trajectory.riskLevel && (
          <Badge variant={riskBadgeVariant(trajectory.riskLevel)} className="shrink-0 mt-1">
            {trajectory.riskLevel} Risk
          </Badge>
        )}
      </div>

      <Divider />

      {/* Year-by-year narrative */}
      {trajectory.years && trajectory.years.length > 0 && (
        <Section title="Year by Year">
          <div className="flex flex-col gap-4">
            {trajectory.years.map((y, i) => (
              y.year !== undefined && y.narrative ? (
                <div key={i} className="flex gap-4">
                  <div className={cn("flex h-7 w-7 shrink-0 items-center justify-center rounded-full text-xs font-bold", colors.bg, colors.accent)}>
                    {y.year}
                  </div>
                  <p className="text-sm text-text-secondary leading-relaxed pt-0.5">
                    {y.narrative}
                  </p>
                </div>
              ) : null
            ))}
          </div>
        </Section>
      )}

      {/* 5-Year Outcome */}
      {trajectory.outcome && (
        <>
          <Divider />
          <Section title="5-Year Outcome">
            <div className="flex flex-col gap-3">
              {trajectory.outcome.careerFinancial && (
                <div>
                  <span className="text-xs font-semibold text-text-muted uppercase tracking-wide">Career & Financial</span>
                  <p className="mt-1 text-sm text-text-secondary leading-relaxed">{trajectory.outcome.careerFinancial}</p>
                </div>
              )}
              {trajectory.outcome.relationshipsLifestyle && (
                <div>
                  <span className="text-xs font-semibold text-text-muted uppercase tracking-wide">Relationships & Lifestyle</span>
                  <p className="mt-1 text-sm text-text-secondary leading-relaxed">{trajectory.outcome.relationshipsLifestyle}</p>
                </div>
              )}
              {trajectory.outcome.mentalHealthEnergy && (
                <div>
                  <span className="text-xs font-semibold text-text-muted uppercase tracking-wide">Mental Health & Energy</span>
                  <p className="mt-1 text-sm text-text-secondary leading-relaxed">{trajectory.outcome.mentalHealthEnergy}</p>
                </div>
              )}
            </div>
          </Section>
        </>
      )}

      {/* Value alignment bars */}
      {trajectory.outcome?.valuesAlignment && trajectory.outcome.valuesAlignment.length > 0 && (
        <>
          <Divider />
          <Section title="Values Alignment">
            <ValueAlignmentList
              alignments={
                trajectory.outcome.valuesAlignment.filter(
                  (a): a is { value: string; score: number } =>
                    typeof a.value === "string" && typeof a.score === "number"
                )
              }
              accentColor={colors.bar}
            />
          </Section>
        </>
      )}

      {/* Regret score + turning point */}
      {trajectory.regretScore !== undefined && (
        <>
          <Divider />
          <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:gap-8">
            <div className="shrink-0">
              <RegretGauge score={trajectory.regretScore} />
            </div>
            {trajectory.regretExplanation && (
              <p className="text-sm text-text-secondary leading-relaxed">
                {trajectory.regretExplanation}
              </p>
            )}
          </div>
        </>
      )}

      {/* Turning point */}
      {trajectory.turningPoint && (
        <>
          <Divider />
          <Section title="The Turning Point">
            <div className={cn("rounded-lg border-l-4 p-4", colors.bg, colors.border)}>
              <div className="flex items-start gap-3">
                <Zap className={cn("mt-0.5 h-4 w-4 shrink-0", colors.accent)} aria-hidden="true" />
                <p className="text-sm text-text-secondary leading-relaxed">
                  {trajectory.turningPoint}
                </p>
              </div>
            </div>
          </Section>
        </>
      )}

      {/* Risks & Upsides */}
      {(trajectory.risks?.length || trajectory.upsides?.length) ? (
        <>
          <Divider />
          <div className="grid gap-4 sm:grid-cols-2">
            {trajectory.risks && trajectory.risks.length > 0 && (
              <Section title="What could go wrong">
                <ul className="flex flex-col gap-2">
                  {trajectory.risks.map((r, i) => (
                    <li key={i} className="flex items-start gap-2 text-sm text-text-secondary">
                      <AlertTriangle className="mt-0.5 h-3.5 w-3.5 shrink-0 text-red-400" aria-hidden="true" />
                      {r}
                    </li>
                  ))}
                </ul>
              </Section>
            )}
            {trajectory.upsides && trajectory.upsides.length > 0 && (
              <Section title="What could go right">
                <ul className="flex flex-col gap-2">
                  {trajectory.upsides.map((u, i) => (
                    <li key={i} className="flex items-start gap-2 text-sm text-text-secondary">
                      <TrendingUp className="mt-0.5 h-3.5 w-3.5 shrink-0 text-emerald-400" aria-hidden="true" />
                      {u}
                    </li>
                  ))}
                </ul>
              </Section>
            )}
          </div>
        </>
      ) : null}

      {/* Streaming indicator */}
      {isStreaming && (
        <div className="flex items-center gap-2 text-xs text-text-muted" aria-live="polite">
          <span className="inline-block h-1.5 w-1.5 rounded-full bg-amber-500 animate-pulse" />
          Generating...
        </div>
      )}
    </article>
  );
}
