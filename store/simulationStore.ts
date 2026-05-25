"use client";

import { create } from "zustand";
import { persist } from "zustand/middleware";
import type { SimulationInput } from "@/types/simulation";

interface FormState {
  decision: string;
  values: string[];
  goals: string;
  context: string;
  riskTolerance: number;
}

const defaultFormState: FormState = {
  decision: "",
  values: [],
  goals: "",
  context: "",
  riskTolerance: 5,
};

interface SimulationStore {
  form: FormState;
  lastSimulationId: string | null;
  lastShareToken: string | null;

  setForm: (form: Partial<FormState>) => void;
  setFormField: <K extends keyof FormState>(field: K, value: FormState[K]) => void;
  resetForm: () => void;
  setLastSimulation: (id: string, shareToken: string) => void;
  getFormAsInput: () => SimulationInput;
}

export const useSimulationStore = create<SimulationStore>()(
  persist(
    (set, get) => ({
      form: defaultFormState,
      lastSimulationId: null,
      lastShareToken: null,

      setForm: (partial) =>
        set((state) => ({ form: { ...state.form, ...partial } })),

      setFormField: (field, value) =>
        set((state) => ({ form: { ...state.form, [field]: value } })),

      resetForm: () => set({ form: defaultFormState }),

      setLastSimulation: (id, shareToken) =>
        set({ lastSimulationId: id, lastShareToken: shareToken }),

      getFormAsInput: (): SimulationInput => {
        const { form } = get();
        return {
          decision: form.decision,
          values: form.values,
          goals: form.goals,
          context: form.context || undefined,
          riskTolerance: form.riskTolerance,
        };
      },
    }),
    {
      name: "regret-simulator-form",
      partialize: (state) => ({
        form: state.form,
        lastSimulationId: state.lastSimulationId,
        lastShareToken: state.lastShareToken,
      }),
    }
  )
);
