package com.exam.reservation.controller;

import com.exam.common.dto.UserDTO;
import com.exam.reservation.dto.AccountDTO;
import com.exam.reservation.service.AccountService;
import jakarta.servlet.http.HttpSession;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/accounts")
public class AccountController {

    AccountService accountService;

    public AccountController(AccountService accountService) {
        this.accountService = accountService;
    }

    @GetMapping
    public List<AccountDTO> accountsByUserId(HttpSession session) {
        UserDTO loginUser = (UserDTO) session.getAttribute("loginUser");
        if (loginUser == null) {
            throw new RuntimeException("로그인이 필요합니다.");
        }
        return accountService.findByUserId(loginUser.getUserId());
    }
}
