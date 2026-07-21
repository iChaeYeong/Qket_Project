import { apiFetch } from "./client";
import type { ApiResult } from "../data/types";

export async function transfer(
  frmAccountNo: string,
  toAccountNo: string,
  amount: number
): Promise<ApiResult> {
  const res = await apiFetch("/transfer", {
    method: "POST",
    body: JSON.stringify({ frmAccountNo, toAccountNo, amount }),
  });
  return res.json();
}
