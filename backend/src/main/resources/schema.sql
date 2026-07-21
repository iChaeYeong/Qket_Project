USE qket;

CREATE TABLE IF NOT EXISTS ROLES (
    role_id BIGINT NOT NULL AUTO_INCREMENT,
    role_name VARCHAR(255),

    PRIMARY KEY (role_id),
    UNIQUE KEY uk_role_name (role_name)
);

CREATE TABLE IF NOT EXISTS PERFORMANCES (
    performance_id BIGINT PRIMARY KEY AUTO_INCREMENT,
    p_title VARCHAR(255) NOT NULL,
    p_location VARCHAR(255) NOT NULL,
    poster_url VARCHAR(500),
    created_per DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS USERS (
    user_id VARCHAR(50) NOT NULL,
    user_nm VARCHAR(255) NOT NULL,
    pwd VARCHAR(255) NOT NULL,
    user_email VARCHAR(255) NOT NULL,
    role_id BIGINT NOT NULL,
    user_status VARCHAR(255) NOT NULL,
    created_user DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,

    PRIMARY KEY (user_id),
    FOREIGN KEY (role_id) REFERENCES ROLES (role_id),
    UNIQUE KEY uk_users_user_email (user_email)
);

CREATE TABLE IF NOT EXISTS PERFORMANCE_ROUND (
    round_id BIGINT PRIMARY KEY AUTO_INCREMENT,
    performance_id BIGINT NOT NULL,
    round_time DATETIME NOT NULL,
    round_status VARCHAR(255) NOT NULL,
    FOREIGN KEY (performance_id) REFERENCES PERFORMANCES (performance_id)
);

CREATE TABLE IF NOT EXISTS SEATS (
    seat_id BIGINT NOT NULL AUTO_INCREMENT,
    round_id BIGINT NOT NULL,
    seat_row VARCHAR(255) NOT NULL,
    seat_colume VARCHAR(255) NOT NULL,
    grade VARCHAR(255) NOT NULL,
    status VARCHAR(255) NOT NULL,

    PRIMARY KEY (seat_id),
    FOREIGN KEY (round_id) REFERENCES PERFORMANCE_ROUND (round_id),
    UNIQUE KEY uk_seats_round_seat (round_id, seat_row, seat_colume)
);

CREATE TABLE IF NOT EXISTS RESERVATIONS (
    reservation_id BIGINT PRIMARY KEY AUTO_INCREMENT,
    user_id VARCHAR(50) NOT NULL,
    seat_id BIGINT NOT NULL,
    round_id BIGINT NOT NULL,
    reserved_status VARCHAR(255) NOT NULL DEFAULT 'reserved',
    created_reserved DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES USERS (user_id),
    FOREIGN KEY (seat_id) REFERENCES SEATS (seat_id),
    FOREIGN KEY (round_id) REFERENCES PERFORMANCE_ROUND (round_id)
);

SHOW TABLES;