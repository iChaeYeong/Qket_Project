// Client Component — "use client" 필요한 이유:
//   1. 좌석 선택 상태 관리 (useState: selected, seats)
//   2. 예매하기 버튼 onClick 이벤트 핸들러 (handleReserve)
//   3. 좌석 클릭 이벤트 핸들러 (handleSelect)
//   * 이상적으로는 좌석 목록 fetch 는 Server Component 에서 처리하고
//     선택/예매 인터랙션만 Client Component 로 분리하는 것이 좋음
//     (Server Component → props 로 seats 전달 → Client Component 에서 selection 처리)
"use client";

import { useEffect, useState, type CSSProperties } from "react";
import { useParams, useRouter, useSearchParams } from "next/navigation";
import type { Seat } from "@/lib/data/types";
import { getSeats } from "@/lib/api/seats"
import { createReservation } from "@/lib/api/reservations"


// 등급 표시 라벨
const GRADE_LABEL: Record<string, string> = { VIP: "VIP석", R: "R석", S: "S석" };

// 등급별 가격 (백엔드에서 받아올 수도 있음)
const GRADE_PRICE: Record<string, string> = { VIP: "220,000원", R: "154,000원", S: "99,000원" };

export default function SeatsPage() {
  //동적라우팅 값 가져오기
  const { scheduleId } = useParams<{ scheduleId: string }>();
  const searchParams = useSearchParams();
  const queueToken = searchParams.get("queueToken") ?? undefined;
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

  // 컴포넌트 마운트 시 좌석 목록 불러오기
  // lib/api/seats.ts 의 getSeats(scheduleId) 호출 → GET /api/seats/round/{scheduleId}
  // 응답 배열을 setSeats 에 넣기
  // 실패 시 setSeats([]) 또는 에러 표시
  useEffect(() => {
    getSeats(Number(scheduleId))
      .then(setSeats)
      .catch(() => setSeats([]))
      .finally(() => setLoading(false));
  }, [scheduleId]);


  // [TODO-SEATS-SELECT] 좌석 클릭 시 실행
  // status === "AVAILABLE" 인 좌석만 선택 가능
  // 이미 선택된 좌석 다시 클릭 시 선택 해제

  const handleSelect = (seat: Seat) => {
    if (seat.status !== "AVAILABLE") {
      alert("이미 선택된 좌석입니다.")
      return;
    }
    setSelected(prev => prev?.seatId === seat.seatId ? null : seat);
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
    if (!selected) return; //아무것도 선택하지 않고 예매 시

    setBooking(true);
    try {
      const result = await createReservation(selected.reservationId, Number(scheduleId), selected.seatId, queueToken);
      if (result.success) {
        setSuccess(true);
        setTimeout(() => router.push("/mypage"), 2000);
      } else {
        setError(result.message ?? "예매에 실패했습니다.");
      } //예매 성공 시 2초뒤 마이페이지로(예매조회)
    } catch (e: any) {
      setError(e?.message ?? "서버에 연결할 수 없습니다.");
    } finally {
      setBooking(false);
    }


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

  // 실제 응답 데이터에 존재하는 행(row)만 사용 (하드코딩 X)
  // → 예전엔 ROWS 가 A~H 로 고정돼 있어서 그 뒤 행(예: S석 구간)이 화면에 아예 안 그려지는 버그가 있었음
  const ROWS = Array.from(new Set(seats.map(s => s.seatRow))).sort();

  // 행별로 좌석 그룹핑 (열 번호 순 정렬) + 무대로부터의 순서(rowIndex) 기록 — 곡선/폭 계산에 사용
  const byRow = ROWS.map((row, rowIndex) => ({
    row,
    rowIndex,
    grade: seats.find(s => s.seatRow === row)?.grade ?? "S",
    seats: seats.filter(s => s.seatRow === row).sort((a, b) => Number(a.seatColume) - Number(b.seatColume)),
  }));

  // 연속된 같은 등급의 행들을 하나의 섹션으로 묶기 (VIP / R / S 구역 구분 표시용)
  const sections: { grade: string; rows: typeof byRow }[] = [];
  byRow.forEach(entry => {
    const last = sections[sections.length - 1];
    if (last && last.grade === entry.grade) {
      last.rows.push(entry);
    } else {
      sections.push({ grade: entry.grade, rows: [entry] });
    }
  });

  // 실제 공연장처럼 각 행이 무대 쪽으로 살짝 휘어진 부채꼴(곡선) 모양이 되도록
  // 좌석마다 중심에서 멀어질수록 무대(위쪽)에서 조금씩 멀어지는 세로 오프셋을 계산
  const buildCurvedSeats = (rowSeats: Seat[], rowIndex: number) => {
    const n = rowSeats.length;
    const amplitude = Math.min(16, 3 + rowIndex * 0.8); // 뒤쪽 행일수록 곡률을 크게 (행 간격을 넘지 않도록 상한)
    return rowSeats.map((seat, i) => {
      const t = n > 1 ? (i - (n - 1) / 2) / ((n - 1) / 2) : 0; // -1(왼쪽 끝) ~ 1(오른쪽 끝), 0(중앙)
      const offsetY = Math.round(amplitude * t * t);
      return { seat, offsetY };
    });
  };

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
              </div>

              {/* 좌석 그리드 — 무대에서 멀어질수록 행이 넓어지고, 각 행은 가운데가 무대 쪽으로 볼록한 부채꼴 곡선으로 배치 */}
              <div className="seatVenue">
                <div className="seatGrid">
                  {sections.map((section, si) => {
                    // 무대와 가까운 앞 구역(보통 VIP)일수록 좌우 여백을 크게 줘서 폭이 좁아 보이게, 뒤로 갈수록 여백을 줄여 넓어지게
                    const sectionIndent = Math.max(0, (sections.length - 1 - si) * 20);
                    return (
                      <div key={si} className="seatSection" style={{ paddingLeft: sectionIndent, paddingRight: sectionIndent }}>
                        <div className="seatSectionHeader">
                          <span className={`badge badge${section.grade === "VIP" ? "Vip" : section.grade}`}>
                            {GRADE_LABEL[section.grade] ?? section.grade}
                          </span>
                        </div>
                        {section.rows.map(({ row, rowIndex, seats: rowSeats }) => {
                          const withOffset = buildCurvedSeats(rowSeats, rowIndex);
                          const half = Math.ceil(withOffset.length / 2);
                          const left = withOffset.slice(0, half);
                          const right = withOffset.slice(half);
                          // 뒤쪽 행일수록 폭을 좁혀줘서(음수 여백 대신 안쪽 정렬) 부채꼴이 자연스럽게 넓어지는 느낌을 강조
                          const rowIndent = Math.max(0, (ROWS.length - 1 - rowIndex) * 2);
                          return (
                            <div key={row} className="seatRow" style={{ paddingLeft: rowIndent, paddingRight: rowIndent }}>
                              <span className="seatRowLabel">{row}</span>
                              <div className="seatRowGroup">
                                {left.map(({ seat, offsetY }) => (
                                  <button
                                    key={seat.seatId}
                                    className={seatClass(seat)}
                                    onClick={() => handleSelect(seat)}
                                    disabled={seat.status !== "AVAILABLE"}
                                    title={`${row}${seat.seatColume} (${GRADE_LABEL[seat.grade]})`}
                                    style={{ "--seat-y": `${offsetY}px` } as CSSProperties}
                                  />
                                ))}
                              </div>
                              {right.length > 0 && <div className="seatAisle" />}
                              <div className="seatRowGroup">
                                {right.map(({ seat, offsetY }) => (
                                  <button
                                    key={seat.seatId}
                                    className={seatClass(seat)}
                                    onClick={() => handleSelect(seat)}
                                    disabled={seat.status !== "AVAILABLE"}
                                    title={`${row}${seat.seatColume} (${GRADE_LABEL[seat.grade]})`}
                                    style={{ "--seat-y": `${offsetY}px` } as CSSProperties}
                                  />
                                ))}
                              </div>
                            </div>
                          );
                        })}
                      </div>
                    );
                  })}
                </div>
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
                    <span className="seatPanelValue">{selected.seatRow}{selected.seatColume}</span>
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
