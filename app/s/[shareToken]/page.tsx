import React from "react";
import { notFound } from "next/navigation";
import Link from "next/link";
import { db } from "@/lib/supabase/db";
import { TrajectoryCard } from "@/components/TrajectoryCard";
import { HonestVerdict } from "@/components/HonestVerdict";
import { Brain } from "lucide-react";
import { cn } from "@/lib/cn";
import type { SimulationRecord } from "@/types/simulation";
import type { Metadata } from "next";

interface PageProps {
  params: { shareToken: string };
}

async function getSimulation(shareToken: string) {
  const { data, error } = await db
    .simulations()
    .select("id, share_token, input, result, created_at, completed_at")
    .eq("share_token", shareToken)
    .single();

  if (error || !data?.result) return null;
  return data as SimulationRecord;
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const sim = await getSimulation(params.shareToken);
  if (!sim) return { title: "Simulation not found — Regret Simulator" };

  const decision = (sim.input.decision ?? "").slice(0, 80);
  return {
    title: `"${decision}" — Regret Simulator`,
    description: `3 diverging 5-year trajectories for: ${decision}`,
  };
}

// Cache share pages at the edge — results never change once a simulation completes.
// Use ISR so the page is generated on first request then cached indefinitely.
export const revalidate = false;

export default async function SharePage({ params }: PageProps) {
  const sim = await getSimulation(params.shareToken);
  if (!sim || !sim.result) notFound();

  const { input, result } = sim;
  const date = new Date(sim.created_at).toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });

  return (
    <main className="mx-auto max-w-7xl px-4 py-12 sm:py-16">
      {/* Nav */}
      <div className="mb-10 flex items-center justify-between">
        <Link
          href="/"
          className="flex items-center gap-2 text-xs font-mono uppercase tracking-widest text-text-muted hover:text-text-secondary transition-colors"
          aria-label="Back to Regret Simulator home"
        >
          <Brain className="h-4 w-4 text-amber-500" aria-hidden="true" />
          Regret Simulator
        </Link>
        <span className="text-xs text-text-muted">{date}</span>
      </div>

      {/* Decision header */}
      <section className="mb-10 flex flex-col gap-3" aria-label="Decision details">
        <span className="text-xs font-mono uppercase tracking-widest text-text-muted">
          Decision
        </span>
        <h1 className="text-2xl font-bold text-text-primary sm:text-3xl">
          {input.decision}
        </h1>
        {input.values.length > 0 && (
          <div className="flex flex-wrap gap-1.5" aria-label="Values">
            {input.values.map((v) => (
              <span
                key={v}
                className="rounded-full bg-surface-2 px-2.5 py-0.5 text-xs text-text-secondary border border-border"
              >
                {v}
              </span>
            ))}
          </div>
        )}
        <p className="text-sm text-text-secondary italic">
          Risk tolerance: {input.riskTolerance}/10
        </p>
      </section>

      {/* Trajectories */}
      <section aria-label="Life trajectories" className="mb-10">
        <div className="grid gap-6 lg:grid-cols-3">
          {result.trajectories.map((t) => (
            <TrajectoryCard key={t.id} trajectory={t} />
          ))}
        </div>
      </section>

      {/* Verdict */}
      <div className="mb-10">
        <HonestVerdict verdict={result.verdict} />
      </div>

      {/* CTA */}
      <div className="flex flex-col items-center gap-4 rounded-xl border border-border bg-surface p-8 text-center">
        <p className="text-sm text-text-secondary">Facing a big decision of your own?</p>
        <Link
          href="/"
          aria-label="Simulate your own decision"
          className={cn(
            "inline-flex items-center justify-center gap-2 rounded-md text-base font-medium transition-colors",
            "h-12 px-6 bg-amber-500 text-black hover:bg-amber-400",
            "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-amber-500"
          )}
        >
          Simulate your decision →
        </Link>
      </div>
    </main>
  );
}
