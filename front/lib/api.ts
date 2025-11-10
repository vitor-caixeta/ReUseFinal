//const API_BASE = process.env.NEXT_PUBLIC_API_BASE_URL || "http://localhost:8080";
const API_BASE = process.env.NEXT_PUBLIC_API_BASE_URL || "https://reusefinalback.vercel.app";


let _token: string | null = null;

function emitAuthChanged() {
  if (typeof window !== "undefined") {
    window.dispatchEvent(new Event("auth:changed"));
  }
}

export function setToken(token: string) {
  _token = token;
  try { if (typeof window !== "undefined") localStorage.setItem("token", token); } catch {}
  emitAuthChanged();
}

export function getToken(): string | null {
  if (_token) return _token;
  try {
    if (typeof window !== "undefined") {
      _token = localStorage.getItem("token");
      return _token;
    }
    return null;
  } catch { return null; }
}

export function clearToken() {
  _token = null;
  try { if (typeof window !== "undefined") localStorage.removeItem("token"); } catch {}
  emitAuthChanged();
}

type Options = {
  method?: "GET"|"POST"|"PUT"|"PATCH"|"DELETE";
  body?: any;
  auth?: boolean;
  init?: RequestInit;
};

export async function apiFetch<T = any>(path: string, opts: Options = {}) {
  const headers: Record<string,string> = { "Content-Type": "application/json" };
  if (opts.auth) {
    const t = getToken();
    if (t) headers.Authorization = `Bearer ${t}`;
  }

  const res = await fetch(`${API_BASE}${path}`, {
    method: opts.method || "GET",
    headers,
    body: opts.body ? JSON.stringify(opts.body) : undefined,
    ...opts.init,
  });

  const data = await res.json().catch(() => ({}));
  if (!res.ok) throw new Error((data as any)?.error || "Erro na requisição");
  return data as T;
}

export const api = apiFetch;
export default apiFetch;
