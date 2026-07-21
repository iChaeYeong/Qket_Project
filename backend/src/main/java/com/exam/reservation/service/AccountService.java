package com.exam.reservation.service;

import com.exam.reservation.dto.AccountDTO;

import java.util.List;

public interface AccountService {
    List<AccountDTO> findByUserId(String userId);
    AccountDTO findByAccountNo(String accountNo);
}
