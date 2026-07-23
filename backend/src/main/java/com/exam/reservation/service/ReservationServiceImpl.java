package com.exam.reservation.service;

import com.exam.queue.service.QueueService;
import com.exam.reservation.dto.ReservationDTO;
import com.exam.reservation.mapper.ReservationMapper;
import org.springframework.data.redis.core.RedisTemplate;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.Duration;
import java.util.List;
import java.util.Map;
/**
 *
 파일명: ReservationServiceImpl.java
 *
 **/
@Service
public class ReservationServiceImpl implements ReservationService {

    private final ReservationMapper reservationMapper;
    private final RedisTemplate<String, Object> redisTemplate;
    private final QueueService queueService;

    public ReservationServiceImpl(ReservationMapper reservationMapper,
                                  RedisTemplate<String, Object> redisTemplate,
                                  QueueService queueService) {
        this.reservationMapper = reservationMapper;
        this.redisTemplate = redisTemplate;
        this.queueService = queueService;
    }

    @Override
    @Transactional
    /***********************************
     *  이름      :   reserve
     *  기능      :   공연 좌석 예매 (동시성 처리)
     *  param    :  String,Long,Long,Long,String
     *  return   :   Map<String, Object>
     ************************************/
    public Map<String, Object> reserve(String userId, Long reservationId, Long roundId, Long seatId, String queueToken) {
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

            // 예매 성공 시 대기열 active 자리 즉시 반납
            // 대기열을 거치지 않고 들어온 요청일 수도 있으니 토큰 없으면 그냥 건너뜀
            // 반납 자체가 실패해도 예매 성공에는 영향 주지 않도록 예외를 삼킴
            if (queueToken != null && !queueToken.isBlank()) {
                try {
                    queueService.leave(queueToken, userId);
                } catch (Exception e) {
                    // 반납 실패는 로그만 남기고 무시 (TTL로 나중에 자동 정리됨)
                }
            }

            return Map.of("success", true, "message", "예매가 완료되었습니다.");
        } finally {
            redisTemplate.delete(lockKey);
        }
    }
    /***********************************
     *  이름      :  getMyReservations
     *  기능      :  내 예매 내역 조회 기능
     *  param    :  String
     *  return   :  List<ReservationDTO>
     ************************************/
    @Override
    public List<ReservationDTO> getMyReservations(String userId) {
        return reservationMapper.findByUserId(userId);
    }

    @Override
    @Transactional
    /***********************************
     *  이름      :  cancel
     *  기능      :  예매 취소 기능
     *  param    :  Long,String
     *  return   :  Map<String, Object>
     ************************************/
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