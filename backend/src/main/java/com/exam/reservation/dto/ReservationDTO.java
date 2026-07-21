package com.exam.reservation.dto;

import org.apache.ibatis.type.Alias;

import java.time.LocalDateTime;

@Alias("ReservationDTO")
public class ReservationDTO {

    Long reservationId;
    String userId;
    Long seatId;
    Long roundId;
    String reservedStatus;
    LocalDateTime createdReserved;

    // for join query results
    String seatRow;
    String seatColume;
    String grade;
    String pTitle;
    LocalDateTime roundTime;

    public Long getReservationId() { return reservationId; }
    public void setReservationId(Long reservationId) { this.reservationId = reservationId; }

    public String getUserId() { return userId; }
    public void setUserId(String userId) { this.userId = userId; }

    public Long getSeatId() { return seatId; }
    public void setSeatId(Long seatId) { this.seatId = seatId; }

    public Long getRoundId() { return roundId; }
    public void setRoundId(Long roundId) { this.roundId = roundId; }

    public String getReservedStatus() { return reservedStatus; }
    public void setReservedStatus(String reservedStatus) { this.reservedStatus = reservedStatus; }

    public LocalDateTime getCreatedReserved() { return createdReserved; }
    public void setCreatedReserved(LocalDateTime createdReserved) { this.createdReserved = createdReserved; }

    public String getSeatRow() { return seatRow; }
    public void setSeatRow(String seatRow) { this.seatRow = seatRow; }

    public String getSeatColume() { return seatColume; }
    public void setSeatColume(String seatColume) { this.seatColume = seatColume; }

    public String getGrade() { return grade; }
    public void setGrade(String grade) { this.grade = grade; }

    public String getPTitle() { return pTitle; }
    public void setPTitle(String pTitle) { this.pTitle = pTitle; }

    public LocalDateTime getRoundTime() { return roundTime; }
    public void setRoundTime(LocalDateTime roundTime) { this.roundTime = roundTime; }
}
