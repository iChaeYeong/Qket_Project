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

    /***********************************
     *  URL      :  "/reservations"
     *  이름      :   reserve
     *  기능      :   예약
     *  method   :   POST
     *  param    :   HttpSession
     *  result   :   Map<String, Long>, HttpSession
     ************************************/
    @PostMapping
    public Map<String, Object> reserve(@RequestBody Map<String, Long> body, HttpSession session) {
        UserDTO loginUser = (UserDTO) session.getAttribute("loginUser");
        if (loginUser == null) {
            return Map.of("success", false, "message", "로그인이 필요합니다.");
        }
        Long seatId = body.get("seatId");
        Long roundId = body.get("roundId");
        Long reservationId = body.get("reservationId");
        return reservationService.reserve(loginUser.getUserId(), reservationId, roundId, seatId);
    }

    /***********************************
     *  URL      :  "/reservations/my"
     *  이름      :   my
     *  기능      :   마이페이지 조회
     *  method   :   GET
     *  param    :   Map<String, Object>
     *  result   :   HttpSession
     ************************************/
    @GetMapping("/my")
    public Map<String, Object> myReservations(HttpSession session) {
        UserDTO loginUser = (UserDTO) session.getAttribute("loginUser");
        if (loginUser == null) {
            return Map.of("success", false, "message", "로그인이 필요합니다.");
        }
        List<ReservationDTO> list = reservationService.getMyReservations(loginUser.getUserId());
        return Map.of("success", true, "reservations", list);
    }

    /***********************************
     *  URL      :  "/reservations/{reservationId}"
     *  이름      :   cancel
     *  기능      :   예매 취소
     *  method   :   DELETE
     *  param    :   Map<String, Object>
     *  result   :   Long, HttpSession
     ************************************/
    @DeleteMapping("/{reservationId}")
    public Map<String, Object> cancel(@PathVariable Long reservationId, HttpSession session) {
        UserDTO loginUser = (UserDTO) session.getAttribute("loginUser");
        if (loginUser == null) {
            return Map.of("success", false, "message", "로그인이 필요합니다.");
        }
        return reservationService.cancel(reservationId, loginUser.getUserId());
    }
}
