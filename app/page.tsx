"use client";

import React, { useCallback, useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { SimulationInputSchema } from "@/types/simulation";
import type { SimulationInput, CreateSimulationResponse } from "@/types/simulation";
import { useSimulationStore } from "@/store/simulationStore";
import { apiClient, ApiClientError } from "@/lib/apiClient";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Slider } from "@/components/ui/slider";
import { TagInput } from "@/components/TagInput";
import { Loader2, Brain } from "lucide-react";

function CharCount({ current, max }: { current: number; max: number }) {
  const near = current > max * 0.85;
  return (
    <span
      className={`text-xs tabular-nums ${near ? "text-amber-400" : "text-text-muted"}`}
      aria-live="polite"
      aria-atomic="true"
    >
      {current}/{max}
    </span>
  );
}

function FieldError({ message, id }: { message?: string; id: string }) {
  if (!message) return null;
  return (
    <p id={id} role="alert" className="mt-1 text-xs text-red-400">
      {message}
    </p>
  );
}

function Label({ htmlFor, children, required }: { htmlFor: string; children: React.ReactNode; required?: boolean }) {
  return (
    <label htmlFor={htmlFor} className="text-sm font-medium text-text-primary">
      {children}
      {required && <span className="ml-1 text-amber-500" aria-label="required">*</span>}
    </label>
  );
}

export default function HomePage() {
  const router = useRouter();
  const { form, setForm, setLastSimulation } = useSimulationStore();

  const {
    register,
    handleSubmit,
    control,
    watch,
    setValue,
    setError,
    formState: { errors, isSubmitting },
  } = useForm<SimulationInput>({
    resolver: zodResolver(SimulationInputSchema),
    defaultValues: {
      decision: form.decision,
      values: form.values,
      goals: form.goals,
      context: form.context || "",
      riskTolerance: form.riskTolerance,
    },
  });

  // Persist to store on change (debounced via useEffect below)
  const watchAll = watch();
  const saveTimeout = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    if (saveTimeout.current) clearTimeout(saveTimeout.current);
    saveTimeout.current = setTimeout(() => {
      setForm({
        decision: watchAll.decision ?? "",
        values: watchAll.values ?? [],
        goals: watchAll.goals ?? "",
        context: watchAll.context ?? "",
        riskTolerance: watchAll.riskTolerance ?? 5,
      });
    }, 300);
    return () => { if (saveTimeout.current) clearTimeout(saveTimeout.current); };
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [watchAll.decision, watchAll.goals, watchAll.context, watchAll.riskTolerance, JSON.stringify(watchAll.values)]);

  const onSubmit = useCallback(async (data: SimulationInput) => {
    try {
      const res = await apiClient.post<CreateSimulationResponse>("/api/simulate", data);
      setLastSimulation(res.id, res.shareToken);
      router.push(`/simulate/${res.id}`);
    } catch (err) {
      if (err instanceof ApiClientError) {
        if (err.field) {
          setError(err.field as keyof SimulationInput, { message: err.message });
        } else if (err.code === "RATE_LIMITED") {
          setError("root", { message: "Too many simulations. Please wait an hour and try again." });
        } else {
          setError("root", { message: err.message });
        }
      } else {
        setError("root", { message: "Something went wrong. Please try again." });
      }
    }
  }, [router, setLastSimulation, setError]);

  const decisionVal = watch("decision") ?? "";
  const goalsVal = watch("goals") ?? "";
  const contextVal = watch("context") ?? "";
  const riskVal = watch("riskTolerance") ?? 5;

  const riskLabel = riskVal <= 2 ? "I avoid risk" : riskVal <= 4 ? "Cautious" : riskVal <= 6 ? "Balanced" : riskVal <= 8 ? "Risk-tolerant" : "I chase risk";

  return (
    <main className="mx-auto max-w-2xl px-4 py-16 sm:py-24">
      {/* Header */}
      <div className="mb-12 flex flex-col gap-3">
        <div className="flex items-center gap-2.5">
          <Brain className="h-6 w-6 text-amber-500" aria-hidden="true" />
          <span className="text-xs font-mono uppercase tracking-widest text-text-muted">
            Regret Simulator
          </span>
        </div>
        <h1 className="text-3xl font-black leading-tight text-text-primary sm:text-4xl">
          What does each path<br />
          <span className="text-amber-500">actually look like?</span>
        </h1>
        <p className="text-sm text-text-secondary leading-relaxed">
          Describe your decision and we'll model 3 diverging trajectories 5 years into the future — honest, specific, and grounded in your values.
        </p>
      </div>

      <form
        onSubmit={handleSubmit(onSubmit)}
        noValidate
        aria-label="Decision simulation form"
        className="flex flex-col gap-8"
      >
        {/* Decision */}
        <fieldset className="flex flex-col gap-2">
          <div className="flex items-baseline justify-between">
            <Label htmlFor="decision" required>The Decision</Label>
            <CharCount current={decisionVal.length} max={500} />
          </div>
          <Textarea
            id="decision"
            rows={4}
            placeholder="e.g. Leave my stable job to start a company"
            error={errors.decision?.message}
            aria-describedby={errors.decision ? "decision-error" : undefined}
            {...register("decision")}
          />
          <FieldError message={errors.decision?.message} id="decision-error" />
        </fieldset>

        {/* Values */}
        <fieldset className="flex flex-col gap-2">
          <Label htmlFor="values-input" required>Your Values</Label>
          <p className="text-xs text-text-muted">What matters most to you? Add 2–8 values.</p>
          <Controller
            name="values"
            control={control}
            render={({ field }) => (
              <TagInput
                id="values-input"
                values={field.value ?? []}
                onChange={field.onChange}
                placeholder='e.g. "financial security", "creative freedom"'
                maxTags={8}
                error={errors.values?.message}
              />
            )}
          />
          {errors.values?.message && (
            <FieldError message={errors.values.message} id="values-error" />
          )}
        </fieldset>

        {/* Goals */}
        <fieldset className="flex flex-col gap-2">
          <div className="flex items-baseline justify-between">
            <Label htmlFor="goals" required>Your Goals in 5 Years</Label>
            <CharCount current={goalsVal.length} max={500} />
          </div>
          <Textarea
            id="goals"
            rows={3}
            placeholder="What does success look like to you in 5 years?"
            error={errors.goals?.message}
            aria-describedby={errors.goals ? "goals-error" : undefined}
            {...register("goals")}
          />
          <FieldError message={errors.goals?.message} id="goals-error" />
        </fieldset>

        {/* Context */}
        <fieldset className="flex flex-col gap-2">
          <div className="flex items-baseline justify-between">
            <Label htmlFor="context">Relevant Context</Label>
            <CharCount current={contextVal.length} max={800} />
          </div>
          <p className="text-xs text-text-muted">
            Optional: age, current situation, constraints, family, debt, location…
          </p>
          <Textarea
            id="context"
            rows={3}
            placeholder="e.g. 32 years old, married with one child, $40k in student debt, living in NYC"
            error={errors.context?.message}
            {...register("context")}
          />
          <FieldError message={errors.context?.message} id="context-error" />
        </fieldset>

        {/* Risk Tolerance */}
        <fieldset className="flex flex-col gap-4">
          <div className="flex items-baseline justify-between">
            <Label htmlFor="risk-slider" required>Risk Tolerance</Label>
            <span className="text-sm font-semibold text-amber-400 tabular-nums">
              {riskVal}/10 — {riskLabel}
            </span>
          </div>
          <Controller
            name="riskTolerance"
            control={control}
            render={({ field }) => (
              <Slider
                id="risk-slider"
                min={1}
                max={10}
                step={1}
                value={[field.value ?? 5]}
                onValueChange={([v]) => field.onChange(v)}
                error={errors.riskTolerance?.message}
                aria-label="Risk tolerance"
                aria-valuetext={`${riskVal} out of 10 — ${riskLabel}`}
              />
            )}
          />
          <div className="flex justify-between text-xs text-text-muted" aria-hidden="true">
            <span>I avoid risk</span>
            <span>I chase risk</span>
          </div>
          <FieldError message={errors.riskTolerance?.message} id="risk-error" />
        </fieldset>

        {/* Root error */}
        {errors.root?.message && (
          <div
            role="alert"
            className="rounded-lg border border-red-500/30 bg-red-500/10 px-4 py-3 text-sm text-red-400"
          >
            {errors.root.message}
          </div>
        )}

        <Button
          type="submit"
          size="lg"
          disabled={isSubmitting}
          aria-label="Simulate my decision"
          className="mt-2 w-full sm:w-auto"
        >
          {isSubmitting ? (
            <>
              <Loader2 className="h-4 w-4 animate-spin" aria-hidden="true" />
              Creating simulation…
            </>
          ) : (
            "Simulate my decision →"
          )}
        </Button>
      </form>
    </main>
  );
}
