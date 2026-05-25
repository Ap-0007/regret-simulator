import React from "react";

const MESSAGES = [
  "Mapping your decision tree...",
  "Simulating path A...",
  "Simulating path B...",
  "Simulating path C...",
  "Calculating regret vectors...",
];

// Each message holds for 2.5s; 5 × 2.5 = 12.5s cycle
const TOTAL_DURATION = 12.5;
const PER_MESSAGE = TOTAL_DURATION / MESSAGES.length;

export function SimulationLoadingState() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-background px-4">
      <div className="relative flex flex-col items-center gap-14">
        {/* Ambient glow */}
        <div
          className="pointer-events-none absolute inset-0 -z-10 blur-3xl opacity-20"
          aria-hidden="true"
        >
          <div className="h-64 w-64 rounded-full bg-amber-500/40" />
        </div>

        {/* Cycling messages — CSS-only, no spinner */}
        <div
          className="relative h-7 w-[360px] overflow-hidden"
          role="status"
          aria-label="Simulation in progress"
          aria-live="polite"
        >
          {MESSAGES.map((msg, i) => (
            <span
              key={msg}
              className="absolute inset-0 flex items-center justify-center text-center font-mono text-sm tracking-widest uppercase text-text-secondary"
              style={{
                // Each message fades in at its slot, then fades out before the next
                animation: `messageCycle ${TOTAL_DURATION}s ease-in-out ${i * PER_MESSAGE}s infinite`,
                opacity: 0,
              }}
            >
              {msg}
            </span>
          ))}
        </div>

        {/* Thin progress bar — CSS animation, 30s fill to 95% */}
        <div className="w-64 h-px bg-surface-3 overflow-hidden rounded-full">
          <div
            className="h-full bg-amber-500/50 rounded-full"
            style={{
              width: "0%",
              animation: "progressFill 30s linear forwards",
            }}
          />
        </div>

        <p className="text-xs text-text-muted tracking-wider">
          This takes 15–30 seconds
        </p>
      </div>
    </div>
  );
}
