import { apiFetch } from "./client";
import type { Reservation, ApiResult } from "../data/types";

export async function createReservation(
  scheduleId: number,
  seatId: number
): Promise<ApiResult> {
  const res = await apiFetch("/reservations", {
    method: "POST",
    body: JSON.stringify({ scheduleId, seatId }),
  });
  return res.json();
}

export async function getMyReservations(): Promise<Reservation[]> {
  const res = await apiFetch("/users/me/reservations");
  if (!res.ok) throw new Error("예약 내역을 불러오지 못했습니다.");
  return res.json();
}

export async function cancelReservation(reservationId: number): Promise<ApiResult> {
  const res = await apiFetch(`/reservations/${reservationId}`, { method: "DELETE" });
  return res.json();
}
