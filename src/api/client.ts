const API_URL = import.meta.env.VITE_API_URL;

export class ApiError extends Error {
  readonly status: number | null;

  constructor(message: string, status: number | null = null) {
    super(message);
    this.name = "ApiError";
    this.status = status;
  }
}

interface ProblemDetails {
  title?: string;
  errors?: Record<string, string[]>;
}

export async function request<T>(path: string, init?: RequestInit): Promise<T> {
  let response: Response;

  try {
    response = await fetch(`${API_URL}${path}`, init);
  } catch {
    throw new ApiError("Could not reach the server. Is the API running?");
  }

  if (!response.ok) {
    throw new ApiError(await readErrorMessage(response), response.status);
  }

  return (await response.json()) as T;
}

export function getErrorMessage(error: unknown) {
  return error instanceof ApiError
    ? error.message
    : "Something went wrong. Please try again.";
}

export function resolveUrl(path: string) {
  return new URL(path, API_URL).href;
}

async function readErrorMessage(response: Response): Promise<string> {
  const fallback = `The request failed (${response.status}).`;

  try {
    const problem = (await response.json()) as ProblemDetails;
    const messages = Object.values(problem.errors ?? {}).flat();

    if (messages.length > 0) {
      return messages.join(" ");
    }

    return problem.title ? `${problem.title} (${response.status}).` : fallback;
  } catch {
    return fallback;
  }
}
