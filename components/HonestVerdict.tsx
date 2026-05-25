import React from "react";
import { MessageSquare } from "lucide-react";

interface HonestVerdictProps {
  verdict: string;
}

export function HonestVerdict({ verdict }: HonestVerdictProps) {
  return (
    <section
      aria-labelledby="verdict-heading"
      className="rounded-xl border border-amber-500/20 bg-amber-500/5 p-6 sm:p-8"
    >
      <div className="flex items-center gap-3 mb-5">
        <MessageSquare className="h-5 w-5 text-amber-400" aria-hidden="true" />
        <h2
          id="verdict-heading"
          className="text-sm font-semibold uppercase tracking-widest text-amber-400"
        >
          The Honest Verdict
        </h2>
      </div>
      <blockquote className="text-base leading-relaxed text-text-primary">
        {verdict.split("\n\n").map((para, i) => (
          <p key={i} className={i > 0 ? "mt-4" : ""}>
            {para}
          </p>
        ))}
      </blockquote>
    </section>
  );
}
