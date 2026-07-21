import { apiFetch } from "./client";
import type { TransactionDTO } from "../data/types";

export async function getTransactions(accountNo: string): Promise<TransactionDTO[]> {
  const res = await apiFetch(`/transactions/${encodeURIComponent(accountNo)}`);
  if (!res.ok) throw new Error("거래내역 조회에 실패했습니다.");
  return res.json();
}
