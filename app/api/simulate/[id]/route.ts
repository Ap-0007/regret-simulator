import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/supabase/db";
import type { SimulationRecord } from "@/types/simulation";

export async function GET(
  _request: NextRequest,
  { params }: { params: { id: string } }
) {
  const { id } = params;

  const { data, error } = await db
    .simulations()
    .select("id, share_token, input, result, created_at, completed_at")
    .eq("id", id)
    .single();

  if (error || !data) {
    return NextResponse.json(
      { error: { code: "NOT_FOUND", message: "Simulation not found." } },
      { status: 404 }
    );
  }

  const record = data as SimulationRecord;
  return NextResponse.json({
    id: record.id,
    shareToken: record.share_token,
    input: record.input,
    result: record.result,
    completed: record.result !== null,
  });
}
