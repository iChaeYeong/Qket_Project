package com.exam.reservation.service;

import com.exam.reservation.dto.ReservationDTO;
import com.exam.reservation.mapper.ReservationMapper;
import org.springframework.data.redis.core.RedisTemplate;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.Duration;
import java.util.List;
import java.util.Map;

@Service
public class ReservationServiceImpl implements ReservationService {

    private final ReservationMapper reservationMapper;
    private final RedisTemplate<String, Object> redisTemplate;

    public ReservationServiceImpl(ReservationMapper reservationMapper,
                                  RedisTemplate<String, Object> redisTemplate) {
        this.reservationMapper = reservationMapper;
        this.redisTemplate = redisTemplate;
    }

    @Override
    @Transactional
    public Map<String, Object> reserve(String userId,Long reservationId, Long roundId,Long seatId) {
        String lockKey = "lock:reservation:" + seatId;

        // Redis 분산 락 획득 시도 (TTL 10초)
        Boolean acquired = redisTemplate.opsForValue().setIfAbsent(lockKey, userId.toString(), Duration.ofSeconds(10));
        if (acquired == null || !acquired) {
            return Map.of("success", false, "message", "이미 다른 사용자가 예매 중인 좌석입니다.");
        }

        try {
            ReservationDTO reservation = new ReservationDTO();
            reservation.setUserId(userId);
            reservation.setReservationId(reservationId);
            reservation.setSeatId(seatId);
            reservation.setRoundId(roundId);

            int affected = reservationMapper.save(reservation);
            if (affected == 0) {
                return Map.of("success", false, "message", "이미 예매된 좌석입니다.");
            }

            reservation.setAction("RESERVED");
            reservationMapper.insertHistory(reservation);

            return Map.of("success", true, "message", "예매가 완료되었습니다.");
        } finally {
            redisTemplate.delete(lockKey);
        }
    }

    @Override
    public List<ReservationDTO> getMyReservations(String userId) {
        return reservationMapper.findByUserId(userId);
    }

    @Override
    @Transactional
    public Map<String, Object> cancel(Long reservationId, String userId) {
        ReservationDTO reservation = reservationMapper.findById(reservationId);
        if (reservation == null || !reservation.getUserId().equals(userId)) {
            return Map.of("success", false, "message", "예매 정보를 찾을 수 없습니다.");
        }
        if (!"RESERVED".equals(reservation.getReservedStatus())) {
            return Map.of("success", false, "message", "이미 취소된 예매입니다.");
        }

        reservationMapper.cancel(reservationId);

        reservation.setAction("CANCELLED");
        reservationMapper.insertHistory(reservation);

        return Map.of("success", true, "message", "예매가 취소되었습니다.");
    }
}
