package com.exam.reservation.controller;

import com.exam.reservation.dto.TransactionDTO;
import com.exam.reservation.service.TransactionService;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping
public class TransactionController {

    TransactionService transactionService;

    public TransactionController(TransactionService transactionService) {
        this.transactionService = transactionService;
    }

    @GetMapping("/transactions/{accountNo}")
    public List<TransactionDTO> transactions(@PathVariable String accountNo) {
        return transactionService.findByAccountNo(accountNo);
    }

    @PostMapping("/transfer")
    public Map<String, Object> transfer(@RequestBody Map<String, Object> body) {
        String frmAccountNo = (String) body.get("frmAccountNo");
        String toAccountNo  = (String) body.get("toAccountNo");
        int amount = (int) body.get("amount");
        Map<String, Object> result = new HashMap<>();
        int n = transactionService.transfer(frmAccountNo, toAccountNo, amount);
        result.put("success", n > 0);
        if (n == 0) result.put("message", "이체에 실패했습니다. 잔액 또는 계좌번호를 확인하세요.");
        return result;
    }
}
