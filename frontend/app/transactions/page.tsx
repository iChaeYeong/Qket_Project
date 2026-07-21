"use client";

import { useEffect, useMemo, useState, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import SiteNav from "@/components/SiteNav";
import { getAccounts } from "@/lib/api/accounts";
import { getTransactions } from "@/lib/api/transactions";
import type { AccountDTO, TransactionDTO } from "@/lib/data/types";

type Filter = "전체" | "입금" | "출금";

const ALL = "전체";

function TransactionsContent() {
  const searchParams = useSearchParams();
  const initialAccount = searchParams.get("account") ?? ALL;

  const [accounts, setAccounts] = useState<AccountDTO[]>([]);
  const [selected, setSelected] = useState(initialAccount);
  const [transactions, setTransactions] = useState<TransactionDTO[]>([]);
  const [filter, setFilter] = useState<Filter>("전체");
  const [sortOrder, setSortOrder] = useState<"desc" | "asc">("desc");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const myAccountNos = useMemo(
    () => new Set(accounts.map((a) => a.accountNo)),
    [accounts]
  );

  const getDirection = (t: TransactionDTO): "입금" | "출금" =>
    myAccountNos.has(t.frmAccountNo) ? "출금" : "입금";

  const fetchFor = async (account: string, accs: AccountDTO[]) => {
    setLoading(true);
    setError("");
    try {
      if (account === ALL) {
        const results = await Promise.all(accs.map((a) => getTransactions(a.accountNo)));
        const seen = new Map<number, TransactionDTO>();
        results.flat().forEach((t) => seen.set(t.tranId, t));
        setTransactions([...seen.values()]);
      } else {
        setTransactions(await getTransactions(account));
      }
    } catch (e) {
      setError(e instanceof Error ? e.message : "오류가 발생했습니다.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    getAccounts()
      .then((accs) => {
        setAccounts(accs);
        fetchFor(initialAccount, accs);
      })
      .catch(() => setError("계좌 정보를 불러오지 못했습니다."));
  }, []);

  const handleSelect = (account: string) => {
    setSelected(account);
    fetchFor(account, accounts);
  };

  const rows = useMemo(() => {
    return transactions
      .filter((t) => {
        const type = getDirection(t);
        return filter === "전체" || type === filter;
      })
      .sort((a, b) => {
        const d = new Date(a.tranDt).getTime() - new Date(b.tranDt).getTime();
        return sortOrder === "desc" ? -d : d;
      });
  }, [transactions, filter, sortOrder, myAccountNos]);

  const selectedLabel =
    selected === ALL
      ? "전체 계좌"
      : accounts.find((a) => a.accountNo === selected)?.accountNm ?? selected;

  return (
    <>
      <SiteNav active="transactions" />
      <div className="pageWrap">
        <h1 className="pageTitle">거래내역</h1>
        <p className="pageSubtitle">조회할 계좌를 선택하세요.</p>

        <div className="surface">
          <div className="tableSection">
            <div className="tableSectionHeader">
              <span className="tableSectionTitle">{selectedLabel}</span>
              <div className="filterRow">
                <select
                  className="filterSelect"
                  value={selected}
                  onChange={(e) => handleSelect(e.target.value)}
                  style={{ minWidth: 200 }}
                >
                  <option value={ALL}>전체 계좌</option>
                  {accounts.map((a) => (
                    <option key={a.accountNo} value={a.accountNo}>
                      {a.accountNm} · {a.accountNo}
                    </option>
                  ))}
                </select>
                <select
                  className="filterSelect"
                  value={filter}
                  onChange={(e) => setFilter(e.target.value as Filter)}
                >
                  <option value="전체">전체</option>
                  <option value="입금">입금</option>
                  <option value="출금">출금</option>
                </select>
                <select
                  className="filterSelect"
                  value={sortOrder}
                  onChange={(e) => setSortOrder(e.target.value as "desc" | "asc")}
                >
                  <option value="desc">최신순</option>
                  <option value="asc">오래된순</option>
                </select>
              </div>
            </div>

            {loading && <p className="loadingMsg">불러오는 중...</p>}
            {error && <p className="errorMsg" style={{ padding: "12px 18px" }}>{error}</p>}

            {!loading && (
              <div className="tableWrap">
                <table>
                  <thead>
                    <tr>
                      <th>일시</th>
                      <th>출금 계좌</th>
                      <th>입금 계좌</th>
                      <th>금액</th>
                      <th>구분</th>
                    </tr>
                  </thead>
                  <tbody>
                    {rows.length === 0 ? (
                      <tr>
                        <td colSpan={5} className="emptyMsg">거래내역이 없습니다.</td>
                      </tr>
                    ) : (
                      rows.map((t) => {
                        const type = getDirection(t);
                        return (
                          <tr key={t.tranId}>
                            <td className="tdMono">{t.tranDt}</td>
                            <td className="tdMono">{t.frmAccountNo}</td>
                            <td className="tdMono">{t.toAccountNo}</td>
                            <td className="tdAmount">{t.tranAmt.toLocaleString()}원</td>
                            <td>
                              <span className={type === "입금" ? "badge badgeGreen" : "badge badgeRed"}>
                                {type}
                              </span>
                            </td>
                          </tr>
                        );
                      })
                    )}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </div>
      </div>
    </>
  );
}

export default function TransactionsPage() {
  return (
    <Suspense fallback={<p className="loadingMsg" style={{ padding: "32px 24px" }}>로딩 중...</p>}>
      <TransactionsContent />
    </Suspense>
  );
}
