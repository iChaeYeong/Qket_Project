package com.exam.reservation.controller;

import com.exam.common.dto.UserDTO;
import com.exam.reservation.dto.ReservationDTO;
import com.exam.reservation.service.ReservationService;
import jakarta.servlet.http.HttpSession;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/reservations")
public class ReservationController {

    private final ReservationService reservationService;

    public ReservationController(ReservationService reservationService) {
        this.reservationService = reservationService;
    }

    @PostMapping
    public Map<String, Object> reserve(@RequestBody Map<String, Long> body, HttpSession session) {
        UserDTO loginUser = (UserDTO) session.getAttribute("loginUser");
        if (loginUser == null) {
            return Map.of("success", false, "message", "로그인이 필요합니다.");
        }
        Long seatId = body.get("seatId");
        Long scheduleId = body.get("scheduleId");
        return reservationService.reserve(loginUser.getUserId(), seatId, scheduleId);
    }

    @GetMapping("/my")
    public Map<String, Object> myReservations(HttpSession session) {
        UserDTO loginUser = (UserDTO) session.getAttribute("loginUser");
        if (loginUser == null) {
            return Map.of("success", false, "message", "로그인이 필요합니다.");
        }
        List<ReservationDTO> list = reservationService.getMyReservations(loginUser.getUserId());
        return Map.of("success", true, "reservations", list);
    }

    @DeleteMapping("/{reservationId}")
    public Map<String, Object> cancel(@PathVariable Long reservationId, HttpSession session) {
        UserDTO loginUser = (UserDTO) session.getAttribute("loginUser");
        if (loginUser == null) {
            return Map.of("success", false, "message", "로그인이 필요합니다.");
        }
        return reservationService.cancel(reservationId, loginUser.getUserId());
    }
}
