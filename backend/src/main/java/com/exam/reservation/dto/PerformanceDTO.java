package com.exam.reservation.dto;

import lombok.Data;
import org.apache.ibatis.type.Alias;

import java.time.LocalDateTime;
import java.util.List;

@Data
@Alias("PerformanceDTO")
public class PerformanceDTO {

    private Long performanceId;
    private String pTitle;
    private String pLocation;
    private String posterUrl;
    private LocalDateTime createdPer;
    private List<RoundDTO> rounds;
}
