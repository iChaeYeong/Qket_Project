package com.exam.common.controller;

import com.exam.common.dto.UserDTO;
import com.exam.common.service.UserService;
import jakarta.servlet.http.HttpSession;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.Map;

@RestController
@RequestMapping("/auth")
public class UserController {

    UserService userService;

    public UserController(UserService userService) {
        this.userService = userService;
    }

    @PostMapping("/login")
    public Map<String, Object> login(@RequestBody UserDTO userDTO, HttpSession session) {
        Map<String, Object> result = new HashMap<>();
        UserDTO user = userService.login(userDTO.getUserId(), userDTO.getPwd());
        if (user == null) {
            result.put("success", false);
            result.put("message", "아이디 또는 비밀번호가 올바르지 않습니다.");
        } else {
            session.setAttribute("loginUser", user);
            result.put("success", true);
            result.put("user", user);
        }
        return result;
    }

    @PostMapping("/logout")
    public Map<String, Object> logout(HttpSession session) {
        session.invalidate();
        return Map.of("success", true);
    }

    @PostMapping("/signup")
    public Map<String, Object> register(@RequestBody UserDTO userDTO) {
        Map<String, Object> result = new HashMap<>();
        try {
            int n = userService.register(userDTO);
            if (n > 0) {
                result.put("success", true);
                result.put("message", "회원가입이 완료되었습니다.");
            } else {
                result.put("success", false);
                result.put("message", "회원가입에 실패했습니다.");
            }
        } catch (Exception e) {
            result.put("success", false);
            //result.put("message", "이미 사용 중인 아이디 또는 이메일입니다.");
            result.put("message", e.getMessage());
        }
        return result;
    }

    @GetMapping("/me")
    public Map<String, Object> me(HttpSession session) {
        Map<String, Object> result = new HashMap<>();
        UserDTO user = (UserDTO) session.getAttribute("loginUser");
        if (user == null) {
            result.put("success", false);
            result.put("message", "로그인이 필요합니다.");
        } else {
            result.put("success", true);
            result.put("user", user);
        }
        return result;
    }
}
