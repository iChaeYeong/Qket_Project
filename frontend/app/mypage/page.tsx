// Client Component — "use client" 필요한 이유:
//   1. 예매 취소 버튼 onClick 이벤트 핸들러 (handleCancel)
//   2. 로그인 세션 기반 사용자 정보 조회 (credentials: "include" 쿠키)
//   * 이상적으로는 유저 정보 + 예매 목록 fetch 를 Server Component 에서 처리하고
//     취소 버튼만 Client Component 로 분리하는 것이 좋지만,
//     세션 쿠키 forwarding 설정이 필요해 지금은 전체를 Client Component 로 유지
"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import type { Reservation, UserDTO } from "@/lib/data/types";

// 예매 상태 표시 라벨
const STATUS_LABEL: Record<string, string> = {
  CONFIRMED: "예매 완료",
  CANCELLED: "취소됨",
  PENDING: "처리 중",
};

// 예매 상태 배지 CSS 클래스
const STATUS_CLASS: Record<string, string> = {
  CONFIRMED: "badge badgeOpen",
  CANCELLED: "badge badgeClosed",
  PENDING:   "badge badgeSoldout",
};

export default function MyPage() {
  const router = useRouter();

  // 로그인 유저 정보
  const [user, setUser] = useState<UserDTO | null>(null);

  // 예매 내역 목록
  const [reservations, setReservations] = useState<Reservation[]>([]);

  // UI 상태
  const [loading, setLoading] = useState(true);
  const [cancelling, setCancelling] = useState<number | null>(null); // 취소 중인 reservationId

  // [TODO-MYPAGE-INIT] 컴포넌트 마운트 시 실행
  // 1. GET /api/auth/me → 로그인 유저 정보 가져오기 → setUser
  //    응답 형식: { success: true, user: { userId, userNm } }
  // 2. lib/api/reservations.ts 의 getMyReservations() 호출 → GET /api/reservations/my
  //    응답을 setReservations 에 넣기
  //    실패 시 setReservations([]) 로 빈 목록 표시
  // 3. setLoading(false)
  useEffect(() => {
    // 구현 필요
    setLoading(false);
  }, []);

  // [TODO-MYPAGE-CANCEL] 예매 취소 버튼 클릭 시 실행
  // 1. confirm("예매를 취소하시겠습니까?") → 취소 시 리턴
  // 2. setCancelling(reservationId)
  // 3. lib/api/reservations.ts 의 cancelReservation(reservationId) 호출 → DELETE /api/reservations/{id}
  // 4. 성공 시 해당 예매의 reservedStatus 를 "CANCELLED" 로 변경 (setReservations 업데이트)
  // 5. finally 에서 setCancelling(null)
  const handleCancel = async (reservationId: number) => {
    // 구현 필요
  };

  return (
    <>
      <div className="pageWrap">
        <div className="pageHeader">
          <h1 className="pageTitle">마이페이지</h1>
          <p className="pageSubtitle">계정 정보와 예매 내역을 확인합니다.</p>
        </div>

        <div className="mypageGrid">
          {/* 프로필 카드 */}
          <div className="profileCard">
            <div className="profileAvatar">
              {/* [TODO-MYPAGE-AVATAR] user.userNm 첫 글자 표시, 없으면 "?" */}
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
