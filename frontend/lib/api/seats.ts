import { apiFetch } from "./client";
import type { Seat } from "../data/types";

export async function getSeats(scheduleId: number): Promise<Seat[]> {
  const res = await apiFetch(`/schedules/${scheduleId}/seats`);
  if (!res.ok) throw new Error("좌석 정보를 불러오지 못했습니다.");
  return res.json();
}

export async function lockSeat(
  scheduleId: number,
  seatId: number
): Promise<{ success: boolean }> {
  const res = await apiFetch(`/schedules/${scheduleId}/seats/lock`, {
    method: "POST",
    body: JSON.stringify({ seatId }),
  });
  return res.json();
}
