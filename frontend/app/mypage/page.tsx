"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import SiteNav from "@/components/SiteNav";
import { getMyReservations, cancelReservation } from "@/lib/api/reservations";
import type { Reservation, UserDTO } from "@/lib/data/types";

const STATUS_LABEL: Record<string, string> = {
  CONFIRMED: "예매 완료",
  CANCELLED: "취소됨",
  PENDING: "처리 중",
};

const STATUS_CLASS: Record<string, string> = {
  CONFIRMED: "badge badgeOpen",
  CANCELLED: "badge badgeClosed",
  PENDING:   "badge badgeSoldout",
};

export default function MyPage() {
  const router = useRouter();
  const [user, setUser] = useState<UserDTO | null>(null);
  const [reservations, setReservations] = useState<Reservation[]>([]);
  const [loading, setLoading] = useState(true);
  const [cancelling, setCancelling] = useState<number | null>(null);

  useEffect(() => {
    // 세션에서 유저 정보 조회 (/api/users/me)
    fetch("/api/users/me", { credentials: "include" })
      .then(r => r.ok ? r.json() : null)
      .then(data => data && setUser(data))
      .catch(() => {});

    getMyReservations()
      .then(setReservations)
      .catch(() => {
        // 백엔드 미연결 시 빈 목록 표시
        setReservations([]);
      })
      .finally(() => setLoading(false));
  }, []);

  const handleCancel = async (reservationId: number) => {
    if (!confirm("예매를 취소하시겠습니까?")) return;
    setCancelling(reservationId);
    try {
      const res = await cancelReservation(reservationId);
      if (res.success) {
        setReservations(prev =>
          prev.map(r =>
            r.reservationId === reservationId ? { ...r, reservedStatus: "CANCELLED" } : r
          )
        );
      }
    } finally {
      setCancelling(null);
    }
  };

  return (
    <>
      <SiteNav active="mypage" />
      <div className="pageWrap">
        <div className="pageHeader">
          <h1 className="pageTitle">마이페이지</h1>
          <p className="pageSubtitle">계정 정보와 예매 내역을 확인합니다.</p>
        </div>

        <div className="mypageGrid">
          {/* 프로필 카드 */}
          <div className="profileCard">
            <div className="profileAvatar">
              {user?.userNm?.[0] ?? "?"}
            </div>
            <p className="profileName">{user?.userNm ?? "—"}</p>
            <p className="profileId">@{user?.userId ?? "—"}</p>

            <hr className="divider" />

            <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
              <div style={{ fontSize: 13, color: "var(--text-2)", display: "flex", justifyContent: "space-between" }}>
                <span>예매 내역</span>
                <span style={{ color: "var(--text)", fontWeight: 700 }}>{reservations.length}건</span>
              </div>
              <div style={{ fontSize: 13, color: "var(--text-2)", display: "flex", justifyContent: "space-between" }}>
                <span>완료된 예매</span>
                <span style={{ color: "var(--success)", fontWeight: 700 }}>
                  {reservations.filter(r => r.reservedStatus === "CONFIRMED").length}건
                </span>
              </div>
            </div>
          </div>

          {/* 예매 내역 */}
          <div>
            <h2 style={{ fontSize: 15, fontWeight: 700, color: "var(--text)", marginBottom: 16, letterSpacing: "-0.02em" }}>
              예매 내역
            </h2>

            {loading && <p className="loadingMsg">불러오는 중...</p>}

            {!loading && reservations.length === 0 && (
              <div className="emptyMsg">
                <p style={{ fontSize: 32, marginBottom: 12 }}>🎫</p>
                <p>예매 내역이 없습니다.</p>
                <button
                  className="btnPrimary"
                  style={{ marginTop: 16 }}
                  onClick={() => router.push("/")}
                >
                  공연 보러 가기
                </button>
              </div>
            )}

            <div className="reservationList">
              {reservations.map(r => (
                <div key={r.reservationId} className="reservationCard">
                  <div className="reservationInfo">
                    <p className="reservationTitle">{r.performanceTitle}</p>
                    <div className="reservationMeta">
                      <span>📅 {r.roundTime}</span>
                      <span>💺 {r.seatInfo}</span>
                      <span>🎟 {r.grade}</span>
                    </div>
                    <div style={{ marginTop: 8 }}>
                      <span className={STATUS_CLASS[r.reservedStatus] ?? "badge badgeClosed"}>
                        {STATUS_LABEL[r.reservedStatus] ?? r.reservedStatus}
                      </span>
                    </div>
                  </div>

                  {r.reservedStatus === "CONFIRMED" && (
                    <button
                      className="btnDanger"
                      onClick={() => handleCancel(r.reservationId)}
                      disabled={cancelling === r.reservationId}
                    >
                      {cancelling === r.reservationId ? "처리 중..." : "취소"}
                    </button>
                  )}
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
