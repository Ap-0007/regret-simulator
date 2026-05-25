const HTML_TAG_RE = /<[^>]*>/g;
const CONTROL_CHAR_RE = /[\x00-\x08\x0B\x0C\x0E-\x1F\x7F]/g;

function stripHtml(value: string): string {
  return value.replace(HTML_TAG_RE, "").replace(CONTROL_CHAR_RE, "").trim();
}

export function sanitizeString(value: string, maxLength: number): string {
  return stripHtml(value).slice(0, maxLength);
}

export function sanitizeStringArray(values: string[], maxLength: number): string[] {
  return values
    .map((v) => sanitizeString(v, 50))
    .filter((v) => v.length > 0)
    .slice(0, maxLength);
}

export interface SanitizedInput {
  decision: string;
  values: string[];
  goals: string;
  context: string | undefined;
  riskTolerance: number;
}

export function sanitizeSimulationInput(raw: {
  decision: string;
  values: string[];
  goals: string;
  context?: string;
  riskTolerance: number;
}): SanitizedInput {
  return {
    decision: sanitizeString(raw.decision, 500),
    values: sanitizeStringArray(raw.values, 8),
    goals: sanitizeString(raw.goals, 500),
    context: raw.context ? sanitizeString(raw.context, 800) : undefined,
    riskTolerance: Math.max(1, Math.min(10, Math.round(raw.riskTolerance))),
  };
}
