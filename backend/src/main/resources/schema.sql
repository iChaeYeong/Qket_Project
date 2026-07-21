CREATE TABLE user_info (
    user_id VARCHAR(20) PRIMARY KEY,
    user_nm VARCHAR(20) NOT NULL,
    pwd VARCHAR(255) NOT NULL
);

CREATE TABLE accounts_info (
    account_no VARCHAR(30) PRIMARY KEY,
    user_id VARCHAR(20) NOT NULL,
    balance INT DEFAULT 0,
    account_nm VARCHAR(30) NOT NULL,
    account_stat VARCHAR(20) NOT NULL,
    FOREIGN KEY (user_id) REFERENCES user_info (user_id)
);

CREATE TABLE transaction_history (
    tran_id INT PRIMARY KEY AUTO_INCREMENT,
    frm_account_no VARCHAR(30) NOT NULL,   -- 출금계좌
    to_account_no VARCHAR(30) NOT NULL,     -- 입금계좌
    tran_amt INT NOT NULL,
    tran_dt DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (frm_account_no) REFERENCES accounts_info (account_no),
	FOREIGN KEY (to_account_no) REFERENCES accounts_info (account_no)
);