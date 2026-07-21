"use client";

import Link from "next/link";
import { useEffect, useState, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import SiteNav from "@/components/SiteNav";
import { getAccounts } from "@/lib/api/accounts";
import { transfer } from "@/lib/api/transfer";
import type { AccountDTO } from "@/lib/data/types";

function TransferContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const initialFrom = searchParams.get("from") ?? "";

  const [accounts, setAccounts] = useState<AccountDTO[]>([]);
  const [frmAccountNo, setFrmAccountNo] = useState(initialFrom);
  const [toAccountNo, setToAccountNo] = useState("");
  const [amount, setAmount] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    getAccounts()
      .then((data) => {
        setAccounts(data);
        if (!initialFrom && data.length > 0) setFrmAccountNo(data[0].accountNo);
      })
      .catch(() => {});
  }, [initialFrom]);

  const handleTransfer = async () => {
    if (!frmAccountNo || !toAccountNo || !amount) { setError("모든 항목을 입력하세요."); return; }
    const num = parseInt(amount, 10);
    if (isNaN(num) || num <= 0) { setError("유효한 금액을 입력하세요."); return; }
    setLoading(true);
    setError("");
    try {
      const res = await transfer(frmAccountNo, toAccountNo, num);
      if (res.success) router.push("/accounts");
      else setError(res.message ?? "이체에 실패했습니다.");
    } catch {
      setError("서버에 연결할 수 없습니다.");
    } finally {
      setLoading(false);
    }
  };

  const selected = accounts.find((a) => a.accountNo === frmAccountNo);

  return (
    <>
      <SiteNav active="transfer" />
      <div className="pageWrapNarrow">
        <h1 className="pageTitle">계좌 이체</h1>
        <p className="pageSubtitle">출금 계좌와 입금 계좌, 금액을 입력합니다.</p>

        <div className="surface">
          <div className="formBody">
            <div className="field">
              <label className="fieldLabel">출금 계좌</label>
              <select
                className="fieldInput fieldSelect"
                value={frmAccountNo}
                onChange={(e) => setFrmAccountNo(e.target.value)}
              >
                {accounts.map((a) => (
                  <option key={a.accountNo} value={a.accountNo}>
                    {a.accountNm} · {a.accountNo}
                  </option>
                ))}
              </select>
              {selected && (
                <span style={{ fontSize: 12, color: "var(--text-2)", marginTop: 2 }}>
                  잔액 {selected.balance.toLocaleString()}원
                </span>
              )}
            </div>

            <div className="field">
              <label className="fieldLabel">입금 계좌번호</label>
              <input
                className="fieldInput"
                placeholder="받는 계좌번호 입력"
                value={toAccountNo}
                onChange={(e) => setToAccountNo(e.target.value)}
              />
            </div>

            <div className="field">
              <label className="fieldLabel">이체 금액</label>
              <input
                className="fieldInput"
                type="number"
                placeholder="0"
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                style={{ fontVariantNumeric: "tabular-nums" }}
              />
            </div>

            {error && <p className="errorMsg">{error}</p>}

            <div className="formFooter">
              <button className="btnPrimary" onClick={handleTransfer} disabled={loading}>
                {loading ? "처리 중..." : "이체하기"}
              </button>
              <Link className="btnSecondary" href="/accounts">
                취소
              </Link>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

export default function TransferPage() {
  return (
    <Suspense fallback={<p className="loadingMsg" style={{ padding: "32px 24px" }}>로딩 중...</p>}>
      <TransferContent />
    </Suspense>
  );
}
