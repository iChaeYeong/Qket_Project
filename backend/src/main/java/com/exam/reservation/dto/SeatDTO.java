package com.exam.reservation.dto;

import org.apache.ibatis.type.Alias;

@Alias("SeatDTO")
public class SeatDTO {

    Long seatId;
    Long roundId;
    String seatRow;
    String seatColume;
    String grade;
    String status;

    public Long getSeatId() { return seatId; }
    public void setSeatId(Long seatId) { this.seatId = seatId; }

    public Long getRoundId() { return roundId; }
    public void setRoundId(Long roundId) { this.roundId = roundId; }

    public String getSeatRow() { return seatRow; }
    public void setSeatRow(String seatRow) { this.seatRow = seatRow; }

    public String getSeatColume() { return seatColume; }
    public void setSeatColume(String seatColume) { this.seatColume = seatColume; }

    public String getGrade() { return grade; }
    public void setGrade(String grade) { this.grade = grade; }

    public String getStatus() { return status; }
    public void setStatus(String status) { this.status = status; }
}
