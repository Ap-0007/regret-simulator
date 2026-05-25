import { NextRequest, NextResponse } from "next/server";
import { streamText } from "ai";
import { createOllama } from "ollama-ai-provider";
import { db } from "@/lib/supabase/db";
import { SYSTEM_PROMPT, buildUserPrompt } from "@/lib/claude";
import type { SimulationInput, SimulationResult } from "@/types/simulation";

function getOllamaModel() {
  const ollama = createOllama({
    baseURL: process.env.OLLAMA_BASE_URL ?? "http://localhost:11434/api",
  });
  return ollama(process.env.OLLAMA_MODEL ?? "qwen2.5:14b");
}

export async function POST(
  _request: NextRequest,
  { params }: { params: { id: string } }
) {
  const { id } = params;

  const { data, error } = await db
    .simulations()
    .select("id, input, result")
    .eq("id", id)
    .single();

  if (error || !data) {
    return NextResponse.json(
      { error: { code: "NOT_FOUND", message: "Simulation not found." } },
      { status: 404 }
    );
  }

  const record = data as { id: string; input: SimulationInput; result: SimulationResult | null };

  if (record.result !== null) {
    return NextResponse.json(
      { error: { code: "ALREADY_COMPLETE", message: "Simulation already completed." } },
      { status: 409 }
    );
  }

  const userPrompt = buildUserPrompt(record.input);
  let parseAttempts = 0;

  const result = await streamText({
    model: getOllamaModel(),
    system: SYSTEM_PROMPT,
    prompt: userPrompt,
    onFinish: async ({ text }) => {
      const attemptSave = async (jsonText: string): Promise<void> => {
        // Strip markdown fences some models emit despite instructions
        const cleaned = jsonText
          .replace(/^```(?:json)?\s*/i, "")
          .replace(/\s*```\s*$/i, "")
          .trim();

        try {
          const parsed = JSON.parse(cleaned) as SimulationResult;
          await db
            .simulations()
            .update({
              result: parsed,
              completed_at: new Date().toISOString(),
            })
            .eq("id", id);
        } catch {
          if (parseAttempts < 1) {
            parseAttempts++;
            await attemptSave(cleaned);
          }
          // After one retry, silently fail — stream content already delivered
        }
      };

      void attemptSave(text);
    },
  });

  return result.toDataStreamResponse();
}

export const maxDuration = 120;
