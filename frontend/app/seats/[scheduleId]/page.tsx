"use client";

import { use, useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import SiteNav from "@/components/SiteNav";
import { getSeats } from "@/lib/api/seats";
import { createReservation } from "@/lib/api/reservations";
import type { Seat } from "@/lib/data/types";

type Grade = "VIP" | "R" | "S";

const GRADE_LABEL: Record<Grade, string> = { VIP: "VIP석", R: "R석", S: "S석" };
const GRADE_PRICE: Record<Grade, string> = { VIP: "220,000원", R: "154,000원", S: "99,000원" };

const ROWS = ["A", "B", "C", "D", "E", "F", "G", "H"];
const COLS = Array.from({ length: 12 }, (_, i) => i + 1);

function getGrade(row: string): Grade {
  if (["A", "B"].includes(row)) return "VIP";
  if (["C", "D", "E"].includes(row)) return "R";
  return "S";
}

function generateMockSeats(scheduleId: number): Seat[] {
  const seats: Seat[] = [];
  let id = 1;
  for (const row of ROWS) {
    for (const col of COLS) {
      const rand = Math.random();
      const status: Seat["status"] =
        rand < 0.55 ? "AVAILABLE" : rand < 0.75 ? "RESERVED" : rand < 0.82 ? "LOCKED" : "AVAILABLE";
      seats.push({
        seatId: id++,
        roundId: scheduleId,
        seatRow: row,
        seatColumn: String(col),
        grade: getGrade(row),
        status,
      });
    }
  }
  return seats;
}

export default function SeatsPage({ params }: { params: Promise<{ scheduleId: string }> }) {
  const { scheduleId } = use(params);
  const router = useRouter();
  const [seats, setSeats] = useState<Seat[]>([]);
  const [selected, setSelected] = useState<Seat | null>(null);
  const [loading, setLoading] = useState(true);
  const [booking, setBooking] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);

  useEffect(() => {
    getSeats(Number(scheduleId))
      .then(setSeats)
      .catch(() => setSeats(generateMockSeats(Number(scheduleId))))
      .finally(() => setLoading(false));
  }, [scheduleId]);

  const handleSelect = (seat: Seat) => {
    if (seat.status !== "AVAILABLE") return;
    setSelected(prev => prev?.seatId === seat.seatId ? null : seat);
  };

  const handleReserve = async () => {
    if (!selected) return;
    setBooking(true);
    setError("");
    try {
      const res = await createReservation(Number(scheduleId), selected.seatId);
      if (res.success) {
        setSuccess(true);
        setTimeout(() => router.push("/mypage"), 2000);
      } else {
        setError(res.message ?? "예매에 실패했습니다.");
      }
    } catch {
      setError("서버에 연결할 수 없습니다.");
    } finally {
      setBooking(false);
    }
  };

  const seatClass = (seat: Seat): string => {
    const base = "seat";
    if (selected?.seatId === seat.seatId) {
      const gradeClass = seat.grade === "VIP" ? "seatAvailableVip" : seat.grade === "R" ? "seatAvailableR" : "seatAvailableS";
      return `${base} ${gradeClass} seatSelected`;
    }
    if (seat.status === "RESERVED") return `${base} seatReserved`;
    if (seat.status === "LOCKED")   return `${base} seatLocked`;
    if (seat.grade === "VIP") return `${base} seatAvailableVip`;
    if (seat.grade === "R")   return `${base} seatAvailableR`;
    return `${base} seatAvailableS`;
  };

  const byRow = ROWS.map(row => ({
    row,
    seats: seats.filter(s => s.seatRow === row).sort((a, b) => Number(a.seatColumn) - Number(b.seatColumn)),
  }));

  return (
    <>
      <SiteNav />
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
