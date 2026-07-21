import { apiFetch } from "./client";
import type { Performance } from "../data/types";

export async function getEvents(): Promise<Performance[]> {
  const res = await apiFetch("/events");
  if (!res.ok) throw new Error("공연 목록을 불러오지 못했습니다.");
  return res.json();
}

export async function getEvent(eventId: number): Promise<Performance> {
  const res = await apiFetch(`/events/${eventId}`);
  if (!res.ok) throw new Error("공연 정보를 불러오지 못했습니다.");
  return res.json();
}
