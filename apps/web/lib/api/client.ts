const DEFAULT_API_BASE_URL = "http://localhost:8000";

export class ApiClientError extends Error {
  constructor(
    message: string,
    public readonly status: number,
  ) {
    super(message);
    this.name = "ApiClientError";
  }
}

export function getApiBaseUrl() {
  return process.env.NEXT_PUBLIC_PROFORMA_API_URL ?? DEFAULT_API_BASE_URL;
}

export async function apiGet<T>(path: string): Promise<T> {
  const response = await fetch(`${getApiBaseUrl()}${path}`, {
    headers: {
      accept: "application/json",
    },
  });

  if (!response.ok) {
    throw new ApiClientError(
      `ProForma API request failed for ${path}`,
      response.status,
    );
  }

  return response.json() as Promise<T>;
}
