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

function getRequestUrl(path: string) {
  if (typeof window !== "undefined") {
    return path;
  }

  return `${getApiBaseUrl()}${path}`;
}

export async function apiGet<T>(path: string): Promise<T> {
  const response = await fetch(getRequestUrl(path), {
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

export async function apiPost<TResponse, TBody>(path: string, body: TBody): Promise<TResponse> {
  const response = await fetch(getRequestUrl(path), {
    body: JSON.stringify(body),
    headers: {
      accept: "application/json",
      "content-type": "application/json",
    },
    method: "POST",
  });

  if (!response.ok) {
    throw new ApiClientError(
      `ProForma API request failed for ${path}`,
      response.status,
    );
  }

  return response.json() as Promise<TResponse>;
}
