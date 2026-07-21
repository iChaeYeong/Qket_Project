import { apiFetch } from "./client";
import type { AccountDTO } from "../data/types";

export async function getAccounts(): Promise<AccountDTO[]> {
  const res = await apiFetch("/accounts");
  if (!res.ok) throw new Error("계좌 정보를 불러오지 못했습니다.");
  return res.json();
}
