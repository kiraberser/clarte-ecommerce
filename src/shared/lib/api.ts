import type { ApiResponse } from "@/shared/types/api";

export const API_BASE_URL =
  process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000/api/v1";

// ──────────────────────────────────────────────
// Token helpers (client-side only)
// ──────────────────────────────────────────────

const TOKEN_KEY = "ocaso-access-token";
const REFRESH_KEY = "ocaso-refresh-token";

export function getAccessToken(): string | null {
  if (typeof window === "undefined") return null;
  return localStorage.getItem(TOKEN_KEY);
}

export function getRefreshToken(): string | null {
  if (typeof window === "undefined") return null;
  return localStorage.getItem(REFRESH_KEY);
}

export function setTokens(access: string, refresh: string) {
  localStorage.setItem(TOKEN_KEY, access);
  localStorage.setItem(REFRESH_KEY, refresh);
  document.cookie = `${TOKEN_KEY}=${access}; path=/; max-age=${60 * 30}; SameSite=Lax`;
}

export function clearTokens() {
  localStorage.removeItem(TOKEN_KEY);
  localStorage.removeItem(REFRESH_KEY);
  document.cookie = `${TOKEN_KEY}=; path=/; max-age=0`;
}

// ──────────────────────────────────────────────
// Core fetch wrapper
// ──────────────────────────────────────────────

export class ApiError extends Error {
  constructor(
    public status: number,
    public data: ApiResponse<null>,
  ) {
    super(data.message || `API error ${status}`);
    this.name = "ApiError";
  }
}

interface FetchOptions extends Omit<RequestInit, "body"> {
  body?: unknown;
  auth?: boolean;
}

export async function apiFetch<T>(
  endpoint: string,
  { body, auth = false, headers: customHeaders, ...init }: FetchOptions = {},
): Promise<T> {
  const url = endpoint.startsWith("http")
    ? endpoint
    : `${API_BASE_URL}${endpoint.startsWith("/") ? "" : "/"}${endpoint}`;

  const headers: Record<string, string> = {
    "Content-Type": "application/json",
    ...customHeaders as Record<string, string>,
  };

  if (auth) {
    const token = getAccessToken();
    if (token) {
      headers["Authorization"] = `Bearer ${token}`;
    }
  }

  const res = await fetch(url, {
    ...init,
    headers,
    body: body ? JSON.stringify(body) : undefined,
  });

  // Handle 204 No Content
  if (res.status === 204) {
    return undefined as T;
  }

  const json = await res.json();

  if (!res.ok) {
    throw new ApiError(res.status, json);
  }

  return json;
}

// ──────────────────────────────────────────────
// Convenience helpers
// ──────────────────────────────────────────────

export function apiGet<T>(endpoint: string, auth = false) {
  return apiFetch<T>(endpoint, { method: "GET", auth });
}

export function apiPost<T>(endpoint: string, body: unknown, auth = false) {
  return apiFetch<T>(endpoint, { method: "POST", body, auth });
}

export function apiPatch<T>(endpoint: string, body: unknown, auth = false) {
  return apiFetch<T>(endpoint, { method: "PATCH", body, auth });
}

export function apiPut<T>(endpoint: string, body: unknown, auth = false) {
  return apiFetch<T>(endpoint, { method: "PUT", body, auth });
}

export function apiDelete<T>(endpoint: string, auth = false) {
  return apiFetch<T>(endpoint, { method: "DELETE", auth });
}

// ──────────────────────────────────────────────
// SWR fetcher (client-side, with optional auth)
// ──────────────────────────────────────────────

export function swrFetcher<T>(endpoint: string): Promise<T> {
  return apiGet<T>(endpoint, true);
}
