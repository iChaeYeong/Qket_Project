package com.exam.reservation.service;

import com.exam.reservation.dto.SeatDTO;
import com.exam.reservation.mapper.SeatMapper;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class SeatServiceImpl implements SeatService {

    private final SeatMapper seatMapper;

    public SeatServiceImpl(SeatMapper seatMapper) {
        this.seatMapper = seatMapper;
    }

    @Override
    public List<SeatDTO> getSeatsByRound(Long roundId) {
        return seatMapper.findByRoundId(roundId);
    }

    @Override
    public SeatDTO getSeat(Long seatId) {
        return seatMapper.findById(seatId);
    }
}
