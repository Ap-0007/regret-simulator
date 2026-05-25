import React from "react";
import type { ValueAlignment } from "@/types/simulation";
import { cn } from "@/lib/cn";

interface ValueAlignmentBarProps {
  alignment: ValueAlignment;
  accentColor: string;
}

export function ValueAlignmentBar({ alignment, accentColor }: ValueAlignmentBarProps) {
  const pct = Math.max(0, Math.min(10, alignment.score)) * 10;
  const label =
    alignment.score >= 8
      ? "Strong"
      : alignment.score >= 5
        ? "Moderate"
        : alignment.score >= 3
          ? "Weak"
          : "Poor";

  return (
    <div className="flex items-center gap-3">
      <span
        className="w-32 shrink-0 truncate text-xs text-text-secondary capitalize"
        title={alignment.value}
      >
        {alignment.value}
      </span>
      <div
        className="relative flex-1 h-1.5 rounded-full bg-surface-3"
        role="progressbar"
        aria-valuenow={alignment.score}
        aria-valuemin={0}
        aria-valuemax={10}
        aria-label={`${alignment.value}: ${alignment.score}/10`}
      >
        <div
          className={cn("absolute inset-y-0 left-0 rounded-full transition-all duration-700", accentColor)}
          style={{ width: `${pct}%` }}
        />
      </div>
      <span className="w-12 shrink-0 text-right text-xs text-text-muted">
        {alignment.score}/10
      </span>
    </div>
  );
}

interface ValueAlignmentListProps {
  alignments: ValueAlignment[];
  accentColor: string;
}

export function ValueAlignmentList({ alignments, accentColor }: ValueAlignmentListProps) {
  return (
    <div className="flex flex-col gap-2.5" aria-label="Values alignment scores">
      {alignments.map((a) => (
        <ValueAlignmentBar key={a.value} alignment={a} accentColor={accentColor} />
      ))}
    </div>
  );
}
