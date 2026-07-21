package com.exam.reservation.dto;

import org.apache.ibatis.type.Alias;

import java.time.LocalDateTime;

@Alias("PerformanceDTO")
public class PerformanceDTO {

    Long performanceId;
    String pTitle;
    String pLocation;
    String posterUrl;
    LocalDateTime createdPer;

    public Long getPerformanceId() { return performanceId; }
    public void setPerformanceId(Long performanceId) { this.performanceId = performanceId; }

    public String getPTitle() { return pTitle; }
    public void setPTitle(String pTitle) { this.pTitle = pTitle; }

    public String getPLocation() { return pLocation; }
    public void setPLocation(String pLocation) { this.pLocation = pLocation; }

    public String getPosterUrl() { return posterUrl; }
    public void setPosterUrl(String posterUrl) { this.posterUrl = posterUrl; }

    public LocalDateTime getCreatedPer() { return createdPer; }
    public void setCreatedPer(LocalDateTime createdPer) { this.createdPer = createdPer; }
}
