package com.exam.reservation.dto;

import lombok.Data;
import org.apache.ibatis.type.Alias;

@Data
@Alias("RoundDTO")
public class RoundDTO {

    private Long roundId;
    private String roundTime;
    private String openTime;
    private String roundStatus;
}
