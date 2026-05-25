"use client";

import React, { useMemo } from "react";
import { TrajectoryCard } from "@/components/TrajectoryCard";
import { HonestVerdict } from "@/components/HonestVerdict";
import { ShareButton } from "@/components/ShareButton";
import { Button } from "@/components/ui/button";
import { RotateCcw } from "lucide-react";
import { parsePartialResult, isTrajectoryRenderable } from "@/lib/parseStream";
import type { SimulationResult } from "@/types/simulation";
import { useRouter } from "next/navigation";

interface SimulationResultsProps {
  completion: string;
  isStreaming: boolean;
  shareToken: string;
  onRunAgain: () => void;
  completedResult?: SimulationResult | null;
}

export function SimulationResults({
  completion,
  isStreaming,
  shareToken,
  onRunAgain,
  completedResult,
}: SimulationResultsProps) {
  const partial = useMemo(() => {
    if (completedResult) return completedResult;
    return parsePartialResult(completion);
  }, [completion, completedResult]);

  const trajectories = partial?.trajectories ?? [];
  const renderableTrajectories = trajectories.filter(isTrajectoryRenderable);
  const verdict = partial?.verdict;

  if (renderableTrajectories.length === 0) return null;

  return (
    <div className="flex flex-col gap-10 animate-fade-in">
      {/* Trajectories grid */}
      <section aria-label="Life trajectories">
        <div className="grid gap-6 lg:grid-cols-3">
          {renderableTrajectories.map((t, i) => (
            <TrajectoryCard
              key={t.id ?? i}
              trajectory={t}
              isStreaming={isStreaming && i === renderableTrajectories.length - 1}
            />
          ))}
          {/* Placeholder cards while streaming remaining trajectories */}
          {isStreaming &&
            Array.from({ length: Math.max(0, 3 - renderableTrajectories.length) }).map((_, i) => (
              <div
                key={`placeholder-${i}`}
                className="flex min-h-[300px] items-center justify-center rounded-xl border border-border bg-surface p-6"
                aria-label="Loading trajectory"
                aria-busy="true"
              >
                <div className="flex flex-col items-center gap-3 text-text-muted">
                  <span className="inline-block h-2 w-2 rounded-full bg-amber-500 animate-pulse" />
                  <span className="text-xs uppercase tracking-widest">Generating...</span>
                </div>
              </div>
            ))}
        </div>
      </section>

      {/* Verdict */}
      {verdict && (
        <HonestVerdict verdict={verdict} />
      )}

      {/* Actions */}
      {!isStreaming && (
        <div className="flex flex-wrap items-center gap-3">
          <ShareButton shareToken={shareToken} />
          <Button
            variant="ghost"
            onClick={onRunAgain}
            aria-label="Run a new simulation"
            className="gap-2"
          >
            <RotateCcw className="h-4 w-4" />
            Run Again
          </Button>
        </div>
      )}
    </div>
  );
}
