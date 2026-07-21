package com.exam.reservation.dto;

import lombok.Data;
import org.apache.ibatis.type.Alias;

import java.time.LocalDateTime;

@Data
@Alias("ReservationDTO")
public class ReservationDTO {

    private Long reservationId;
    private String userId;
    private Long seatId;
    private Long roundId;
    private String reservedStatus;
    private LocalDateTime createdReserved;

    // JOIN 결과용 필드
    private String seatRow;
    private String seatColume;
    private String grade;
    private String pTitle;
    private LocalDateTime roundTime;
}
