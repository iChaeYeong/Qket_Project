"use client";

import Link from "next/link";
import { useEffect, useState } from "react";

type Props = {
  roundId: number;
  openTime: string;
  roundTime: string;
  title: string;
};

// [BOOK-STATE] 버튼 상태 3가지
// hidden  - 10분 전보다 이전 (버튼 안 보임)
// pending - 10분 전 ~ 오픈시간 (버튼 보이지만 클릭 시 alert)
// open    - 오픈시간 이후 (버튼 활성화, /queue 이동)
// close   - 공연시간 이후 (버튼 비활성화)
type ButtonState = "Before" | "pending" | "open" | "closed";

export default function BookButton({ roundId, openTime, roundTime, title }: Props) {

  const [state, setState] = useState<ButtonState>(() => {
    const open = new Date(openTime).getTime();
    const round = new Date(roundTime).getTime();
    const now = Date.now();
    if (now >= round) return "closed";
    if (now >= open) return "open";
    if (now >= open - 10 * 60 * 1000) return "pending";
    return "Before";
  });


  useEffect(() => {
    const open = new Date(openTime).getTime();
    const round = new Date(roundTime).getTime();

    const check = () => {
      const now = Date.now();
      if (now >= round) {
        setState("closed");
      } else if (now >= open) {
        setState("open");
      } else if (now >= open - 10 * 60 * 1000) {
        setState("pending");
      } else {
        setState("Before");
      }
    };

    check();
    const id = setInterval(check, 1000);
    return () => clearInterval(id);
  }, [openTime, roundTime]);


  // [BOOK-HIDDEN] 10분 전보다 이전 — 아무것도 렌더링하지 않음
  if (state === "Before") return <span className="badge badgeClosed">예매 전</span>

  // [BOOK-PENDING] 10분 전 ~ 오픈 전 — 클릭 시 alert
  if (state === "pending") {
    return (
      <button
        className="btnPrimary"
        style={{ padding: "4px 12px", fontSize: 12 }}
        onClick={() => {
          const now = new Date().toLocaleString("ko-KR");
          alert(`예매 오픈 전입니다.\n현재 시각: ${now}\n오픈 시각: ${new
            Date(openTime).toLocaleString("ko-KR")}`);
        }}
      >
        예매하기
      </button>
    );
  }

  // [BOOK-OPEN] 오픈 이후 — 좌석 선택 페이지로 이동
  // TODO: 대기열 구현 후 아래 href 를 `/queue?scheduleId=${roundId}&title=${encodeURIComponent(title)}` 로 교체
  return (
    <Link
      href={`/seats/${roundId}`}
      className="btnPrimary"
      style={{ padding: "4px 12px", fontSize: 12 }}
    >
      예매하기
    </Link>
  );
}
