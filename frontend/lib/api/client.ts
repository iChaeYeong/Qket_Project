export async function apiFetch(path: string, options?: RequestInit): Promise<Response> {
  return fetch(`/api${path}`, {
    ...options,
    credentials: "include",
    headers: {
      "Content-Type": "application/json",
      ...options?.headers,
    },
  });
}
