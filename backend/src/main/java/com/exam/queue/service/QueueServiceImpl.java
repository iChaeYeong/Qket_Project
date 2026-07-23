package com.exam.queue.service;

import com.exam.queue.domain.QueueStatus;
import com.exam.queue.domain.QueueTokenInfo;
import com.exam.queue.dto.QueueJoinResponse;
import com.exam.queue.dto.QueueStatusResponse;
import com.exam.queue.repository.RedisQueueRepository;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.web.server.ResponseStatusException;

import java.time.Duration;
import java.util.Optional;
import java.util.Set;
import java.util.UUID;

@Service
public class QueueServiceImpl implements QueueService {

    private static final int MAX_ACTIVE_USERS = 10;

    private static final Duration WAITING_TTL =
            Duration.ofMinutes(30);

    private static final Duration ACTIVE_TTL =
            Duration.ofMinutes(10);

    private final RedisQueueRepository repository;

    public QueueServiceImpl(
            RedisQueueRepository repository
    ) {
        this.repository = repository;
    }

    @Override
    public QueueJoinResponse join(
            Long scheduleId,
            String userId
    ) {
        String existingToken =
                repository.getUserToken(scheduleId, userId);

        if (existingToken != null) {
            Optional<QueueTokenInfo> existingInfo =
                    repository.findToken(existingToken);

            if (existingInfo.isPresent()) {
                return new QueueJoinResponse(existingToken);
            }
        }

        String token = UUID.randomUUID().toString();

        repository.saveToken(
                token,
                scheduleId,
                userId,
                WAITING_TTL
        );

        boolean claimed = repository.claimUserToken(
                scheduleId,
                userId,
                token,
                WAITING_TTL
        );

        if (!claimed) {
            repository.deleteToken(token);

            return new QueueJoinResponse(
                    repository.getUserToken(scheduleId, userId)
            );
        }

        repository.addWaiting(
                scheduleId,
                token,
                System.currentTimeMillis()
        );

        return new QueueJoinResponse(token);
    }

    @Override
    public QueueStatusResponse getStatus(
            String queueToken,
            String userId
    ) {
        Optional<QueueTokenInfo> optionalInfo =
                repository.findToken(queueToken);

        if (optionalInfo.isEmpty()) {
            return expired(queueToken);
        }

        QueueTokenInfo tokenInfo = optionalInfo.get();

        validateOwner(tokenInfo, userId);

        admitAvailableUsers(tokenInfo.scheduleId());

        if (repository.isActive(
                tokenInfo.scheduleId(),
                queueToken
        )) {
            return new QueueStatusResponse(
                    queueToken,
                    QueueStatus.ENTERED,
                    0,
                    0
            );
        }

        Long rank = repository.getWaitingRank(
                tokenInfo.scheduleId(),
                queueToken
        );

        if (rank == null) {
            removeToken(queueToken, tokenInfo);
            return expired(queueToken);
        }

        long estimatedWait = Math.max(3, rank * 3);

        return new QueueStatusResponse(
                queueToken,
                QueueStatus.WAITING,
                rank,
                estimatedWait
        );
    }

    @Override
    public void leave(
            String queueToken,
            String userId
    ) {
        Optional<QueueTokenInfo> optionalInfo =
                repository.findToken(queueToken);

        if (optionalInfo.isEmpty()) {
            return;
        }

        QueueTokenInfo tokenInfo = optionalInfo.get();

        validateOwner(tokenInfo, userId);

        repository.removeWaiting(
                tokenInfo.scheduleId(),
                queueToken
        );

        repository.removeActive(
                tokenInfo.scheduleId(),
                queueToken
        );

        removeToken(queueToken, tokenInfo);
    }

    @Override
    public boolean canEnter(
            Long scheduleId,
            String queueToken,
            String userId
    ) {
        Optional<QueueTokenInfo> optionalInfo =
                repository.findToken(queueToken);

        if (optionalInfo.isEmpty()) {
            return false;
        }

        QueueTokenInfo tokenInfo = optionalInfo.get();

        if (!tokenInfo.scheduleId().equals(scheduleId)) {
            return false;
        }

        if (!tokenInfo.userId().equals(userId)) {
            return false;
        }

        repository.removeExpiredActive(
                scheduleId,
                System.currentTimeMillis()
        );

        return repository.isActive(
                scheduleId,
                queueToken
        );
    }

    private void admitAvailableUsers(Long scheduleId) {
        String lockOwner = UUID.randomUUID().toString();

        boolean locked =
                repository.acquireAdmissionLock(
                        scheduleId,
                        lockOwner,
                        Duration.ofSeconds(5)
                );

        if (!locked) {
            return;
        }

        try {
            long now = System.currentTimeMillis();

            repository.removeExpiredActive(
                    scheduleId,
                    now
            );

            long activeCount =
                    repository.getActiveCount(scheduleId);

            long available =
                    MAX_ACTIVE_USERS - activeCount;

            while (available > 0) {
                Set<String> waitingTokens =
                        repository.getFirstWaiting(
                                scheduleId,
                                available
                        );

                if (waitingTokens == null ||
                        waitingTokens.isEmpty()) {
                    break;
                }

                boolean processed = false;

                for (String token : waitingTokens) {
                    Optional<QueueTokenInfo> tokenInfo =
                            repository.findToken(token);

                    // 만료된 대기 토큰 제거
                    if (tokenInfo.isEmpty()) {
                        repository.removeWaiting(
                                scheduleId,
                                token
                        );
                        processed = true;
                        continue;
                    }

                    long expiresAt =
                            now + ACTIVE_TTL.toMillis();

                    boolean moved =
                            repository.moveToActive(
                                    scheduleId,
                                    token,
                                    expiresAt
                            );

                    if (moved) {
                        repository.refreshToken(
                                token,
                                ACTIVE_TTL
                        );

                        repository.refreshUserToken(
                                scheduleId,
                                tokenInfo.get().userId(),
                                ACTIVE_TTL
                        );

                        available--;
                        processed = true;
                    }
                }

                if (!processed) {
                    break;
                }
            }
        } finally {
            repository.releaseAdmissionLock(
                    scheduleId,
                    lockOwner
            );
        }
    }

    private void validateOwner(
            QueueTokenInfo tokenInfo,
            String userId
    ) {
        if (!tokenInfo.userId().equals(userId)) {
            throw new ResponseStatusException(
                    HttpStatus.FORBIDDEN,
                    "다른 사용자의 대기열 토큰입니다."
            );
        }
    }

    private void removeToken(
            String queueToken,
            QueueTokenInfo tokenInfo
    ) {
        repository.deleteToken(queueToken);

        repository.deleteUserToken(
                tokenInfo.scheduleId(),
                tokenInfo.userId(),
                queueToken
        );
    }

    private QueueStatusResponse expired(String token) {
        return new QueueStatusResponse(
                token,
                QueueStatus.EXPIRED,
                0,
                0
        );
    }
}