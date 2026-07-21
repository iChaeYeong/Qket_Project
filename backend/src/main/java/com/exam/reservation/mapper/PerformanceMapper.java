package com.exam.reservation.mapper;

import com.exam.reservation.dto.PerformanceDTO;
import org.apache.ibatis.annotations.Mapper;

import java.util.List;

@Mapper
public interface PerformanceMapper {
    List<PerformanceDTO> findAll();

//    PerformanceDTO findById(Long performanceId);
//    List<PerformanceRoundDTO> findRoundsByPerformanceId(Long performanceId);
//    PerformanceRoundDTO findRoundById(Long roundId);
}
