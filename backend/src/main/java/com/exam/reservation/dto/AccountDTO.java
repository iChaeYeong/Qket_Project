package com.exam.reservation.dto;

import org.apache.ibatis.type.Alias;

@Alias("AccountDTO")
public class AccountDTO {

    String accountNo;
    String userId;
    String accountNm;
    int balance;
    String accountStat;

    public AccountDTO() {}

    public AccountDTO(String accountNo, String userId, String accountNm, int balance, String accountStat) {
        this.accountNo = accountNo;
        this.userId = userId;
        this.accountNm = accountNm;
        this.balance = balance;
        this.accountStat = accountStat;
    }

    public String getAccountNo() { return accountNo; }
    public void setAccountNo(String accountNo) { this.accountNo = accountNo; }

    public String getUserId() { return userId; }
    public void setUserId(String userId) { this.userId = userId; }

    public String getAccountNm() { return accountNm; }
    public void setAccountNm(String accountNm) { this.accountNm = accountNm; }

    public int getBalance() { return balance; }
    public void setBalance(int balance) { this.balance = balance; }

    public String getAccountStat() { return accountStat; }
    public void setAccountStat(String accountStat) { this.accountStat = accountStat; }

    @Override
    public String toString() {
        return "AccountDTO{accountNo='" + accountNo + "', userId='" + userId + "', balance=" + balance + "}";
    }
}
