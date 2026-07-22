USE qket;
SET NAMES utf8mb4;
-- =========================
-- Qket 테스트 데이터 (공연 1개만 운영)
-- =========================

-- ROLES
INSERT INTO ROLES (role_name) VALUES
  ('USER'),
  ('MANAGER'),
  ('ADMIN');

-- VENUE (공연장 1곳만 사용)
INSERT INTO VENUE (venue_name) VALUES
  ('서울 올림픽공원 체조경기장');

-- PERFORMANCES (공연 1개만 운영)
INSERT INTO PERFORMANCES (p_title, venue_id, poster_url) VALUES
  ('아이유 콘서트 - The Golden Hour', 1, 'https://example.com/poster/iu.jpg');

-- USERS password : test1234 (user_id는 로그인 아이디를 그대로 사용, auto_increment 아님)
INSERT INTO USERS (user_id, user_nm, pwd, user_email, role_id, user_status) VALUES
  ('admin01', '관리자01', '$2b$10$hWBKmcDTCeEpTSo69AszSOq83qcpV.y7HJwWtweymXyxLmL7kD4Am', 'admin01@qket.com', 3, 'ACTIVE'),
  ('manager01', '매니저01', '$2b$10$hWBKmcDTCeEpTSo69AszSOq83qcpV.y7HJwWtweymXyxLmL7kD4Am', 'manager01@qket.com', 2, 'ACTIVE'),
  ('testuser01', '테스트유저01', '$2b$10$hWBKmcDTCeEpTSo69AszSOq83qcpV.y7HJwWtweymXyxLmL7kD4Am', 'testuser01@qket.com', 1, 'ACTIVE'),
  ('testuser02', '테스트유저02', '$2b$10$hWBKmcDTCeEpTSo69AszSOq83qcpV.y7HJwWtweymXyxLmL7kD4Am', 'testuser02@qket.com', 1, 'ACTIVE'),
  ('testuser03', '테스트유저03', '$2b$10$hWBKmcDTCeEpTSo69AszSOq83qcpV.y7HJwWtweymXyxLmL7kD4Am', 'testuser03@qket.com', 1, 'ACTIVE'),
  ('testuser04', '테스트유저04', '$2b$10$hWBKmcDTCeEpTSo69AszSOq83qcpV.y7HJwWtweymXyxLmL7kD4Am', 'testuser04@qket.com', 1, 'ACTIVE'),
  ('testuser05', '테스트유저05', '$2b$10$hWBKmcDTCeEpTSo69AszSOq83qcpV.y7HJwWtweymXyxLmL7kD4Am', 'testuser05@qket.com', 1, 'ACTIVE'),
  ('testuser06', '테스트유저06', '$2b$10$hWBKmcDTCeEpTSo69AszSOq83qcpV.y7HJwWtweymXyxLmL7kD4Am', 'testuser06@qket.com', 1, 'SUSPENDED');

-- PERFORMANCE_ROUND (공연 1개, 회차 2개. open_time = 예매 오픈 시각, round_time보다 이전)
INSERT INTO PERFORMANCE_ROUND (performance_id, round_time, open_time, round_status) VALUES
  (1, '2026-08-15 19:00:00', '2026-08-01 10:00:00', 'SCHEDULED'),
  (1, '2026-08-16 17:00:00', '2026-08-01 10:00:00', 'SCHEDULED');

-- SEATS (공연장 소속, 5행 x 6열 = 30석, VIP/R/S 등급. 회차와 무관하게 공연장에 귀속)
INSERT INTO SEATS (venue_id, seat_row, seat_colume, grade) VALUES
  (1, 'A', '1', 'VIP'),
  (1, 'A', '2', 'VIP'),
  (1, 'A', '3', 'VIP'),
  (1, 'A', '4', 'VIP'),
  (1, 'A', '5', 'VIP'),
  (1, 'A', '6', 'VIP'),
  (1, 'B', '1', 'VIP'),
  (1, 'B', '2', 'VIP'),
  (1, 'B', '3', 'VIP'),
  (1, 'B', '4', 'VIP'),
  (1, 'B', '5', 'VIP'),
  (1, 'B', '6', 'VIP'),
  (1, 'C', '1', 'R'),
  (1, 'C', '2', 'R'),
  (1, 'C', '3', 'R'),
  (1, 'C', '4', 'R'),
  (1, 'C', '5', 'R'),
  (1, 'C', '6', 'R'),
  (1, 'D', '1', 'R'),
  (1, 'D', '2', 'R'),
  (1, 'D', '3', 'R'),
  (1, 'D', '4', 'R'),
  (1, 'D', '5', 'R'),
  (1, 'D', '6', 'R'),
  (1, 'E', '1', 'S'),
  (1, 'E', '2', 'S'),
  (1, 'E', '3', 'S'),
  (1, 'E', '4', 'S'),
  (1, 'E', '5', 'S'),
  (1, 'E', '6', 'S');

-- RESERVATIONS (좌석 x 회차 슬롯을 회차 등록 시점에 미리 생성. user_id/reserved_at은 예매 전까지 NULL, reserved_status='AVAILABLE')
INSERT INTO RESERVATIONS (user_id, seat_id, round_id, performance_id, reserved_status)
SELECT NULL, s.seat_id, r.round_id, r.performance_id, 'AVAILABLE'
FROM SEATS s
CROSS JOIN PERFORMANCE_ROUND r
WHERE r.performance_id = 1;

-- 데모용으로 일부 슬롯만 예매된 상태로 표시 (1회차 A1, A2 / 2회차 A1, A2)
-- 실제 서비스에서는 "예매하기" 버튼 클릭 시 아래와 동일한 조건부 UPDATE가 실행됨
-- (WHERE user_id IS NULL 조건으로 중복 예매 방지, reserved_at에 실제 예매 시각 기록)
UPDATE RESERVATIONS SET user_id = 'testuser01', reserved_status = 'RESERVED', reserved_at = NOW()
WHERE seat_id = (SELECT seat_id FROM SEATS WHERE seat_row='A' AND seat_colume='1' AND venue_id=1)
  AND round_id = 1
  AND user_id IS NULL;

UPDATE RESERVATIONS SET user_id = 'testuser02', reserved_status = 'RESERVED', reserved_at = NOW()
WHERE seat_id = (SELECT seat_id FROM SEATS WHERE seat_row='A' AND seat_colume='2' AND venue_id=1)
  AND round_id = 1
  AND user_id IS NULL;

UPDATE RESERVATIONS SET user_id = 'testuser03', reserved_status = 'RESERVED', reserved_at = NOW()
WHERE seat_id = (SELECT seat_id FROM SEATS WHERE seat_row='A' AND seat_colume='1' AND venue_id=1)
  AND round_id = 2
  AND user_id IS NULL;

UPDATE RESERVATIONS SET user_id = 'testuser04', reserved_status = 'RESERVED', reserved_at = NOW()
WHERE seat_id = (SELECT seat_id FROM SEATS WHERE seat_row='A' AND seat_colume='2' AND venue_id=1)
  AND round_id = 2
  AND user_id IS NULL;

-- 검증용 조회
/*
SELECT COUNT(*) AS role_count FROM ROLES;
SELECT COUNT(*) AS venue_count FROM VENUE;
SELECT COUNT(*) AS performance_count FROM PERFORMANCES;
SELECT COUNT(*) AS user_count FROM USERS;
SELECT COUNT(*) AS round_count FROM PERFORMANCE_ROUND;
SELECT COUNT(*) AS seat_count FROM SEATS;
SELECT COUNT(*) AS reservation_count FROM RESERVATIONS;
*/