export type UserDTO = {
  userId: string;
  userNm: string;
  userEmail?: string;

};

export type ApiResult = {
  success: boolean;
  message?: string;
};

export type LoginResult = ApiResult & {
  user?: UserDTO;
};

export type PerformanceRound = {
  roundId: number;
  performanceId: number;
  roundTime: string;
  roundStatus: "OPEN" | "CLOSED" | "SOLDOUT";
};

export type Performance = {
  performanceId: number;
  pTitle: string;
  pLocation: string;
  posterUrl?: string;
  rounds: PerformanceRound[];
};

export type Seat = {
  seatId: number;
  roundId: number;
  seatRow: string;
  seatColumn: string;
  grade: "VIP" | "R" | "S";
  status: "AVAILABLE" | "LOCKED" | "RESERVED";
};

export type Reservation = {
  reservationId: number;
  performanceTitle: string;
  roundTime: string;
  seatInfo: string;
  grade: string;
  reservedStatus: string;
  createdReserved: string;
};

export type QueueStatus = {
  queueToken: string;
  position: number;
  estimatedWait: number;
  status: "WAITING" | "ENTERED" | "EXPIRED";
};
