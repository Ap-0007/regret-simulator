import type { ApiError } from "@/types/simulation";

export class ApiClientError extends Error {
  constructor(
    public readonly code: string,
    message: string,
    public readonly field?: string,
    public readonly detail?: unknown
  ) {
    super(message);
    this.name = "ApiClientError";
  }
}

async function handleResponse<T>(res: Response): Promise<T> {
  if (res.ok) {
    return res.json() as Promise<T>;
  }

  let body: ApiError | null = null;
  try {
    body = (await res.json()) as ApiError;
  } catch {
    throw new ApiClientError(
      "NETWORK_ERROR",
      `Request failed with status ${res.status}`
    );
  }

  throw new ApiClientError(
    body?.error?.code ?? "UNKNOWN_ERROR",
    body?.error?.message ?? "An unexpected error occurred",
    body?.error?.field,
    body?.error?.detail
  );
}

export const apiClient = {
  async post<T>(url: string, body: unknown): Promise<T> {
    const res = await fetch(url, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body),
    });
    return handleResponse<T>(res);
  },

  async get<T>(url: string): Promise<T> {
    const res = await fetch(url);
    return handleResponse<T>(res);
  },
};
