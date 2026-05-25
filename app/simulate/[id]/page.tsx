"use client";

import React, { useEffect, useRef, useState, useCallback } from "react";
import { useRouter, useParams } from "next/navigation";
import { useCompletion } from "ai/react";
import { SimulationLoadingState } from "@/components/SimulationLoadingState";
import { SimulationResults } from "@/components/SimulationResults";
import { ErrorBoundary } from "@/components/ErrorBoundary";
import { Button } from "@/components/ui/button";
import { AlertCircle, RotateCcw, Brain } from "lucide-react";
import { apiClient, ApiClientError } from "@/lib/apiClient";
import { useSimulationStore } from "@/store/simulationStore";
import type { GetSimulationResponse, SimulationResult } from "@/types/simulation";
import Link from "next/link";

type PageState = "loading" | "streaming" | "done" | "error" | "already_done";

export default function SimulatePage() {
  const params = useParams<{ id: string }>();
  const id = params?.id ?? "";
  const router = useRouter();
  const { lastShareToken } = useSimulationStore();

  const [pageState, setPageState] = useState<PageState>("loading");
  const [shareToken, setShareToken] = useState<string>(lastShareToken ?? "");
  const [errorMessage, setErrorMessage] = useState<string>("");
  const [completedResult, setCompletedResult] = useState<SimulationResult | null>(null);
  const hasFetched = useRef(false);

  const { completion, complete, isLoading: isStreaming, error: streamError } = useCompletion({
    api: `/api/simulate/${id}/stream`,
    onFinish: (_prompt, text) => {
      // Stream done — attempt to fetch the persisted result for clean hydration
      void apiClient
        .get<GetSimulationResponse>(`/api/simulate/${id}`)
        .then((res) => {
          if (res.result) setCompletedResult(res.result);
        })
        .catch(() => {
          // Non-fatal: we already have the completion text
        })
        .finally(() => {
          setPageState("done");
        });
    },
    onError: (err) => {
      setErrorMessage(err.message || "Streaming failed. Please try again.");
      setPageState("error");
    },
  });

  useEffect(() => {
    if (hasFetched.current || !id) return;
    hasFetched.current = true;

    // First check if we already have a completed result
    apiClient
      .get<GetSimulationResponse>(`/api/simulate/${id}`)
      .then((res) => {
        setShareToken(res.shareToken);
        if (res.completed && res.result) {
          setCompletedResult(res.result);
          setPageState("already_done");
        } else {
          setPageState("streaming");
          void complete("");
        }
      })
      .catch((err) => {
        const message =
          err instanceof ApiClientError
            ? err.message
            : "Could not load simulation. It may have expired or never existed.";
        setErrorMessage(message);
        setPageState("error");
      });
  }, [id, complete]);

  useEffect(() => {
    if (isStreaming && pageState === "streaming") return;
    if (isStreaming) setPageState("streaming");
  }, [isStreaming, pageState]);

  const handleRunAgain = useCallback(() => {
    router.push("/");
  }, [router]);

  const handleRetry = useCallback(() => {
    setPageState("streaming");
    setErrorMessage("");
    void complete("");
  }, [complete]);

  // ── Render ────────────────────────────────────────────────────────────────

  if (pageState === "loading") {
    return <SimulationLoadingState />;
  }

  if (pageState === "error") {
    return (
      <div className="flex min-h-screen flex-col items-center justify-center gap-6 px-4">
        <AlertCircle className="h-12 w-12 text-red-400" aria-hidden="true" />
        <div className="text-center">
          <h1 className="text-xl font-bold text-text-primary">Simulation failed</h1>
          <p className="mt-2 text-sm text-text-secondary max-w-md">{errorMessage}</p>
        </div>
        <div className="flex gap-3">
          <Button onClick={handleRetry} aria-label="Retry simulation">
            <RotateCcw className="h-4 w-4 mr-2" aria-hidden="true" />
            Retry
          </Button>
          <Link
            href="/"
            aria-label="Start over"
            className="inline-flex items-center justify-center gap-2 rounded-md border border-border-bright bg-transparent px-4 py-2 text-sm font-medium text-text-primary hover:bg-surface-2 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-amber-500"
          >
            Start over
          </Link>
        </div>
      </div>
    );
  }

  const hasContent = completion.length > 0 || completedResult !== null;
  const isActivelyStreaming = pageState === "streaming" && isStreaming;

  return (
    <div className="relative">
      {/* Show full-screen loading until first content arrives */}
      {!hasContent && pageState === "streaming" && <SimulationLoadingState />}

      {/* Results — appear once streaming starts producing content */}
      {hasContent && (
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
            {isActivelyStreaming && (
              <span className="flex items-center gap-2 text-xs text-text-muted" aria-live="polite">
                <span className="inline-block h-1.5 w-1.5 rounded-full bg-amber-500 animate-pulse" aria-hidden="true" />
                Generating trajectories…
              </span>
            )}
          </div>

          <ErrorBoundary
            fallback={
              <div className="rounded-xl border border-red-500/20 bg-red-500/5 p-8 text-center">
                <p className="text-sm text-red-400 mb-4">Failed to render results.</p>
                <Button onClick={handleRetry} variant="outline" size="sm">
                  Retry
                </Button>
              </div>
            }
          >
            <SimulationResults
              completion={completion}
              isStreaming={isActivelyStreaming}
              shareToken={shareToken}
              onRunAgain={handleRunAgain}
              completedResult={completedResult}
            />
          </ErrorBoundary>
        </main>
      )}
    </div>
  );
}
