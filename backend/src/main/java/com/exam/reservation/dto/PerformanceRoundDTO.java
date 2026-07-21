package com.exam.reservation.dto;

import org.apache.ibatis.type.Alias;

import java.time.LocalDateTime;

@Alias("PerformanceRoundDTO")
public class PerformanceRoundDTO {

    Long roundId;
    Long performanceId;
    String pTitle;
    LocalDateTime roundTime;
    String roundStatus;

    public Long getRoundId() { return roundId; }
    public void setRoundId(Long roundId) { this.roundId = roundId; }

    public Long getPerformanceId() { return performanceId; }
    public void setPerformanceId(Long performanceId) { this.performanceId = performanceId; }

    public String getPTitle() { return pTitle; }
    public void setPTitle(String pTitle) { this.pTitle = pTitle; }

    public LocalDateTime getRoundTime() { return roundTime; }
    public void setRoundTime(LocalDateTime roundTime) { this.roundTime = roundTime; }

    public String getRoundStatus() { return roundStatus; }
    public void setRoundStatus(String roundStatus) { this.roundStatus = roundStatus; }
}
