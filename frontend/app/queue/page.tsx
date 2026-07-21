"use client";

import { useEffect, useRef, useState, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { joinQueue, getQueueStatus } from "@/lib/api/queues";
import type { QueueStatus } from "@/lib/data/types";

function QueueContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const scheduleId = Number(searchParams.get("scheduleId") ?? "0");
  const title = searchParams.get("title") ?? "공연";

  const [status, setStatus] = useState<QueueStatus | null>(null);
  const [error, setError] = useState("");
  const tokenRef = useRef<string>("");
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);

  const stopPolling = () => {
    if (intervalRef.current) clearInterval(intervalRef.current);
  };

  const poll = async (token: string) => {
    try {
      const data = await getQueueStatus(token);
      setStatus(data);
      if (data.status === "ENTERED") {
        stopPolling();
        setTimeout(() => router.push(`/seats/${scheduleId}`), 1500);
      }
      if (data.status === "EXPIRED") {
        stopPolling();
        setError("대기열이 만료되었습니다. 다시 시도해주세요.");
      }
    } catch {
      // 서버 미연결 시 데모 모드로 카운트다운
    }
  };

  useEffect(() => {
    if (!scheduleId) { setError("잘못된 접근입니다."); return; }

    joinQueue(scheduleId)
      .then(({ queueToken }) => {
        tokenRef.current = queueToken;
        poll(queueToken);
        intervalRef.current = setInterval(() => poll(queueToken), 3000);
      })
      .catch(() => {
        // 백엔드 미연결 시 데모용 시뮬레이션
        const demoToken = `demo-${Date.now()}`;
        tokenRef.current = demoToken;
        let pos = Math.floor(Math.random() * 80) + 20;
        setStatus({ queueToken: demoToken, position: pos, estimatedWait: pos * 3, status: "WAITING" });
        intervalRef.current = setInterval(() => {
          pos = Math.max(0, pos - Math.floor(Math.random() * 4 + 1));
          if (pos === 0) {
            setStatus({ queueToken: demoToken, position: 0, estimatedWait: 0, status: "ENTERED" });
            stopPolling();
            setTimeout(() => router.push(`/seats/${scheduleId}`), 1500);
          } else {
            setStatus({ queueToken: demoToken, position: pos, estimatedWait: pos * 3, status: "WAITING" });
          }
        }, 2000);
      });

    return stopPolling;
  }, [scheduleId]);

  const formatWait = (seconds: number) => {
    if (seconds < 60) return `약 ${seconds}초`;
    return `약 ${Math.ceil(seconds / 60)}분`;
  };

  return (
    <div className="queueWrap">
      <div className="queueBox">
        <div className="queueIcon">🎫</div>
        <h1 className="queueTitle">대기열</h1>
        <p className="queueEventName">{title}</p>

        {error && <p className="errorMsg">{error}</p>}

        {!error && !status && (
          <>
            <div className="queueDots">
              <div className="queueDot" />
              <div className="queueDot" />
              <div className="queueDot" />
            </div>
            <p style={{ fontSize: 13, color: "var(--text-2)" }}>대기열에 진입하는 중...</p>
          </>
        )}

        {status?.status === "WAITING" && (
          <>
            <div className="queuePosition">{status.position.toLocaleString()}</div>
            <p className="queuePositionLabel">내 앞 대기 인원</p>
            <p className="queueWait">
              예상 대기시간 <strong>{formatWait(status.estimatedWait)}</strong>
            </p>
            <div className="queueDots">
              <div className="queueDot" />
              <div className="queueDot" />
              <div className="queueDot" />
            </div>
            <p className="queueNote">페이지를 벗어나지 마세요. 순번이 되면 자동으로 이동합니다.</p>
          </>
        )}

        {status?.status === "ENTERED" && (
          <>
            <div className="queueEntered">✅ 입장 가능합니다! 좌석 선택 페이지로 이동합니다...</div>
            <div className="queueDots">
              <div className="queueDot" />
              <div className="queueDot" />
              <div className="queueDot" />
            </div>
          </>
        )}
      </div>
    </div>
  );
}

export default function QueuePage() {
  return (
    <Suspense fallback={
      <div className="queueWrap">
        <div className="queueBox">
          <p style={{ color: "var(--text-2)", fontSize: 14 }}>로딩 중...</p>
        </div>
      </div>
    }>
      <QueueContent />
    </Suspense>
  );
}
