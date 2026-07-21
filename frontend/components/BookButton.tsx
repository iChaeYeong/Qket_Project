"use client";

import Link from "next/link";
import { useEffect, useState } from "react";

type Props = {
  roundId: number;
  roundTime: string;
  openTime: string;
  title: string;
};

// [BOOK-STATE] 버튼 상태 3가지
// hidden  → 10분 전보다 이전 (버튼 안 보임)
// pending → 10분 전 ~ 오픈시간 (버튼 보이지만 클릭 시 alert)
// open    → 오픈시간 이후 (버튼 활성화, /queue 이동)
type ButtonState = "hidden" | "pending" | "open";

export default function BookButton({ roundId, roundTime, openTime, title }: Props) {

  const [state, setState] = useState<ButtonState>("hidden");

  // [BOOK-TIMER] useEffect 안에서 1초마다 현재 시간 체크
  // openTime 기준으로 10분전/오픈 계산해서 setState 로 상태 변경
  // 컴포넌트 언마운트 시 clearInterval
  useEffect(() => {
    // 구현 필요
  }, [openTime]);

  // [BOOK-HIDDEN] 10분 전보다 이전 — 아무것도 렌더링하지 않음
  if (state === "hidden") return null;

  // [BOOK-PENDING] 10분 전 ~ 오픈 전 — 클릭 시 alert
  if (state === "pending") {
    return (
      <button
        className="btnPrimary"
        style={{ padding: "4px 12px", fontSize: 12 }}
        onClick={() => {/* [BOOK-PENDING-ALERT] alert 구현 필요 */}}
      >
        예매하기
      </button>
    );
  }

  // [BOOK-OPEN] 오픈 이후 — 대기열 페이지로 이동
  return (
    <Link
      href={`/queue?scheduleId=${roundId}&title=${encodeURIComponent(title)}`}
      className="btnPrimary"
      style={{ padding: "4px 12px", fontSize: 12 }}
    >
      예매하기
    </Link>
  );
}
