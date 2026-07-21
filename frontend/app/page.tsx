"use client";

import { useRouter } from "next/navigation";
import SiteNav from "@/components/SiteNav";

type Round = { roundId: number; roundTime: string; roundStatus: "OPEN" | "CLOSED" | "SOLDOUT" };
type Event = { id: number; title: string; location: string; color: string; emoji: string; rounds: Round[] };

const MOCK_EVENTS: Event[] = [
  {
    id: 1, title: "BTS WORLD TOUR 2026", location: "서울 올림픽주경기장",
    color: "linear-gradient(135deg, #7c3aed, #4f46e5)", emoji: "🎤",
    rounds: [
      { roundId: 1, roundTime: "2026-08-15 18:00", roundStatus: "OPEN" },
      { roundId: 2, roundTime: "2026-08-16 18:00", roundStatus: "OPEN" },
    ],
  },
  {
    id: 2, title: "IU Concert : Hereh", location: "서울 KSPO DOME",
    color: "linear-gradient(135deg, #0891b2, #0e7490)", emoji: "🎵",
    rounds: [
      { roundId: 3, roundTime: "2026-09-05 19:00", roundStatus: "OPEN" },
      { roundId: 4, roundTime: "2026-09-06 19:00", roundStatus: "SOLDOUT" },
    ],
  },
  {
    id: 3, title: "뮤지컬 레미제라블", location: "예술의전당 오페라극장",
    color: "linear-gradient(135deg, #b45309, #92400e)", emoji: "🎭",
    rounds: [
      { roundId: 5, roundTime: "2026-09-20 14:00", roundStatus: "OPEN" },
      { roundId: 6, roundTime: "2026-09-20 19:00", roundStatus: "OPEN" },
      { roundId: 7, roundTime: "2026-09-21 14:00", roundStatus: "CLOSED" },
    ],
  },
  {
    id: 4, title: "aespa FAN MEETING 2026", location: "고려대학교 화정체육관",
    color: "linear-gradient(135deg, #0f766e, #115e59)", emoji: "💚",
    rounds: [
      { roundId: 8, roundTime: "2026-10-10 17:00", roundStatus: "OPEN" },
    ],
  },
  {
    id: 5, title: "서울 재즈 페스티벌", location: "올림픽공원 88잔디마당",
    color: "linear-gradient(135deg, #be185d, #9d174d)", emoji: "🎷",
    rounds: [
      { roundId: 9, roundTime: "2026-10-25 15:00", roundStatus: "OPEN" },
      { roundId: 10, roundTime: "2026-10-26 15:00", roundStatus: "OPEN" },
    ],
  },
  {
    id: 6, title: "클래식 갈라 콘서트", location: "롯데콘서트홀",
    color: "linear-gradient(135deg, #4338ca, #3730a3)", emoji: "🎻",
    rounds: [
      { roundId: 11, roundTime: "2026-11-08 19:30", roundStatus: "OPEN" },
    ],
  },
];

const STATUS_LABEL: Record<string, string> = {
  OPEN: "예매 가능",
  CLOSED: "예매 종료",
  SOLDOUT: "매진",
};

const STATUS_CLASS: Record<string, string> = {
  OPEN: "badge badgeOpen",
  CLOSED: "badge badgeClosed",
  SOLDOUT: "badge badgeSoldout",
};

export default function EventsPage() {
  const router = useRouter();

  const handleBook = (roundId: number, title: string, status: string) => {
    if (status !== "OPEN") return;
    router.push(`/queue?scheduleId=${roundId}&title=${encodeURIComponent(title)}`);
  };

  return (
    <>
      <SiteNav active="events" />
      <div className="pageWrap">
        <div className="pageHeader">
          <h1 className="pageTitle">공연 목록</h1>
          <p className="pageSubtitle">예매하고 싶은 공연을 선택하세요.</p>
        </div>

        <div className="eventGrid">
          {MOCK_EVENTS.map((event) => (
            <div key={event.id} className="eventCard">
              <div className="eventPoster" style={{ background: event.color }}>
                <span style={{ fontSize: 52 }}>{event.emoji}</span>
              </div>

              <div className="eventInfo">
                <p className="eventTitle">{event.title}</p>
                <p className="eventLocation">📍 {event.location}</p>

                <div className="eventRounds">
                  {event.rounds.map((round) => (
                    <div key={round.roundId} className="eventRoundRow">
                      <span className="eventRoundTime">
                        {round.roundTime.replace("T", " ")}
                      </span>
                      {round.roundStatus === "OPEN" ? (
                        <button
                          className="btnPrimary"
                          style={{ padding: "4px 12px", fontSize: 12 }}
                          onClick={() => handleBook(round.roundId, event.title, round.roundStatus)}
                        >
                          예매하기
                        </button>
                      ) : (
                        <span className={STATUS_CLASS[round.roundStatus]}>
                          {STATUS_LABEL[round.roundStatus]}
                        </span>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </>
  );
}
