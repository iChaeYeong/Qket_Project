package com.exam.reservation.controller;

import com.exam.reservation.dto.SeatDTO;
import com.exam.reservation.service.SeatService;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/seats")
public class SeatController {

    private final SeatService seatService;

    public SeatController(SeatService seatService) {
        this.seatService = seatService;
    }

    @GetMapping("/round/{roundId}")
    public List<SeatDTO> byRound(@PathVariable Long roundId) {
        return seatService.getSeatsByRound(roundId);
    }
}
