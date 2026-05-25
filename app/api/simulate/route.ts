import { NextRequest, NextResponse } from "next/server";
import { ZodError } from "zod";
import { SimulationInputSchema } from "@/types/simulation";
import { sanitizeSimulationInput } from "@/lib/sanitize";
import { checkRateLimit } from "@/lib/ratelimit";
import { db } from "@/lib/supabase/db";

function getClientIp(req: NextRequest): string {
  return (
    req.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ??
    req.headers.get("x-real-ip") ??
    "unknown"
  );
}

export async function POST(request: NextRequest) {
  const ip = getClientIp(request);

  const rateLimit = await checkRateLimit(ip);
  if (!rateLimit.success) {
    return NextResponse.json(
      {
        error: {
          code: "RATE_LIMITED",
          message: "Too many simulations. Try again later.",
          detail: { reset: rateLimit.reset },
        },
      },
      { status: 429 }
    );
  }

  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json(
      { error: { code: "INVALID_JSON", message: "Request body is not valid JSON." } },
      { status: 400 }
    );
  }

  let parsed;
  try {
    parsed = SimulationInputSchema.parse(body);
  } catch (err) {
    if (err instanceof ZodError) {
      const first = err.errors[0];
      return NextResponse.json(
        {
          error: {
            code: "VALIDATION_ERROR",
            message: first.message,
            field: first.path.join("."),
          },
        },
        { status: 400 }
      );
    }
    return NextResponse.json(
      { error: { code: "VALIDATION_ERROR", message: "Invalid input." } },
      { status: 400 }
    );
  }

  const sanitized = sanitizeSimulationInput(parsed);

  const { data, error } = await db
    .simulations()
    .insert({ input: sanitized })
    .select("id, share_token")
    .single();

  if (error || !data) {
    const isDev = process.env.NODE_ENV === "development";
    return NextResponse.json(
      {
        error: {
          code: "DB_ERROR",
          message: "Failed to create simulation.",
          detail: isDev ? (error as { message?: string })?.message : undefined,
        },
      },
      { status: 500 }
    );
  }

  return NextResponse.json({ id: data.id as string, shareToken: data.share_token as string });
}
