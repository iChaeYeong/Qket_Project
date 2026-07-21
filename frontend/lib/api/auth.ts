import { apiFetch } from "./client";
import type { LoginResult, ApiResult } from "../data/types";

export async function login(userId: string, pwd: string): Promise<LoginResult> {
  const res = await apiFetch("/auth/login", {
    method: "POST",
    body: JSON.stringify({ userId, pwd }),
  });
  return res.json();
}

export async function logout(): Promise<ApiResult> {
  const res = await apiFetch("/auth/logout", { method: "POST" });
  return res.json();
}

export async function register(
  userId: string,
  userNm: string,
  userEmail: string,
  pwd: string
): Promise<ApiResult> {
  const res = await apiFetch("/auth/register", {
    method: "POST",
    body: JSON.stringify({ userId, userNm, userEmail, pwd }),
  });
  return res.json();
}
