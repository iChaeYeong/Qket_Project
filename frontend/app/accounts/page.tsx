"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import SiteNav from "@/components/SiteNav";
import { getAccounts } from "@/lib/api/accounts";
import type { AccountDTO } from "@/lib/data/types";

export default function AccountsPage() {
  const router = useRouter();
  const [accounts, setAccounts] = useState<AccountDTO[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getAccounts()
      .then(setAccounts)
      .catch(() => router.push("/login"))
      .finally(() => setLoading(false));
  }, [router]);

  const total = accounts.reduce((sum, a) => sum + a.balance, 0);

  return (
    <>
      <SiteNav active="accounts" />
      <div className="pageWrap">
        <h1 className="pageTitle">내 계좌</h1>
        <p className="pageSubtitle">보유 계좌 목록과 잔액을 확인합니다.</p>

        {!loading && accounts.length > 0 && (
          <div className="summaryBar">
            <span className="summaryLabel">총 보유자산</span>
            <span className="summaryAmount">{total.toLocaleString()}원</span>
          </div>
        )}

        <div className="surface">
          {loading && <p className="loadingMsg">불러오는 중...</p>}

          {!loading && accounts.length === 0 && (
            <p className="emptyMsg">보유한 계좌가 없습니다.</p>
          )}

          <ul className="accountList" style={{ listStyle: "none" }}>
            {accounts.map((account) => (
              <li key={account.accountNo} className="accountRow">
                <div className="accountInfo">
                  <span className="accountName">{account.accountNm}</span>
                  <span className="accountNum">{account.accountNo}</span>
                </div>
                <div className="accountMeta">
                  <span className="badge badgeGray">{account.accountStat}</span>
                  <span className="accountBalance">{account.balance.toLocaleString()}원</span>
                  <div className="accountActions">
                    <Link
                      className="btnOutline"
                      href={`/transactions?account=${account.accountNo}`}
                    >
                      내역
                    </Link>
                    <Link
                      className="btnPrimary"
                      href={`/transfer?from=${account.accountNo}`}
                    >
                      이체
                    </Link>
                  </div>
                </div>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </>
  );
}
