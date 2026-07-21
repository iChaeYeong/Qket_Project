package com.exam.reservation.service;

import com.exam.reservation.dto.TransactionDTO;

import java.util.List;

public interface TransactionService {
    List<TransactionDTO> findByAccountNo(String accountNo);
    int transfer(String frmAccountNo, String toAccountNo, int amount);
}
