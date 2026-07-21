import { apiFetch } from "./client";
import type { QueueStatus } from "../data/types";

export async function joinQueue(scheduleId: number): Promise<{ queueToken: string }> {
  const res = await apiFetch("/queues", {
    method: "POST",
    body: JSON.stringify({ scheduleId }),
  });
  if (!res.ok) throw new Error("대기열 진입에 실패했습니다.");
  return res.json();
}

export async function getQueueStatus(queueToken: string): Promise<QueueStatus> {
  const res = await apiFetch(`/queues/${queueToken}`);
  if (!res.ok) throw new Error("대기열 상태를 조회할 수 없습니다.");
  return res.json();
}
