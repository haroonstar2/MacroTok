import { API_BASE } from "../config";

/**
 * Generic API helper for real backend requests.
 * Automatically includes JSON headers.
 */
export async function api(path, opts = {}) {
  const res = await fetch(API_BASE + path, {
    headers: { "Content-Type": "application/json", ...(opts.headers || {}) },
    ...opts,
  });
  if (!res.ok) throw new Error(`HTTP ${res.status}`);
  return res.status === 204 ? null : res.json();
}
