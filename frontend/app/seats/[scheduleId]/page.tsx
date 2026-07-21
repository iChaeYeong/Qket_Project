// Client Component — "use client" 필요한 이유:
//   1. 좌석 선택 상태 관리 (useState: selected, seats)
//   2. 예매하기 버튼 onClick 이벤트 핸들러 (handleReserve)
//   3. 좌석 클릭 이벤트 핸들러 (handleSelect)
//   * 이상적으로는 좌석 목록 fetch 는 Server Component 에서 처리하고
//     선택/예매 인터랙션만 Client Component 로 분리하는 것이 좋음
//     (Server Component → props 로 seats 전달 → Client Component 에서 selection 처리)
"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import type { Seat } from "@/lib/data/types";

// 등급 표시 라벨
const GRADE_LABEL: Record<string, string> = { VIP: "VIP석", R: "R석", S: "S석" };

// 등급별 가격 (백엔드에서 받아올 수도 있음)
const GRADE_PRICE: Record<string, string> = { VIP: "220,000원", R: "154,000원", S: "99,000원" };

// 좌석 행/열 구성 (백엔드 DB와 맞춰야 함)
const ROWS = ["A", "B", "C", "D", "E", "F", "G", "H"];

// [TODO-SEATS-GRADE] 행 → 등급 매핑 (백엔드 기준과 일치해야 함)
// A,B → VIP / C,D,E → R / F,G,H → S
function getGrade(row: string): "VIP" | "R" | "S" {
  if (["A", "B"].includes(row)) return "VIP";
  if (["C", "D", "E"].includes(row)) return "R";
  return "S";
}

// [TODO-SEATS-PARAMS] Next.js 14 App Router: params 는 Promise 로 받아야 할 수도 있음
// 현재 { params: { scheduleId: string } } 로 받고 있음
export default function SeatsPage({ params }: { params: { scheduleId: string } }) {
  const { scheduleId } = params;
  const router = useRouter();

  // 좌석 목록
  const [seats, setSeats] = useState<Seat[]>([]);

  // 선택된 좌석 (단일 선택)
  const [selected, setSelected] = useState<Seat | null>(null);

  // UI 상태
  const [loading, setLoading] = useState(true);
  const [booking, setBooking] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);

  // [TODO-SEATS-FETCH] 컴포넌트 마운트 시 좌석 목록 불러오기
  // lib/api/seats.ts 의 getSeats(scheduleId) 호출 → GET /api/seats/round/{scheduleId}
  // 응답 배열을 setSeats 에 넣기
  // 실패 시 setSeats([]) 또는 에러 표시
  useEffect(() => {
    // 구현 필요
    setLoading(false);
  }, [scheduleId]);

  // [TODO-SEATS-SELECT] 좌석 클릭 시 실행
  // status === "AVAILABLE" 인 좌석만 선택 가능
  // 이미 선택된 좌석 다시 클릭 시 선택 해제
  const handleSelect = (seat: Seat) => {
    // 구현 필요
  };

  // [TODO-SEATS-RESERVE] 예매하기 버튼 클릭 시 실행
  // 1. selected 없으면 리턴
  // 2. setBooking(true)
  // 3. lib/api/reservations.ts 의 createReservation(scheduleId, selected.seatId) 호출
  //    → POST /api/reservations { roundId: scheduleId, seatId }
  // 4. 성공 시 setSuccess(true) → 2초 뒤 router.push("/mypage")
  // 5. 실패 시 setError(응답.message)
  // 6. catch 블록에서 setError("서버에 연결할 수 없습니다.")
  // 7. finally 에서 setBooking(false)
  const handleReserve = async () => {
    // 구현 필요
  };

  // 좌석 버튼 CSS 클래스 결정
  // selected → seatSelected / RESERVED → seatReserved / LOCKED → seatLocked
  // 등급별 색상: VIP → seatAvailableVip / R → seatAvailableR / S → seatAvailableS
  const seatClass = (seat: Seat): string => {
    const base = "seat";
    if (selected?.seatId === seat.seatId) {
      const gradeClass = seat.grade === "VIP" ? "seatAvailableVip" : seat.grade === "R" ? "seatAvailableR" : "seatAvailableS";
      return `${base} ${gradeClass} seatSelected`;
    }
    if (seat.status === "RESERVED") return `${base} seatReserved`;
    if (seat.status === "LOCKED") return `${base} seatLocked`;
    if (seat.grade === "VIP") return `${base} seatAvailableVip`;
    if (seat.grade === "R") return `${base} seatAvailableR`;
    return `${base} seatAvailableS`;
  };

  // 행별로 좌석 그룹핑
  const byRow = ROWS.map(row => ({
    row,
    seats: seats.filter(s => s.seatRow === row).sort((a, b) => Number(a.seatColumn) - Number(b.seatColumn)),
  }));

  return (
    <>
      <div className="pageWrap">
        <div className="pageHeader">
          <h1 className="pageTitle">좌석 선택</h1>
          <p className="pageSubtitle">원하는 좌석을 선택한 뒤 예매를 완료하세요.</p>
        </div>

        {loading ? (
          <p className="loadingMsg">좌석 정보를 불러오는 중...</p>
        ) : (
          <div className="seatLayout">
            {/* 좌석 배치도 */}
            <div className="seatMapWrap">
              <div className="seatStage">STAGE</div>

              {/* 범례 */}
              <div className="seatLegend">
                <div className="seatLegendItem">
                  <div className="seatLegendDot" style={{ background: "var(--vip-color)" }} />
                  <span>VIP석</span>
                </div>
                <div className="seatLegendItem">
                  <div className="seatLegendDot" style={{ background: "var(--r-color)" }} />
                  <span>R석</span>
                </div>
                <div className="seatLegendItem">
                  <div className="seatLegendDot" style={{ background: "var(--s-color)" }} />
                  <span>S석</span>
                </div>
                <div className="seatLegendItem">
                  <div className="seatLegendDot" style={{ background: "var(--border-strong)" }} />
                  <span>예매완료</span>
                </div>
                <div className="seatLegendItem">
                  <div className="seatLegendDot" style={{ background: "var(--warning)" }} />
                  <span>선택 중</span>
                </div>
              </div>

              {/* 좌석 그리드 */}
              <div className="seatGrid">
                {byRow.map(({ row, seats: rowSeats }) => (
                  <div key={row} className="seatRow">
                    <span className="seatRowLabel">{row}</span>
                    {rowSeats.map(seat => (
                      <button
                        key={seat.seatId}
                        className={seatClass(seat)}
                        onClick={() => handleSelect(seat)}
                        disabled={seat.status !== "AVAILABLE"}
                        title={`${row}${seat.seatColumn} (${GRADE_LABEL[seat.grade]})`}
                      />
                    ))}
                  </div>
                ))}
              </div>
            </div>

            {/* 선택 정보 패널 */}
            <div className="seatPanel">
              <p className="seatPanelTitle">예매 정보</p>

              {!selected ? (
                <p className="seatPanelEmpty">좌석을 선택하세요</p>
              ) : (
                <>
                  <div className="seatPanelRow">
                    <span className="seatPanelLabel">좌석</span>
                    <span className="seatPanelValue">{selected.seatRow}{selected.seatColumn}</span>
                  </div>
                  <div className="seatPanelRow">
                    <span className="seatPanelLabel">등급</span>
                    <span className="seatPanelValue">
                      <span className={`badge badge${selected.grade === "VIP" ? "Vip" : selected.grade}`}>
                        {GRADE_LABEL[selected.grade]}
                      </span>
                    </span>
                  </div>
                  <div className="seatPanelRow">
                    <span className="seatPanelLabel">가격</span>
                    <span className="seatPanelValue">{GRADE_PRICE[selected.grade]}</span>
                  </div>
                  <hr className="seatPanelDivider" />

                  {success ? (
                    <p className="successMsg">예매 완료! 마이페이지로 이동합니다.</p>
                  ) : (
                    <>
                      {error && <p className="errorMsg">{error}</p>}
                      <button
                        className="btnPrimary"
                        style={{ width: "100%" }}
                        onClick={handleReserve}
                        disabled={booking}
                      >
                        {booking ? "예매 중..." : "예매하기"}
                      </button>
                    </>
                  )}
                </>
              )}
            </div>
          </div>
        )}
      </div>
    </>
  );
}
